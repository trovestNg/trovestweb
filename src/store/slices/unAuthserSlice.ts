import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    unAuthUserBMOSearch: {
        unAuthUserSearchWord: '',
        unAuthUserBMOCustomerSearchResult: []
    },
    unAuthUserNavigationArray: [],
    unAuthUserBmoCustormerProfile:{},
    unAuthUserBmoOwnerProfile:{}
}

const unAuserUserSlice = createSlice({
    name: 'unAuthUserSlice',
    initialState,
    reducers: {
        setUnAuthUserBMOSearchWord: (state, action) => {
            state.unAuthUserBMOSearch.unAuthUserSearchWord= action.payload
        },
        setUnAuthUserBMOSearchResult: (state, action) => {
            state.unAuthUserBMOSearch.unAuthUserBMOCustomerSearchResult = action.payload
        },
        emptyUnAuthUserBMOSearchResult: (state) => {
            state.unAuthUserBMOSearch.unAuthUserBMOCustomerSearchResult = []
        },
        pushTounAuthUserNavArray: (state:any,action) => {
            state.unAuthUserNavigationArray.push(action.payload)
        },
        removeFromUnAuthUserNavArray: (state, action) => {
            state.unAuthUserNavigationArray = action.payload
            // state.userNav.pop()
        },
        reduceUnAuthUserNavArray: (state, action) => {
            // Replace the current array with the modified one (payload is the new array)
            state.unAuthUserNavigationArray = action.payload;
          },
        emptyUnAuthUserNavArray:(state)=>{
            state.unAuthUserNavigationArray = []
        },
        clearUnAuthUserBmoSearchWord:(state)=>{
            state.unAuthUserBMOSearch.unAuthUserSearchWord=""
        },
        setUnAuthUserBmoCustormerProfile: (state, action) => {
            state.unAuthUserBmoCustormerProfile=action.payload
        },
        setUnAuthUserBMOOwnerProfile: (state, action) => {
            state.unAuthUserBmoOwnerProfile=action.payload
        },
    }
})

export const {
    setUnAuthUserBMOSearchWord,
    setUnAuthUserBMOSearchResult,
    emptyUnAuthUserBMOSearchResult,
    pushTounAuthUserNavArray,
    removeFromUnAuthUserNavArray,
    emptyUnAuthUserNavArray,
    clearUnAuthUserBmoSearchWord,
    setUnAuthUserBmoCustormerProfile,
    setUnAuthUserBMOOwnerProfile,
    reduceUnAuthUserNavArray
} = unAuserUserSlice.actions
export default unAuserUserSlice.reducer