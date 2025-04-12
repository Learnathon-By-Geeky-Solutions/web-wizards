import { createSlice } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, clearUser } = userSlice.actions;

// Thunk for handling token refresh
export const refreshUserSession = () => async (dispatch) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      dispatch(clearUser());
      return;
    }

    // Use the authService to handle token refresh
    const response = await authService.refreshToken();
    if (response.access) {
      localStorage.setItem('accessToken', response.access);
      // Update auth state if needed
      dispatch(setUser(response.user));
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    dispatch(clearUser());
  }
};

export default userSlice.reducer;