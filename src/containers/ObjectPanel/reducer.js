/*
 *
 * ConfigPanel reducer
 *
 */

import { fromJS } from 'immutable';

import { assurePath } from '../../utils/schemaUtils';

import {
  OPEN_PROPERTY_BY_PATH,
  SET_ERRORS,
  SET_STATE_CONFIG,
  RESET_OPEN_PROPERTY,
  UPDATE_OPEN_PROPERTY_BY_PATH,
  HIDE_NEW_PATTERN_PROPERTY_ITEM,
  SHOW_NEW_PATTERN_PROPERTY_ITEM,
  SELECT_SCHEMA,
  CHANGE_FILTER,
  RESET_FILTER,
  TOGGLE_EDIT_AS_JSON,
} from './constants';

const supportedTypes = ['object', 'array'];

const initialPanelState = fromJS({
  initialized: false,
  loading: false,
  errors: {},
  openProperty: false,
  displayNewPatternPropertyItem: false,
  schemaIndexes: [],
  filter: '',
  filterWasSet: false,
  editAsJson: false,
  config: false,
  initialConfig: false,
});

const initialState = fromJS({}).set('', initialPanelState);

function objectPanelReducer(state = initialState, action) {
  const path = assurePath(action.path);

  switch (action.type) {
    case OPEN_PROPERTY_BY_PATH: {
      let localState = state;
      if (supportedTypes.includes(action.property.schema.type)) {
        const { property } = action;

        localState = localState.set(
          property.path,
          initialPanelState.set('initialized', true),
        );
      }

      return localState.setIn([path, 'openProperty'], action.property);
    }
    case SELECT_SCHEMA: {
      const { schemaIndexes } = action;

      return state.setIn([path, 'schemaIndexes'], schemaIndexes);
    }
    case RESET_OPEN_PROPERTY: {
      const openProperty = state.getIn([path, 'openProperty']);

      let localState = state;

      if (openProperty) {
        // close respective panel
        localState = localState.set(assurePath(openProperty.path), false);
      }

      return localState.setIn([path, 'openProperty'], false);
    }
    case SET_ERRORS: {
      return state.setIn([path, 'errors'], fromJS(action.errors));
    }
    case SET_STATE_CONFIG: {
      return state
        .setIn([path, 'config'], action.config)
        .setIn([path, 'initialConfig'], action.initialConfig);
    }
    case UPDATE_OPEN_PROPERTY_BY_PATH: {
      return state.setIn([path, 'openProperty'], action.property);
    }
    case SHOW_NEW_PATTERN_PROPERTY_ITEM: {
      return state.setIn([path, 'displayNewPatternPropertyItem'], true);
    }
    case HIDE_NEW_PATTERN_PROPERTY_ITEM: {
      return state.setIn([path, 'displayNewPatternPropertyItem'], false);
    }
    case CHANGE_FILTER: {
      return state
        .setIn([path, 'filter'], action.filter)
        .setIn([path, 'filterWasSet'], true);
    }
    case RESET_FILTER: {
      return state
        .setIn([path, 'filter'], '')
        .setIn([path, 'filterWasSet'], !state.getIn([path, 'filterWasSet']));
    }
    case TOGGLE_EDIT_AS_JSON: {
      return state.setIn(
        [path, 'editAsJson'],
        !state.getIn([path, 'editAsJson']),
      );
    }
    default:
      return state;
  }
}

export default objectPanelReducer;
