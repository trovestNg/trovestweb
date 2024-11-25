import { ADMIN_LOGIN, ADMIN_REQUEST } from '../Actions/Actions'
import { user_storage_name } from '../config'

const initialState = {
    data: {},
    token: '',
    user_type: '',
}


export const loginAdminAction = (action) => {
    return {
        type: ADMIN_REQUEST,
        payload: action
    }
}

export const setAdminAction = (action) => {
    return {
        type: ADMIN_LOGIN,
        data: action.data,
        token: action.token,
        user_type: action.user_type
    }
}


export const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADMIN_LOGIN:
            return {
                ...state,
                data: action.data,
                token: action.token
            }
        default:
            return state;
    }
}
