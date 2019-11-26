import { instance } from "./api";

/*
Instrument
*/
export const getInstruments = () => {
  return instance.get("/instruments");
};

export const getInstrument = (projectId, id) => {
  return instance.get(`/projects/${projectId}/instruments/${id}`);
};

export const createInstrument = (projectId, instrument) => {
  return instance.post(`/projects/${projectId}/instruments`, instrument);
};

export const updateInstrument = (projectId, id, instrument) => {
  return instance.put(`/projects/${projectId}/instruments/${id}`, instrument);
};

export const deleteInstrument = (projectId, id) => {
  return instance.delete(`/projects/${projectId}/instruments/${id}`);
};

export const reorderInstrumentQuestions = (projectId, id) => {
  return instance.get(`/projects/${projectId}/instruments/${id}/reorder`);
};
