/*
 * This module exports all the action types and action creators
 * that the app uses. Actions are used to communicate intentions
 * to change the state of the application and are commonly triggered
 * by user interaction.
 */

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
