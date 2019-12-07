import { instance } from "./api";

/**DisplayInstruction */
export const getDisplayInstructions = (projectId, instrumentId, displayId) => {
  return instance.get(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${displayId}/display_instructions`
  );
};

export const createDisplayInstruction = (
  projectId,
  instrumentId,
  displayId,
  di
) => {
  return instance.post(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${displayId}/display_instructions`,
    { display_instruction: di }
  );
};

export const updateDisplayInstruction = (
  projectId,
  instrumentId,
  displayId,
  di
) => {
  return instance.put(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${displayId}/display_instructions/${di.id}`,
    { display_instruction: di }
  );
};

export const deleteDisplayInstruction = (
  projectId,
  instrumentId,
  displayId,
  id
) => {
  return instance.delete(
    `/projects/${projectId}/instruments/${instrumentId}/displays/${displayId}/display_instructions/${id}`
  );
};
