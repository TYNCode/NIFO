import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../../interfaces';

interface LoginState {
  loading: boolean;
  user?: User;
  error?: string;
  message?: string;
}

const initialState: LoginState = {
  loading: false,
  user: undefined,
  error: undefined,
  message: undefined,
};

interface FormData {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/user/login/', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Login failed. Please check your credentials.'
      );
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    clearLoginState(state) {
      state.loading = false;
      state.user = undefined;
      state.error = undefined;
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.message = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = 'Login successful';
        localStorage.setItem('jwtAccessToken', action.payload.tokens.access_token);
        localStorage.setItem('jwtRefreshToken', action.payload.tokens.refresh_token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLoginState } = loginSlice.actions;

export default loginSlice.reducer;
