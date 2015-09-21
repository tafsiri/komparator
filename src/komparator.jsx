import React from 'react';

class SplitViewComponent extends React.Component {
  render() {
    return <div onClick={this._handleClick}>Hello, world.</div>;
  }
}


class UIMenuComponent extends React.Component {
  render() {
    return <div onClick={this._handleClick}>Hello, world.</div>;
  }
}


class Komparator extends React.Component {
  render() {

  }
}


document.addEventListener("DOMContentLoaded", function() {
  console.log("hello")
  console.log("goodbye")
});