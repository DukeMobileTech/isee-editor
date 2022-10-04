import { instance } from "./api";

/**
 * Task
 */
export const getTasks = () => {
  return instance.get("/tasks");
};
