import { all } from "redux-saga/effects";
import instrumentsSaga from "./instrumentsSaga";
import projectsSaga from "./projectsSaga";

export default function* rootSaga() {
  yield all([projectsSaga(), instrumentsSaga()]);
}
