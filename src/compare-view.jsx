import React from 'react';
import Komparator from '../lib/komparator.js';

export default class CompareView extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    console.log("Compare-view did mount")
    var container = React.findDOMNode(this).querySelector('#compare-view');
    var width = React.findDOMNode(this).offsetWidth;
    var height = React.findDOMNode(this).offsetHeigh;
    console.log(width, height, container.offsetWidth, container.offsetHeight, container);
    this.komparator = new Komparator({
      container: container
    });
    this.komparator.update(this.props.left, this.props.right)
    this.komparator.render()
  }

  componentDidUpdate() {
    console.log("componentDidUpdate", this.props);
    this.komparator.update(this.props.left, this.props.right)
    this.komparator.render()
  }

  render() {
    return <div>
      <div className="pure-g">
        <div id="compare-view">
        </div>
      </div>
    </div>
  }
}