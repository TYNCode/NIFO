import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface SolutionProviderDetails {
  solution_provider_id: string;
  solution_provider_name: string;
  offerings: string[];
  key_customer: string;
  usp: string;
  email: string;
  phone_number: string;
  solution_provider_url: string;
  linkedin_url: string;
  other_usecases: string[];
}

interface SolutionProviderDetailsState {
  details: SolutionProviderDetails | null;
  loading: boolean;
  error: string | null;
}

export const fetchSolutionProviderDetails = createAsyncThunk(
  "solutionProviderDetails/fetchSolutionProviderDetails",
  async (
    {
      project_id,
      solution_provider_id,
    }: { project_id: string; solution_provider_id: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "https://tyn-server.azurewebsites.net/coinnovation/solution-provider-details/",
        { project_id, solution_provider_id },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data.provider_details;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch details");
    }
  }
);

const solutionProviderDetailsSlice = createSlice({
  name: "solutionProviderDetails",
  initialState: {
    details: null,
    loading: false,
    error: null,
  } as SolutionProviderDetailsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolutionProviderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolutionProviderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchSolutionProviderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default solutionProviderDetailsSlice.reducer;
