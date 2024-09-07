import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../../interfaces/index";

interface RegisterState {
  loading: boolean;
  user?: User;
  error?: string;
  message?: string;
}

const initialState: RegisterState = {
  loading: false,
  user: undefined,
  error: undefined,
  message: undefined,
};

interface FormData {
  first_name: string;
  email: string;
  organization_name?: string; // Make this optional as per the interface
  password: string;
  organization_id?: number; // Add optional organization_id
}

export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post("https://nifo.theyellow.network/api/user/register/", data);
      
      // Check if tokens are present in the response
      if (response.data.tokens && response.data.tokens.access && response.data.tokens.refresh) {
        return response.data;
      } else {
        throw new Error("Tokens not found in the response");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.email?.[0] || 
        error.message || 
        "Unexpected error during registration. Please try again."
      );
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    clearRegisterState(state) {
      state.loading = false;
      state.user = undefined;
      state.error = undefined;
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.message = undefined;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;

        // Store tokens in localStorage
        if (action.payload.tokens) {
          localStorage.setItem("jwtAccessToken", action.payload.tokens.access);
          localStorage.setItem("jwtRefreshToken", action.payload.tokens.refresh);
        }

        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRegisterState } = registerSlice.actions;

export default registerSlice.reducer;
