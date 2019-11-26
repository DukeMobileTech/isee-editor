import { instance } from "./api";

/**
 * Option
 */
export const getOptions = () => {
  return instance.get("/options");
};

export const createOption = option => {
  return instance.post("/options", option);
};

export const updateOption = (id, option) => {
  return instance.put(`/options/${id}`, option);
};

export const deleteOption = id => {
  return instance.delete(`/options/${id}`);
};
