// solutionProviderSlice.ts
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
  } catch (error) {
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
    } catch (error) {
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
      // FETCH PROVIDERS
      .addCase(fetchSolutionProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolutionProviders.fulfilled, (state, action) => {
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
      .addCase(addSolutionProvider.fulfilled, (state, action) => {
        state.solutionProviders.push(action.payload);
        state.loading = false;
      })
      .addCase(addSolutionProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add solution provider";
      });
  },
});


export const { setActiveTabSource } = solutionProviderSlice.actions;
export default solutionProviderSlice.reducer;
