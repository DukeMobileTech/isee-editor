import { instance } from "./api";

/**
 * RedFlag
 */
export const getRedFlags = (projectId, instrumentId, scoreSchemeId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/red_flags`
  );
};

export const createRedFlag = (
  projectId,
  instrumentId,
  scoreSchemeId,
  redFlag
) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/red_flags`,
    { red_flag: redFlag }
  );
};

export const updateRedFlag = (
  projectId,
  instrumentId,
  scoreSchemeId,
  redFlag
) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/red_flags/${redFlag.id}`,
    { red_flag: redFlag }
  );
};

export const deleteRedFlag = (
  projectId,
  instrumentId,
  scoreSchemeId,
  redFlag
) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/score_schemes/${scoreSchemeId}/red_flags/${redFlag.id}`
  );
};
