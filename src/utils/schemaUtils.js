/* eslint-disable no-plusplus */
import { Validator } from 'jsonschema';
import { List, fromJS } from 'immutable';
import { genId, isNumber } from './generalUtils';

export function genPathPropName(propName, schemaIndexes = List()) {
  const encodedPropName = encodeURIComponent(propName);
  const postfixString = schemaIndexes.size
    ? `{${schemaIndexes.join(',')}}`
    : '';

  return encodedPropName + postfixString;
}

export const assurePath = (path) => path || '';

export function genPath(propName, parentPath, schemaIndexes = List()) {
  const pathPropName = genPathPropName(propName, schemaIndexes);

  return parentPath ? `${parentPath}/${pathPropName}` : pathPropName;
}

export function generatePropertyObject(
  propName,
  props,
  rootSchema,
  schemaIndexes = List(),
) {
  const { config, initialConfig, schema, path } = props;

  const propPath = genPath(propName, path, schemaIndexes);

  const propSchema = getSchemaForPropertyName(schema, propName, rootSchema);

  if (!propSchema) {
    return false;
  }

  const selectedSchema = getSelectedSchema(
    propSchema,
    schemaIndexes,
    rootSchema,
  );

  const generatedConfigValue = getConfigForPropertyName(
    config,
    selectedSchema,
    propName,
  );

  let initialPropConfig = false;
  const hasInitialConfigValue = hasConfigValueForPropertyName(
    initialConfig,
    propName,
  );

  if (initialConfig && hasInitialConfigValue) {
    initialPropConfig = initialConfig[propName];
  }

  const hasConfigValue =
    hasConfigValueForPropertyName(config, propName) || false;

  const changed =
    (hasInitialConfigValue && !hasConfigValue) ||
    (!hasInitialConfigValue && hasConfigValue) ||
    (hasInitialConfigValue &&
      hasConfigValue &&
      initialPropConfig !== generatedConfigValue) ||
    false;

  return {
    id: genId(),
    title: selectedSchema ? selectedSchema.title : undefined,
    name: propName,
    config: generatedConfigValue,
    initialConfig: initialPropConfig,
    hasConfigValue,
    hasInitialConfigValue,
    schema: selectedSchema,
    path: propPath,
    parentPath: path,
    schemaIndexes,
    changed,
  };
}

export function getSchemaForPropertyName(schema, propName, rootSchema) {
  // eslint-disable-next-line no-param-reassign
  schema = deRefSchema(schema, rootSchema);

  if (schema && !(propName || propName === 0)) {
    return schema;
  }

  switch (schema.type) {
    case 'array': {
      if (Array.isArray(schema.items)) {
        const idx = Number(propName);
        if (idx >= 0 && idx < schema.items.length) {
          return deRefSchema(schema.items[idx], rootSchema);
        }
        return schema.additionalItems && typeof schema.additionalItems === 'object'
          ? deRefSchema(schema.additionalItems, rootSchema)
          : false;
      }
      return deRefSchema(schema.items, rootSchema);
    }
    case 'object': {
      let res = false;
      if (!res && schema.properties) {
        res = schema.properties[propName];
      }
      if (!res && schema.patternProperties) {
        const patterns = Object.keys(schema.patternProperties);

        for (let i = 0; i < patterns.length; i++) {
          const pattern = patterns[i];
          if (isPatternMatchingName(pattern, propName)) {
            res = schema.patternProperties[pattern];
            break;
          }
        }
      }
      return deRefSchema(res, rootSchema);
    }
    default: {
      return false;
    }
  }
}

export function getConfigForPropertyName(config, propSchema, propName) {
  if (config != null && Object.hasOwn(config, propName)) {
    return config[propName];
  }

  if (!propSchema) {
    return false;
  }

  return generateDefaultValueForProperty(propSchema, propName);
}
export function hasConfigValueForPropertyName(config, propName) {
  return config != null && Object.hasOwn(config, propName);
}

export function generateIdPrefixFromPath(path) {
  return `bypath-${path ? `${path}-` : ''}`;
}

export function isValueTypeMatch(value, type) {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'integer':
    case 'number':
      return typeof value === 'number' && !Number.isNaN(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'array':
      return Array.isArray(value);
    case 'object':
      return value !== null && typeof value === 'object' && !Array.isArray(value);
    case 'null':
      return value === null;
    default:
      return true;
  }
}

export function setValueType(value, type) {
  switch (type) {
    case 'string':
      return String(value);
    case 'integer':
    case 'number': {
      let amendedValue = value;

      if (
        typeof amendedValue === 'string' &&
        amendedValue.includes('.') &&
        (amendedValue.endsWith('.') || amendedValue.endsWith('0'))
      ) {
        if (type === 'number') {
          amendedValue = `${amendedValue}1`;
        } else {
          amendedValue = parseInt(amendedValue, 10);
        }
      }
      return isNumber(amendedValue) ? +amendedValue : 0;
    }
    case 'boolean':
      return String(value).toLowerCase() === 'true';
    case 'null':
      return null;
    default:
      return value;
  }
}

