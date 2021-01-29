import { instance } from "./api";

/**
 * RedFlag
 */
export const getRedFlags = (instrument, scoreSchemeId) => {
  return instance.get(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/red_flags`
  );
};

export const createRedFlag = (instrument, scoreSchemeId, redFlag) => {
  return instance.post(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/red_flags`,
    { red_flag: redFlag }
  );
};

export const updateRedFlag = (instrument, scoreSchemeId, redFlag) => {
  return instance.put(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/red_flags/${redFlag.id}`,
    { red_flag: redFlag }
  );
};

export const deleteRedFlag = (instrument, scoreSchemeId, redFlag) => {
  return instance.delete(
    `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scoreSchemeId}/red_flags/${redFlag.id}`
  );
};
