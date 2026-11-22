/*
 *
 * Editor actions
 *
 */

import {
  INITIALIZE,
  UPDATE_PATH,
  UPDATE_CONFIG_FOR_PATH,
  DELETE_CONFIG_FOR_PATH,
} from './constants';

export function initialize(
  path = '',
  config = {},
  schema = {},
  deltaDepth = 0,
) {
  return {
    type: INITIALIZE,
    path,
    config,
    schema,
    deltaDepth,
  };
}

export function updatePath(path = '') {
  return {
    type: UPDATE_PATH,
    path,
  };
}

export function updateConfigForPath(config, path = '', depth = -1) {
  return {
    type: UPDATE_CONFIG_FOR_PATH,
    config,
    path,
    depth,
  };
}

export function deleteConfigForPath(path = '', depth = -1) {
  return {
    type: DELETE_CONFIG_FOR_PATH,
    path,
    depth,
  };
}
