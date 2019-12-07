import { instance } from "./api";

/**
 * Subdomains
 */
export const createSubdomain = (instrument, scoreSchemeId, subdomain) => {
  return instance.post(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains`,
    { subdomain: subdomain }
  );
};

export const updateSubdomain = (instrument, scoreSchemeId, subdomain) => {
  return instance.put(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${subdomain.id}`,
    { subdomain: subdomain }
  );
};

export const deleteSubdomain = (instrument, scoreSchemeId, subdomain) => {
  return instance.delete(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${subdomain.id}`
  );
};
