/*
 * action types
 */

export const SET_TEXT = 'SET_TEXT';
export const SET_MIN_FREQUENCY = 'CHANGE_MIN_FREQ_THRESHOLD';
export const SHOW_UNIQUE_TERMS = 'TOGGLE_UNIQUE_TERMS';
export const SHOW_STOP_WORDS = 'SHOW_STOP_WORDS';

/*
 * action creators
 */

export function setText(text, corpusId) {
  return { type: SET_TEXT, text, corpusId };
}

export function setMinimumFrequency(value) {
  return { type: SET_MIN_FREQUENCY, value };
}

export function showUniqueTerms(value) {
  return { type: SHOW_UNIQUE_TERMS, value };
}

export function showStopWords(value) {
  return { type: SHOW_STOP_WORDS, value };
}