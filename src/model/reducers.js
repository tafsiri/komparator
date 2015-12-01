/**
 * This module contains the reducers that transform actions into actual
 * changes of state.
 */

import {
  SET_TEXT,
  SET_MIN_FREQUENCY,
  SHOW_UNIQUE_TERMS,
  SHOW_STOP_WORDS
} from './actions';


/**
 * Create a redux reducer function, the returned function
 * will produce a new state for every given pair of state and action
 *
 * @param  {Object} initialState an Immutable.js object representing
 *                               the initial state of the application.
 * @return {Function} reducer a function that converts actions and a current
 *                            state into a new state.
 */
export default function makeReducer(initialState) {

  /**
   * The reducer function
   * @param  {Object} state  an Immutable.js object a current state
   * @param  {Object} action an action object @see ./actions.js
   * @return {Object}        a new immutable object representing the new state
   */
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
