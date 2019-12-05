import { instance } from "./api";

/**
 * OptionSet
 */
export const getOptionSets = () => {
  return instance.get("/option_sets");
};

export const getOptionSet = id => {
  return instance.get(`/option_sets/${id}`);
};

export const copyOptionSet = id => {
  return instance.get(`/option_sets/${id}/copy`);
};

export const createOptionSet = optionSet => {
  return instance.post("/option_sets", optionSet);
};

export const updateOptionSet = (id, optionSet) => {
  return instance.put(`/option_sets/${id}`, optionSet);
};

export const deleteOptionSet = id => {
  return instance.delete(`/option_sets/${id}`);
};
