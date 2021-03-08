import { instance } from "./api";

/**
 * DisplayTranslation
 */
export const getDisplayTranslations = (projectId, instrumentId, language) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/display_translations`,
    {
      params: { language: language },
    }
  );
};

export const createDisplayTranslation = (
  projectId,
  instrumentId,
  translation
) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/display_translations`,
    {
      display_translation: translation,
    }
  );
};

export const updateDisplayTranslation = (
  projectId,
  instrumentId,
  translation
) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/display_translations/${translation.id}`,
    {
      display_translation: translation,
    }
  );
};

export const deleteDisplayTranslation = (
  projectId,
  instrumentId,
  translation
) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/display_translations/${translation.id}`
  );
};
