import { instance } from "./api";

/**
 * ScoreUnit
 */
export const getScoreUnits = (
  projectId,
  instrumentId,
  scoreSchemeId,
  subdomainId
) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/subdomains/${subdomainId}/score_units`
  );
};

export const createScoreUnit = (
  projectId,
  instrumentId,
  scoreSchemeId,
  scoreUnit
) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units`,
    { score_unit: scoreUnit }
  );
};

export const updateScoreUnit = (
  projectId,
  instrumentId,
  scoreSchemeId,
  scoreUnit
) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units/${scoreUnit.id}`,
    { score_unit: scoreUnit }
  );
};

export const copyScoreUnit = (
  projectId,
  instrumentId,
  scoreSchemeId,
  scoreUnit
) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units/${scoreUnit.id}/copy`
  );
};

export const deleteScoreUnit = (
  projectId,
  instrumentId,
  scoreSchemeId,
  scoreUnit
) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units/${scoreUnit.id}`
  );
};
