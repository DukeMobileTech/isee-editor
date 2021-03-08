import { instance } from "./api";

/**
 * Questions
 */
export const getAllQuestions = () => {
  return instance.get("/questions");
};

export const getQuestions = (projectId, instrumentId, ids, language) => {
  return instance.get(
    `projects/${projectId}/instruments/${instrumentId}/questions`,
    {
      params: {
        ids: ids,
        language: language,
      },
    }
  );
};

export const copyQuestion = (id) => {
  return instance.get(`/questions/${id}/copy`);
};

export const getFolderQuestions = (folder) => {
  return instance.get(
    `/question_sets/${folder.question_set_id}/folders/${folder.id}/questions`
  );
};

export const getQuestionSetQuestions = (questionSetId) => {
  return instance.get(`/question_sets/${questionSetId}/questions`);
};

export const createFolderQuestion = (question) => {
  return instance.post(
    `/question_sets/${question.question_set_id}/folders/${question.folder_id}/questions`,
    { question: question }
  );
};

export const updateFolderQuestion = (question) => {
  return instance.put(
    `/question_sets/${question.question_set_id}/folders/${question.folder_id}/questions/${question.id}`,
    { question: question }
  );
};

export const deleteFolderQuestion = (question) => {
  return instance.delete(
    `/question_sets/${question.question_set_id}/folders/${question.folder_id}/questions/${question.id}`
  );
};
