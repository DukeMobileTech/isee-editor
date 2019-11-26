import { instance } from "./api";

/**
 * ScoreScheme
 */
export const getScoreSchemes = (projectId, instrumentId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes`
  );
};

export const createScoreScheme = (projectId, instrumentId, scheme) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes`,
    scheme
  );
};

export const updateScoreScheme = (projectId, instrumentId, id, scheme) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${id}`,
    scheme
  );
};

export const deleteScoreScheme = (projectId, instrumentId, id) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${id}`
  );
};
