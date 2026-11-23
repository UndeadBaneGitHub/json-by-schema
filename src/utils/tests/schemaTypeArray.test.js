import { describe, it, expect } from 'vitest';
import { List } from 'immutable';
import {
  isValueTypeMatch,
  isMultipleChoiceSchema,
  getMultipleChoiceSchemaChoices,
  inferSchemaIndexes,
  getSelectedSchema,
  getSchemaForPropertyName,
  hasFilter,
  deRefSchema,
} from '../schemaUtils';
import objectPanelReducer from '../../containers/ObjectPanel/reducer';
import {
  openPropertyByPath,
  resetOpenProperty,
  selectSchema,
} from '../../containers/ObjectPanel/actions';
import {
  normalizeFormat,
  parseStructuredValue,
  stringifyStructuredValue,
} from '../formatUtils';

describe('schemaUtils type-array & type-matching helpers', () => {
  it('isValueTypeMatch checks JSON schema types accurately', () => {
    expect(isValueTypeMatch('hello', 'string')).toBe(true);
    expect(isValueTypeMatch(123, 'string')).toBe(false);
    expect(isValueTypeMatch(null, 'string')).toBe(false);

    expect(isValueTypeMatch(123, 'integer')).toBe(true);
    expect(isValueTypeMatch(12.5, 'number')).toBe(true);
    expect(isValueTypeMatch(NaN, 'number')).toBe(false);
    expect(isValueTypeMatch('123', 'integer')).toBe(false);

    expect(isValueTypeMatch(true, 'boolean')).toBe(true);
    expect(isValueTypeMatch('true', 'boolean')).toBe(false);

    expect(isValueTypeMatch([1, 2], 'array')).toBe(true);
    expect(isValueTypeMatch({}, 'array')).toBe(false);

    expect(isValueTypeMatch({ a: 1 }, 'object')).toBe(true);
    expect(isValueTypeMatch(null, 'object')).toBe(false);
    expect(isValueTypeMatch([], 'object')).toBe(false);

    expect(isValueTypeMatch(null, 'null')).toBe(true);
    expect(isValueTypeMatch('', 'null')).toBe(false);
  });

  it('normalizes type arrays into oneOf choices with allowsNull on non-null branches', () => {
    const schema = { type: ['string', 'integer', 'null'] };
    expect(isMultipleChoiceSchema(schema)).toBe(true);

    const choices = getMultipleChoiceSchemaChoices(schema);
    expect(choices.type).toBe('oneOf');
    expect(choices.value).toEqual([
      { title: 'string', type: 'string', allowsNull: true },
      { title: 'integer', type: 'integer', allowsNull: true },
      { title: 'null', type: 'null' },
    ]);
  });

  it('infers first allowsNull branch for null config on nullable type array', () => {
    const schema = { type: ['string', 'integer', 'null'] };
    expect(inferSchemaIndexes({ config: null, schema }, schema).toJS()).toEqual([0]);
    expect(inferSchemaIndexes({ config: 42, schema }, schema).toJS()).toEqual([1]);
    expect(inferSchemaIndexes({ config: 'abc', schema }, schema).toJS()).toEqual([0]);

    const selected = getSelectedSchema(schema, List([1]), schema);
    expect(selected).toEqual({ title: 'integer', type: 'integer', allowsNull: true });
  });

  it('resolves non-first patternProperties in getSchemaForPropertyName', () => {
    const schema = {
      type: 'object',
      patternProperties: {
        '^x-': { type: 'string' },
        '^num_': { type: 'integer' },
        '^flag_': { type: 'boolean' },
      },
    };
    expect(getSchemaForPropertyName(schema, 'x-test', schema)).toEqual({
      type: 'string',
    });
    expect(getSchemaForPropertyName(schema, 'num_workers', schema)).toEqual({
      type: 'integer',
    });
    expect(getSchemaForPropertyName(schema, 'flag_beta', schema)).toEqual({
      type: 'boolean',
    });
    expect(getSchemaForPropertyName(schema, 'unknown', schema)).toBe(false);
  });

  it('matches case-insensitively in hasFilter when filter contains uppercase characters', () => {
    expect(
      hasFilter('serviceName', undefined, 'serviceName', 'my-service', {
        type: 'string',
      }),
    ).toBe(true);
    expect(
      hasFilter('MY-SERVICE', undefined, 'serviceName', 'my-service', {
        type: 'string',
      }),
    ).toBe(true);
    expect(
      hasFilter('nonexistent_xyz', undefined, 'serviceName', 'my-service', {
        type: 'string',
      }),
    ).toBe(false);
  });
});

