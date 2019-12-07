import { instance } from "./api";

/**
 * QuestionTranslation
 */
export const getQuestionTranslations = language => {
  return instance.get("/question_translations", {
    params: {
      language: language
    }
  });
};

export const createQuestionTranslation = translation => {
  return instance.post("/question_translations", {
    question_translation: translation
  });
};

export const updateQuestionTranslation = (id, translation) => {
  return instance.put(`/question_translations/${id}`, {
    question_translation: translation
  });
};

export const deleteQuestionTranslation = id => {
  return instance.delete(`/question_translations/${id}`);
};
