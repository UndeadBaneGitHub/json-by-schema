
import { fromJS } from 'immutable';
import newPatternPropertyItemReducer from '../reducer';

describe('newPatternPropertyItemReducer', () => {
  it('returns the initial state', () => {
    expect(newPatternPropertyItemReducer(undefined, {})).toEqual(fromJS({}));
  });
});
