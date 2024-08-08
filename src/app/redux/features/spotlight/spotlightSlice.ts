import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getRequest } from "../../hooks"; // Import the getRequest utility function
import { Spotlight } from "../../../interfaces";



interface SpotlightState {
  spotlights: Spotlight[];
  selectedSpotlight: Spotlight | null;
  error: string | null;
  loading: boolean;
}

const initialState: SpotlightState = {
  spotlights: [],
  selectedSpotlight: null,
  error: null,
  loading: false,
};

export const fetchSpotlights = createAsyncThunk<
  Spotlight[],
  void,
  { rejectValue: string }
>(
  'spotlights/fetchSpotlights',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest('https://theyellow.group/api/spotlight/getspotlight/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch spotlights");
    }
  }
);

export const fetchSpotlightById = createAsyncThunk<
  Spotlight,
  number,
  { rejectValue: string }
>(
  'spotlights/fetchSpotlightById',
  async (spotlightId, { rejectWithValue }) => {
    try {
      const response = await getRequest(`https://theyellow.group/api/spotlight/getspotlight/${spotlightId}/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch spotlight");
    }
  }
);

const spotlightSlice = createSlice({
  name: "spotlights",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpotlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpotlights.fulfilled, (state, action: PayloadAction<Spotlight[]>) => {
        state.spotlights = action.payload;
        state.loading = false;
      })
      .addCase(fetchSpotlights.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch spotlights";
        state.loading = false;
      })
      .addCase(fetchSpotlightById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedSpotlight = null;
      })
      .addCase(fetchSpotlightById.fulfilled, (state, action: PayloadAction<Spotlight>) => {
        state.selectedSpotlight = action.payload;
        state.loading = false;
      })
      .addCase(fetchSpotlightById.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch spotlight";
        state.loading = false;
      });
  },
});

export default spotlightSlice.reducer;
