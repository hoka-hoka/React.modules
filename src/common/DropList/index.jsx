import React, { Component, createRef } from 'react';
import './DropList.scss';

export default class DropList extends Component {
  constructor(props) {
    super(props);
    const { optNames = [], defVal = 0 } = this.props;
    this.state = {
      active: false,
      name: optNames.length ? optNames[defVal - 1] : '',
      val: defVal,
    };
    this.par = createRef();
  }

  componentDidUpdate(_, prevState) {
    const { val } = this.state;
    const { callback } = this.props;
    if (prevState.val != val) {
      callback(val);
    }
  }

  handlerClick = ({ target }) => {
    this.setState(({ active }) => ({
      active: !active,
    }));
    this.rasingFocus(target);
  };

  handlerKeyDown = (event) => {
    event.stopPropagation();
    const keyCode = event.keyCode || event.charCode;
    if (![32, 13].includes(keyCode)) return;
    this.setState(({ active }) => ({
      active: !active,
    }));
  };

  handlerBlur = () => {
    setTimeout(() => {
      const $elem = $(document.activeElement);
      const $focused = $(this.par.current);
      if (!$focused.is($elem) && !$focused.find($elem).length) {
        this.setState({ active: false });
      }
    });
  };

  selectOption = (event, i) => {
    event.stopPropagation();
    const { target, type } = event;
    if (type === 'keydown') {
      const keyCode = event.keyCode || event.charCode;
      if (![32, 13].includes(keyCode)) return;
    }
    this.setState({ active: false, name: target.innerHTML, val: ++i });
  };

  rasingFocus(elem) {
    const $focused = $(elem).parent();
    setTimeout(() => {
      $focused.focus();
    });
  }

  render() {
    const { active, name } = this.state;
    const { optNames = [], extClass } = this.props;
    return (
      <div
        ref={this.par}
        className={`drop-list${extClass ?? ''}${
          active ? ' drop-list_active' : ''
        }`}
        tabIndex="0"
        onBlur={this.handlerBlur}
        onKeyDown={this.handlerKeyDown}
        role="button"
        aria-expanded={active}
        aria-haspopup="true"
      >
        <input
          className="drop-list__field"
          type="text"
          onClick={this.handlerClick}
          placeholder=""
          tabIndex="-1"
          value={name || ''}
          readOnly
          aria-hidden
        />
        <button
          className="drop-list__btn"
          type="button"
          onClick={this.handlerClick}
          tabIndex="-1"
          aria-hidden
        />
        {active && (
          <div className="drop-list__panel">
            {optNames.map((item, i) => (
              <div
                className="drop-list__item"
                onClick={(event) => this.selectOption(event, i)}
                onKeyDown={(event) => this.selectOption(event, i)}
                key={i}
                tabIndex="0"
                role="button"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
