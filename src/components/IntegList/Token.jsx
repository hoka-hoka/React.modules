import React, { Component } from 'react';
import { lang, langData } from './constants';

export default class Token extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getToken();
  }

  getToken = async (event) => {
    const { updateState, getData } = this.props;
    if (event) {
      this.clickHanler(event);
    }
    const data = {
      newToken: 1,
    };

    const resp = await getData('/ParseControllers', data);
    if (resp instanceof Error) {
    } else {
      updateState(({ sends }) => ({
        sends: {
          ...sends,
          token: resp.d?.token || '',
        },
      }));
      this.setState({ token: resp.d?.token || '' });
    }
  };

  clickHanler(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  render() {
    const { token } = this.state;
    return (
      <>
        <div className="name">{lang[langData.token]}:</div>
        {token && <div className="token">{token}</div>}
        <a className="blink" href="#" onClick={this.getToken} draggable="false">
          {lang[langData.regenerate]}
        </a>
      </>
    );
  }
}
