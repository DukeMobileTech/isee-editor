import { PROJECTS } from "../constants/projects";
import { INSTRUMENTS } from "../constants/instruments";

const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case PROJECTS.LOAD:
    case INSTRUMENTS.LOAD:
      return true;
    case PROJECTS.LOAD_SUCCESS:
    case PROJECTS.LOAD_FAIL:
    case INSTRUMENTS.LOAD_SUCCESS:
    case INSTRUMENTS.LOAD_FAIL:
      return false;

    default:
      return state;
  }
};

export default loadingReducer;
