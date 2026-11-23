import { createSelector } from 'reselect';
import { List } from 'immutable';

import { assurePath } from '../../utils/schemaUtils';

import { DOMAIN_NAME } from './constants';

/**
 * Direct selector to the configPanel state domain
 */
const selectObjectPanelDomain = (state) => state.get(DOMAIN_NAME);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ObjectPanel
 */

const makeSelectHasBeenInitialized = () =>
  createSelector(
    selectObjectPanelDomain,
    (state) => state.getIn(['', 'initialized']) || false,
  );

const makeSelectLoading = (path) =>
  createSelector(
    selectObjectPanelDomain,
    (state) => state.getIn([assurePath(path), 'loading']) || false,
  );

const makeSelectOpenProperty = (path) =>
  createSelector(
    selectObjectPanelDomain,
    (state) => state.getIn([assurePath(path), 'openProperty']) || false,
  );

const makeSelectErrors = (path) =>
  createSelector(
    selectObjectPanelDomain,
    (state) => state.getIn([assurePath(path), 'errors']) || List(),
  );

const makeSelectConfig = (path) =>
  createSelector(
    selectObjectPanelDomain,
    (state) => state.getIn([assurePath(path), 'config']) || false,
  );

const makeSelectInitialConfig = (path) =>
  createSelector(
    selectObjectPanelDomain,
    (state) => state.getIn([assurePath(path), 'initialConfig']) || false,
  );

const makeSelectDisplayNewPatternPropertyItem = (path) =>
  createSelector(
    selectObjectPanelDomain,
    (state) =>
      state.getIn([assurePath(path), 'displayNewPatternPropertyItem']) || false,
  );

const makeSelectSchemaIndexes = (path) =>
  createSelector(selectObjectPanelDomain, (state) => {
    if (!state) return false; // this selector might be called before reducer is initialized
    return state.getIn([assurePath(path), 'schemaIndexes']) || List();
  });

const makeSelectFilter = (path) =>
  createSelector(selectObjectPanelDomain, (state) =>
    state.getIn([assurePath(path), 'filter']),
  );

const makeSelectFilterWasSet = (path) =>
  createSelector(selectObjectPanelDomain, (state) =>
    state.getIn([assurePath(path), 'filterWasSet']),
  );

const makeSelectEditAsJson = (path) =>
  createSelector(selectObjectPanelDomain, (state) =>
    state.getIn([assurePath(path), 'editAsJson']),
  );

export {
  makeSelectHasBeenInitialized,
  makeSelectLoading,
  makeSelectOpenProperty,
  makeSelectErrors,
  makeSelectConfig,
  makeSelectDisplayNewPatternPropertyItem,
  makeSelectSchemaIndexes,
  makeSelectFilter,
  makeSelectFilterWasSet,
  makeSelectEditAsJson,
  makeSelectInitialConfig,
};
