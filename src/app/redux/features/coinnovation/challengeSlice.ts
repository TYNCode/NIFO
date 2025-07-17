import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiRequest } from "../../../utils/apiWrapper/apiRequest";
import axios from "axios";

interface Answer {
  assumed: string;
  actual: string | null;
}

interface Question {
  question: string;
  answer: Answer;
  isSelected?: boolean;
}

interface Category {
  questions: Question[];
}

export interface QuestionnaireData {
  categories: Record<string, Category>;
}

interface ChallengeState {
  questionnaireData: QuestionnaireData | null;
  jsonForDocument: Record<string, any> | null;
  activeDefineStepTab: string;
  loading: boolean;
  error: string | null;
  isPDDJsonGenerating: boolean;
  isDocxGenerating: boolean;
}

interface ChallengeApplication {
  id: number;
  challenge: number;
  challenge_title: string;
  startup: number;
  startup_email: string;
  applied_at: string;
}

interface ChallengeClarification {
  id: number;
  challenge: number;
  challenge_title: string;
  startup: number;
  startup_email: string;
  subject: string;
  query: string;
  sent_at: string;
}

interface ChallengeExtraState {
  applications: ChallengeApplication[];
  applicationsLoading: boolean;
  applicationsError: string | null;
  applyStatus: "idle" | "loading" | "succeeded" | "failed";
  applyError: string | null;
  clarificationStatus: "idle" | "loading" | "succeeded" | "failed";
  clarificationError: string | null;
}

const initialState: ChallengeState = {
  questionnaireData: null,
  jsonForDocument: null,
  activeDefineStepTab: "01.a",
  loading: false,
  error: null,
  isPDDJsonGenerating: false,
  isDocxGenerating: false,
};

const initialExtraState: ChallengeExtraState = {
  applications: [],
  applicationsLoading: false,
  applicationsError: null,
  applyStatus: "idle",
  applyError: null,
  clarificationStatus: "idle",
  clarificationError: null,
};

// ============ ASYNC THUNKS ============ //

export const generateQuestions = createAsyncThunk(
  "challenge/generateQuestions",
  async (
    {
      projectID,
      problemStatement,
      context,
    }: { projectID: string; problemStatement: string; context: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await apiRequest(
        "post",
        "coinnovation/generate-questions/",
        {
          project_id: projectID,
          problem_statement: problemStatement,
          context,
        },
        true
      );
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to generate questions");
    }
  }
);

export const fetchQuestionnaire = createAsyncThunk(
  "challenge/fetchQuestionnaire",
  async (
    {
      projectID,
      problemStatement,
      context,
    }: { 
      projectID: string; 
      problemStatement?: string; 
      context?: string; 
    },
    { rejectWithValue }
  ) => {
    try {
      // Use direct axios call for generate-questions endpoint
      const token = localStorage.getItem("jwtAccessToken");
      const headers: any = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      headers["Content-Type"] = "application/json";

      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseURL}coinnovation/generate-questions/`;
      
      const payload: any = {
        project_id: projectID,
      };

      // Only add problem_statement and context if they are provided
      if (problemStatement) {
        payload.problem_statement = problemStatement;
      }
      if (context) {
        payload.context = context;
      }

      const response = await axios.post(url, payload, { headers });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch questionnaire");
    }
  }
);

export const updateQuestionnaire = createAsyncThunk(
  "challenge/updateQuestionnaire",
  async (
    {
      projectID,
      updatedCategories,
    }: { projectID: string; updatedCategories: Record<string, Category> },
    { rejectWithValue }
  ) => {
    try {
      const res = await apiRequest(
        "put",
        "coinnovation/generate-questions/",
        {
          project_id: projectID,
          categories: updatedCategories,
        },
        true
      );
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to update questionnaire");
    }
  }
);

export const generatePDD = createAsyncThunk(
  "challenge/generatePDD",
  async (
    {
      projectID,
      problemStatement,
      context,
      questionnaire,
    }: {
      projectID: string;
      problemStatement: string;
      context: string;
      questionnaire: QuestionnaireData;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await apiRequest(
        "post",
        "/coinnovation/generate-challenge-document/",
        {
          project_id: projectID,
          problem_statement: problemStatement,
          context,
          categories: questionnaire,
        },
        true
      );
      return res.data.data.json;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to generate PDD");
    }
  }
);

export const updatePDD = createAsyncThunk(
  "challenge/updatePDD",
  async (
    {
      projectID,
      jsonForDocument,
    }: { projectID: string; jsonForDocument: Record<string, any> },
    { rejectWithValue }
  ) => {
    try {
      const res = await apiRequest(
        "put",
        "/coinnovation/generate-challenge-document/",
        {
          project_id: projectID,
          json: jsonForDocument,
        },
        true
      );
      return res.data.data.json;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to update PDD");
    }
  }
);

export const fetchChallengeDocument = createAsyncThunk(
  "challenge/fetchChallengeDocument",
  async (projectID: string, { rejectWithValue }) => {
    try {
      // Use direct axios call for generate-challenge-document endpoint
      const token = localStorage.getItem("jwtAccessToken");
      const headers: any = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseURL}/coinnovation/generate-challenge-document/?project_id=${projectID}`;
      
      const response = await axios.get(url, { headers });
      return response.data.data?.json || null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch challenge document");
    }
  }
);

