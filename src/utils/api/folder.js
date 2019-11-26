import { instance } from "./api";

/**
 * Folder
 */
export const getFolders = questionSetId => {
  return instance.get(`/question_sets/${questionSetId}/folders`);
};

export const createFolder = (questionSetId, folder) => {
  return instance.post(`/question_sets/${questionSetId}/folders`, folder);
};

export const updateFolder = (questionSetId, id, folder) => {
  return instance.put(`/question_sets/${questionSetId}/folders/${id}`, folder);
};

export const deleteFolder = (questionSetId, id) => {
  return instance.delete(`/question_sets/${questionSetId}/folders/${id}`);
};
