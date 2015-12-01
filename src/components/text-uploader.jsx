import React from 'react';

/**
 * Component that allows a user to upload a text to the app.
 * Currently implemented as a text area.
 */
export default class TextUploader extends React.Component {
  constructor() {
    super();
    this.state = { value: "" };
  }

  /**
   * Event handler for changes to the content of the text area.
   * @param  {SyntheticEvent} event a change event
   * @return {[type]}       [description]
   */
  handleChange(event) {
    // Set the internal state of the component to the
    // new value and trigger the external handler that was
    // passed in through props.
    this.setState({value: event.target.value});
    this.props.updated(this.state.value, this.props.corpusId);
  }

  render() {
    return <textarea
      onChange={this.handleChange.bind(this)}
      defaultValue={this.props.text}
      rows="4"
      cols="50">
    </textarea>;
  }
}

TextUploader.propTypes = {
  updated: React.PropTypes.func,    // callback for when state is updated.
  text: React.PropTypes.string,     // initial text content.
  corpusId: React.PropTypes.string  // an identifier to track responses
                                    // from this component.
};
