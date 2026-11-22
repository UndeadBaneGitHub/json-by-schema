
import { fromJS } from 'immutable';
import configPanelReducer from '../reducer';

describe('objectPanelReducer', () => {
  it('returns the initial state', () => {
    expect(configPanelReducer(undefined, {})).toEqual(fromJS({}));
  });
});
