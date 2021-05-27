import React, { PureComponent } from 'react';
import { lang, langData } from './constants';

export default class Pass extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { access: 1 };
  }

  bubblingData(data) {
    const { updateState } = this.props;
    updateState((prevState) => ({
      ...prevState,
      sends: {
        ...prevState.sends,
        access: data,
      },
    }));
  }

  componentDidMount() {
    const { access } = this.state;

    this.bubblingData(access);
  }

  componentDidUpdate(prevProps) {
    const { access } = this.state;
    const { applyAction } = this.props;
    if (prevProps.applyAction == applyAction) {
      return;
    }
    this.bubblingData(access);
  }

  handlerClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  accessСhange = (event, index) => {
    this.handlerClick(event);
    const { access } = this.state;
    if (index == access) {
      return;
    }
    this.setState((prevState) => ({ access: +!prevState.access }));
  };

  render() {
    const { access } = this.state;
    const btnNames = [lang[langData.yes], lang[langData.no]];
    return (
      <>
        <div className="name shifted">{lang[langData.available]}:</div>
        {btnNames.map((item, index) => (
          <a
            className={`b-box${index == access ? ' active' : ' '}`}
            key={item}
            href="#"
            onClick={(event) => this.accessСhange(event, index)}
            draggable="false"
          >
            {item}
          </a>
        ))}
      </>
    );
  }
}
