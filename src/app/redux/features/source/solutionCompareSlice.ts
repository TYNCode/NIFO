import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface RatingCriteria {
  score: number;
  reason: string;
}

interface CompanyComparison {
  company: string;
  criteria: {
    [key: string]: RatingCriteria;
  };
}

interface ComparisonState {
  loading: boolean;
  error: string | null;
  result: CompanyComparison[];
  message: string | null;
}

const initialState: ComparisonState = {
  loading: false,
  error: null,
  result: [],
  message: null,
};

export const compareSolutionProviders = createAsyncThunk<
  { message: string; comparison_result: CompanyComparison[] },
  { project_id: string; solution_provider_ids: string[] },
  { rejectValue: string }
>(
  "comparison/compareSolutionProviders",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://tyn-server.azurewebsites.net/coinnovation/compare-solution-providers/",
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