const defaultValues = {
  string: '',
  integer: 0,
  number: 0,
  object: {},
  array: [],
  boolean: true,
  null: null,
};

export function generateDefaultValueForProperty(propertySchema) {
  if (propertySchema.default) {
    return propertySchema.default;
  }

  return defaultValues[propertySchema.type];
}

export function isPatternMatchingName(pattern, name) {
  const re = new RegExp(pattern);

  return re.test(name);
}

export function getSelectedSchema(schema, schemaIndexes = List(), rootSchema) {
  let res = schema;

  schemaIndexes.forEach((schemaIndex) => {
    res = getSchemaByIndex(res, schemaIndex, rootSchema);
  });

  return res;
}

export function getSchemaByIndex(
  schema,
  index,
  rootSchema,
  clearSchemaChoices,
) {
  // eslint-disable-next-line no-param-reassign
  schema = deRefSchema(schema, rootSchema);

  if (!schema || index < 0 || !isMultipleChoiceSchema(schema)) {
    return schema;
  }

  const schemaChoices = getMultipleChoiceSchemaChoices(schema);

  const schemaIndex = index < schemaChoices.value.length ? index : 0;

  const res = { ...schema };
  if (clearSchemaChoices) {
    delete res[schemaChoices.type];
  }

  switch (schema.type) {
    case 'object':
      return deRefSchema(
        { ...res, ...schemaChoices.value[schemaIndex] },
        rootSchema,
      );
    default:
      return deRefSchema(schemaChoices.value[schemaIndex], rootSchema);
  }
}

export function stripPathOfSchemaIndex(path) {
  return path.replace(/{[\d,]+}/g, '');
}

export function isMultipleChoiceSchema(schema) {
  return (
    schema &&
    !!(
      schema.allOf ||
      schema.oneOf ||
      schema.anyOf ||
      Array.isArray(schema.type)
    )
  );
}

export function getMultipleChoiceSchemaChoices(schema) {
  if (schema) {
    if (schema.allOf) {
      return {
        type: 'allOf',
        value: schema.allOf,
      };
    } else if (schema.oneOf) {
      return {
        type: 'oneOf',
        value: schema.oneOf,
      };
    } else if (schema.anyOf) {
      return {
        type: 'anyOf',
        value: schema.anyOf,
      };
    } else if (Array.isArray(schema.type)) {
      return {
        type: 'oneOf',
        value: normalizeTypeArraySchema(schema).oneOf,
      };
    }
  }
  return false;
}

function denormalizeSchema(schema, rootSchema) {
  const res = {};

  const schemaChoices = getMultipleChoiceSchemaChoices(schema);

  schemaChoices.value.forEach((schemaChoice, index) => {
    // eslint-disable-next-line no-param-reassign
    schemaChoice = deRefSchema(schemaChoice, rootSchema);

    if (!isMultipleChoiceSchema(schemaChoice)) {
      res[index] = schemaChoice;
    } else {
      const denormalizedSchema = denormalizeSchema(schemaChoice);
      Object.keys(denormalizedSchema).forEach((indexes) => {
        res[`${index},${indexes}`] = denormalizedSchema[indexes];
      });
    }
  });

  return res;
}

function inferMatchingSchemaIndexes(config, schema, rootSchema) {
  if (!isMultipleChoiceSchema(schema)) {
    return [];
  }

  const schemaRes = denormalizeSchema(schema, rootSchema);

  let resSchemaIndexes = [];
  let minErrCount = -1;
  const schemaIndexesStrs = Object.keys(schemaRes);
  for (let i = 0; i < schemaIndexesStrs.length; i++) {
    const schemaIndexes = fromJS(
      schemaIndexesStrs[i].split(',').map((indexStr) => +indexStr),
    );
    const schemaByIndexes = getSelectedSchema(
      schema,
      schemaIndexes,
      rootSchema,
    );

    if (
      schemaIndexesStrs.length > 1 &&
      schemaByIndexes &&
      schemaByIndexes.type === 'null'
    ) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (config === null && schemaByIndexes && schemaByIndexes.allowsNull) {
      return schemaIndexes;
    }

    const validationRes = validateConfig(config, schemaByIndexes, rootSchema);

    const errors = validationRes.errors || [];
    const wrongType = errors.reduce((res, error) => {
      if (res) {
        return res;
      }
      return error.toString().includes('instance is not of a type(s)');
    }, false);

    if (wrongType) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (config && typeof config === 'object' && !Array.isArray(config)) {
      Object.keys(config).forEach((propName) => {
        const propSchema = getSchemaForPropertyName(
          schemaByIndexes,
          propName,
          rootSchema,
        );
        if (!propSchema) {
          errors.push(
            new Error(`No schema was found for property "${propName}"`),
          );
        }
      });
    }

    if (minErrCount < 0) {
      minErrCount = errors.length;
      resSchemaIndexes = schemaIndexes;
    } else if (minErrCount > errors.length) {
      resSchemaIndexes = schemaIndexes;
    }
  }

  return resSchemaIndexes;
}

