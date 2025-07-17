import { apiRequest } from '@/app/utils/apiWrapper/apiRequest';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetch',
  async () => {
    const res = await apiRequest('get', 'http://127.0.0.1:8000/api/users/me/');
    return res.data;
  }
);

export const updateUserProfile = createAsyncThunk(
  'userProfile/update',
  async (profileData) => {
    const res = await apiRequest('put', 'http://127.0.0.1:8000/api/users/me/', profileData);
    return res.data;
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  }
});

export default userProfileSlice.reducer; 