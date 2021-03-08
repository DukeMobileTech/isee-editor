import { instance } from "./api";

/**
 * ScoreScheme
 */
export const getScoreSchemes = (projectId, instrumentId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes`
  );
};

export const getScoreScheme = (projectId, instrumentId, id) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${id}`
  );
};

export const getScoreSchemeUnits = (projectId, instrumentId, scoreSchemeId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/score_units`
  );
};

export const createScoreScheme = (projectId, instrumentId, scheme) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes`,
    { score_scheme: scheme }
  );
};

export const updateScoreScheme = (projectId, instrumentId, id, scheme) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${id}`,
    { score_scheme: scheme }
  );
};

export const deleteScoreScheme = (projectId, instrumentId, id) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${id}`
  );
};

export const getScoreSchemeExcel = (projectId, instrumentId, id) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${id}/download`,
    {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/xlsx",
      },
    }
  );
};
