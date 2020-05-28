import { instance } from "./api";

/**
 * InstrumentQuestion
 */

export const getInstrumentQuestions = (projectId, instrumentId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions`
  );
};

export const getAllInstrumentQuestions = (projectId, instrumentId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/all`
  );
};

export const createInstrumentQuestion = (projectId, instrumentId, iQ) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions`,
    { instrument_question: iQ }
  );
};

export const updateInstrumentQuestion = (projectId, iQ) => {
  return instance.put(
    `/projects/${projectId}/instruments/${iQ.instrument_id}/instrument_questions/${iQ.id}`,
    { instrument_question: iQ }
  );
};

export const deleteInstrumentQuestion = (projectId, iQ) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${iQ.instrument_id}/instrument_questions/${iQ.id}`
  );
};
