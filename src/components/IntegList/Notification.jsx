import React, { Component, createRef } from 'react';
import { lang, langData } from './constants';

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.panel = createRef();
  }

  closeModal = () => {
    const { updateState } = this.props;
    updateState({ notice: { popupText: '' } });
  };

  restoreDelFile = (event) => {
    const { updateState } = this.props;
    this.clickHanler(event);
    updateState({ notice: { popupText: '', restore: true } });
  };

  popupRef = (popupDiv) => {
    $(popupDiv).show();
    $.event.trigger({ type: 'errInit' });
  };

  clickHanler(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  render() {
    const { popupText, btn = true } = this.props;
    return (
      <>
        {popupText && (
          <div className="errGlobal bl" ref={this.popupRef}>
            <div className="cont">
              <img
                alt={lang[langData.notice]}
                className="errGlobal-img1"
                src="/img/notice.png"
              />
              <div className="errGlobal-ch1">{popupText}</div>
              {btn && (
                <a
                  href="#"
                  className="errBtn"
                  onClick={this.restoreDelFile}
                  draggable="false"
                >
                  {lang[langData.recover].toUpperCase()}
                </a>
              )}
              <img
                alt={lang[langData.close]}
                className="errGlobal-img2"
                src="img/close.png"
                onClick={this.closeModal}
              />
            </div>
          </div>
        )}
      </>
    );
  }
}
