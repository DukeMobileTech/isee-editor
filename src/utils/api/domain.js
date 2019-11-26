import { instance } from "./api";

/**
 * Domains
 */
export const getDomains = (projectId, instrumentId, scoreSchemeId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/domains`
  );
};

export const getDomain = (projectId, instrumentId, scoreSchemeId, id) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/domains/${id}`
  );
};

export const createDomain = (instrument, domain) => {
  return instance.post(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${domain.score_scheme_id}/domains`,
    domain
  );
};

export const updateDomain = (instrument, domain) => {
  return instance.put(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${domain.score_scheme_id}/domains/${domain.id}`,
    domain
  );
};

export const deleteDomain = (instrument, domain) => {
  return instance.delete(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${domain.score_scheme_id}/domains/${domain.id}`
  );
};
