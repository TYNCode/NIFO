import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { apiRequest } from "../../../utils/apiWrapper/apiRequest";

// Types
export interface ChatMessage {
  question: string;
  response: string;
}

export interface ChatSession {
  id: string;
  session_id: string;
  created_time: string;
  messages: ChatMessage[];
}

export interface ChatState {
  sessionId: string;
  messages: ChatMessage[];
  userInfo: any;
  selectedStartup: any;
  mailMessage: any;
  queryData: any;
  loading: boolean;
  error: string | null;
  sessions: ChatSession[];
}

const initialState: ChatState = {
  sessionId: "",
  messages: [],
  userInfo: null,
  selectedStartup: null,
  mailMessage: null,
  queryData: null,
  loading: false,
  error: null,
  sessions: [],
};

// Async thunk for sending a prompt to /prompts/chat/
export const sendPrompt = createAsyncThunk<
  { question: string; response: string },
  { input: string; sessionId: string; token: string },
  { rejectValue: string }
>(
  "chat/sendPrompt",
  async ({ input, sessionId, token }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        "post",
        "/prompts/chat/",
        { input, session_id: sessionId },
        true // usePrivate, so Authorization header is set
      );
      return { question: input, response: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to send prompt");
    }
  }
);

// Async thunk for fetching all chat sessions
export const fetchChatSessions = createAsyncThunk<
  ChatSession[],
  void,
  { rejectValue: string }
>(
  "chat/fetchChatSessions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("get", "/prompt/sessions/", {}, true);
      // Format sessions and messages
      const data = response.data;
      const formattedData: ChatSession[] = data.map((session: any) => ({
        id: session.id,
        session_id: session.session_id,
        created_time: session.created_time,
        messages: session.conversations.map((message: any) => ({
          question: message.role === "user" ? message.message : "",
          response: message.role === "assistant" ? message.message : "",
        })),
      }));
      return formattedData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error fetching chat sessions");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
    },
    setSelectedStartup: (state, action: PayloadAction<any>) => {
      state.selectedStartup = action.payload;
    },
    setMailMessage: (state, action: PayloadAction<any>) => {
      state.mailMessage = action.payload;
    },
    setQueryData: (state, action: PayloadAction<any>) => {
      state.queryData = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addMessage: (state, action: PayloadAction<{ question: string; response: string }>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<{ question: string; response: string }>) => {
      const idx = state.messages.findIndex(m => m.question === action.payload.question);
      if (idx !== -1) state.messages[idx].response = action.payload.response;
    },
    clearChatState: (state) => {
      state.sessionId = "";
      state.messages = [];
      state.selectedStartup = null;
      state.mailMessage = null;
      state.queryData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendPrompt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPrompt.fulfilled, (state, action) => {
        state.loading = false;
        // Find the last message with response: 'Loading' and update it
        const idx = [...state.messages].reverse().findIndex(m => m.response === "Loading");
        if (idx !== -1) {
          // idx is from the end, so convert to forward index
          const forwardIdx = state.messages.length - 1 - idx;
          state.messages[forwardIdx].response = action.payload.response;
        } else {
          // fallback: just add the message
          state.messages.push({
            question: action.payload.question,
            response: action.payload.response,
          });
        }
      })
      .addCase(sendPrompt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send prompt";
      })
      .addCase(fetchChatSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchChatSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch chat sessions";
      });
  },
});

export const {
  setSessionId,
  setUserInfo,
  setSelectedStartup,
  setMailMessage,
  setQueryData,
  clearMessages,
  addMessage,
  updateMessage,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer; 