export const generateDocx = createAsyncThunk(
  "challenge/generateDocx",
  async (
    {
      projectID,
      projectName,
      owner,
      approver,
      category,
      businessUnit,
      location,
      department,
      jsonData,
    }: {
      projectID: string;
      projectName?: string;
      owner?: string;
      approver?: string;
      category?: string;
      businessUnit?: string;
      location?: string;
      department?: string;
      jsonData?: Record<string, any>;
    },
    { rejectWithValue }
  ) => {
    try {
      // Use direct axios call for generate-docx endpoint
      const token = localStorage.getItem("jwtAccessToken");
      const headers: any = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      headers["Content-Type"] = "application/json";

      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseURL}/coinnovation/generate-docx/`;
      
      const payload = {
        project_id: projectID,
        project_name: projectName || "Untitled Project",
        owner: owner || "N/A",
        approver: approver || "N/A",
        category: category || "N/A",
        business_unit: businessUnit || "N/A",
        location: location || "N/A",
        department: department || "N/A",
        ...(jsonData && { final_document: jsonData }),
      };

      const response = await axios.post(url, payload, { 
        headers,
        responseType: "blob"
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to generate DOCX");
    }
  }
);

// ============ CHALLENGE APPLICATIONS ============ //

export const fetchChallengeApplications = createAsyncThunk(
  "challenge/fetchChallengeApplications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest(
        "get",
        "/coinnovation/challenge-applications/",
        undefined,
        true
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch challenge applications"
      );
    }
  }
);

export const applyToChallenge = createAsyncThunk(
  "challenge/applyToChallenge",
  async (
    { challengeId }: { challengeId: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await apiRequest(
        "post",
        "/coinnovation/challenge-applications/",
        { challenge: challengeId },
        true
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to apply to challenge"
      );
    }
  }
);

// ============ CHALLENGE CLARIFICATIONS ============ //

export const sendClarification = createAsyncThunk(
  "challenge/sendClarification",
  async (
    {
      challengeId,
      subject,
      query,
    }: { challengeId: number; subject: string; query: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await apiRequest(
        "post",
        "/coinnovation/challenge-clarifications/",
        {
          challenge: challengeId,
          subject,
          query,
        },
        true
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to send clarification"
      );
    }
  }
);

// ============ SLICE ============ //

const challengeSlice = createSlice({
  name: "challenge",
  initialState: {
    ...initialState,
    ...initialExtraState,
  },
  reducers: {
    setQuestionnaireData: (state, action: PayloadAction<QuestionnaireData>) => {
      state.questionnaireData = action.payload;
    },
    setJsonForDocument: (state, action: PayloadAction<Record<string, any>>) => {
      state.jsonForDocument = action.payload;
    },
    resetChallenge: (state) => {
      state.questionnaireData = null;
      state.jsonForDocument = null;
      state.loading = false;
      state.error = null;
      state.isPDDJsonGenerating = false;
      state.isDocxGenerating = false;
      state.activeDefineStepTab = "01.a";
    },
    setActiveDefineStepTab: (state, action: PayloadAction<string>) => {
      state.activeDefineStepTab = action.payload;
    },
    setIsPDDJsonGenerating: (state, action: PayloadAction<boolean>) => {
      state.isPDDJsonGenerating = action.payload;
    },
    setIsDocxGenerating: (state, action: PayloadAction<boolean>) => {
      state.isDocxGenerating = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questionnaireData = action.payload;
      })
      .addCase(generateQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchQuestionnaire.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionnaire.fulfilled, (state, action) => {
        state.loading = false;
        state.questionnaireData = action.payload;
      })
      .addCase(fetchQuestionnaire.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateQuestionnaire.fulfilled, (state, action) => {
        state.questionnaireData = action.payload;
      })

      .addCase(generatePDD.pending, (state) => {
        state.isPDDJsonGenerating = true;
      })
      .addCase(generatePDD.fulfilled, (state, action) => {
        state.isPDDJsonGenerating = false;
        state.jsonForDocument = action.payload;
      })
      .addCase(generatePDD.rejected, (state, action) => {
        state.isPDDJsonGenerating = false;
        state.error = action.payload as string;
      })

      .addCase(updatePDD.fulfilled, (state, action) => {
        state.jsonForDocument = action.payload;
      })

      .addCase(fetchChallengeDocument.fulfilled, (state, action) => {
        state.jsonForDocument = action.payload;
      })

      .addCase(generateDocx.pending, (state) => {
        state.isDocxGenerating = true;
        state.error = null;
      })
      .addCase(generateDocx.fulfilled, (state, action) => {
        state.isDocxGenerating = false;
        // The action.payload contains the blob data for download
      })
      .addCase(generateDocx.rejected, (state, action) => {
        state.isDocxGenerating = false;
        state.error = action.payload as string;
      })

      // Challenge Applications
      .addCase(fetchChallengeApplications.pending, (state) => {
        state.applicationsLoading = true;
        state.applicationsError = null;
      })
      .addCase(fetchChallengeApplications.fulfilled, (state, action) => {
        state.applicationsLoading = false;
        state.applications = action.payload;
      })
      .addCase(fetchChallengeApplications.rejected, (state, action) => {
        state.applicationsLoading = false;
        state.applicationsError = action.payload as string;
      })
      // Apply to Challenge
      .addCase(applyToChallenge.pending, (state) => {
        state.applyStatus = "loading";
        state.applyError = null;
      })
      .addCase(applyToChallenge.fulfilled, (state, action) => {
        state.applyStatus = "succeeded";
        state.applications.push(action.payload);
      })
      .addCase(applyToChallenge.rejected, (state, action) => {
        state.applyStatus = "failed";
        state.applyError = action.payload as string;
      })
      // Send Clarification
      .addCase(sendClarification.pending, (state) => {
        state.clarificationStatus = "loading";
        state.clarificationError = null;
      })
      .addCase(sendClarification.fulfilled, (state) => {
        state.clarificationStatus = "succeeded";
      })
      .addCase(sendClarification.rejected, (state, action) => {
        state.clarificationStatus = "failed";
        state.clarificationError = action.payload as string;
      });
  },
});

export const {
  setQuestionnaireData,
  setJsonForDocument,
  resetChallenge,
  setActiveDefineStepTab,
  setIsPDDJsonGenerating,
  setIsDocxGenerating,
} = challengeSlice.actions;

export default challengeSlice.reducer;
