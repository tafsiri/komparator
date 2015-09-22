import React from 'react';
import TextUploader from './text-uploader.jsx';
import CompareView from './compare-view.jsx'


class UIMenuComponent extends React.Component {
  render() {
    return <div onClick={this._handleClick}>Hello, UIMenuComponent.</div>;
  }
}

class Komparator extends React.Component {

  constructor() {
    super();
    // this is just a stub model
    // this will eventually be a proper data store
    this.state = {
      left: {
        text: "hello left"
      },
      right: {
        text: "hello right"
      }
    }
  }

  textUpdated(newValue, corpusId) {
    this.setState(function(){
      var ret = {};
      ret[corpusId] = {text: newValue}  ;
      return ret;
    })
  }

  render() {
    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-1">
            <UIMenuComponent/>
          </div>
        </div>
        
        <div className="pure-g">
          <div className="pure-u-1">
            <CompareView left={this.state.left.text} right={this.state.right.text}/>
          </div>
        </div>

      {/* Text Entry */}

      <div className="pure-g">
        <div className="pure-u-1-2">
          <TextUploader updated={this.textUpdated.bind(this)} corpusId="left" />
        </div>
        <div className="pure-u-1-2">
          <TextUploader updated={this.textUpdated.bind(this)} corpusId="right" />
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