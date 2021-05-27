import React, { Component } from 'react';
import { lang, langData } from './constants';

export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { handler } = this.props;
    return (
      <>
        <div className="name raised">{lang[langData.about]}:</div>
        <textarea className="f-text wide fTextArea" rows="5" onBlur={handler} />
      </>
    );
  }
}
