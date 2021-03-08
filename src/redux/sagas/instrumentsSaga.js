import { call, put, takeEvery } from "redux-saga/effects";
import {
  createInstrument,
  deleteInstrument,
  getInstruments,
  updateInstrument,
} from "../../utils/api/instrument";
import {
  addInstrument,
  removeInstrument,
  setInstrument,
  setInstruments,
  setInstrumentsError,
} from "../actions/instruments";
import { INSTRUMENTS } from "../constants/instruments";

export function* handleInstrumentsLoad(action) {
  try {
    const results = yield call(getInstruments, action.projectId);
    yield put(setInstruments(results.data));
  } catch (error) {
    yield put(setInstrumentsError(error.toString()));
  }
}

export function* handleInstrumentCreate(action) {
  try {
    const results = yield call(
      createInstrument,
      action.projectId,
      action.instrument
    );
    yield put(addInstrument(results.data));
  } catch (error) {
    yield put(setInstrumentsError(error.toString()));
  }
}

export function* handleInstrumentDelete(action) {
  try {
    yield call(deleteInstrument, action.projectId, action.id);
    yield put(removeInstrument(action.id));
  } catch (error) {
    yield put(setInstrumentsError(error.toString()));
  }
}

export function* handleInstrumentUpdate(action) {
  try {
    const results = yield call(
      updateInstrument,
      action.projectId,
      action.id,
      action.instrument
    );
    yield put(setInstrument(results.data, action.projectId));
  } catch (error) {
    yield put(setInstrumentsError(error.toString()));
  }
}

export default function* watchInstruments() {
  yield takeEvery(INSTRUMENTS.LOAD, handleInstrumentsLoad);
  yield takeEvery(INSTRUMENTS.CREATE, handleInstrumentCreate);
  yield takeEvery(INSTRUMENTS.DELETE, handleInstrumentDelete);
  yield takeEvery(INSTRUMENTS.UPDATE, handleInstrumentUpdate);
}