export function inferSchemaIndexes(props, rootSchema) {
  const { config } = props;

  const schema = deRefSchema(props.schema, rootSchema);

  if (
    !schema ||
    (isConfigEmpty(config, schema) && config !== null) ||
    !isMultipleChoiceSchema(schema)
  ) {
    return List();
  }

  return List(inferMatchingSchemaIndexes(config, schema, rootSchema));
}

export function combineAllOf(schema, rootSchema) {
  // eslint-disable-next-line no-param-reassign
  schema = deRefSchema(schema, rootSchema);

  if (schema.allOf) {
    const schemaComponents = schema.allOf;
    return Object.assign({}, ...schemaComponents);
  }
  return deRefSchema(schema, rootSchema);
}

export function validateConfig(config, schema, rootSchema) {
  const v = new Validator();

  if (rootSchema) {
    v.addSchema(rootSchema, '/');
  } else {
    // eslint-disable-next-line no-console
    console.warn('No root schema was provided to validation function!');
  }

  return v.validate(config, schema);
}

export function isConfigEmpty(config, schema) {
  if (!schema) {
    return false;
  }

  if (!schema.type) {
    return !config;
  }
  switch (schema.type) {
    case 'string':
    case 'number':
    case 'integer':
      return !config && config !== 0 && config !== '';
    case 'array':
      return !(config?.length);
    case 'object':
      return !(config && Object.keys(config).length);
    case 'boolean':
      return config !== true && config !== false;
    default:
      return true;
  }
}

export function hasFilter(filter, title, name, config, schema) {
  // TODO: make a better filter (excluding JSON schema standard field names

  if (!filter) {
    return true;
  }

  if (!title && !name && !config && !schema) {
    return false;
  }

  const normalizedFilter = String(filter).toLowerCase();
  const searchableConfig = (config ? JSON.stringify(config) : '').toLowerCase();
  const searchableSchema = (schema ? JSON.stringify(schema) : '').toLowerCase();
  const searchableName = String(name).toLowerCase();
  const searchableTitle = String(title).toLowerCase();

  return (
    searchableTitle.includes(normalizedFilter) ||
    searchableName.includes(normalizedFilter) ||
    searchableConfig.includes(normalizedFilter) ||
    searchableSchema.includes(normalizedFilter)
  );
}

function normalizeTypeArraySchema(schema) {
  if (!schema) {
    return schema;
  }

  if (schema.type === null) {
    return {
      ...schema,
      type: 'null',
    };
  }

  if (!Array.isArray(schema.type)) {
    return schema;
  }

  const { type: rawTypes, ...rest } = schema;
  const types = rawTypes.map((t) => (t === null ? 'null' : String(t)));
  const allowsNull = types.includes('null') && types.length > 1;
  return {
    ...rest,
    oneOf: types.map((t) => ({
      ...rest,
      title: t,
      type: t,
      ...(allowsNull && t !== 'null' ? { allowsNull: true } : {}),
    })),
  };
}

export function deRefSchema(schema, rootSchema, visited = new Set()) {
  if (!schema?.$ref || !rootSchema) {
    return normalizeTypeArraySchema(schema);
  }

  const ref = schema.$ref;
  if (visited.has(ref)) {
    return normalizeTypeArraySchema({ ...schema, $ref: undefined });
  }

  const nextVisited = new Set(visited);
  nextVisited.add(ref);

  const splitReference = ref.split('/').filter((item) => !!item);
  let resolvedRef = rootSchema;
  for (let i = 0; i < splitReference.length; i++) {
    const rawPart = splitReference[i];

    if (rawPart && rawPart !== '#') {
      const refPart = decodeURIComponent(rawPart)
        .replace(/~1/g, '/')
        .replace(/~0/g, '~');
      const curRefPart =
        resolvedRef && typeof resolvedRef === 'object'
          ? resolvedRef[refPart]
          : undefined;

      if (!curRefPart) {
        resolvedRef = false;
        break;
      }

      resolvedRef = curRefPart;
    }
  }

  resolvedRef = resolvedRef || {};
  const merged = { ...schema, $ref: undefined, ...resolvedRef };

  if (merged.$ref) {
    return deRefSchema(merged, rootSchema, nextVisited);
  }

  return normalizeTypeArraySchema(merged);
}
