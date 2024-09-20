import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authUserBMOSearch: {
        authUserSearchWord: '',
        authUserBMOCustomerSearchResult: []
    },
    authUserNavigationArray: [],
    authUserBmoCustormerProfile:{},
    authUserBmoOwnerProfile:{}
}

const authUserSlice = createSlice({
    name: 'authUserSlice',
    initialState,
    reducers: {
        setAuthUserBMOSearchWord: (state, action) => {
            state.authUserBMOSearch.authUserSearchWord= action.payload
        },
        setAuthUserBMOSearchResult: (state, action) => {
            state.authUserBMOSearch.authUserBMOCustomerSearchResult = action.payload
        },
        emptyAuthUserBMOSearchResult: (state) => {
            state.authUserBMOSearch.authUserBMOCustomerSearchResult = []
        },
        pushToAuthUserNavArray: (state:any,action) => {
            state.authUserNavigationArray.push(action.payload)
        },
        removeFromAuthUserNavArray: (state, action) => {
            state.authUserNavigationArray = action.payload
            // state.userNav.pop()
        },
        reduceAuthUserNavArray: (state, action) => {
            // Replace the current array with the modified one (payload is the new array)
            state.authUserNavigationArray = action.payload;
          },
        emptyAuthUserNavArray:(state)=>{
            state.authUserNavigationArray = []
        },
        clearAuthUserBmoSearchWord:(state)=>{
            state.authUserBMOSearch.authUserSearchWord=""
        },
        setAuthUserBmoCustormerProfile: (state, action) => {
            state.authUserBmoCustormerProfile=action.payload
        },
        setAuthUserBMOOwnerProfile: (state, action) => {
            state.authUserBmoOwnerProfile=action.payload
        },
    }
})

export const {
    setAuthUserBMOSearchWord,
    setAuthUserBMOSearchResult,
    emptyAuthUserBMOSearchResult,
    pushToAuthUserNavArray,
    removeFromAuthUserNavArray,
    emptyAuthUserNavArray,
    clearAuthUserBmoSearchWord,
    setAuthUserBmoCustormerProfile,
    setAuthUserBMOOwnerProfile,
    reduceAuthUserNavArray
} = authUserSlice.actions
export default authUserSlice.reducer