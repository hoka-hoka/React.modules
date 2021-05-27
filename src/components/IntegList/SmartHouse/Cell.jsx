import React, { Component } from 'react';

export default class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { field, titleName, valid = true } = this.props;
    return (
      <div className="col">
        <div className="title">{titleName}</div>
        {field}
      </div>
    );
  }
}
