import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface modalState {
  isModalOpen: boolean;
}

const initialState: modalState = {
  isModalOpen: false,
};

const registerModalSlice = createSlice({
  name: 'registerModal',
  initialState,
  reducers: {
    setRegModalOpen(state, action: PayloadAction<boolean>) {
      state.isModalOpen = action.payload;
    },
  },
});

const logInModalSlice = createSlice({
    name: 'logInModal',
    initialState,
    reducers: {
      setLogInModalOpen(state, action: PayloadAction<boolean>) {
        state.isModalOpen = action.payload;
      },
    },
  });

export const { setRegModalOpen } = registerModalSlice.actions;

export const { setLogInModalOpen } = logInModalSlice.actions;
export default {
    registerModal: registerModalSlice.reducer,
    logInModal: logInModalSlice.reducer,
  };