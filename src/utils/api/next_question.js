import { instance } from "./api";

/**
 * NextQuestion
 */
export const getNextQuestions = (projectId, instrumentId, iqId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${iqId}/next_questions`
  );
};

export const createNextQuestion = (
  projectId,
  instrumentId,
  iqId,
  nextQuestion
) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${iqId}/next_questions`,
    { next_question: nextQuestion }
  );
};

export const updateNextQuestion = (projectId, instrumentId, nextQuestion) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${nextQuestion.instrument_question_id}/next_questions/${nextQuestion.id}`,
    { next_question: nextQuestion }
  );
};

export const deleteNextQuestion = (projectId, instrumentId, nextQuestion) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/instrument_questions/${nextQuestion.instrument_question_id}/next_questions/${nextQuestion.id}`
  );
};
