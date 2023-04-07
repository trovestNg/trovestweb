import { AGENT_REQUEST, CREATE_AGENT, GET_AGENTS, SET_AGENTS, SET_AGENTS_COLLECTIONS } from '../Actions/Actions'
import { user_storage_name } from '../config'

const initialState = {
    agents: [],
    collections: [],
}


export const addAgentAction = (action) => {
    return {
        type: AGENT_REQUEST,
        payload: action,
    }
}

export const setAgentAction = (agents) => {
    return {
        type: SET_AGENTS,
        agents: agents,
    }
}

export const setAgenCollectiontAction = (collections) => {
    return {
        type: SET_AGENTS_COLLECTIONS,
        collections: collections,
    }
}

export const agentReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_AGENT:
            return {
                ...state,
                data: action.data,
            }
        case GET_AGENTS:
            return {
                ...state,
                agents: action.data,
            }
        case SET_AGENTS:
            return {
                ...state,
                agents: action.agents,
            }
            case SET_AGENTS_COLLECTIONS:
                return {
                    ...state,
                    collections: action.collections,
                }
        default:
            return state;
    }
}
