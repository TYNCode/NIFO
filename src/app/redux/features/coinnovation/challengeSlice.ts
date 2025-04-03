import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

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
}

const initialState: ChallengeState = {
  questionnaireData: null,
  jsonForDocument: null,
  activeDefineStepTab: '01.a',
  loading: false,
  error: null,
  isPDDJsonGenerating: false,
};

// ============ ASYNC THUNKS ============ //

export const generateQuestions = createAsyncThunk(
  'challenge/generateQuestions',
  async (
    {
      projectID,
      problemStatement,
      context,
    }: { projectID: string; problemStatement: string; context: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post('https://tyn-server.azurewebsites.net/coinnovation/generate-questions/', {
        project_id: projectID,
        problem_statement: problemStatement,
        context,
      });
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to generate questions');
    }
  }
);

export const updateQuestionnaire = createAsyncThunk(
  'challenge/updateQuestionnaire',
  async (
    { projectID, updatedCategories }: { projectID: string; updatedCategories: Record<string, Category> },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put('https://tyn-server.azurewebsites.net/coinnovation/generate-questions/', {
        project_id: projectID,
        categories: updatedCategories,
      });
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update questionnaire');
    }
  }
);

export const generatePDD = createAsyncThunk(
  'challenge/generatePDD',
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
      const res = await axios.post('https://tyn-server.azurewebsites.net/coinnovation/generate-challenge-document/', {
        project_id: projectID,
        problem_statement: problemStatement,
        context,
        categories: questionnaire,
      });
      return res.data.data.json;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to generate PDD');
    }
  }
);

// ============ SLICE ============ //

const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
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
    },
    setActiveDefineStepTab: (state, action: PayloadAction<string>) => {
      state.activeDefineStepTab = action.payload;
    },
    setIsPDDJsonGenerating: (state, action: PayloadAction<boolean>) => {
      state.isPDDJsonGenerating = action.payload;
    },

    updateJsonSection: (
      state,
      action: PayloadAction<{ section: string; key: string; value: string[] | { Title: string; Description: string }[] }>
    ) => {
      const { section, key, value } = action.payload;
      if (!state.jsonForDocument || !state.jsonForDocument[section]) return;
      const sectionData = state.jsonForDocument[section];

      if (Array.isArray(sectionData)) {
        const itemIndex = sectionData.findIndex((item: any) => item[key] !== undefined);
        if (itemIndex !== -1) {
          sectionData[itemIndex][key] = value;
        } else {
          sectionData.push({ [key]: value });
        }
      } else {
        state.jsonForDocument[section][key] = value;
      }
    },

    updateKpiTableCell: (
      state,
      action: PayloadAction<{ column: string; rowIndex: number; value: string }>
    ) => {
      const { column, rowIndex, value } = action.payload;
      if (
        state.jsonForDocument &&
        state.jsonForDocument['Operational KPI Metrics Table'] &&
        state.jsonForDocument['Operational KPI Metrics Table'][column]
      ) {
        state.jsonForDocument['Operational KPI Metrics Table'][column][rowIndex] = value;
      }
    },
    addKpiRow: (state) => {
      const table = state.jsonForDocument?.['Operational KPI Metrics Table'];
      if (!table) return;

      const metricKeys = Object.keys(table);
      const numRows = table[metricKeys[0]]?.length || 0;

      const isLastRowEmpty = metricKeys.some((key) => table[key][numRows - 1] === '');
      if (numRows === 0 || !isLastRowEmpty) {
        metricKeys.forEach((key) => {
          table[key].push('');
        });
      }
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
      });
  },
});

export const {
  setQuestionnaireData,
  setJsonForDocument,
  resetChallenge,
  setActiveDefineStepTab,
  setIsPDDJsonGenerating,
  updateJsonSection,
  updateKpiTableCell,
  addKpiRow,
} = challengeSlice.actions;

export default challengeSlice.reducer;
