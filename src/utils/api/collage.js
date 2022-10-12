import { instance } from "./api";

/**
 * Collage
 */
export const getCollages = () => {
  return instance.get("/collages");
};
