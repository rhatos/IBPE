import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import modalReducers from '../slices/modalSlice';
import trainingReducers from '../slices/trainingSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    registerModal: modalReducers.registerModal,
    logInModal: modalReducers.logInModal,
    trainingQueue: trainingReducers,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
