import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatHistoryResponse, Session } from "../../interfaces";
import { getRequestWithAccessToken } from "../hooks";

export interface ChatHistoryState {
  history: Session[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatHistoryState = {
  history: [],
  loading: false,
  error: null,
};

export const fetchChatHistory = createAsyncThunk(
  "chatHistory/fetchChatHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequestWithAccessToken(
        "https://theyellow.group/api/prompt/session/"
      );
      const data = response.data;

      // Transform the data to fit the Session interface
      const formattedData: Session[] = data.map(
        (session: ChatHistoryResponse) => ({
          id: session.id,
          session_id: session.session_id,
          created_time: session.created_time,
          messages: session.messages.map((message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
            created_time: message.created_time,
            session: message.session,
          })),
        })
      );

      return formattedData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching query history"
      );
    }
  }
);

const chatHistorySlice = createSlice({
  name: "chatHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchChatHistory.fulfilled,
        (state, action: PayloadAction<Session[]>) => {
          state.history = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchChatHistory.rejected,
        (state, action: PayloadAction<any>) => {
          state.error = action.payload;
          state.loading = false;
        }
      );
  },
});

export default chatHistorySlice.reducer;
