import { instance } from "./api";

/**
 * ScoreScheme
 */
export const getScoreSchemes = (projectId, instrumentId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes`
  );
};

export const getScoreSchemeUnits = (instrument, scoreSchemeId) => {
  return instance.get(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/score_units`
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

export const getScoreSchemeExcel = (instrument, scoreScheme) => {
  return instance.get(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreScheme.id}/download`,
    {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/xlsx"
      }
    }
  );
};

export const getScoreSchemeRedFlags = (instrument, scoreSchemeId) => {
  return instance.get(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/red_flags`
  );
};
