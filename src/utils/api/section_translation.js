import { instance } from "./api";

/**
 * SectionTranslation
 */
export const getSectionTranslations = (projectId, instrumentId, language) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/section_translations`,
    {
      params: { language: language }
    }
  );
};

export const createSectionTranslation = (
  projectId,
  instrumentId,
  translation
) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/section_translations`,
    {
      section_translation: translation
    }
  );
};

export const updateSectionTranslation = (
  projectId,
  instrumentId,
  translation
) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/section_translations/${translation.id}`,
    {
      section_translation: translation
    }
  );
};

export const deleteSectionTranslation = (
  projectId,
  instrumentId,
  translation
) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/section_translations/${translation.id}`
  );
};
