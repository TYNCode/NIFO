// solutionProviderSlice.ts
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
      "https://tyn-server.azurewebsites.net/coinnovation/source-solution-providers/",
      { project_id: projectId },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data.solution_providers;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// New Thunk for adding solution provider
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
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.provider_details;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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

    builder
      .addCase(addSolutionProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSolutionProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.solutionProviders.push(action.payload);
      })
      .addCase(addSolutionProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add solution provider";
      });
  },
});

export default solutionProviderSlice.reducer;
