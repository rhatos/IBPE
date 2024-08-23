import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  loggedIn: boolean;
}

const initialState: AuthState = {
  loggedIn: localStorage.getItem('loggedIn') === 'true',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.loggedIn = action.payload;
      localStorage.setItem('loggedIn', action.payload.toString());
    },
  },
});

export const { setLoggedIn } = authSlice.actions;
export default authSlice.reducer;
