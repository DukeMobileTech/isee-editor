import { INSTRUMENTS } from "../constants/instruments";

export default function (state = [], action) {
  switch (action.type) {
    case INSTRUMENTS.LOAD_SUCCESS:
      return [...action.instruments];
    case INSTRUMENTS.CREATE_SUCCESS:
      return [...state, action.instrument];
    case INSTRUMENTS.DELETE_SUCCESS:
      return state.slice().filter((ins) => ins.id !== action.id);
    case INSTRUMENTS.UPDATE_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const index = state.findIndex((ins) => ins.id === action.instrument.id);
      // eslint-disable-next-line no-case-declarations
      const instruments = [...state];
      instruments.splice(index, 1, action.instrument);
      return instruments.filter(
        (ins) => ins.project_id === action.currentProjectId
      );
    default:
      return state;
  }
}
