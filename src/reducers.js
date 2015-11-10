// import Immutable from 'immutable';
import { 
  SET_TEXT, 
  SET_MIN_FREQUENCY, 
  SHOW_UNIQUE_TERMS,
  SHOW_STOP_WORDS
} from './actions';


export default function makeReducer(initialState) {

  var reducer = function(state, action) {
    if (typeof state === 'undefined') {
      return initialState;
    }

    switch (action.type) {
      case SET_TEXT:
        return state.updateIn(['sourceTexts', action.corpusId], () => action.text);
      case SET_MIN_FREQUENCY:
        return state.updateIn(['komparatorOptions', 'minimumFrequency'], () => action.value);
      case SHOW_UNIQUE_TERMS:
        return state.updateIn(['komparatorOptions', 'showUniqueTerms'], () => action.value);
      case SHOW_STOP_WORDS:
        return state.updateIn(['komparatorOptions', 'showStopWords'], () => action.value);
      default:
        return state;
    }
  };

  return reducer;
}