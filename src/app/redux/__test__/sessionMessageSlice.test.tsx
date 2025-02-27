import { configureStore } from "@reduxjs/toolkit";
import sessionMessageReducer, { fetchSessionMessages } from "../features/chat/sessionMessageSlice"; // Adjust the path if necessary
import { StartupType } from "../../interfaces"; // Adjust the path as needed
import axios from "axios"; // Import axios directly for mocking
// import mockConversations from "./mockConversation";

jest.mock("axios"); // Mock axios module
const mockedAxios = axios as jest.Mocked<typeof axios>; // Type the mock to access mockResolvedValueOnce

describe("sessionMessageSlice", () => {
  const initialState = {
    loading: false,
    conversations: [],
    error: null,
  };

  const mockConversations = [
    {
      question:
        "Can you provide companies which will help in Real-time quality monitoring of water at every process step",
      response: {
        success: true,
        category: "direct user query",
        response:
          "Here are several companies that specialize in real-time quality monitoring of water across various process steps:",
        startups: [
          {
            name: "KarIOT",
            description: "A cool startup",
            database_info: { /* Add the appropriate StartupType data here */ },
          },
        ],
      },
    },
  ];

  // Test initial state
  test("should return the initial state", () => {
    expect(sessionMessageReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  // Test fetchSessionMessages.pending action
  test("should handle fetchSessionMessages.pending", () => {
    const state = sessionMessageReducer(initialState, fetchSessionMessages.pending("", ""));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  // Test fetchSessionMessages.fulfilled action (successful response)
  test("should handle fetchSessionMessages.fulfilled", () => {
    const action = { type: fetchSessionMessages.fulfilled.type, payload: mockConversations };
    const state = sessionMessageReducer(initialState, action);
    
    expect(state.conversations).toEqual(mockConversations);
    expect(state.loading).toBe(false);
  });

  // Test fetchSessionMessages.rejected action (failed response)
  test("should handle fetchSessionMessages.rejected", () => {
    const errorMessage = "Failed to fetch session messages";
    const action = { type: fetchSessionMessages.rejected.type, payload: errorMessage };
    const state = sessionMessageReducer(initialState, action);

    expect(state.error).toBe(errorMessage);
    expect(state.loading).toBe(false);
  });

  // Test the async thunk (fetchSessionMessages)
  test("should dispatch fetchSessionMessages and handle successful response", async () => {
    const mockResponseData = { data: { conversations: mockConversations } };
    mockedAxios.post.mockResolvedValueOnce(mockResponseData); // Mocking resolved response

    const store = configureStore({ reducer: { sessionMessage: sessionMessageReducer } });

    await store.dispatch(fetchSessionMessages("123"));


    const state = store.getState().sessionMessage;

    // Check if the state is updated with the conversations data
    expect(state.conversations).toEqual(mockConversations);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test("should dispatch fetchSessionMessages and handle failed response", async () => {
    const errorMessage = "Error in fetching conversations using session";
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    const store = configureStore({ reducer: { sessionMessage: sessionMessageReducer } });

    await store.dispatch(fetchSessionMessages("123"));

    const state = store.getState().sessionMessage;

    // Check if the state is updated with the error message
    expect(state.error).toBe(errorMessage);
    expect(state.loading).toBe(false);
  });
});
