import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiRequest } from "../../../utils/apiWrapper/apiRequest";

export interface Challenge {
  id: number;
  title: string;
  industry: string;
  technology: string;
  company: number;
  company_name: string;
  description: string;
  requirements: string;
  scenario: string;
  budget: string;
  implementation_timeline: string;
  problem_image: string | null;
  created_at: string;
  updated_at: string;
  num_applied: number;
  applied: boolean;
}

interface ChallengesListState {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: string | null;
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteError: string | null;
  selectedChallenge: Challenge | null;
  selectedLoading: boolean;
  selectedError: string | null;
}

const initialState: ChallengesListState = {
  challenges: [],
  loading: false,
  error: null,
  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
  deleteStatus: "idle",
  deleteError: null,
  selectedChallenge: null,
  selectedLoading: false,
  selectedError: null,
};

export const fetchChallenges = createAsyncThunk(
  "challengesList/fetchChallenges",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest(
        "get",
        "/coinnovation/challenges/",
        undefined,
        true
      );
      return res.data.results || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch challenges"
      );
    }
  }
);

export const fetchChallengeById = createAsyncThunk(
  "challengesList/fetchChallengeById",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await apiRequest(
        "get",
        `/coinnovation/challenges/${id}/`,
        undefined,
        true
      );
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch challenge"
      );
    }
  }
);

export const createChallenge = createAsyncThunk(
  "challengesList/createChallenge",
  async (challenge: Partial<Challenge>, { rejectWithValue }) => {
    try {
      const res = await apiRequest(
        "post",
        "/coinnovation/challenges/",
        challenge,
        true
      );
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create challenge"
      );
    }
  }
);

export const updateChallenge = createAsyncThunk(
  "challengesList/updateChallenge",
  async (
    { id, data }: { id: number; data: Partial<Challenge> },
    { rejectWithValue }
  ) => {
    try {
      const res = await apiRequest(
        "put",
        `/coinnovation/challenges/${id}/`,
        data,
        true
      );
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update challenge"
      );
    }
  }
);

export const deleteChallenge = createAsyncThunk(
  "challengesList/deleteChallenge",
  async (id: number, { rejectWithValue }) => {
    try {
      await apiRequest(
        "delete",
        `/coinnovation/challenges/${id}/`,
        undefined,
        true
      );
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete challenge"
      );
    }
  }
);

const challengesListSlice = createSlice({
  name: "challengesList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChallenges.fulfilled, (state, action: PayloadAction<Challenge[]>) => {
        state.loading = false;
        state.challenges = action.payload;
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch by id
      .addCase(fetchChallengeById.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(fetchChallengeById.fulfilled, (state, action: PayloadAction<Challenge>) => {
        state.selectedLoading = false;
        state.selectedChallenge = action.payload;
      })
      .addCase(fetchChallengeById.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload as string;
      })
      // Create
      .addCase(createChallenge.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createChallenge.fulfilled, (state, action: PayloadAction<Challenge>) => {
        state.createStatus = "succeeded";
        state.challenges.push(action.payload);
      })
      .addCase(createChallenge.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload as string;
      })
      // Update
      .addCase(updateChallenge.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateChallenge.fulfilled, (state, action: PayloadAction<Challenge>) => {
        state.updateStatus = "succeeded";
        state.challenges = state.challenges.map((c) =>
          c.id === action.payload.id ? action.payload : c
        );
        if (state.selectedChallenge && state.selectedChallenge.id === action.payload.id) {
          state.selectedChallenge = action.payload;
        }
      })
      .addCase(updateChallenge.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload as string;
      })
      // Delete
      .addCase(deleteChallenge.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteChallenge.fulfilled, (state, action: PayloadAction<number>) => {
        state.deleteStatus = "succeeded";
        state.challenges = state.challenges.filter((c) => c.id !== action.payload);
        if (state.selectedChallenge && state.selectedChallenge.id === action.payload) {
          state.selectedChallenge = null;
        }
      })
      .addCase(deleteChallenge.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload as string;
      });
  },
});

export default challengesListSlice.reducer; 