import React, { Component } from 'react';

export default class Field extends Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.defVal || '' };
  }

  componentDidUpdate() {
    const { value } = this.state;
    const { defVal, focusHandler } = this.props;
    if (focusHandler && value != defVal) {
      this.setState({ value: defVal });
    }
  }

  setDevData = (event) => {
    const { value } = event.target;
    this.setState({ value: value });
  };

  createField() {
    const { value } = this.state;
    const { extClass, inpType, prompt, blurHandler, focusHandler } = this.props;
    return (
      <input
        className={`f-text${extClass ? extClass : ''}`}
        type={inpType || 'text'}
        placeholder={prompt || ''}
        onChange={(event) => this.setDevData(event)}
        onBlur={() => (blurHandler ? blurHandler(value) : false)}
        onFocus={(event) => {
          focusHandler ? focusHandler(event) : false;
        }}
        value={value || ''}
      />
    );
  }

  render() {
    const { valid = true } = this.props;
    return (
      <>
        {!valid ? (
          <div className="err">
            {this.createField()}
            <svg width="15" height="18">
              <use xlinkHref="#error" />
            </svg>
          </div>
        ) : (
          this.createField()
        )}
      </>
    );
  }
}
