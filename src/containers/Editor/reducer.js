/*
 *
 * Editor reducer
 *
 */

import { fromJS } from 'immutable';
import { assurePath, generateDefaultValueForProperty } from '../../utils/schemaUtils';
import { genId } from '../../utils/generalUtils';

import {
  INITIALIZE,
  UPDATE_PATH,
  UPDATE_CONFIG_FOR_PATH,
  DELETE_CONFIG_FOR_PATH,
} from './constants';

const initialState = fromJS({
  id: false,
  path: false,
  config: false,
  initialConfig: false,
  schema: false,
  delta: false,
  deltaDepth: 0,
  denormalizedInitialConfig: false,
});

function getConfigType(val) {
  if (!val) return '';

  if (Array.isArray(val)) {
    return 'array';
  }
  if (val === Object(val)) {
    return 'object';
  }
  return 'other';
}
function getDelta({ denormOldObj, denormNewObj, prevDelta }) {
  const res = prevDelta || {
    ADD: {},
    UPDATE: {},
    DELETE: {},
  };

  const oldType = getConfigType(denormOldObj);
  const newType = getConfigType(denormNewObj);

  if (oldType !== newType) {
    if (denormNewObj) {
      if (denormOldObj) {
        res.UPDATE[''] = denormNewObj;

        delete res.UPDATE[''];
        delete res.ADD[''];
      } else {
        res.ADD[''] = denormNewObj;

        delete res.UPDATE[''];
        delete res.DELETE[''];
      }
    } else if (denormOldObj) {
      res.DELETE[''] = true;

      delete res.UPDATE[''];
      delete res.ADD[''];
    }
  } else {
    switch (oldType) {
      case 'object': {
        const processedKeys = {};

        if (denormOldObj && denormNewObj) {
          const oldKeys = Object.keys(denormOldObj);
          const newKeys = Object.keys(denormNewObj);

          oldKeys.forEach((oldKey) => {
            processedKeys[oldKey] = true;

            if (!newKeys.includes(oldKey)) {
              // edge case has to be covered: the old value is an empty object,
              // and we have added a property in it, and depth is -1
              let oneKeyStartsWith = false;

              const oldKeyAsPrefix = oldKey.endsWith('/')
                ? oldKey
                : `${oldKey}/`;

              // eslint-disable-next-line no-plusplus
              for (let i = 0; i < newKeys.length; i++) {
                if (newKeys[i].indexOf(oldKeyAsPrefix) === 0) {
                  oneKeyStartsWith = true;
                  break;
                }
              }

              if (!oneKeyStartsWith) {
                res.DELETE[oldKey] = true;

                delete res.UPDATE[oldKey];
                delete res.ADD[oldKey];
              } else {
                delete res.DELETE[oldKey];
              }
            } else if (
              JSON.stringify(denormOldObj[oldKey]) !==
              JSON.stringify(denormNewObj[oldKey])
            ) {
              res.UPDATE[oldKey] = denormNewObj[oldKey];

              delete res.DELETE[oldKey];
              delete res.ADD[oldKey];
            } else {
              // it's a revert, practically, cleanup

              delete res.ADD[oldKey];
              delete res.UPDATE[oldKey];
              delete res.DELETE[oldKey];
            }
          });
          newKeys.forEach((newKey) => {
            if (processedKeys[newKey]) {
              // already processed, continue
              return;
            }

            processedKeys[newKey] = true;

            let oneKeyStartsWith = false;

            const newKeyAsPrefix = newKey.endsWith('/') ? newKey : `${newKey}/`;

            if (!oldKeys.includes(newKeyAsPrefix)) {
              // edge case fix: the last key in the object is changed/deleted,
              // so it should not generate an ADD delta

              // eslint-disable-next-line no-plusplus
              for (let i = 0; i < oldKeys.length; i++) {
                if (oldKeys[i].indexOf(newKey) === 0) {
                  oneKeyStartsWith = true;
                  break;
                }
              }

              if (!oneKeyStartsWith) {
                res.ADD[newKey] = denormNewObj[newKey];

                delete res.UPDATE[newKey];
                delete res.DELETE[newKey];
              }
            }
          });
        } else if (denormNewObj) {
          res.ADD[''] = denormNewObj;

          delete res.UPDATE[''];
          delete res.DELETE[''];
        } else {
          res.DELETE[''] = true;

          delete res.UPDATE[''];
          delete res.ADD[''];
        }

        // clean up the remaining keys that have not been found either in
        // original config or in new config
        Object.keys(res.ADD).forEach((key) => {
          if (!processedKeys[key]) {
            delete res.ADD[key];
          }
        });
        Object.keys(res.UPDATE).forEach((key) => {
          if (!processedKeys[key]) {
            delete res.UPDATE[key];
          }
        });
        Object.keys(res.DELETE).forEach((key) => {
          if (!processedKeys[key]) {
            delete res.DELETE[key];
          }
        });

        break;
      }
      default: {
        if (denormOldObj && denormNewObj) {
          res.UPDATE[''] = denormNewObj;

          delete res.DELETE[''];
          delete res.ADD[''];
        } else if (denormNewObj) {
          res.ADD[''] = denormNewObj;
        } else if (denormOldObj) {
          res.DELETE[''] = true;

          delete res.ADD[''];
          delete res.UPDATE[''];
        } else {
          // it's a revert
          delete res.ADD[''];
          delete res.UPDATE[''];
          delete res.DELETE[''];
        }
        break;
      }
    }
  }

  if (
    Object.keys(res.ADD).length ||
    Object.keys(res.UPDATE).length ||
    Object.keys(res.DELETE).length
  ) {
    return res;
  }
  return false;
}

