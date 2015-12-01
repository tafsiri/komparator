import React from 'react';
import Immutable from 'immutable';
import { createStore } from 'redux';
import makeReducer from './model/reducers';
import { setText } from './model/actions';
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

    // Set up the inital state and create the redux store.
    var initialState = Immutable.fromJS({
      sourceTexts: {
        left: "",
        right: ""
      },
      komparatorOptions: {
        showUniqueTerms: false,
        minimumFrequency: 3
      }
    });

    this.state = {
      data: initialState
    };

    var reducer = makeReducer(initialState);
    this.store = createStore(reducer);

    this.store.subscribe(() => {
      // Update component state when the store changes.
      // we use a data property because react requires that
      // what is passed to setState is a pojo, if you pass
      // the immutable object, its prototype will get changed.
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
