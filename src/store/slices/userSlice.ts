import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userProfile: {},
    userToken: '',
    userBMOSearch: {
        searchWords: '',
        searchResult: []
    },
    userNav: []
}

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        updateNav: (state: any, action) => {
            state.userNav.push(action.payload)
        },
        clearNav:(state,action)=>{
            state.userNav = action.payload
        },
        reduceNavLink: (state, action) => {
            state.userNav = action.payload
            // state.userNav.pop()
        },
        handleUserSearch: (state, action) => {
            state.userBMOSearch.searchWords = action.payload
        },
        handleUserSearchResult: (state, action) => {
            state.userBMOSearch.searchResult = action.payload
        }
    }
})

export const { updateNav, reduceNavLink,handleUserSearch,handleUserSearchResult,clearNav } = userSlice.actions
export default userSlice.reducer