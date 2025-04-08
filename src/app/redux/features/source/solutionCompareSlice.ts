import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface ComparisonResult {
  solution_provider_name: string;
  customer_feedback_rating: number;
  potential_clients_rating: number;
  deployment_capability_rating: number;
  channel_partners_rating: number;
  usp_rating: number;
  ip_protection_rating: number;
  competitors_benchmarking_rating: number;
  funding_stage_rating: number;
  incorporation_timeline_rating: number;
  product_stage_rating: number;
  team_strength_rating: number;
}

interface ComparisonState {
  loading: boolean;
  error: string | null;
  result: ComparisonResult[];
  message: string | null;
}

const initialState: ComparisonState = {
  loading: false,
  error: null,
  result: [],
  message: null,
};

// Async thunk to trigger the comparison
export const compareSolutionProviders = createAsyncThunk<
  { message: string; comparison_result: ComparisonResult[] },
  { project_id: string; solution_provider_ids: string[] },
  { rejectValue: string }
>(
  "comparison/compareSolutionProviders",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/coinnovation/compare-solution-providers/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const solutionComparisonSlice = createSlice({
  name: "solutionComparison",
  initialState,
  reducers: {
    resetComparisonState: (state) => {
      state.loading = false;
      state.error = null;
      state.result = [];
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(compareSolutionProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.result = [];
        state.message = null;
      })
      .addCase(compareSolutionProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload.comparison_result;
        state.message = action.payload.message;
      })
      .addCase(compareSolutionProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Comparison failed";
      });
  },
});

export const { resetComparisonState } = solutionComparisonSlice.actions;

export default solutionComparisonSlice.reducer;
