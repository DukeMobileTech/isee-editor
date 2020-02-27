import { instance } from "./api";

/**
 * ConditionSkip
 */
export const getConditionSkips = (projectId, instrumentId, iqId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${iqId}/condition_skips`
  );
};

export const createConditionSkip = (
  projectId,
  instrumentId,
  iqId,
  conditionSkip
) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${iqId}/condition_skips`,
    { condition_skip: conditionSkip }
  );
};

export const updateConditionSkip = (projectId, instrumentId, conditionSkip) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${conditionSkip.instrument_question_id}/condition_skips/${conditionSkip.id}`,
    { condition_skip: conditionSkip }
  );
};

export const deleteConditionSkip = (projectId, instrumentId, conditionSkip) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${conditionSkip.instrument_question_id}/condition_skips/${conditionSkip.id}`
  );
};