function denormalizeConfig({ config, prefix, depth, curDepth = 0, res = {} }) {
  const curPrefix = prefix ? `${prefix}/` : '';
  let curRes = res;

  const configKeys = Object.keys(config);

  if (configKeys?.length) {
    configKeys.forEach((key) => {
      const val = config[key];
      if (
        Object(val) === val &&
        val.constructor !== Array &&
        (depth < 0 || curDepth < depth)
      ) {
        curRes = denormalizeConfig({
          config: val,
          prefix: curPrefix + key,
          depth,
          curDepth: curDepth + 1,
          res: curRes,
        });
      } else {
        curRes[curPrefix + key] = val;
      }
    });
  } else {
    curRes[prefix] = config;
  }

  return curRes;
}

function configEditorReducer(state = initialState, action) {
  const path = assurePath(action.path);

  switch (action.type) {
    case UPDATE_PATH:
      return state.set('id', genId()).set('path', path);
    case INITIALIZE: {
      const { schema, deltaDepth } = action;

      let config = action.config;
      if (!config) {
        // config is not present, generate one by schema
        config = generateDefaultValueForProperty(schema);
      }

      return state
        .set('id', genId())
        .set('path', path)
        .set('config', config)
        .set('initialConfig', config)
        .set('delta', false)
        .set('schema', schema)
        .set('deltaDepth', deltaDepth || 0);
    }
    case UPDATE_CONFIG_FOR_PATH: {
      if (action.path) {
        // not yet
        return state;
      }
      // NOW!

      const maxDeltaDepth = state.get('deltaDepth');
      const actionDepth = action.depth;

      let curDeltaDepth = maxDeltaDepth;
      if (maxDeltaDepth > -1 && actionDepth > -1) {
        curDeltaDepth = Math.min(actionDepth, maxDeltaDepth);
      } else if (actionDepth > -1) {
        curDeltaDepth = actionDepth;
      } else {
        curDeltaDepth = maxDeltaDepth;
      }

      const denormalizedInitialConfig = denormalizeConfig({
        config: state.get('initialConfig'),
        depth: curDeltaDepth,
      });
      const denormalizedActionConfig = denormalizeConfig({
        config: action.config,
        depth: curDeltaDepth,
      });

      const delta = getDelta({
        denormOldObj: denormalizedInitialConfig,
        denormNewObj: denormalizedActionConfig,
        delta: state.get('delta'),
      });

      return state
        .set('id', genId())
        .set('config', action.config)
        .set('delta', delta);
    }
    case DELETE_CONFIG_FOR_PATH: {
      if (action.path) {
        return state;
      }

      // it comes here only when we delete entire config
      return state
        .set('id', genId())
        .set('config', false)
        .set('delta', { ADD: {}, UPDATE: {}, DELETE: { '': true } });
    }
    default:
      return state;
  }
}

export default configEditorReducer;
