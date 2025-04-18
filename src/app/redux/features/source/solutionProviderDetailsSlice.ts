import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface SolutionProviderDetails {
  solution_provider_id: string;
  solution_provider_name: string;
  offerings: string[];
  partnerships_and_alliances: string[];
  usp: string;
  email: string;
  phone_number: string;
  solution_provider_url: string;
  linkedin_url: string;
  other_usecases: string[];
  relevant_usecase: string;
  key_customers: string[];
}

interface ProviderState {
  data: SolutionProviderDetails | null;
  loading: boolean;
  error: string | null;
}

interface SolutionProviderDetailsState {
  [solution_provider_id: string]: ProviderState;
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
      return {
        solution_provider_id,
        details: response.data.provider_details,
      };
    } catch (error: any) {
      return rejectWithValue({
        solution_provider_id,
        error: error.response?.data || "Failed to fetch details",
      });
    }
  }
);

export const updateSolutionProvider = createAsyncThunk<
  {
    solution_provider_id: string;
    data: SolutionProviderDetails;
  },
  {
    solution_provider_id: string;
    updatedData: any;
    project_id: string;
  },
  { rejectValue: string }
>(
  "solutionProviderDetails/updateSolutionProvider",
  async (
    { solution_provider_id, updatedData, project_id },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `https://tyn-server.azurewebsites.net/coinnovation/edit-solution-provider/`,
        {
          solution_provider_id,
          project_id,
          ...updatedData,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      return {
        solution_provider_id,
        data: response.data.provider_details,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState: SolutionProviderDetailsState = {};

const solutionProviderDetailsSlice = createSlice({
  name: "solutionProviderDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolutionProviderDetails.pending, (state, action) => {
        const id = action.meta.arg.solution_provider_id;
        state[id] = {
          data: null,
          loading: true,
          error: null,
        };
      })
      .addCase(fetchSolutionProviderDetails.fulfilled, (state, action) => {
        const { solution_provider_id, details } = action.payload;
        state[solution_provider_id] = {
          data: details,
          loading: false,
          error: null,
        };
      })
      .addCase(fetchSolutionProviderDetails.rejected, (state, action: any) => {
        const { solution_provider_id, error } = action.payload;
        state[solution_provider_id] = {
          data: null,
          loading: false,
          error,
        };
      })
      .addCase(updateSolutionProvider.fulfilled, (state, action) => {
        const { solution_provider_id, data } = action.payload;
        console.log(data);
        state[solution_provider_id] = {
          data,
          loading: false,
          error: null,
        };
      })
      .addCase(updateSolutionProvider.rejected, (state, action: any) => {
        const id = action.meta.arg.solution_provider_id;
        state[id] = {
          ...state[id],
          loading: false,
          error: action.payload || "Failed to update solution provider.",
        };
      });
  },
});

export default solutionProviderDetailsSlice.reducer;
