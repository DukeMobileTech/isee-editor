import { instance } from "./api";

/*
Project
*/
export const getProjects = () => {
  return instance.get("/projects");
};
