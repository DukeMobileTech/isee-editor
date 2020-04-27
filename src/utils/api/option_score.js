import { instance } from "./api";

/**
 * OptionScore
 */
export const createOptionScore = (
  instrument,
  scoreSchemeId,
  scoreUnit,
  optionScore
) => {
  return instance.post(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units/${scoreUnit.id}/option_scores`,
    { option_score: optionScore }
  );
};

export const updateOptionScore = (
  instrument,
  scoreSchemeId,
  scoreUnit,
  optionScore
) => {
  return instance.put(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units/${scoreUnit.id}/option_scores/${optionScore.id}`,
    { option_score: optionScore }
  );
};

export const deleteOptionScore = (instrument, scoreSchemeId, scoreUnit, id) => {
  return instance.delete(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units/${scoreUnit.id}/option_scores/${id}`
  );
};
