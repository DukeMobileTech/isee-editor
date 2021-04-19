import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import rootSaga from "./sagas";

export const history = createBrowserHistory();

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const persistConfig = {
    key: "isee-root",
    storage,
  };
  const persistedReducer = persistReducer(persistConfig, rootReducer(history));
  const devTools =
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === "development" &&
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (x) => x;
  const store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(sagaMiddleware, routerMiddleware(history)),
      devTools
    )
  );
  sagaMiddleware.run(rootSaga);
  const persistor = persistStore(store);
  return { store, persistor };
};

export default configureStore;
