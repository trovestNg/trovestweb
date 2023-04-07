import { call, put } from "redux-saga/effects";
import { adminCreateAgent,getAdminAgents } from './Requests'
import { setAgentAction } from '../Reducers/agent.reducer'
import { CREATE_AGENT, GET_AGENTS } from '../Actions/Actions'

export function* addAgentUserSaga(action) {
    try {
        const response = yield call(adminCreateAgent, action.payload);
        const { success, message, data } = response.data;
        if (success === true) {
            yield put(setAgentAction({ type: CREATE_AGENT, payload: data, success, message: message, loading: false }));
        }
        else {
            yield put(setAgentAction({ type: CREATE_AGENT, payload: {}, success, message: message, loading: false }));
        }
    } catch (error) {
        yield put(setAgentAction({ type: CREATE_AGENT, payload: {}, success: false, message: error.message, loading: false }));
    }
}

export function* getAgentSaga(action) {
    try {
        const response = yield call(getAdminAgents, action.payload);
        const { success, message, data } = response.data;
        if (success === true) {
            yield put(setAgentAction({ type: GET_AGENTS, payload: data, success, message: message, loading: false }));
        }
        else {
            yield put(setAgentAction({ type: GET_AGENTS, payload: {}, success, message: message, loading: false }));
        }
    } catch (error) {
        yield put(setAgentAction({ type: GET_AGENTS, payload: {}, success: false, message: error.message, loading: false }));
    }
}


