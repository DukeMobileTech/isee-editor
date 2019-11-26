import { instance } from "./api";

/**
 * OptionInOptionSet
 */
export const deleteOptionInOptionSet = (optionSetId, id) => {
  return instance.delete(
    `/option_sets/${optionSetId}/option_in_option_sets/${id}`
  );
};
