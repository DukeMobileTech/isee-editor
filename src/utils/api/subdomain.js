import { instance } from "./api";

/**
 * Subdomains
 */
export const createSubdomain = (
  projectId,
  instrumentId,
  scoreSchemeId,
  subdomain
) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/subdomains`,
    { subdomain: subdomain }
  );
};

export const updateSubdomain = (
  projectId,
  instrumentId,
  scoreSchemeId,
  subdomain
) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/subdomains/${subdomain.id}`,
    { subdomain: subdomain }
  );
};

export const deleteSubdomain = (
  projectId,
  instrumentId,
  scoreSchemeId,
  subdomain
) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/subdomains/${subdomain.id}`
  );
};
