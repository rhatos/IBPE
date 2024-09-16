import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the interface for the authentication state
interface AuthState {
  loggedIn: boolean; // Whether the user is logged in or not
  username: string;  // The username of the logged-in user
  token: string | null; // Authentication token, if available
}

// Initialize the state, reading from localStorage to persist the user's session
const initialState: AuthState = {
  loggedIn: localStorage.getItem('loggedIn') === 'true', // Read 'loggedIn' status from localStorage
  username: localStorage.getItem('Username') || '', // Read username from localStorage, default to empty string if not found
  token: localStorage.getItem('token') || null, // Read token from localStorage, default to null if not found
};

// Create a slice of the store for authentication management
const authSlice = createSlice({
  name: 'auth', // The name of the slice
  initialState, // The initial state
  reducers: {
    // Reducer to handle setting the user as logged in
    setLoggedIn(state, action: PayloadAction<{ loggedIn: boolean; username: string; token: string }>) {
      const { loggedIn, username, token } = action.payload; // Maps payload values
      state.loggedIn = loggedIn; // Set the logged-in status in the state
      state.username = username; // Set the username in the state
      state.token = token; // Set the token in the state

      // Save the logged-in status, username, and token to localStorage for persistence
      localStorage.setItem('loggedIn', loggedIn.toString());
      localStorage.setItem('Username', username);
      localStorage.setItem('token', token);
    },

    // Reducer to handle logging out
    logout(state) {
      state.loggedIn = false; // Set logged-in status to false
      state.username = ''; // Clear the username
      state.token = null; // Clear the token

      // Remove the values from localStorage to effectively log out the user
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('Username');
      localStorage.removeItem('token');
    }
  },
});

// Export the actions so that components can dispatch them
export const { setLoggedIn, logout } = authSlice.actions;

// Export the reducer to be used in the store
export default authSlice.reducer;