describe('objectPanelReducer RESET_OPEN_PROPERTY and SELECT_SCHEMA', () => {
  it('allows SELECT_SCHEMA after RESET_OPEN_PROPERTY closed the same path', () => {
    let state = objectPanelReducer(undefined, {});
    state = objectPanelReducer(
      state,
      openPropertyByPath(
        {
          id: 'p1',
          name: 'x-kappa',
          path: 'x-kappa{0}',
          schema: { type: 'string', allowsNull: true },
        },
        '',
      ),
    );
    state = objectPanelReducer(state, selectSchema(List([0]), 'x-kappa{0}'));
    state = objectPanelReducer(state, resetOpenProperty(''));

    expect(state.get('x-kappa{0}')).toBeUndefined();

    expect(() => {
      state = objectPanelReducer(state, selectSchema(List([0]), 'x-kappa{0}'));
    }).not.toThrow();
    expect(state.getIn(['x-kappa{0}', 'schemaIndexes']).toJS()).toEqual([0]);
  });
});

describe('formatUtils JSON and YAML helpers', () => {
  it('normalizes supported formats', () => {
    expect(normalizeFormat('json')).toBe('json');
    expect(normalizeFormat('yaml')).toBe('yaml');
    expect(normalizeFormat('YAML')).toBe('yaml');
    expect(normalizeFormat('yml')).toBe('yaml');
    expect(normalizeFormat(undefined)).toBe('json');
  });

  it('parses and stringifies JSON and YAML objects accurately', () => {
    const sample = {
      serviceName: 'api-gateway',
      port: 8080,
      tags: ['alpha', 'beta'],
      nested: { enabled: true },
    };

    const jsonStr = stringifyStructuredValue(sample, 'json');
    expect(jsonStr).toContain('"serviceName": "api-gateway"');
    expect(parseStructuredValue(jsonStr, 'json')).toEqual(sample);

    const yamlStr = stringifyStructuredValue(sample, 'yaml');
    expect(yamlStr).toContain('serviceName: api-gateway');
    expect(yamlStr).toContain('port: 8080');
    expect(parseStructuredValue(yamlStr, 'yaml')).toEqual(sample);
  });

  it('normalizes YAML-parsed null in type arrays (e.g. ["string", "integer", null]) to "null" title and type', () => {
    const yamlSchema = parseStructuredValue(
      [
        'type: object',
        'patternProperties:',
        '  ^x-:',
        '    type:',
        '      - string',
        '      - integer',
        '      - null',
        '    description: Pattern property (^x-)',
      ].join('\n'),
      'yaml',
    );
    const propSchema = getSchemaForPropertyName(yamlSchema, 'x-custom', yamlSchema);
    expect(propSchema.oneOf.map((branch) => branch.title)).toEqual([
      'string',
      'integer',
      'null',
    ]);
    expect(propSchema.oneOf.map((branch) => branch.type)).toEqual([
      'string',
      'integer',
      'null',
    ]);
  });

  it('recursively resolves chained $ref definitions with RFC 6901 pointer unescaping and cycle protection', () => {
    const rootSchema = {
      type: 'object',
      definitions: {
        basePort: {
          type: 'integer',
          minimum: 1,
          maximum: 65535,
        },
        aliasPort: {
          $ref: '#/definitions/basePort',
          description: 'Aliased port definition',
        },
        'nested/ ~key': {
          $ref: '#/definitions/aliasPort',
        },
        cycleA: {
          $ref: '#/definitions/cycleB',
        },
        cycleB: {
          $ref: '#/definitions/cycleA',
          type: 'string',
        },
      },
      properties: {
        port: {
          $ref: '#/definitions/nested~1%20~0key',
        },
        cyclic: {
          $ref: '#/definitions/cycleA',
        },
      },
    };

    const resolvedPort = getSchemaForPropertyName(rootSchema, 'port', rootSchema);
    expect(resolvedPort).toEqual({
      type: 'integer',
      minimum: 1,
      maximum: 65535,
      description: 'Aliased port definition',
    });

    const resolvedCyclic = deRefSchema(rootSchema.properties.cyclic, rootSchema);
    expect(resolvedCyclic.type).toBe('string');
    expect(resolvedCyclic.$ref).toBeUndefined();
  });
});
