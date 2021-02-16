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

export const createDomain = (projectId, instrumentId, domain) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${domain.score_scheme_id}/domains`,
    { domain: domain }
  );
};

export const updateDomain = (projectId, instrumentId, domain) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${domain.score_scheme_id}/domains/${domain.id}`,
    { domain: domain }
  );
};

export const deleteDomain = (projectId, instrumentId, domain) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${domain.score_scheme_id}/domains/${domain.id}`
  );
};
