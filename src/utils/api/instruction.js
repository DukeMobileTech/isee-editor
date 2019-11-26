import { instance } from "./api";

/**
 * Instruction
 */
export const getInstructions = () => {
  return instance.get("/instructions");
};

export const updateInstruction = (id, instruction) => {
  return instance.put(`/instructions/${id}`, instruction);
};

export const createInstruction = instruction => {
  return instance.post("/instructions", instruction);
};

export const deleteInstruction = id => {
  return instance.delete(`/instructions/${id}`);
};
