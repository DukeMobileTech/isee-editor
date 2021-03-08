import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import instrumentsReducer from "./instrumentsReducer";
import loadingReducer from "./loadingReducer";
import projectsReducer from "./projectsReducer";

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    projects: projectsReducer,
    instruments: instrumentsReducer,
    isLoading: loadingReducer,
    error: errorReducer,
  });

export default rootReducer;
