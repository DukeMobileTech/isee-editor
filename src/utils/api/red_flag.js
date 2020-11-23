import { instance } from "./api";

/**
 * RedFlag
 */
export const getRedFlags = (projectId, instrumentId, iqId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${iqId}/red_flags`
  );
};

export const createRedFlag = (projectId, instrumentId, iqId, redFlag) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${iqId}/red_flags`,
    { red_flag: redFlag }
  );
};

export const updateRedFlag = (projectId, instrumentId, redFlag) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${redFlag.instrument_question_id}/red_flags/${redFlag.id}`,
    { red_flag: redFlag }
  );
};

export const deleteRedFlag = (projectId, instrumentId, redFlag) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${redFlag.instrument_question_id}/red_flags/${redFlag.id}`
  );
};
