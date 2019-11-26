import { instance } from "./api";

/** Response */
export const getResponses = surveyId => {
  return instance.get(`/surveys/${surveyId}/responses`);
};
