import { instance } from "./api";

/**
 * QuestionSet
 */
export const getQuestionSets = (page, perPage) => {
  return instance.get("/question_sets");
};

export const createQuestionSet = questionSet => {
  return instance.post("/question_sets", { question_set: questionSet });
};

export const updateQuestionSet = (id, questionSet) => {
  return instance.put(`/question_sets/${id}`, { question_set: questionSet });
};

export const deleteQuestionSet = id => {
  return instance.delete(`/question_sets/${id}`);
};

export const orderFolders = (id, data) => {
  return instance.post(`/question_sets/${id}/order_folders`, {
    question_set: data
  });
};
