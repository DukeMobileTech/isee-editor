import { instance } from "./api";

/**
 * SubdomainTranslation
 */
export const getSubdomainTranslations = (instrument, domain, language) => {
  return instance.get(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${domain.score_scheme_id}/domains/${domain.id}/subdomain_translations`,
    {
      params: { language: language }
    }
  );
};

export const createSubdomainTranslation = (instrument, domain, translation) => {
  return instance.post(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${domain.score_scheme_id}/domains/${domain.id}/subdomain_translations`,
    {
      subdomain_translation: translation
    }
  );
};

export const updateSubdomainTranslation = (instrument, domain, translation) => {
  return instance.put(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${domain.score_scheme_id}/domains/${domain.id}/subdomain_translations/${translation.id}`,
    {
      subdomain_translation: translation
    }
  );
};

export const deleteSubdomainTranslation = (instrument, domain, translation) => {
  return instance.delete(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${domain.score_scheme_id}/domains/${domain.id}/subdomain_translations/${translation.id}`
  );
};
