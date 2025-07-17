import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/app/utils/apiWrapper/apiRequest';

export const fetchTeam = createAsyncThunk('team/fetchTeam', async (_, thunkAPI) => {
  try {
    const response = await apiRequest('get', '/users/');
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching team');
  }
});

export const inviteTeammate = createAsyncThunk(
  'team/inviteTeammate',
  async (payload: { email: string; role: string }, thunkAPI) => {
    try {
      const response = await apiRequest('post', '/users/invite/', payload);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error inviting teammate');
    }
  }
);

export const resendInvite = createAsyncThunk(
  'team/resendInvite',
  async (payload: { user_id: number }, thunkAPI) => {
    try {
      const response = await apiRequest('post', '/users/resend-invite/', payload);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error resending invite');
    }
  }
);

export const deleteTeammate = createAsyncThunk(
  'team/deleteTeammate',
  async (user_id: number, thunkAPI) => {
    try {
      await apiRequest('delete', `/users/${user_id}/`);
      return user_id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error deleting teammate');
    }
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    members: [],
    loading: {
      fetch: false,
      invite: false,
      resend: {} as Record<number, boolean>,
      delete: {} as Record<number, boolean>,
    },
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeam.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.members = action.payload;
      })
      .addCase(fetchTeam.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload as string;
      })
      .addCase(inviteTeammate.pending, (state) => {
        state.loading.invite = true;
        state.error = null;
      })
      .addCase(inviteTeammate.fulfilled, (state, action) => {
        state.loading.invite = false;
        // Optionally, you can push the new member or refetch
      })
      .addCase(inviteTeammate.rejected, (state, action) => {
        state.loading.invite = false;
        state.error = action.payload as string;
      })
      .addCase(resendInvite.pending, (state, action) => {
        state.loading.resend[action.meta.arg.user_id] = true;
        state.error = null;
      })
      .addCase(resendInvite.fulfilled, (state, action) => {
        state.loading.resend[action.meta.arg.user_id] = false;
      })
      .addCase(resendInvite.rejected, (state, action) => {
        state.loading.resend[action.meta.arg.user_id] = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTeammate.pending, (state, action) => {
        state.loading.delete[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(deleteTeammate.fulfilled, (state, action) => {
        state.loading.delete[action.payload] = false;
        state.members = state.members.filter((m: any) => m.id !== action.payload);
      })
      .addCase(deleteTeammate.rejected, (state, action) => {
        state.loading.delete[action.meta.arg] = false;
        state.error = action.payload as string;
      });
  },
});

export default teamSlice.reducer; 