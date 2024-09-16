import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import modalReducers from '../slices/modalSlice';
import trainingReducers from '../slices/trainingSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer, // The reducer for authentication state
    registerModal: modalReducers.registerModal, // The reducer for the register modal state
    logInModal: modalReducers.logInModal, // The reducer for the login modal state
    trainingQueue: trainingReducers, // The reducer for the training queue state
  },
});

// Define types for the Redux store's state and dispatch
export type RootState = ReturnType<typeof store.getState>; // Type for the state of the entire store
export type AppDispatch = typeof store.dispatch; // Type for the dispatch function

export default store; // Export the configured store
