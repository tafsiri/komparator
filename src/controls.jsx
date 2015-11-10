import React from 'react';
import { setMinimumFrequency, showUniqueTerms, showStopWords } from './actions';

export default class Controls extends React.Component {

  updateFreq(event) {
    if(event.target.value >= 0) {
      this.props.store.dispatch(setMinimumFrequency(event.target.value));
    }
  }

  updateShowUnique(event) {
    this.props.store.dispatch(showUniqueTerms(event.target.checked));
  }

  updateShowStopWords(event) {
    this.props.store.dispatch(showStopWords(event.target.checked));
  }

  render() {
    var options = this.props.store.getState().get('komparatorOptions');
    return (
      <div>
        <label>Minimum Term Frequency</label>
        <input type="number"
          value={options.get('minimumFrequency')}
          onChange={this.updateFreq.bind(this)}
          min="0"
          max="100" />

        <label>Show Unique Terms</label>
        <input type="checkbox"
          checked={options.get('showUniqueTerms')}
          onChange={this.updateShowUnique.bind(this)} />

        <label>Show Stopwords</label>
        <input type="checkbox"
          checked={options.get('showStopWords')}
          onChange={this.updateShowStopWords.bind(this)} />
      </div>
    );
  }
}