import { instance } from "./api";

/**
 * DomainTranslation
 */
export const getDomainTranslations = (projectId, scoreScheme, language) => {
  return instance.get(
    `/projects/${projectId}/instruments/${scoreScheme.instrument_id}/score_schemes/${scoreScheme.id}/domain_translations`,
    {
      params: { language: language },
    }
  );
};

export const createDomainTranslation = (
  projectId,
  scoreScheme,
  translation
) => {
  return instance.post(
    `/projects/${projectId}/instruments/${scoreScheme.instrument_id}/score_schemes/${scoreScheme.id}/domain_translations`,
    {
      domain_translation: translation,
    }
  );
};

export const updateDomainTranslation = (
  projectId,
  scoreScheme,
  translation
) => {
  return instance.put(
    `/projects/${projectId}/instruments/${scoreScheme.instrument_id}/score_schemes/${scoreScheme.id}/domain_translations/${translation.id}`,
    {
      domain_translation: translation,
    }
  );
};

export const deleteDomainTranslation = (
  projectId,
  scoreScheme,
  translation
) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${scoreScheme.instrument_id}/score_schemes/${scoreScheme.id}/domain_translations/${translation.id}`
  );
};
