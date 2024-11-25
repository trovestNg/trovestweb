import { takeLatest, all } from "redux-saga/effects";
import { AGENT_REQUEST, ADMIN_REQUEST,ADMIN_LOGIN } from "../Actions/Actions";
import { setAdminReducer } from './admin.saga'
import { addAgentUserSaga } from './agent.saga'


export function* watcherSaga() {
  yield all([
    // takeLatest(ADMIN_LOGIN, setAdminReducer),
    takeLatest(ADMIN_REQUEST, setAdminReducer),
    takeLatest(AGENT_REQUEST, addAgentUserSaga),
  ])
}