import { List, fromJS } from 'immutable';
import { put, select, takeLatest } from 'redux-saga/effects';
import { isNumber } from '../../utils/generalUtils';

import {
  generatePropertyObject,
  getSchemaForPropertyName,
  stripPathOfSchemaIndex,
  getSelectedSchema,
  isConfigEmpty,
  generateDefaultValueForProperty,
  isMultipleChoiceSchema,
  inferSchemaIndexes,
} from '../../utils/schemaUtils';

import {
  makeSelectPath,
  makeSelectConfig as makeSelectRootConfig,
  makeSelectSchema as makeSelectRootSchema,
  makeSelectInitialConfig as makeSelectInitialRootConfig,
} from '../../containers/Editor/selectors';

import {
  UPDATE_CONFIG_FOR_PATH,
  DELETE_CONFIG_FOR_PATH,
  UPDATE_PATH,
} from '../../containers/Editor/constants';
import {
  updatePath,
  updateConfigForPath,
} from '../../containers/Editor/actions';

import { INITIALIZE_EDITOR } from './constants';
import {
  makeSelectConfig,
  makeSelectInitialConfig,
  makeSelectOpenProperty,
  makeSelectSchemaIndexes,
} from './selectors';
import { openPropertyByPath, resetOpenProperty, selectSchema } from './actions';

function* closeWrongOpenProperties(parsedLocation) {
  let path = '';
  let openProperty = yield select(makeSelectOpenProperty(path));

  // close whatever is wrong
  while (openProperty) {
    if (!parsedLocation[openProperty.path]) {
      yield put(resetOpenProperty(path));
      path = openProperty.path;
      openProperty = yield select(makeSelectOpenProperty(path));
    } else {
      path = openProperty.path;
      openProperty = yield select(makeSelectOpenProperty(path));
    }
  }
}

function parseSchemaIndexes(str) {
  if (!str) {
    return fromJS([]);
  }
  const splitIndexes = str.split(',');
  return fromJS(
    splitIndexes.map((indexStr) => +indexStr).filter((index) => index > -1),
  );
}

export function* updatePanels() {
  // TODO: Rewrite in a more generic way
  const storedPath = yield select(makeSelectPath());

  const parsedLocation = {
    '': {
      path: '',
      prefixedPath: '', // this field is here for the sake of top level multiple choice schema support
      parentPath: '',
      schemaIndexes: List(),
      name: '',
    },
  };

  let splitLocation = storedPath.split('/');
  const schemaIndexesRe = /^({([\d,]+)})/;

  // if top level schema is multiple choice, try to infer indexes
  let schema = yield select(makeSelectRootSchema());
  let config = yield select(makeSelectRootConfig());
  let initialConfig = yield select(makeSelectInitialRootConfig());

  const schemaIndexesPresent = schemaIndexesRe.test(splitLocation[0]);

  if (!schemaIndexesPresent && isMultipleChoiceSchema(schema)) {
    // try to infer schema indexes
    const inferredSchemaIndexes = inferSchemaIndexes(
      {
        config,
        schema,
      },
      schema,
    );

    if (inferredSchemaIndexes.size) {
      yield put(updatePath(`{${inferredSchemaIndexes.join(',')}}`));

      return;
    }
  }

  if (schemaIndexesPresent) {
    const schemaIndexPos = 2;

    const schemaIndexesMatch = storedPath.match(schemaIndexesRe);
    const schemaIndexes = schemaIndexesMatch[schemaIndexPos] || '';

    if (schemaIndexes) {
      const parsedSchemaIndexes = parseSchemaIndexes(schemaIndexes);
      parsedLocation[''].schemaIndexes = parsedSchemaIndexes;
      parsedLocation[''].prefixedPath = `{${parsedSchemaIndexes.join(',')}}`;
    }

    splitLocation = splitLocation.slice(1);
  }

  const propNameRe = /^(.+?)(?=({([\d,]+)}|$))/;
  const propNamePos = 1;
  const schemaIndexPos = 3;

  let curParent = parsedLocation[''];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < splitLocation.length; i++) {
    const curPiece = splitLocation[i];

    if (!curPiece) {
      break;
    }

    const propNameMatch = curPiece.match(propNameRe);

    const propNameRaw = propNameMatch[propNamePos];
    const propName = decodeURIComponent(propNameRaw);

    const schemaIndexMatch = propNameMatch[schemaIndexPos];
    const schemaIndexes = parseSchemaIndexes(schemaIndexMatch); // isNumber(schemaIndexMatch) ? +schemaIndexMatch : -1;

    const parentPath = curParent.path;
    const prefixedParentPath = curParent.prefixedPath;

    const path = `${parentPath || prefixedParentPath}${
      parentPath || prefixedParentPath ? '/' : ''
    }${propNameRaw}${schemaIndexes.size ? `{${schemaIndexes.join(',')}}` : ''}`;

    const prop = {
      name: propName,
      schemaIndexes,
      path,
      parentPath,
    };
    parsedLocation[path] = prop;
    parsedLocation[parentPath].childPath = path;

    curParent = prop;
  }
  // }

  yield closeWrongOpenProperties(parsedLocation);

  let curLocationPart = parsedLocation[''];

  const rootSchema = schema;

  while (curLocationPart) {
    let openProperty = yield select(
      makeSelectOpenProperty(curLocationPart.path),
    );

    if (curLocationPart.childPath) {
      if (!openProperty) {
        const propName = parsedLocation[curLocationPart.childPath].name;
        const schemaIndexes = curLocationPart.schemaIndexes;

        const selectedSchema = getSelectedSchema(
          schema,
          schemaIndexes,
          rootSchema,
        );

        const propSchema = getSchemaForPropertyName(
          selectedSchema,
          propName,
          rootSchema,
        );

        let stopExecution = !propSchema;

        if (propSchema && selectedSchema.type === 'array') {
          // we need to check for array out of bounds URL,
          // and if it is, stop the parsing at array level
          if (
            !Array.isArray(config) ||
            !isNumber(propName) ||
            Number(propName) >= config.length
          ) {
            stopExecution = true;
          }
        }
        if (selectedSchema.type !== 'array' && curLocationPart.childPath) {
          const curChild = parsedLocation[curLocationPart.childPath];
          if (curChild.childPath) {
            // can't be: a non-existing child can't have yet another child
            stopExecution =
              !propSchema && !Object.hasOwn(config, propName);
          }
        }

        if (stopExecution) {
          // no schema was found for the key => this is a wrong key
          // stop the parsing

          yield put(
            updatePath(curLocationPart.path || curLocationPart.prefixedPath),
          );

          break;
        }

        openProperty = generatePropertyObject(
          propName,
          {
            path: curLocationPart.path || curLocationPart.prefixedPath,
            schema: selectedSchema,
            config,
            initialConfig,
          },
          rootSchema,
          parsedLocation[curLocationPart.childPath].schemaIndexes,
        );

        const isAllowedNull =
          openProperty.config === null &&
          openProperty.schema &&
          openProperty.schema.allowsNull;
        const isExistingPrimitive =
          openProperty.hasConfigValue &&
          openProperty.schema &&
          !['object', 'array'].includes(openProperty.schema.type);

        if (
          !isAllowedNull &&
          !isExistingPrimitive &&
          isConfigEmpty(openProperty.config, openProperty.schema)
        ) {
          // to prevent types collision, if config is empty,
          // generate a new value to guarantee type compliance
          const newConfigValue = generateDefaultValueForProperty(
            openProperty.schema,
          );

          if (!isConfigEmpty(newConfigValue)) {
            openProperty.config = newConfigValue;
          }
        }

        yield put(openPropertyByPath(openProperty, curLocationPart.path));
      }

      schema = openProperty.schema;
      config = openProperty.config;
      initialConfig = openProperty.initialConfig;
    }

    const storedSchemaIndex = yield select(
      makeSelectSchemaIndexes(curLocationPart.path),
    );

    if (
      !storedSchemaIndex?.equals?.(curLocationPart.schemaIndexes)
    ) {
      yield put(
        selectSchema(curLocationPart.schemaIndexes, curLocationPart.path),
      );
    }

    curLocationPart = parsedLocation[curLocationPart.childPath];
  }
}

