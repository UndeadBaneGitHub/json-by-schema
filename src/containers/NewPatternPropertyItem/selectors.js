import { createSelector } from 'reselect';

import { DOMAIN_NAME } from './constants';

/**
 * Direct selector to the newPatternPropertyItem state domain
 */
const selectNewPatternPropertyItemDomain = (state) => state.get(DOMAIN_NAME);

/**
 * Other specific selectors
 */

const makeSelectNewValue = (path) =>
  createSelector(
    selectNewPatternPropertyItemDomain,
    (state) => state.getIn([path, 'newName']) || '',
  );

const makeSelectNumMatchingPatterns = (path) =>
  createSelector(
    selectNewPatternPropertyItemDomain,
    (state) => state.getIn([path, 'numMatchingPatterns']) || 0,
  );

/**
 * Default selector used by NewPatternPropertyItem
 */

export { makeSelectNewValue, makeSelectNumMatchingPatterns };
