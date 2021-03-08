import { PROJECTS } from "../constants/projects";

const loadProjects = () => ({
  type: PROJECTS.LOAD,
});

const setProjects = (projects) => ({
  type: PROJECTS.LOAD_SUCCESS,
  projects,
});

const setProjectsError = (error) => ({
  type: PROJECTS.LOAD_FAIL,
  error,
});

export { loadProjects, setProjects, setProjectsError };
