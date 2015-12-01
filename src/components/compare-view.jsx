import React from 'react';
import Komparator from '../../lib/komparator.js';

/**
 * View that displays a comparison of words used in two text
 * corpora. This is the react view that wraps the komparator
 * visualization.
 */
export default class CompareView extends React.Component {
  constructor() {
    super();
  }

  /**
   * On initial mount of the component, inject an instance of a
   * komparator visualization and initilize it.
   */
  componentDidMount() {
    var container = React.findDOMNode(this).querySelector('#compare-view');
    var width = React.findDOMNode(this).offsetWidth;
    var height = React.findDOMNode(this).offsetHeigh;

    this.komparator = new Komparator({
      container: container
    });

    this.komparator.update(this.props.left, this.props.right, this.props.options);
    this.komparator.render();
  }

  /**
   * Pass updated data and parameters to the komparator and re-render
   */
  componentDidUpdate() {
    this.komparator.update(this.props.left, this.props.right, this.props.options);
    this.komparator.render();
  }

  render() {
    return (
      <div>
        <div className="pure-g">
          <div id="compare-view"></div>
        </div>
      </div>
    );
  }
}

CompareView.propTypes = {
  left: React.PropTypes.string.isRequired,
  right: React.PropTypes.string.isRequired,
  options: React.PropTypes.object.isRequired
};
