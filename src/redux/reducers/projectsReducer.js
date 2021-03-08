import { PROJECTS } from "../constants/projects";

export default function (state = [], action) {
  switch (action.type) {
    case PROJECTS.LOAD_SUCCESS:
      return [...action.projects];
    default:
      return state;
  }
}
