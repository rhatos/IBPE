import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Local storage
import authReducer from '../slices/authSlice';
import modalReducers from '../slices/modalSlice';
import trainingReducers from '../slices/trainingSlice';

// Configure persist reducers
const persistConfig = {
  key: 'root', // Key for the persisted storage
  storage, // Storage engine
};

const rootReducer = {
  auth: authReducer,
  registerModal: modalReducers.registerModal,
  logInModal: modalReducers.logInModal,
  trainingQueue: trainingReducers,
};

// Apply persistence to reducers
const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducer));

const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
});

export const persistor = persistStore(store); // Create the persistor instance

export type RootState = ReturnType<typeof store.getState>; // Type for the state of the entire store
export type AppDispatch = typeof store.dispatch; // Type for the dispatch function

export default store; // Export the configured store
