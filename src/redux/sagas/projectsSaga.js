import { takeEvery, call, put } from "redux-saga/effects";
import { getProjects } from "../../utils/api/project";
import { setProjects, setProjectsError } from "../actions/projects";
import { PROJECTS } from "../constants/projects";

export function* handleProjectsLoad() {
  try {
    const results = yield call(getProjects);
    yield put(setProjects(results.data));
  } catch (error) {
    yield put(setProjectsError(error.toString()));
  }
}

export default function* watchProjectsLoad() {
  yield takeEvery(PROJECTS.LOAD, handleProjectsLoad);
}
