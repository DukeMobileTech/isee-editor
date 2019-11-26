import { instance } from "./api";

/** Survey */
export const getSurveys = () => {
  return instance.get("/surveys");
};
