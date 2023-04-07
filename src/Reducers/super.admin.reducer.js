import { SUPER_ADMIN_REQUEST, CREATE_ADMIN, GET_ADMIN, SET_ADMINS,SET_ADMINS_AGENT } from '../Actions/Actions'
import { user_storage_name } from '../config'

const initialState = {
    admin: {},
    admins: [],
    agents: []
}


export const addSuperAdminAction = (action) => {
    return {
        type: SUPER_ADMIN_REQUEST,
        payload: action,
    }
}

export const setSuperAdminAction = (admins) => {
    return {
        type: SET_ADMINS,
        admins: admins,
    }
}
export const setSuperAdminAgentsAction = (agents) => {
    return {
        type: SET_ADMINS_AGENT,
        agents: agents,
    }
}

// export const setAgenCollectiontAction = (collections) => {
//     return {
//         type: SET_AGENTS_COLLECTIONS,
//         collections: collections,
//     }
// }

export const superAdminReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_ADMIN:
            return {
                ...state,
                data: action.data,
            }
        case GET_ADMIN:
            return {
                ...state,
                admins: action.admins,
            }
        case SET_ADMINS:
            return {
                ...state,
                admins: action.admins,
            }
        case SET_ADMINS_AGENT:
            return {
                ...state,
                agents: action.agents,
            }
        default:
            return state;
    }
}
