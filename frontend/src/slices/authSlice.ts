import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  loggedIn: boolean;
  username: string;
  token: string | null;
}

const initialState: AuthState = {
  loggedIn: localStorage.getItem('loggedIn') === 'true',
  username: localStorage.getItem('Username') || '',
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn(state, action: PayloadAction<{ loggedIn: boolean; username: string; token: string }>) {
      const { loggedIn, username, token } = action.payload;
      state.loggedIn = loggedIn;
      state.username = username;
      state.token = token;
      localStorage.setItem('loggedIn', loggedIn.toString());
      localStorage.setItem('Username', username);
      localStorage.setItem('token', token);
    },
    logout(state){
      state.loggedIn = false;
      state.username = '';
      state.token = null;
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('Username');
      localStorage.removeItem('token');
    }
  },
});

export const { setLoggedIn, logout } = authSlice.actions;
export default authSlice.reducer;
