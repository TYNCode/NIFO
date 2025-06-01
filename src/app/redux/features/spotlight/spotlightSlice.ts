import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../../utils/apiWrapper/apiRequest";
import { Spotlight } from "@/app/admin/spotlights/types/spotlights";
import { RootState } from "@/app/redux/store";

interface SpotlightState {
  loading: boolean;
  spotlights: Spotlight[];
  selectedSpotlight?: Spotlight;
  isModalOpen: boolean;
  mode: "create" | "edit";
  error?: string;
  message?: string;
}

const initialState: SpotlightState = {
  loading: false,
  spotlights: [],
  selectedSpotlight: undefined,
  isModalOpen: false,
  mode: "create",
  error: undefined,
  message: undefined,
};

export const fetchSpotlights = createAsyncThunk<
  Spotlight[],
  void,
  { rejectValue: string }
>("spotlight/fetchSpotlights", async (_, { rejectWithValue }) => {
  try {
    const response = await apiRequest("get", "/spotlights/", null, false);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch spotlights");
  }
});

export const fetchSpotlightById = createAsyncThunk<
  Spotlight,
  number,
  { rejectValue: string }
>("spotlight/fetchSpotlightById", async (id, { rejectWithValue }) => {
  try {
    const response = await apiRequest("get", `/spotlights/${id}/`, null, false);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch spotlight");
  }
});

export const createSpotlight = createAsyncThunk<
  Spotlight,
  Partial<Spotlight>,
  { rejectValue: string }
>("spotlight/createSpotlight", async (payload, { rejectWithValue }) => {
  console.log("payloadinside create Spotlight", payload)
  try {
    const response = await apiRequest("post", "/spotlights/", payload, false);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create spotlight");
  }
});

export const updateSpotlight = createAsyncThunk<
  Spotlight,
  { id: number; payload: Partial<Spotlight> },
  { rejectValue: string }
>("spotlight/updateSpotlight", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await apiRequest("put", `/spotlights/${id}/`, payload, false);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update spotlight");
  }
});

export const deleteSpotlight = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("spotlight/deleteSpotlight", async (id, { rejectWithValue }) => {
  try {
    await apiRequest("delete", `/spotlights/${id}/`, null, false);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete spotlight");
  }
});

const spotlightSlice = createSlice({
  name: "spotlight",
  initialState,
  reducers: {
    clearSpotlightState(state) {
      state.loading = false;
      state.selectedSpotlight = undefined;
      state.error = undefined;
      state.message = undefined;
    },
    setSelectedSpotlight(state, action) {
      state.selectedSpotlight = action.payload;
      state.mode = "edit";
    },
    setSpotlightModalOpen(state, action) {
      state.isModalOpen = action.payload;
      if (!action.payload) {
        state.selectedSpotlight = undefined;
        state.mode = "create";
      }
    },
    setSpotlightMode(state, action) {
      state.mode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpotlights.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchSpotlights.fulfilled, (state, action) => {
        state.loading = false;
        state.spotlights = action.payload;
      })
      .addCase(fetchSpotlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createSpotlight.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSpotlight.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Spotlight created successfully";
        state.spotlights.unshift(action.payload);
      })
      .addCase(createSpotlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateSpotlight.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSpotlight.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Spotlight updated successfully";
        state.spotlights = state.spotlights.map((s) =>
          s.id === action.payload.id ? action.payload : s
        );
        state.selectedSpotlight = action.payload;
      })
      .addCase(updateSpotlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteSpotlight.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSpotlight.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Spotlight deleted successfully";
        state.spotlights = state.spotlights.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteSpotlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectSpotlights = (state: RootState) => state.spotlight.spotlights;
export const selectSelectedSpotlight = (state: RootState) => state.spotlight.selectedSpotlight;
export const selectIsModalOpen = (state: RootState) => state.spotlight.isModalOpen;
export const selectSpotlightMode = (state: RootState) => state.spotlight.mode;
export const selectSpotlightLoading = (state: RootState) => state.spotlight.loading;
export const selectSpotlightMessage = (state: RootState) => state.spotlight.message;
export const selectSpotlightError = (state: RootState) => state.spotlight.error;

export const {
  clearSpotlightState,
  setSelectedSpotlight,
  setSpotlightModalOpen,
  setSpotlightMode,
} = spotlightSlice.actions;

export default spotlightSlice.reducer;
