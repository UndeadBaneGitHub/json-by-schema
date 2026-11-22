
import { fromJS } from 'immutable';
import propertyEditorReducer from '../reducer';

describe('propertyEditorReducer', () => {
  it('returns the initial state', () => {
    expect(propertyEditorReducer(undefined, {})).toEqual(fromJS({}));
  });
});
