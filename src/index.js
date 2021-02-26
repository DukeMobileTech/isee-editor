import "antd/dist/antd.css";
import "react-quill/dist/quill.snow.css";
import "./index.css";

import * as serviceWorker from "./serviceWorker";

import { App } from "./App";
import AppProviders from "./context/AppProviders";
import { IntlProvider } from "react-intl";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./redux/store";

const store = configureStore();

ReactDOM.render(
  <IntlProvider locale="en">
    <AppProviders>
      <Provider store={store}>
        <App />
      </Provider>
    </AppProviders>
  </IntlProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
