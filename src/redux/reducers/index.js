import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import projectsReducer from "./projectsReducer";
import loadingReducer from "./loadingReducer";
import errorReducer from "./errorReducer";
import instrumentsReducer from "./instrumentsReducer";

const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    projects: projectsReducer,
    instruments: instrumentsReducer,
    isLoading: loadingReducer,
    error: errorReducer
  });

export default rootReducer;
