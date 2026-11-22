/*
 *
 * PropertyEditor actions
 *
 */

import { CHANGE_NEW_PROPERTY_VALUE } from './constants';

export function changeNewPropertyValue(value, strValue, path) {
  return {
    type: CHANGE_NEW_PROPERTY_VALUE,
    value,
    strValue,
    path,
  };
}
