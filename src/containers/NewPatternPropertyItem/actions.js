/*
 *
 * NewPatternPropertyItem actions
 *
 */

import { CHANGE_NEW_PROPERTY_VALUE } from './constants';

export function changeNewPropertyName(value, patterns, path) {
  return {
    type: CHANGE_NEW_PROPERTY_VALUE,
    value,
    patterns,
    path,
  };
}
