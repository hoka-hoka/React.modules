import React, { Component, createRef } from 'react';
import IMask from 'imask';
import { lang, langData } from '../constants';
import DropList from '../../../common/DropList';
import Field from '../Field';
import Pass from '../Pass';
import Cell from './Cell';

export default class SmartHouse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devType: '-1',
      devData: [{ id: 0, type: '-1', titles: ['Тип'] }],
      amount: 1,
    };
    this.errors = createRef();
  }

  componentDidUpdate(prevProps) {
    const { del } = this.state;
    const {
      applyAction,
      notice: { restore },
      updateState,
    } = this.props;
    if (applyAction && prevProps.applyAction != applyAction) {
      this.errors.current = false;
      this.setState(
        ({ devData }) => ({
          devData: devData.map((item, index) => {
            if (index == devData.length - 1) {
              return item;
            }
            return {
              ...item,
              activeID: {
                ...item.activeID,
                valid:
                  this.validCheck(item.activeID?.val, item.type) ||
                  (() => {
                    this.showNotice(lang[langData.acttive], false);
                    return false;
                  })(),
              },
              value: {
                ...item.value,
                valid: this.validCheck(item.value?.val, item.type, 'value'),
              },
            };
          }),
        }),
        () => {
          this.bubblingData();
        },
      );
    }

    if (restore && prevProps.notice.restore != restore) {
      this.state.devData.splice(del.index, 0, del.line);
      updateState({ notice: { restore: false } });
    }
  }

  bubblingData() {
    const { devData } = this.state;
    const rasingDevData = () => {
      const { updateState } = this.props;
      updateState(({ sends }) => ({
        sends: {
          ...sends,
          devices: devices,
        },
      }));
    };

    let devices = [];
    if (this.errors.current) {
      rasingDevData();
      return;
    }

    devices = devData.filter((item, index) => {
      if (item.type == -1 || index == devData.length - 1) {
        return false;
      }
      return true;
    });
    devices = devices.map((item) => {
      const { activeID, type, value } = item;
      return { activeID: activeID.val, type: +type + 1, value: value.val };
    });
    rasingDevData();
  }

  validCheck = (val, type, prop) => {
    const { integData } = this.props;

    const isURLValid = (regexp) => {
      const check = regexp.test(val);
      return check;
    };

    let valid;
    const isContrURL = integData.types.contr == type && prop == 'value';
    if (isContrURL) {
      valid = isURLValid(/(https?:\/\/[^\s]+)/g);
    } else {
      valid = !!val;
    }
    valid ? false : (this.errors.current = true);
    return valid;
  };

  handlerClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  setDevData = (val, prop, lineIndex) => {
    const { devData } = this.state;
    const { integData } = this.props;

    const titles =
      prop === 'type'
        ? integData.devices[val].titles
        : devData[lineIndex].titles;

    if (['value', 'activeID'].includes(prop)) {
      val = {
        ...devData[lineIndex][prop],
        val: val,
      };
    }

    this.state.devData[lineIndex] = {
      ...this.state.devData[lineIndex],
      [prop]: val,
      titles: titles,
    };
    this.forceUpdate();
  };

  addDevLine = (event) => {
    this.handlerClick(event);
    const { integData } = this.props;
    const { devType } = this.state;

    this.setState(({ devData, amount }) => ({
      devData: [
        ...devData,
        {
          id: amount,
          type: devType,
          titles: [integData.types.phone, integData.types.contr].includes(
            devType,
          )
            ? integData.devices[devType].titles
            : ['Тип'],
        },
      ],
      devType: '-1',
      amount: amount + 1,
    }));
  };

  delDeviceLine = (event, lineIndex) => {
    this.handlerClick(event);
    const { devData } = this.state;
    const { integData } = this.props;

    const delLine = devData.splice(lineIndex, 1)[0];
    $(document).data('no-err-close', 1);

    this.setState({
      del: { index: lineIndex, line: delLine },
    });

    if ([integData.types.phone, integData.types.contr].includes(delLine.type)) {
      const devName = integData.devices[delLine.type].name;
      this.showNotice(
        `${lang[langData.device]} ${devName} ${lang[langData.del]}`,
      );
    }
  };

  showNotice(text, isBtn = true) {
    const { updateState } = this.props;
    updateState({
      notice: {
        popupText: text,
        btn: isBtn,
      },
    });
  }

  phoneHandler = (event, index) => {
    const { target } = event;
    const maskOptions = {
      mask: '+{7}(000)000-00-00',
      lazy: false,
      placeholderChar: '_',
    };
    const mask = IMask(target, maskOptions);

    mask.on('accept', ({ target: t }) => {
      if (t) {
        this.setDevData(t.value, 'value', index);
      }
    });
  };

  devLine = (type, index) => {
    const { integData } = this.props;

    const lineAddition = () => {
      const { devData } = this.state;
      const rezult = [];
      if (type == integData.types.phone) {
        const value = devData[index].value;
        rezult.push(
          <Field
            defVal={value?.val || ''}
            inpType="tel"
            focusHandler={(event) => this.phoneHandler(event, index)}
            valid={value?.valid}
          />,
        );
      } else if (type == integData.types.contr) {
        const value = devData[index].value;
        rezult.push(
          <Field
            defVal={value?.val}
            extClass=" url"
            inpType="url"
            blurHandler={(val) => this.setDevData(val, 'value', index)}
            valid={value?.valid}
          />,
        );
      }
      console.log(integData.types.phone, integData.types.contr, type);
      if ([integData.types.phone, integData.types.contr].includes(type)) {
        const activeID = devData[index].activeID;
        rezult.push(
          <Field
            inpType="number"
            defVal={activeID?.val}
            blurHandler={(val) =>
              this.setDevData(parseFloat(val), 'activeID', index)
            }
            valid={activeID?.valid}
          />,
        );
      }
      return rezult;
    };

    const rezult = [
      <DropList
        optNames={integData.devices.map((item) => item.name)}
        callback={(val) => {
          this.state.devData[index].value = {};
          this.state.devData[index].activeID = {};
          this.setDevData(val - 1, 'type', index);
        }}
      />,
      ...lineAddition(type, index),
    ];
    return rezult;
  };

  render() {
    const { devData } = this.state;
    const { updateState, applyAction } = this.props;
    return (
      <div className="details">
        <div className="item top">
          <Pass updateState={updateState} applyAction={applyAction} />
        </div>

        <div className="item">
          <div className="name raised">{lang[langData.devList]}:</div>
          <div className="type">
            {devData.map((item, index) => (
              <div key={item.id} className="row">
                {this.devLine(item.type, index).map((cell, i) => (
                  <Cell
                    key={`${item.id}|${i}`}
                    titleName={item.titles[i]}
                    field={cell}
                  />
                ))}
                {index != devData.length - 1 ? (
                  <a
                    key={item.id}
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
                    key={item.id}
                    href="#"
                    className="link-new l-green"
                    onClick={this.addDevLine}
                    draggable="false"
                  >
                    +
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
