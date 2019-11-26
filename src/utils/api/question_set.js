import { instance } from "./api";

/**
 * QuestionSet
 */
export const getQuestionSets = (page, perPage) => {
  if (page && perPage)
    return instance.get("/question_sets", {
      params: { page: page, per_page: perPage }
    });
  else return instance.get("/question_sets");
};

export const getQuestionSetCount = () => {
  return instance.get("/question_sets/total");
};

export const createQuestionSet = questionSet => {
  return instance.post("/question_sets", questionSet);
};

export const updateQuestionSet = (id, questionSet) => {
  return instance.put(`/question_sets/${id}`, questionSet);
};

export const deleteQuestionSet = id => {
  return instance.delete(`/question_sets/${id}`);
};
