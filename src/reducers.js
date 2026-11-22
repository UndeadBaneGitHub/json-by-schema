/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';

/**
 * Empty global plugin reducer, needs to be provided to the store to properly configure it
 */

// The initial state of the App
const initialState = fromJS({});

function appReducer(state = initialState, action) {
  switch (action.type) {
    default: {
      return state;
    }
  }
}

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers) {
  return combineReducers({
    global: appReducer,
    ...injectedReducers,
  });
}
