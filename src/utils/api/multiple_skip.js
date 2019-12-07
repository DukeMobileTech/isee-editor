import { instance } from "./api";

/**
 * MultipleSkip
 */
export const getMultipleSkips = (projectId, instrumentId, iqId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${iqId}/multiple_skips`
  );
};

export const createMultipleSkip = (
  projectId,
  instrumentId,
  iqId,
  multipleSkip
) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${iqId}/multiple_skips`,
    { multiple_skip: multipleSkip }
  );
};

export const updateMultipleSkip = (projectId, instrumentId, multipleSkip) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${multipleSkip.instrument_question_id}/multiple_skips/${multipleSkip.id}`,
    { multiple_skip: multipleSkip }
  );
};

export const deleteMultipleSkip = (projectId, instrumentId, multipleSkip) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${multipleSkip.instrument_question_id}/multiple_skips/${multipleSkip.id}`
  );
};
