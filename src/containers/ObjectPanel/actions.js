import {
  SET_ERRORS,
  INITIALIZE_EDITOR,
  OPEN_PROPERTY_BY_PATH,
  RESET_OPEN_PROPERTY,
  SET_STATE_CONFIG,
  UPDATE_OPEN_PROPERTY_BY_PATH,
  SHOW_NEW_PATTERN_PROPERTY_ITEM,
  HIDE_NEW_PATTERN_PROPERTY_ITEM,
  SELECT_SCHEMA,
  CHANGE_FILTER,
  RESET_FILTER,
  TOGGLE_EDIT_AS_JSON,
} from './constants';

export function initializeEditor() {
  return {
    type: INITIALIZE_EDITOR,
  };
}

export function selectSchema(schemaIndexes, path) {
  return {
    type: SELECT_SCHEMA,
    schemaIndexes,
    path,
  };
}

export function openPropertyByPath(property, path) {
  return {
    type: OPEN_PROPERTY_BY_PATH,
    property,
    path,
  };
}

export function setErrors(errors, path) {
  return {
    type: SET_ERRORS,
    errors,
    path,
  };
}

export function setStateConfig(config, initialConfig, path) {
  return {
    type: SET_STATE_CONFIG,
    config,
    initialConfig,
    path,
  };
}

export function resetOpenProperty(path) {
  return {
    type: RESET_OPEN_PROPERTY,
    path,
  };
}

export function updateOpenPropertyByPath(property, path) {
  return {
    type: UPDATE_OPEN_PROPERTY_BY_PATH,
    property,
    path,
  };
}

export function showNewPatternPropertyItem(path) {
  return {
    type: SHOW_NEW_PATTERN_PROPERTY_ITEM,
    path,
  };
}
export function hideNewPatternPropertyItem(path) {
  return {
    type: HIDE_NEW_PATTERN_PROPERTY_ITEM,
    path,
  };
}

export function changeFilter(filter, path) {
  return {
    type: CHANGE_FILTER,
    filter,
    path,
  };
}

export function resetFilter(path) {
  return {
    type: RESET_FILTER,
    path,
  };
}

export function toggleEditAsJson(path) {
  return {
    type: TOGGLE_EDIT_AS_JSON,
    path,
  };
}
