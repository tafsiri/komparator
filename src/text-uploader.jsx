import React from 'react';

export default class TextUploader extends React.Component {
  constructor() {
    super()
    this.state = { value: "" };
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.props.updated(this.state.value, this.props.corpusId);
  }

  render() {
    return <textarea onChange={this.handleChange.bind(this)} defaultValue={this.props.text} rows="4" cols="50"></textarea>;
  }
}