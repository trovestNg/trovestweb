import { combineReducers } from '@reduxjs/toolkit';
import authUserSlice from './slices/authUserSlice';
import unAuthUserSlice from './slices/unAuthserSlice';

const rootReducer = combineReducers({
  authUserSlice: authUserSlice,
  unAuthUserSlice: unAuthUserSlice,
});

export default rootReducer;