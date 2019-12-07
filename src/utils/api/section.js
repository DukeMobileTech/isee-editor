import { instance } from "./api";

/*
Section
*/
export const getSections = (projectId, instrumentId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/sections`
  );
};

export const getSection = (projectId, instrumentId, id) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/sections/${id}`
  );
};

export const createSection = (projectId, instrumentId, section) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/sections`,
    { section: section }
  );
};

export const updateSection = (projectId, instrumentId, id, section) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/sections/${id}`,
    { section: section }
  );
};

export const deleteSection = (projectId, instrumentId, id) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/sections/${id}`
  );
};
