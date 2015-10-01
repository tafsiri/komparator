/*
 * action types
 */

export const SET_TEXT = 'SET_TEXT';
export const SET_MIN_FREQUENCY = 'CHANGE_MIN_FREQ_THRESHOLD';
export const SHOW_UNIQUE_TERMS = 'TOGGLE_UNIQUE_TERMS';

/*
 * action creators
 */

export function setText(text, corpusId) {
  return { type: SET_TEXT, text, corpusId };
}

export function setMinimumFrequency(value) {
  return { type: SET_MIN_FREQ_THRESHOLD, value };
}

export function showUniqueTerms(value) {
  return { type: SHOW_UNIQUE_TERMS, value };
}