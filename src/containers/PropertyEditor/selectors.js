import { createSelector } from 'reselect';

import { DOMAIN_NAME } from './constants';

/**
 * Direct selector to the propertyEditor state domain
 */
const selectPropertyEditorDomain = (state) => state.get(DOMAIN_NAME);

/**
 * Other specific selectors
 */

const makeSelectNewValue = () =>
  createSelector(
    selectPropertyEditorDomain,
    (state) => (state ? state.get('newValue') : undefined),
  );

const makeSelectStrNewValue = () =>
  createSelector(
    selectPropertyEditorDomain,
    (state) => (state ? state.get('strNewValue') : undefined),
  );

/**
 * Default selector used by PropertyEditor
 */

export { makeSelectNewValue, makeSelectStrNewValue };
