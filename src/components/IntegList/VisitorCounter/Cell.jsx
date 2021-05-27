import React, { Component } from 'react';

export default class Cell extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {};
  }

  render()
  {
    const { field, titleName, valid = true } = this.props;
    return (
      <div className="col">
        <div className="title">{titleName}</div>
        {!valid ? (
          <div className="err">
            {field}
            <svg width="15" height="18">
              <use xlinkHref="#error" />
            </svg>
          </div>
        ) : (
          field
        )}
      </div>
    );
  }
}
