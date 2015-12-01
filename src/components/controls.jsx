import React from 'react';
import { setMinimumFrequency, showUniqueTerms, showStopWords } from '../model/actions';

/**
 * Contains UI for the main configuration options that
 * modify the visualization.
 */
 export default class Controls extends React.Component {

  /**
   * Event handler for updates to minimum frquency control
   *
   * @param  {SyntheticEvent} event a change event
   * @return {undefined}
   */
  updateFreq(event) {
    if(event.target.value >= 0) {
      this.props.store.dispatch(setMinimumFrequency(event.target.value));
    }
  }

  /**
   * Event handler for updates to show unique terms toggle
   *
   * @param  {SyntheticEvent} event a change event
   * @return {undefined}
   */
  updateShowUnique(event) {
    this.props.store.dispatch(showUniqueTerms(event.target.checked));
  }

  /**
   * Event handler for updates to show stopwords toggle
   *
   * @param  {SyntheticEvent} event a change event
   * @return {undefined}
   */
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

Controls.propTypes = {
  store: React.PropTypes.object.isRequired // A redux store
};
