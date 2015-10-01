import Immutable from 'immutable';
import { SET_TEXT, SET_MIN_FREQUENCY, SHOW_UNIQUE_TERMS } from './actions';


export default function makeReducer(initialState) {

  var reducer = function(state, action) {
    if (typeof state === 'undefined') {
      return initialState;
    }

    switch (action.type) {
      case SET_TEXT:
        return state.updateIn(['sourceTexts', action.corpusId], () => action.text);
      case SET_MIN_FREQ_THRESHOLD:
        return state.updateIn(['komparatorOptions', 'minimumFrequency'], () => action.value);
      case SHOW_UNIQUE_TERMS:
        return state.updateIn(['komparatorOptions', 'showUniqueTerms'], () => action.value);
      default:
        return state;
    }
  };

  return reducer;
}