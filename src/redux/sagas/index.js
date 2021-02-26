import { all } from "redux-saga/effects";

import projectsSaga from "./projectsSaga";
import instrumentsSaga from "./instrumentsSaga";

export default function* rootSaga() {
  yield all([projectsSaga(), instrumentsSaga()]);
}
