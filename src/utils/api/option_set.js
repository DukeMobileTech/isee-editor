import { instance } from "./api";

/**
 * OptionSet
 */
export const getOptionSets = (page, perPage) => {
  if (page && perPage)
    return instance.get("/option_sets", {
      params: { page: page, per_page: perPage }
    });
  else return instance.get("/option_sets");
};

export const getOptionSetCount = () => {
  return instance.get("/option_sets/total");
};

export const getOptionSet = id => {
  return instance.get(`/option_sets/${id}`);
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
