import React from 'react';
import Immutable from 'immutable';
import { createStore } from 'redux';
import makeReducer from './reducers';
import { setText } from './actions';
import TextUploader from './text-uploader.jsx';
import CompareView from './compare-view.jsx'
import samples from '../data/samples.js';


class UIMenuComponent extends React.Component {
  render() {
    return <div onClick={this._handleClick}>Hello, UIMenuComponent.</div>;
  }
}

class Komparator extends React.Component {

  constructor() {
    super();

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
    })
  }

  componentDidMount() {
    this.store.dispatch(setText(samples.nyt, "left"));
    this.store.dispatch(setText(samples.fox, "right"));
  }

  textUpdated(newValue, corpusId) {
    this.store.dispatch(setText(newValue, corpusId));
  }

  render() {

    var left = this.state.data.get('sourceTexts').get('left');
    var right = this.state.data.get('sourceTexts').get('right');

    return (
      <div>

        {/* UI for various options for the app */}

        <div className="pure-g">
          <div className="pure-u-1">
            <UIMenuComponent/>
          </div>
        </div>
        
        {/* Compare View, holds the main visualization */}

        <div className="pure-g">
          <div className="pure-u-1">
            <CompareView left={left} right={right}/>
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


document.addEventListener("DOMContentLoaded", function() {
  React.render(
      <Komparator />,
      document.getElementById('main')
    );
});