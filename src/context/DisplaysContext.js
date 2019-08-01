import React, { createContext, Component } from "react";

const { Provider, Consumer } = createContext();

class DisplaysProvider extends Component {
  state = {
    displays: []
  };

  setDisplays = evt => {
    evt.preventDefault();
    this.setState({
      displays: evt.target.dataset.displays
    });
  };

  render() {
    const { displays } = this.state.displays;
    return (
      <Provider
        value={{
          displays: displays,
          setDisplays: this.setDisplays
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { DisplaysProvider as default, Consumer as DisplaysConsumer };
