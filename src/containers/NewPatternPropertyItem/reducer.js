/*
 *
 * NewPatternPropertyItem reducer
 *
 */

import { fromJS } from 'immutable';

import { isPatternMatchingName } from '../../utils/schemaUtils';

import { CHANGE_NEW_PROPERTY_VALUE } from './constants';

const initialState = fromJS({});

function newPatternPropertyItemReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_NEW_PROPERTY_VALUE: {
      const numMatchingPatterns = action.patterns.filter((pattern) =>
        isPatternMatchingName(pattern, action.value),
      ).length;

      return state
        .setIn([action.path, 'newName'], action.value)
        .setIn([action.path, 'numMatchingPatterns'], numMatchingPatterns);
    }
    default:
      return state;
  }
}

export default newPatternPropertyItemReducer;
