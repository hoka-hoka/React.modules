import React, { Component, createRef } from 'react';
import './main.scss';
import makeServer from './server';
import { integ, lang, langData } from './constants';
import DropList from '../../common/DropList';
import Token from './Token';
import About from './About';
import Field from './Field';
import Notification from './Notification';
import Sprite from '../../common/Sprite';

export default class IntegList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applyAction: false,
      valid: true,
      type: 14,
      notice: {
        popupText: '',
        restore: false,
      },
      sends: {},
      error: false,
    };
    this.foundInteg = createRef();
  }

  componentDidMount() {
    const { type } = this.state;
    this.foundInteg.current = this.getIntegByType(type);
    this.forceUpdate();
  }

  componentDidUpdate(_, prevState) {
    const { applyAction, sends } = this.state;
    if (applyAction && prevState.applyAction != applyAction) {
      this.setState({
        valid: this.validCheck(sends?.name),
        applyAction: false,
      });
      setTimeout(() => {
        if (this.checkFixes()) {
          this.sendingReqInteg();
        }
      });
    }
  }

  checkFixes() {
    const { valid, sends } = this.state;
    const foundInteg = this.foundInteg.current;
    if (!foundInteg) {
      return false;
    }
    const rezult = valid && sends[foundInteg.send]?.length;
    return rezult;
  }

  sendingReqInteg() {
    const { sends, type } = this.state;
    const data = { type, ...sends };
    this.getData('/ParseControllers', data);
  }

  getData = async (method, data) => {
    makeServer(method);
    const resp = await fetch(`/api${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!resp.ok) {
      this.setState({ error: true });
      return new Error('Ответ на запрос пустой');
    }
    return resp.json();
  };

  createIntegComp(integ) {
    const IntegComp = integ?.alias;
    if (!IntegComp) {
      return false;
    }
    const props = Object.assign(
      ...integ.props.map((item) => ({ [item]: this.state[item] })),
    );
    return (
      <IntegComp
        {...props}
        integData={integ.data}
        updateState={this.updateState}
      />
    );
  }

  getIntegByType(type) {
    const rezult = integ.types.find((item) => item.value == type);
    return rezult;
  }

  changeType = (val) => {
    const { type } = this.state;
    if (val == type) {
      return;
    }
    this.foundInteg.current = this.getIntegByType(val);
    this.setState({ type: val });
  };

  applyHandler = (event) => {
    this.clickHanler(event);
    $(document).data('no-err-close', 1);
    this.setState({ applyAction: true });
  };

  updateState = (p) => this.setState(p);

  changeText(val, type) {
    this.state.sends[type] = val;
    this.forceUpdate();
  }

  clickHanler(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  validCheck(name) {
    if (name) {
      return true;
    }
    return false;
  }

  render() {
    const { type, valid, notice, error, name } = this.state;
    const foundInteg = this.foundInteg.current;
    return (
      <>
        {!error ? (
          <div className="integ">
            <div className="cont whiteForm">
              <div className="base">
                <div className="item">
                  <div className="name">{lang[langData.name]}:</div>
                  <div className="wide">
                    <Field
                      defVal={name || ''}
                      blurHandler={(val) => {
                        this.changeText(val, 'name');
                      }}
                      valid={valid}
                    />
                  </div>
                </div>

                <div className="item">
                  <div className="name">{lang[langData.type]}:</div>
                  <DropList
                    defVal={type}
                    extClass=" wide"
                    optNames={integ.types.map((item) => item.name)}
                    callback={(val) => this.changeType(val)}
                  />
                </div>

                {foundInteg?.token && (
                  <div className="item">
                    <Token
                      updateState={this.updateState}
                      getData={this.getData}
                    />
                  </div>
                )}

                <div className="item">
                  <About handler={(event) => this.changeText(event, 'about')} />
                </div>
              </div>

              {this.createIntegComp(foundInteg)}
            </div>

            <div className="btns">
              <a
                className="link-new"
                href="#"
                onClick={this.clickHanler}
                draggable="false"
              >
                {lang[langData.cancel]}
              </a>
              <a
                className="link-new blueBtn"
                href="#"
                onClick={this.applyHandler}
                draggable="false"
              >
                {lang[langData.apply]}
              </a>
            </div>
            <Notification
              popupText={notice.popupText}
              updateState={this.updateState}
              btn={notice.btn}
            />
            <Sprite />
          </div>
        ) : (
          false
        )}
      </>
    );
  }
}
