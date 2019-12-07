import { instance } from "./api";

/**
 * LoopQuestion
 */
export const getLoopQuestions = (projectId, instrumentId, lqId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${lqId}/loop_questions`
  );
};

export const createLoopQuestion = (
  projectId,
  instrumentId,
  lqId,
  loopQuestion
) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${lqId}/loop_questions`,
    { loop_question: loopQuestion }
  );
};

export const updateLoopQuestion = (projectId, instrumentId, loopQuestion) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${loopQuestion.instrument_question_id}/loop_questions/${loopQuestion.id}`,
    { loop_question: loopQuestion }
  );
};

export const deleteLoopQuestion = (projectId, instrumentId, loopQuestion) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${loopQuestion.instrument_question_id}/loop_questions/${loopQuestion.id}`
  );
};
