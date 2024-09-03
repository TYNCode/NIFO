import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getRequest,
  getRequestWithAccessToken,
  postRequest,
  postRequestWithAccessToken,
} from "../../hooks"; // Import the request utility functions

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
  user: number;
  consultant_email: string;
  query: string;
  request_status: string;
  created_at: string;
  updated_at: string;
  requested_org: number;
}

interface PartnerConnectState {
  connections: PartnerConnectResponse[];
  selectedConnection: PartnerConnectResponse | null;
  error: string | null;
  loading: boolean;
  successMessage: string | null;
  connectionStatuses: { [startupId: number]: ConnectionStatus };
}

const initialState: PartnerConnectState = {
  connections: [],
  selectedConnection: null,
  error: null,
  loading: false,
  successMessage: null,
  connectionStatuses: {},
};

export const createPartnerConnect = createAsyncThunk<
  PartnerConnectResponse,
  PartnerConnectPayload,
  { rejectValue: string }
>(
  "partnerConnect/createPartnerConnect",
  async (payload, { rejectWithValue }) => {
    console.log("PAYLOAD", payload);
    try {
      const response = await postRequestWithAccessToken(
        "https://nifo.theyellow.network/api/partnerconnect/connects/",
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

export const fetchPartnerConnects = createAsyncThunk<
  PartnerConnectResponse[],
  void,
  { rejectValue: string }
>("partnerConnect/fetchPartnerConnects", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequestWithAccessToken(
      "https://nifo.theyellow.network/api/partnerconnect/connects/"
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch partner connects"
    );
  }
});

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
      .addCase(createPartnerConnect.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        createPartnerConnect.fulfilled,
        (state, action: PayloadAction<PartnerConnectResponse>) => {
          state.connections.push(action.payload);
          state.loading = false;
          state.successMessage = "Partner connect created successfully";
        }
      )
      .addCase(createPartnerConnect.rejected, (state, action) => {
        state.error = action.payload || "Failed to create partner connect";
        state.loading = false;
      })
      .addCase(fetchPartnerConnects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPartnerConnects.fulfilled,
        (state, action: PayloadAction<PartnerConnectResponse[]>) => {
          state.connections = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchPartnerConnects.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch partner connects";
        state.loading = false;
      })
      .addCase(fetchPartnerConnectsByOrg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPartnerConnectsByOrg.fulfilled,
        (state, action: PayloadAction<PartnerConnectResponse[]>) => {
          state.connections = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchPartnerConnectsByOrg.rejected, (state, action) => {
        state.error =
          action.payload || "Failed to fetch partner connects by org";
        state.loading = false;
      });
  },
});

export const { setConnectionStatus } = partnerConnectSlice.actions;
export default partnerConnectSlice.reducer;
