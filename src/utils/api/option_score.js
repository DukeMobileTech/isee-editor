import { instance } from "./api";

/**
 * OptionScore
 */
export const deleteOptionScore = (instrument, scoreSchemeId, scoreUnit, id) => {
  return instance.delete(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units/${scoreUnit.id}/option_scores/${id}`
  );
};
