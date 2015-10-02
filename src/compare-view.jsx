import React from 'react';
import Komparator from '../lib/komparator.js';

export default class CompareView extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {    
    var container = React.findDOMNode(this).querySelector('#compare-view');
    var width = React.findDOMNode(this).offsetWidth;
    var height = React.findDOMNode(this).offsetHeigh;
    
    this.komparator = new Komparator({
      container: container
    });

    this.komparator.update(this.props.left, this.props.right, this.props.options)
    this.komparator.render()
  }

  componentDidUpdate() {    
    this.komparator.update(this.props.left, this.props.right, this.props.options)
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