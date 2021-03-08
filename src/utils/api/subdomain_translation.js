import { instance } from "./api";

/**
 * SubdomainTranslation
 */
export const getSubdomainTranslations = (
  projectId,
  instrumentId,
  domain,
  language
) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${domain.score_scheme_id}/domains/${domain.id}/subdomain_translations`,
    {
      params: { language: language },
    }
  );
};

export const createSubdomainTranslation = (
  projectId,
  instrumentId,
  domain,
  translation
) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${domain.score_scheme_id}/domains/${domain.id}/subdomain_translations`,
    {
      subdomain_translation: translation,
    }
  );
};

export const updateSubdomainTranslation = (
  projectId,
  instrumentId,
  domain,
  translation
) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${domain.score_scheme_id}/domains/${domain.id}/subdomain_translations/${translation.id}`,
    {
      subdomain_translation: translation,
    }
  );
};

export const deleteSubdomainTranslation = (
  projectId,
  instrumentId,
  domain,
  translation
) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${domain.score_scheme_id}/domains/${domain.id}/subdomain_translations/${translation.id}`
  );
};
