import { instance } from "./api";

/**
 * ScoreUnit
 */
export const getScoreUnits = (instrument, scoreSchemeId, subdomainId) => {
  return instance.get(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${subdomainId}/score_units`
  );
};

export const createScoreUnit = (instrument, scoreSchemeId, scoreUnit) => {
  return instance.post(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units`,
    scoreUnit
  );
};

export const updateScoreUnit = (instrument, scoreSchemeId, scoreUnit) => {
  return instance.put(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units/${scoreUnit.id}`,
    scoreUnit
  );
};

export const deleteScoreUnit = (instrument, scoreSchemeId, scoreUnit) => {
  return instance.delete(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units/${scoreUnit.id}`
  );
};
