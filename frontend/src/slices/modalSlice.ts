import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the interface for the modal state
interface modalState {
  isModalOpen: boolean; // Represents whether the modal is open or closed
}

// Set the initial state for both slices
const initialState: modalState = {
  isModalOpen: false, // By default, the modal is closed
};

// Create the slice for the register modal
const registerModalSlice = createSlice({
  name: 'registerModal', // The name of the slice for the register modal
  initialState, // The initial state for this slice
  reducers: {
    // Reducer to set the modal open or closed
    setRegModalOpen(state, action: PayloadAction<boolean>) {
      state.isModalOpen = action.payload; // Update the state based on the payload (true or false)
    },
  },
});

// Create the slice for the login modal
const logInModalSlice = createSlice({
  name: 'logInModal', // The name of the slice for the login modal
  initialState, // The initial state for this slice
  reducers: {
    // Reducer to set the login modal open or closed
    setLogInModalOpen(state, action: PayloadAction<boolean>) {
      state.isModalOpen = action.payload; // Update the state based on the payload (true or false)
    },
  },
});

// Export the action creators so they can be dispatched in components
export const { setRegModalOpen } = registerModalSlice.actions;
export const { setLogInModalOpen } = logInModalSlice.actions;

// Export the reducers to be included in the store
export default {
  registerModal: registerModalSlice.reducer, // Reducer for register modal
  logInModal: logInModalSlice.reducer, // Reducer for login modal
};
