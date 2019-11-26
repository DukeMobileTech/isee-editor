import { instance } from "./api";

/*
 * InstrumentQuestion
 */
export const createInstrumentQuestion = (projectId, instrumentId, iQ) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions`,
    iQ
  );
};

export const updateInstrumentQuestion = (projectId, instrumentQuestion) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentQuestion.instrument_id}/instrument_questions/${instrumentQuestion.id}`,
    instrumentQuestion
  );
};

export const deleteInstrumentQuestion = (projectId, instrumentQuestion) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentQuestion.instrument_id}/instrument_questions/${instrumentQuestion.id}`,
    instrumentQuestion
  );
};