export function* updateConfig(action) {
  // we need to update the config at the topmost level now, so we
  // will iterate, until we reach it in here and other list/object
  // handlers
  if (!action.path) {
    // end of the line, no more props here,
    // main reducer should handle that action
    return;
  }

  const curDepth = action.depth;

  const splitPath = action.path.split('/');

  const propNameRaw = stripPathOfSchemaIndex(splitPath.pop());

  const propName = decodeURIComponent(propNameRaw);
  let parentPath = splitPath.join('/');

  // check for top level multiple choice schema indexes
  if (/^{([\d,]+)}$/.test(parentPath)) {
    parentPath = '';
  }

  const parentConfig = yield select(makeSelectConfig(parentPath));
  if (parentConfig) {
    let config;

    if (Array.isArray(parentConfig)) {
      config = [...parentConfig];
    } else {
      config = { ...parentConfig };
    }

    config[propName] = action.config;

    const parentInitialConfig = yield select(
      makeSelectInitialConfig(parentPath),
    );
    const newDepth = parentInitialConfig ? curDepth + 1 : curDepth;

    yield put(updateConfigForPath(config, parentPath, newDepth));
  }
}

function* deleteConfig(action) {
  if (!action.path) {
    // this is a complete config deletion, will be taken care of in
    // top level reducer
    return;
  }

  const curDepth = action.depth;

  const splitPath = action.path.split('/');

  const propNameRaw = stripPathOfSchemaIndex(splitPath.pop());

  const propName = decodeURIComponent(propNameRaw);
  let parentPath = splitPath.join('/');

  // check for top level multiple choice schema indexes
  if (/^{([\d,]+)}$/.test(parentPath)) {
    parentPath = '';
  }

  const parentConfig = yield select(makeSelectConfig(parentPath));
  if (parentConfig) {
    let config;

    if (Array.isArray(parentConfig)) {
      config = [...parentConfig];
      if (!Number.isNaN(+propName)) {
        config.splice(+propName, 1);
      } else {
        delete config[propName];
      }
    } else {
      config = { ...parentConfig };
      delete config[propName];
      delete config[propName];
    }

    const parentInitialConfig = yield select(
      makeSelectInitialConfig(parentPath),
    );
    const newDepth = parentInitialConfig ? curDepth + 1 : curDepth;

    // now it's straight back to updating the config
    yield put(updateConfigForPath(config, parentPath, newDepth));
  }
}

export default function* defaultSaga() {
  yield takeLatest(INITIALIZE_EDITOR, updatePanels);
  yield takeLatest(UPDATE_PATH, updatePanels);
  yield takeLatest(UPDATE_CONFIG_FOR_PATH, updateConfig);
  yield takeLatest(DELETE_CONFIG_FOR_PATH, deleteConfig);
}
