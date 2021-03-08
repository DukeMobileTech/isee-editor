import { INSTRUMENTS } from "../constants/instruments";
import { PROJECTS } from "../constants/projects";

const errorReducer = (state = null, action) => {
  switch (action.type) {
    case PROJECTS.LOAD_FAIL:
    case INSTRUMENTS.LOAD_FAIL:
      return action.error;
    case PROJECTS.LOAD:
    case PROJECTS.LOAD_SUCCESS:
    case INSTRUMENTS.LOAD:
    case INSTRUMENTS.LOAD_SUCCESS:
      return null;
    default:
      return state;
  }
};

export default errorReducer;
