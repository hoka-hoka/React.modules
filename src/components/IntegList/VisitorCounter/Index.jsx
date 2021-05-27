import React, { Component, createRef, Fragment } from 'react';
import { lang, langData } from '../constants';
import CheckBox from '../../../common/CheckBox';
import DropList from '../../../common/DropList';
import Field from '../Field';
import Cell from './Cell';
import Pass from '../Pass';

export default class VisitorCounter extends Component {
  constructor(props) {
    super(props);
    this.state = { ftpData: [{ id: 0 }], amount: 1 };
    this.errors = createRef();
    this.setState = this.setState.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { del } = this.state;
    const { applyAction } = this.props;
    const {
      notice: { restore },
      updateState,
    } = this.props;
    if (restore && prevProps.restore != restore) {
      this.state.ftpData.splice(del.index, 0, del.line);

      updateState({ notice: { restore: false } });
    }

    if (applyAction && prevProps.applyAction != applyAction) {
      this.errors.current = false;
      this.setState(
        ({ ftpData }) => ({
          ftpData: ftpData.map((item, index) => {
            if (index == ftpData.length - 1) {
              return item;
            }
            return {
              ...item,
              activeID: {
                ...item.activeID,
                valid: this.validCheck(item.activeID?.val),
              },
            };
          }),
        }),
        () => {
          this.bubblingData();
        },
      );
    }
  }

  validCheck = (val) => {
    const valid = !!val;
    !valid ? (this.errors.current = true) : false;
    return valid;
  };

  bubblingData() {
    const { ftpData } = this.state;
    const rasingFTPData = () => {
      const { updateState } = this.props;
      updateState(({ sends }) => ({
        sends: {
          ...sends,
          counters: counters,
        },
      }));
    };

    let counters = [];
    if (this.errors.current) {
      rasingFTPData();
      return;
    }

    counters = ftpData.filter((_, index) => {
      if (index == ftpData.length - 1) {
        return false;
      }
      return true;
    });

    counters = counters.map((item) => {
      const {
        type = 0,
        address = '',
        port = '',
        login = '',
        pass = '',
        certCheck = 0,
      } = item;
      return {
        activeID: +item.activeID.val,
        mins: +item.mins,
        info: JSON.stringify({
          ftp: `${+type}|${address}|${+port}|${login}|${pass}|${+certCheck}`,
          mins: +item.mins,
          path: item.path,
          del: +item.del,
          driver: item.driver ? +item.driver + 1 : 0,
          activeID: +item.activeID.val,
        }),
      };
    });
    rasingFTPData();
  }

  handlerClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  setFTPData(val, prop, lineIndex) {
    const { ftpData } = this.state;

    const valFormatting = () => {
      if (typeof val === 'string') {
        return val.replaceAll('|', '');
      }
      return val;
    };

    let valForm = valFormatting(val);
    if (prop == 'activeID') {
      valForm = {
        ...ftpData[lineIndex][prop],
        val: valForm,
      };
    }
    ftpData[lineIndex][prop] = valForm;
    this.forceUpdate();
  }

  ftpLine(index) {
    const { ftpData } = this.state;
    const { integData } = this.props;
    const activeID = ftpData[index].activeID;
    const rezult = [
      <Field
        defValue={activeID?.val}
        inpType="number"
        extClass=" broad"
        blurHandler={(val) =>
          this.setFTPData(parseFloat(val), 'activeID', index)
        }
        valid={activeID?.valid}
      />,
      <DropList
        optNames={integData.drivers}
        callback={(val) => this.setFTPData(val, 'driver', index)}
      />,
      <Field
        extClass=" broad"
        blurHandler={(val) => this.setFTPData(val, 'path', index)}
      />,
      <Field
        inpType="number"
        extClass=" mins"
        blurHandler={(val) => this.setFTPData(val, 'mins', index)}
      />,
    ];
    return rezult;
  }

  delDeviceLine = (event, lineIndex) => {
    this.handlerClick(event);
    const { updateState } = this.props;
    $(document).data('no-err-close', 1);
    const delLine = this.state.ftpData.splice(lineIndex, 1)[0];
    this.state.del = { index: lineIndex, line: delLine };
    updateState({
      notice: { popupText: `${lang[langData.del]}`, restore: false },
    });
  };

  addDevLine = (event) => {
    this.handlerClick(event);
    const { amount } = this.state;
    this.state.ftpData.push({
      id: amount,
    });
    this.setState(({ amount }) => ({ amount: (amount += 1) }));
  };

  render() {
    const { ftpData } = this.state;
    const { updateState, applyAction, integData } = this.props;

    return (
      <div className="details">
        <div className="item top">
          <Pass updateState={updateState} applyAction={applyAction} />
        </div>

        <div className="item">
          <div className="name raised">{lang[langData.ftp]}:</div>
          <div className="type">
            {ftpData.map((item, index) => (
              <Fragment key={item.id}>
                <div className="ftp-info">
                  <DropList
                    optNames={integData.encrypt}
                    callback={(val) => {
                      this.setFTPData(val, 'type', index);
                    }}
                  />
                  {integData.info.map((elem, i) => (
                    <Fragment key={elem.id}>
                      <Field
                        extClass={` ${elem.name}`}
                        inpType={elem.type}
                        prompt={elem.prompt}
                        blurHandler={(val) => {
                          this.setFTPData(val, elem.name, index);
                        }}
                      />
                      {[1, 3].includes(i) ? <br /> : false}
                    </Fragment>
                  ))}
                  <CheckBox
                    text="Не проверять сертификат"
                    bubling={applyAction}
                    extClass=" certCheck"
                    idFor="ch1"
                    callback={(active) => {
                      this.setFTPData(active, 'certCheck', index);
                    }}
                  />
                </div>

                <div className="row">
                  {this.ftpLine(index).map((cell, i) => (
                    <Cell
                      key={`${item.id}|${i}`}
                      titleName={integData.titles[i]}
                      field={cell}
                    />
                  ))}

                  {index != ftpData.length - 1 ? (
                    <a
                      href="#"
                      draggable="false"
                      className="b-box b-dell"
                      onClick={(event) => this.delDeviceLine(event, index)}
                    >
                      <svg viewBox="0 0 48 48">
                        <use xlinkHref="#cross" />
                      </svg>
                    </a>
                  ) : (
                    <a
                      href="#"
                      className="link-new l-green"
                      onClick={this.addDevLine}
                      draggable="false"
                    >
                      +
                    </a>
                  )}
                </div>

                <CheckBox
                  text="Удалить данные после сбора"
                  bubling={applyAction}
                  extClass=" indent"
                  idFor="ch2"
                  callback={(active) => {
                    this.setFTPData(active, 'del', index);
                  }}
                />
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
