
import { fromJS } from 'immutable';
import configEditorReducer from '../reducer';

describe('configEditorReducer', () => {
  it('returns the initial state', () => {
    expect(configEditorReducer(undefined, {})).toEqual(fromJS({}));
  });
});
