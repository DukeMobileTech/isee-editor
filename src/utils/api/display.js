import { instance } from "./api";

/*
Display
*/
export const getDisplay = (projectId, instrumentId, id) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${id}`
  );
};

export const createDisplay = (projectId, instrumentId, display) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/displays`,
    { display: display }
  );
};

export const updateDisplay = (projectId, instrumentId, id, display) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${id}`,
    { display: display }
  );
};

export const deleteDisplay = (projectId, instrumentId, id) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${id}`
  );
};
