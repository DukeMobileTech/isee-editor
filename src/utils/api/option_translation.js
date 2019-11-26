import { instance } from "./api";

/**
 * OptionTranslation
 */
export const getOptionTranslations = language => {
  return instance.get("/option_translations", {
    params: { language: language }
  });
};

export const createOptionTranslation = translation => {
  return instance.post("/option_translations", translation);
};

export const updateOptionTranslation = (id, translation) => {
  return instance.put(`/option_translations/${id}`, translation);
};

export const deleteOptionTranslation = id => {
  return instance.delete(`/option_translations/${id}`);
};
