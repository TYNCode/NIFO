import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiRequest } from "../../utils/apiWrapper/apiRequest";

interface RecommendedQuery {
  shortName: string;
  prompt: string;
}

interface RecommendedQueriesState {
  data: RecommendedQuery[];
  loading: boolean;
  error: string | null;
}

const initialState: RecommendedQueriesState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchRecommendedQueries = createAsyncThunk<
  RecommendedQuery[],
  void,
  { rejectValue: string }
>(
  "recommendedQueries/fetchRecommendedQueries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("get", "/prompts/recommended-queries/", {}, true);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error fetching recommended queries");
    }
  }
);

const recommendedQueriesSlice = createSlice({
  name: "recommendedQueries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedQueries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedQueries.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = Array.isArray(action.payload)
          ? action.payload
          : action.payload.results || [];
        state.loading = false;
      })
      .addCase(fetchRecommendedQueries.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch recommended queries";
        state.loading = false;
      });
  },
});

export default recommendedQueriesSlice.reducer; 