import { INSTRUMENTS } from "../constants/instruments";

export default function(state = [], action) {
  switch (action.type) {
    case INSTRUMENTS.LOAD_SUCCESS:
      return [...action.instruments];
    case INSTRUMENTS.CREATE_SUCCESS:
      return [...state, action.instrument];
    case INSTRUMENTS.DELETE_SUCCESS:
      return state.slice().filter(ins => ins.id !== action.id);
    case INSTRUMENTS.UPDATE_SUCCESS:
      const index = state.findIndex(ins => ins.id === action.instrument.id);
      const instruments = [...state];
      instruments.splice(index, 1, action.instrument);
      return instruments.filter(
        ins => ins.project_id === action.currentProjectId
      );
    default:
      return state;
  }
}
