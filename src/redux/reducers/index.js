import { combineReducers } from "redux";
import projectsReducer from "./projectsReducer";
import loadingReducer from "./loadingReducer";
import errorReducer from "./errorReducer";
import instrumentsReducer from "./instrumentsReducer";

const rootReducer = combineReducers({
  projects: projectsReducer,
  instruments: instrumentsReducer,
  isLoading: loadingReducer,
  error: errorReducer
});

export default rootReducer;
