import { instance } from "./api";

/**
 * Questions
 */
export const getAllQuestions = () => {
  return instance.get("/questions");
};

export const getQuestions = folder => {
  return instance.get(
    `/question_sets/${folder.question_set_id}/folders/${folder.id}/questions`
  );
};

export const createQuestion = question => {
  return instance.post(
    `/question_sets/${question.question_set_id}/folders/${question.folder_id}/questions`,
    { question: question }
  );
};

export const updateQuestion = question => {
  return instance.put(
    `/question_sets/${question.question_set_id}/folders/${question.folder_id}/questions/${question.id}`,
    { question: question }
  );
};

export const deleteQuestion = question => {
  return instance.delete(
    `/question_sets/${question.question_set_id}/folders/${question.folder_id}/questions/${question.id}`
  );
};
