// store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import rootReducer from './combinedSlices';

// Config for redux-persist
const persistConfig = {
  key: 'root',          // Key in localStorage
  storage,              // Storage method (localStorage)
  whitelist: ['authUserSlice','unAuthUserSlice'],  // List of reducers you want to persist (e.g., auth)
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
});

// Persistor for store
export const persistor = persistStore(store);

export default store;
