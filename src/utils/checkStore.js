import { isObject, isFunction } from './generalUtils';

/**
 * Validate the shape of redux store
 */
export default function checkStore(store) {
  const isValid =
    store &&
    typeof store === 'object' &&
    isFunction(store.dispatch) &&
    isFunction(store.subscribe) &&
    isFunction(store.getState) &&
    isFunction(store.replaceReducer) &&
    isFunction(store.runSaga) &&
    isObject(store.injectedReducers) &&
    isObject(store.injectedSagas);

  if (!isValid) {
    throw new Error('(app/utils...) injectors: Expected a valid redux store');
  }
}
