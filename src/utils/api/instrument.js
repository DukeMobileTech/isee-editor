import { instance } from "./api";

/*
Instrument
*/
export const getInstruments = (projectId) => {
  return instance.get(`/projects/${projectId}/instruments`);
};

export const getInstrument = (projectId, id) => {
  return instance.get(`/projects/${projectId}/instruments/${id}`);
};

export const getInstrumentPdf = (instrument, language, columnCount) => {
  return instance.get(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/pdf_export`,
    {
      params: { language: language, column_count: columnCount },
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
      },
    }
  );
};

export const createInstrument = (projectId, instrument) => {
  return instance.post(`/projects/${projectId}/instruments`, {
    instrument: instrument,
  });
};

export const updateInstrument = (projectId, id, instrument) => {
  return instance.put(`/projects/${projectId}/instruments/${id}`, {
    instrument: instrument,
  });
};

export const deleteInstrument = (projectId, id) => {
  return instance.delete(`/projects/${projectId}/instruments/${id}`);
};
