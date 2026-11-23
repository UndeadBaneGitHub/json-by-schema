/*
 *
 * PropertyEditor reducer
 *
 */

import { fromJS } from 'immutable';
import { CHANGE_NEW_PROPERTY_VALUE } from './constants';

const initialState = fromJS({
  newValue: '',
  strNewValue: '',
});

function propertyEditorReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_NEW_PROPERTY_VALUE:
      return state
        .set('newValue', action.value)
        .set('strNewValue', action.strValue);
    default:
      return state;
  }
}

export default propertyEditorReducer;
