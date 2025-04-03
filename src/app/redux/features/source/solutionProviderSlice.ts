import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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
  activeTabSource: string;
}

const initialState: SolutionProviderState = {
  solutionProviders: [],
  loading: false,
  error: null,
  activeTabSource: "02.a",
};

export const fetchSolutionProviders = createAsyncThunk<
  SolutionProvider[],
  void,
  { rejectValue: string }
>("solutionProvider/fetchSolutionProviders", async (_, { rejectWithValue }) => {
  try {
    const projectId = localStorage.getItem("projectID");
    if (!projectId) throw new Error("Project ID is missing");

    const response = await axios.post(
      "https://tyn-server.azurewebsites.net/coinnovation/source-solution-providers/",
      { project_id: projectId },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data.solution_providers;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const addSolutionProvider = createAsyncThunk<
  SolutionProvider,
  {
    project_id: string;
    solution_provider_name: string;
    contact_person: string;
    phone_number: string;
    email: string;
    solution_provider_url: string;
  },
  { rejectValue: string }
>(
  "solutionProvider/addSolutionProvider",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/coinnovation/add-solution-provider/",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data.provider_details;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteSolutionProvider = createAsyncThunk<
  { solution_provider_id: string },
  { project_id: string; solution_provider_id: string },
  { rejectValue: string }
>(
  "solutionProvider/deleteSolutionProvider",
  async ({ project_id, solution_provider_id }, { rejectWithValue }) => {
    try {
      await axios.delete(
        "http://127.0.0.1:8000/coinnovation/delete-solution-provider/",
        {
          headers: { "Content-Type": "application/json" },
          data: {
            project_id,
            solution_provider_id,
          },
        }
      );
      return { solution_provider_id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const solutionProviderSlice = createSlice({
  name: "solutionProvider",
  initialState,
  reducers: {
    setActiveTabSource: (state, action: PayloadAction<string>) => {
      state.activeTabSource = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolutionProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // FETCH PROVIDERS
      .addCase(fetchSolutionProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolutionProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.solutionProviders = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchSolutionProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch solution providers";
      })

      // ADD PROVIDER
      .addCase(addSolutionProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolutionProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch solution providers.";
      })

      .addCase(addSolutionProvider.fulfilled, (state, action) => {
        state.solutionProviders.push(action.payload);
        state.loading = false;
      })
      .addCase(addSolutionProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add solution provider";
      })
      .addCase(deleteSolutionProvider.fulfilled, (state, action) => {
        state.solutionProviders = state.solutionProviders.filter(
          (provider) =>
            provider.solution_provider_id !==
            action.payload.solution_provider_id
        );
      });
  },
});

export const { setActiveTabSource } = solutionProviderSlice.actions;
export default solutionProviderSlice.reducer;
