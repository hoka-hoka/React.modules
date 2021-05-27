import React from "react";

class DerivedError extends React.Component<{}, { error: null | boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    let error = this.state.error && <div>Errors appeared</div>;
    if (error) {
      return <div>Error!</div>;
    }
    return this.props.children;
  }
}
export default DerivedError;
