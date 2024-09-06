import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getRequestWithAccessToken,
  postRequestWithAccessToken,
  patchRequestWithAccessToken,
} from "../../hooks";

export type ConnectionStatus =
  | "requested"
  | "rejected"
  | "connected"
  | "Connect";

interface PartnerConnectPayload {
  consultant_email: string;
  query: string;
  request_status: string;
  requested_org: number;
}

interface PartnerConnectResponse {
  id: number;
  user: {
    id: number;
    first_name: string;
    email: string;
    organization: {
      startup_id: number;
      startup_name: string;
    };
  };
  query: string;
  request_status: string;
  created_at: string;
  updated_at: string;
  requested_org: {
    startup_id: number;
    startup_name: string;
  };
}

interface PartnerConnectState {
  connectionsMade: PartnerConnectResponse[];
  connectionsReceived: PartnerConnectResponse[];
  connectionsByOrg: PartnerConnectResponse[];
  selectedConnection: PartnerConnectResponse | null;
  error: string | null;
  loading: boolean;
  successMessage: string | null;
  connectionStatuses: { [startupId: number]: ConnectionStatus };
}

const initialState: PartnerConnectState = {
  connectionsMade: [],
  connectionsReceived: [],
  connectionsByOrg: [],
  selectedConnection: null,
  error: null,
  loading: false,
  successMessage: null,
  connectionStatuses: {},
};

export const fetchPartnerConnectsByOrg = createAsyncThunk<
  PartnerConnectResponse[],
  number,
  { rejectValue: string }
>(
  "partnerConnect/fetchPartnerConnectsByOrg",
  async (orgId, { rejectWithValue }) => {
    try {
      const response = await getRequestWithAccessToken(
        `https://nifo.theyellow.network/api/partnerconnect/connects/?requested_org=${orgId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch partner connects by org"
      );
    }
  }
);

export const fetchPartnerConnectsMade = createAsyncThunk<
  PartnerConnectResponse[],
  void,
  { rejectValue: string }
>("partnerConnect/fetchPartnerConnectsMade", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequestWithAccessToken(
      "https://nifo.theyellow.network/api/partnerconnect/connects/made/"
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch partner connects made"
    );
  }
});

export const fetchPartnerConnectsReceived = createAsyncThunk<
  PartnerConnectResponse[],
  void,
  { rejectValue: string }
>(
  "partnerConnect/fetchPartnerConnectsReceived",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequestWithAccessToken(
        "https://nifo.theyellow.network/api/partnerconnect/connects/received/"
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch partner connects received"
      );
    }
  }
);

export const createPartnerConnect = createAsyncThunk<
  PartnerConnectResponse,
  PartnerConnectPayload,
  { rejectValue: string }
>(
  "partnerConnect/createPartnerConnect",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await postRequestWithAccessToken(
        "https://nifo.theyellow.network/api/partnerconnect/connects/create-update/",
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create partner connect"
      );
    }
  }
);

export const updatePartnerConnectStatus = createAsyncThunk<
  PartnerConnectResponse,
  { id: number; request_status: string },
  { rejectValue: string }
>(
  "partnerConnect/updatePartnerConnectStatus",
  async ({ id, request_status }, { rejectWithValue }) => {
    try {
      const response = await patchRequestWithAccessToken(
        "https://nifo.theyellow.network/api/partnerconnect/connects/create-update/",
        { id, request_status }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update partner connect"
      );
    }
  }
);

const partnerConnectSlice = createSlice({
  name: "partnerConnect",
  initialState,
  reducers: {
    setConnectionStatus: (
      state,
      action: PayloadAction<{ startupId: number; status: ConnectionStatus }>
    ) => {
      const { startupId, status } = action.payload;
      state.connectionStatuses[startupId] = status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartnerConnectsMade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPartnerConnectsMade.fulfilled,
        (state, action: PayloadAction<PartnerConnectResponse[]>) => {
          state.connectionsMade = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchPartnerConnectsMade.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch partner connects made";
        state.loading = false;
      })

      .addCase(fetchPartnerConnectsReceived.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPartnerConnectsReceived.fulfilled,
        (state, action: PayloadAction<PartnerConnectResponse[]>) => {
          state.connectionsReceived = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchPartnerConnectsReceived.rejected, (state, action) => {
        state.error =
          action.payload || "Failed to fetch partner connects received";
        state.loading = false;
      })

      .addCase(fetchPartnerConnectsByOrg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPartnerConnectsByOrg.fulfilled,
        (state, action: PayloadAction<PartnerConnectResponse[]>) => {
          state.connectionsByOrg = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchPartnerConnectsByOrg.rejected, (state, action) => {
        state.error =
          action.payload || "Failed to fetch partner connects by org";
        state.loading = false;
      })

      .addCase(createPartnerConnect.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        createPartnerConnect.fulfilled,
        (state, action: PayloadAction<PartnerConnectResponse>) => {
          state.connectionsMade.push(action.payload);
          state.loading = false;
          state.successMessage = "Partner connect created successfully";
        }
      )
      .addCase(createPartnerConnect.rejected, (state, action) => {
        state.error = action.payload || "Failed to create partner connect";
        state.loading = false;
      })

      // Handle updating connection status
      .addCase(updatePartnerConnectStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updatePartnerConnectStatus.fulfilled,
        (state, action: PayloadAction<PartnerConnectResponse>) => {
          const index = state.connectionsMade.findIndex(
            (connection) => connection.id === action.payload.id
          );
          if (index !== -1) {
            state.connectionsMade[index] = action.payload;
          }
          state.loading = false;
          state.successMessage = "Connection status updated successfully";
        }
      )
      .addCase(updatePartnerConnectStatus.rejected, (state, action) => {
        console.error(
          "updatePartnerConnectStatusSlice Rejected",
          action.payload
        );
        state.error =
          action.payload || "Failed to update partner connect status";
        state.loading = false;
      });
  },
});

export const { setConnectionStatus } = partnerConnectSlice.actions;
export default partnerConnectSlice.reducer;
