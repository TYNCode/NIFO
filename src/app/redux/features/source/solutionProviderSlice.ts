import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiRequest } from "../../../utils/apiWrapper/apiRequest";
import { updateSolutionProvider } from "./solutionProviderDetailsSlice";


interface SolutionProvider {
  solution_provider_id: string;
  solution_provider_name: string;
  relevant_usecase: string;
  key_customers: string[];
}

interface SolutionProviderState {
  solutionProviders: SolutionProvider[];
  shortlistedProviders: string[];
  loading: boolean;
  error: string | null;
  activeTabSource: string;
  activeTabRoi: null | string;
}

const initialState: SolutionProviderState = {
  solutionProviders: [],
  shortlistedProviders: [],
  loading: false,
  error: null,
  activeTabSource: "02.a",
  activeTabRoi: null
};

// ✅ Fetch all solution providers
export const fetchSolutionProviders = createAsyncThunk<
  SolutionProvider[],
  void,
  { rejectValue: string }
>("solutionProvider/fetchSolutionProviders", async (_, { rejectWithValue }) => {
  try {
    const projectId = localStorage.getItem("projectID");
    if (!projectId) throw new Error("Project ID is missing");

    const response = await apiRequest(
      "post",
      "/coinnovation/source-solution-providers/",
      { project_id: projectId },
      true
    );

    return response.data.solution_providers;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ✅ Add a solution provider
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
>("solutionProvider/addSolutionProvider", async (formData, { rejectWithValue }) => {
  try {
    const response = await apiRequest(
      "post",
      "/coinnovation/add-solution-provider/",
      formData,
      true
    );
    return response.data.provider_details;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ✅ Delete a solution provider
export const deleteSolutionProvider = createAsyncThunk<
  { solution_provider_id: string },
  { project_id: string; solution_provider_id: string },
  { rejectValue: string }
>("solutionProvider/deleteSolutionProvider", async ({ project_id, solution_provider_id }, { rejectWithValue }) => {
  try {
    await apiRequest(
      "delete",
      "/coinnovation/delete-solution-provider/",
      { project_id, solution_provider_id },
      true
    );
    return { solution_provider_id };
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ✅ Save shortlist of providers
export const saveShortlistedProviders = createAsyncThunk<
  string[],
  { project_id: string; selected_ids: string[] },
  { rejectValue: string }
>("solutionProvider/saveShortlistedProviders", async ({ project_id, selected_ids }, { rejectWithValue }) => {
  try {
    await apiRequest(
      "post",
      "/coinnovation/shortlist-solution-providers/",
      { project_id, selected_ids },
      true
    );
    return selected_ids;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const solutionProviderSlice = createSlice({
  name: "solutionProvider",
  initialState,
  reducers: {
    setActiveTabSource: (state, action: PayloadAction<string>) => {
      state.activeTabSource = action.payload;
    },
    setActiveTabRoi: (state,action:PayloadAction<string>) => {
      state.activeTabRoi = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
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
      })

      .addCase(deleteSolutionProvider.fulfilled, (state, action) => {
        state.solutionProviders = state.solutionProviders.filter(
          (provider) => provider.solution_provider_id !== action.payload.solution_provider_id
        );
      })

      .addCase(updateSolutionProvider.fulfilled, (state, action) => {
        const { solution_provider_id, data } = action.payload;
        const index = state.solutionProviders.findIndex(
          (provider) => provider.solution_provider_id === solution_provider_id
        );

        if (index !== -1) {
          state.solutionProviders[index] = {
            ...state.solutionProviders[index],
            relevant_usecase: data.relevant_usecase,
            key_customers: data.key_customers
          };
        }
      })

      .addCase(saveShortlistedProviders.fulfilled, (state, action) => {
        state.shortlistedProviders = action.payload;
      });
  }
});

export const {setActiveTabSource, setActiveTabRoi } = solutionProviderSlice.actions;
export default solutionProviderSlice.reducer;

// ✅ Optional selector to get full details of shortlisted providers
export const selectShortlistedProviders = (state) =>
  state.solutionProvider.solutionProviders.filter((sp) =>
    state.solutionProvider.shortlistedProviders.includes(sp.solution_provider_id)
  );
