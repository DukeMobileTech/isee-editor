import { instance } from "./api";

/**
 * OptionScore
 */
export const createOptionScore = (
  projectId,
  instrumentId,
  scoreSchemeId,
  scoreUnit,
  optionScore
) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units/${scoreUnit.id}/option_scores`,
    { option_score: optionScore }
  );
};

export const updateOptionScore = (
  projectId,
  instrumentId,
  scoreSchemeId,
  scoreUnit,
  optionScore
) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units/${scoreUnit.id}/option_scores/${optionScore.id}`,
    { option_score: optionScore }
  );
};

export const deleteOptionScore = (
  projectId,
  instrumentId,
  scoreSchemeId,
  scoreUnit,
  id
) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/subdomains/${scoreUnit.subdomain_id}/score_units/${scoreUnit.id}/option_scores/${id}`
  );
};
