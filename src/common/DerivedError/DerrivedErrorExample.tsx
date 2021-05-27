import React from 'react';
import DerivedError from './DerivedError';

class Button extends React.Component<{}, { counter: number }> {
  constructor(props: {}) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState(({ counter }) => ({
      counter: counter + 1,
    }));
  }
  render() {
    if (this.state.counter === 5) {
      throw new Error('I crached!');
    }
    return <h1 onClick={this.handleClick}>{this.state.counter}</h1>;
  }
}
function DropList() {
  return (
    <DerivedError>
      <Button />
    </DerivedError>
  );
}

export default DropList;
