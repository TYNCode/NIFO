import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface SolutionProvider {
  solution_provider_id: string;
  solution_provider_name: string;
  relevant_usecase: string;
  key_customers: string[];
}

interface SolutionProviderState {
  solutionProviders: SolutionProvider[];
  loading: boolean;
  error: string | null;
}

export const fetchSolutionProviders = createAsyncThunk<
  SolutionProvider[],
  void,
  { rejectValue: string }
>("solutionProvider/fetchSolutionProviders", async (_, { rejectWithValue }) => {
  try {
    const projectId = localStorage.getItem("projectID");
    if (!projectId) throw new Error("Project ID is missing in localStorage");

    const response = await axios.post(
      "http://127.0.0.1:8000/coinnovation/source-solution-providers/",
      { project_id: projectId },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data.solution_providers;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const solutionProviderSlice = createSlice({
  name: "solutionProvider",
  initialState: {
    solutionProviders: [],
    loading: false,
    error: null,
  } as SolutionProviderState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolutionProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolutionProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.solutionProviders = action.payload || [];
      })
      .addCase(fetchSolutionProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export default solutionProviderSlice.reducer;
