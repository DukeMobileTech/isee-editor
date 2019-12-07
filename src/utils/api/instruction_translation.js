import { instance } from "./api";

/**
 * InstructionTranslation
 */
export const getInstructionTranslations = language => {
  return instance.get("/instruction_translations", {
    params: { language: language }
  });
};

export const createInstructionTranslation = translation => {
  return instance.post("/instruction_translations", {
    instruction_translation: translation
  });
};

export const updateInstructionTranslation = (id, translation) => {
  return instance.put(`/instruction_translations/${id}`, {
    instruction_translation: translation
  });
};

export const deleteInstructionTranslation = id => {
  return instance.delete(`/instruction_translations/${id}`);
};
