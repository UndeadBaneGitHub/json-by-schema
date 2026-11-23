/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { fromJS, Map as ImmutableMap } from 'immutable';

function combineImmutableReducers(reducers) {
  const keys = Object.keys(reducers);
  return function combination(state = ImmutableMap(), action) {
    let nextState = ImmutableMap.isMap(state) ? state : fromJS(state || {});
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const reducer = reducers[key];
      const prevSubState = nextState.get(key);
      const nextSubState = reducer(prevSubState, action);
      if (nextSubState !== prevSubState) {
        nextState = nextState.set(key, nextSubState);
      }
    }
    return nextState;
  };
}

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
  return combineImmutableReducers({
    global: appReducer,
    ...injectedReducers,
  });
}
