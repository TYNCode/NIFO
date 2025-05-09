import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StartupType } from "../../../interfaces";
import {
  getRequestWithAccessToken,
  deleteRequestWithAccessToken,
} from "../../hooks";

// --- Types ---
interface ChatResponseType {
  success: boolean;
  category: string;
  response: string;
  startups: Array<{
    name: string;
    description: string;
    database_info: StartupType;
  }>;
}

interface ConversationType {
  question: string;
  response: ChatResponseType;
}

interface SingleSessionDetail {
  session_id: string;
  user: number;
  created_time: string;
  conversations: {
    role: string;
    message: string;
    created_time: string;
  }[];
}

export interface SessionMessageState {
  loading: boolean;
  conversations: ConversationType[];
  allSessions: SingleSessionDetail[];
  singleSession: SingleSessionDetail | null;
  error: string | null;
}

const initialState: SessionMessageState = {
  loading: false,
  conversations: [],
  allSessions: [],
  singleSession: null,
  error: null,
};

// --- Async Thunks ---

export const fetchConversationsBySessionId = createAsyncThunk<
  ConversationType[],
  string,
  { rejectValue: string }
>(
  "sessionMessages/fetchConversationsBySessionId",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getRequestWithAccessToken(
        `https://tyn-server.azurewebsites.net/prompt/convo/${id}/`
      );
      return response.data.conversations;
    } catch (error: unknown) {
      const err = error as any;
      return rejectWithValue(
        err.response?.data || "Error fetching conversations"
      );
    }
  }
);

export const fetchAllSessions = createAsyncThunk<
  SingleSessionDetail[], 
  void,
  { rejectValue: string }
>("sessionMessages/fetchAllSessions", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequestWithAccessToken(
      `https://tyn-server.azurewebsites.net/prompt/sessions/`
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as any;
    return rejectWithValue(err.response?.data || "Error fetching sessions");
  }
});

export const fetchSingleSession = createAsyncThunk<
  SingleSessionDetail,
  string,
  { rejectValue: string }
>("sessionMessages/fetchSingleSession", async (id, { rejectWithValue }) => {
  try {
    const response = await getRequestWithAccessToken(
      `https://tyn-server.azurewebsites.net/prompt/sessions/${id}/`
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as any;
    return rejectWithValue(err.response?.data || "Error fetching session");
  }
});

export const deleteSessionById = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("sessionMessages/deleteSessionById", async (id, { rejectWithValue }) => {
  try {
    await deleteRequestWithAccessToken(
      `https://tyn-server.azurewebsites.net/prompt/sessions/${id}/delete/`
    );
    return id;
  } catch (error: unknown) {
    const err = error as any;
    return rejectWithValue(err.response?.data || "Failed to delete session");
  }
});

// --- Slice ---
const sessionMessageSlice = createSlice({
  name: "sessionMessage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversationsBySessionId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationsBySessionId.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.loading = false;
      })
      .addCase(fetchConversationsBySessionId.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch conversations";
        state.loading = false;
      })

      // Fetch All Sessions
      .addCase(fetchAllSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSessions.fulfilled, (state, action) => {
        state.allSessions = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllSessions.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch all sessions";
        state.loading = false;
      })

      // Fetch Single Session
      .addCase(fetchSingleSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleSession.fulfilled, (state, action) => {
        state.singleSession = action.payload;
        state.loading = false;
      })
      .addCase(fetchSingleSession.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch session";
        state.loading = false;
      })

      // Delete Session
      .addCase(deleteSessionById.fulfilled, (state, action) => {
        state.allSessions = state.allSessions.filter(
          (session) => session.session_id !== action.payload
        );
      })
      .addCase(deleteSessionById.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete session";
      });
  },
});

export default sessionMessageSlice.reducer;
