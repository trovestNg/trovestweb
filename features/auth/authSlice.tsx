import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define interfaces for the state and payloads
interface UserInfo {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  loading: boolean;
  userInfo: UserInfo | null;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  loading: false,
  userInfo: null,
  error: null,
};

// Define the async thunk for user login
interface LoginPayload {
  username: string;
  password: string;
}

export const loginUser = createAsyncThunk<UserInfo, LoginPayload>(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      throw new Error('Failed to login');
    }
    const data: UserInfo = await response.json();
    return data;
  }
);

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Your synchronous reducers can go here
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      });
  },
});

export default authSlice.reducer;