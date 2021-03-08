import "antd/dist/antd.css";
import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import "react-quill/dist/quill.snow.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { App } from "./App";
import AppProviders from "./context/AppProviders";
import "./index.css";
import configureStore from "./redux/store";
import * as serviceWorker from "./serviceWorker";

const { store, persistor } = configureStore();

ReactDOM.render(
  <IntlProvider locale="en">
    <AppProviders>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </AppProviders>
  </IntlProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
