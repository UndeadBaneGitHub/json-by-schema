import { createSelector } from 'reselect';
import { DOMAIN_NAME } from '../../containers/Editor/constants';

/**
 * Direct selector to the editor state domain
 */
const selectEditorDomain = (state) => state.get(DOMAIN_NAME);

/**
 * Other specific selectors
 */

/**
 * Default selector used by Editor
 */

const makeSelectInitialized = () =>
  createSelector(selectEditorDomain, (state) => !!state.get('id'));
const makeSelectPath = () =>
  createSelector(selectEditorDomain, (state) => state.get('path') || '');
const makeSelectConfig = () =>
  createSelector(selectEditorDomain, (state) => state.get('config'));
const makeSelectInitialConfig = () =>
  createSelector(
    selectEditorDomain,
    (state) => state.get('initialConfig') || {},
  );
const makeSelectSchema = () =>
  createSelector(selectEditorDomain, (state) => state.get('schema'));
const makeSelectDelta = () =>
  createSelector(selectEditorDomain, (state) => state.get('delta'));

export {
  makeSelectInitialized,
  makeSelectPath,
  makeSelectConfig,
  makeSelectInitialConfig,
  makeSelectSchema,
  makeSelectDelta,
};
