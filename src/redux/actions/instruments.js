import { INSTRUMENTS } from "../constants/instruments";

const loadInstruments = projectId => ({
  type: INSTRUMENTS.LOAD,
  projectId
});

const setInstruments = instruments => ({
  type: INSTRUMENTS.LOAD_SUCCESS,
  instruments
});

const setInstrumentsError = error => ({
  type: INSTRUMENTS.LOAD_FAIL,
  error
});

const createInstrument = (projectId, instrument) => ({
  type: INSTRUMENTS.CREATE,
  projectId,
  instrument
});

const addInstrument = instrument => ({
  type: INSTRUMENTS.CREATE_SUCCESS,
  instrument
});

const updateInstrument = (projectId, id, instrument) => ({
  type: INSTRUMENTS.UPDATE,
  projectId,
  id,
  instrument
});

const setInstrument = (instrument, currentProjectId) => ({
  type: INSTRUMENTS.UPDATE_SUCCESS,
  instrument,
  currentProjectId
});

const deleteInstrument = (projectId, id) => ({
  type: INSTRUMENTS.DELETE,
  projectId,
  id
});

const removeInstrument = id => ({
  type: INSTRUMENTS.DELETE_SUCCESS,
  id
});

export {
  loadInstruments,
  setInstruments,
  setInstrumentsError,
  createInstrument,
  addInstrument,
  updateInstrument,
  setInstrument,
  deleteInstrument,
  removeInstrument
};
