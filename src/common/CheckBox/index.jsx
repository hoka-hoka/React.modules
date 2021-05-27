import React, { Component } from 'react';
import './CheckBox.scss';

export default class CheckBox extends Component {
  constructor(props) {
    super(props);
    const { active } = this.props;
    this.state = { active: active || false };
  }

  componentDidUpdate() {
    const { active } = this.state;
    const { bubling, callback } = this.props;
    if (bubling) {
      callback(active);
    }
  }

  changeActive = () => {
    this.setState(({ active }) => ({ active: !active }));
  };

  render() {
    const { text, extClass, idFor } = this.props;
    return (
      <div className="check-box">
        <input
          id={idFor}
          className="check-box__field check-box__field_hiden"
          type="checkbox"
          tabIndex="-1"
          onClick={this.changeActive}
        />
        <label className={`check-box__lab${extClass ?? ''}`} htmlFor={idFor}>
          {text}
        </label>
      </div>
    );
  }
}
