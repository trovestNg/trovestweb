import { call, put } from "redux-saga/effects";
import { loginAdminRequest } from './Requests'
import { setAdminAction } from '../Reducers/admin.reducer'
import { ADMIN_LOGIN } from '../Actions/Actions'


export function* setAdminReducer(action) {
    try {
        // const response = yield call(loginAdminRequest, action.payload);
        // const { success, message, data, token } = response.data;
        const { success, message, data, token } = action;
        if (success === true) {
            yield put(setAdminAction({ type: ADMIN_LOGIN, data: data, success, message: message, token: token }));
        }
        else {
            yield put(setAdminAction({ type: ADMIN_LOGIN, data: {}, success, message: message, token: '' }));
        }
    } catch (error) {
        yield put(setAdminAction({ type: ADMIN_LOGIN, data: {}, success: false, message: error.message, token: '' }));
    }
}



