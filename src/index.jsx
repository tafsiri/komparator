import '../css/index.css';
import '../index.html';

import React from 'react';
import { setText } from './model/actions';
import { getStore } from './model/reducers';
import { initialState } from './model/reducers';
import TextUploader from './components/text-uploader.jsx';
import CompareView from './components/compare-view.jsx';
import Controls from './components/controls.jsx';
import samples from '../data/samples.js';

/**
 * Main component that represents the Komparator demo app.
 *
 * Responsible to scafollding the top level components and
 * connecting them to the data store.
 */
class KomparatorApp extends React.Component {

  constructor() {
    super();

    // Note the initial state is stored as a property on this POJO because
    // react requires the state property to be a POJO. If you use the
    // immutable object directly, its prototype will get changed.
    this.state = { data: initialState };

    this.store = getStore();

    this.store.subscribe(() => {
      this.setState({'data': this.store.getState()});
    });
  }

  /**
   * On mount we dispatch an action to render the sample text.
   */
  componentDidMount() {
    this.store.dispatch(setText(samples.nyt, "left"));
    this.store.dispatch(setText(samples.fox, "right"));
  }

  /**
   * Event handler for updated text. Will update the store with
   * the new text. Called by the TextUploader components.
   *
   * @param  {String} newValue the new text
   * @param  {String} corpusId the corpusId associated with the text
   *                           currently 'left'|'right'
   */
  textUpdated(newValue, corpusId) {
    this.store.dispatch(setText(newValue, corpusId));
  }

  render() {

    var left = this.state.data.get('sourceTexts').get('left');
    var right = this.state.data.get('sourceTexts').get('right');
    var options = this.state.data.get('komparatorOptions');

    return (
      <div>

        {/* UI for various options for the app */}

        <div className="pure-g">
          <div className="pure-u-1">
            <Controls store={this.store}/>
          </div>
        </div>

        {/* Compare View, holds the main visualization */}

        <div className="pure-g">
          <div className="pure-u-1">
            <CompareView left={left} right={right} options={options.toJS()}/>
          </div>
        </div>

        {/* Text Entry, allows user to update the texts being compared */}

        <div className="pure-g">
          <div className="pure-u-1-2">
            <TextUploader updated={this.textUpdated.bind(this)} corpusId="left" text={left} />
          </div>
          <div className="pure-u-1-2">
            <TextUploader updated={this.textUpdated.bind(this)} corpusId="right" text={right}/>
          </div>
        </div>

      </div>
    );
  }
}

// Inital render.
document.addEventListener("DOMContentLoaded", function() {
  React.render(<KomparatorApp />, document.getElementById('main'));
});
