import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Types
export interface StoredFile {
  id: number;
  original_name: string;
  name: string;
  url: string;
}

interface UploadResponse {
  files?: StoredFile[];
  problem_statement?: string;
}

interface FileState {
  storedFiles: StoredFile[];
  loading: boolean;
  uploading: boolean;
  deleting: boolean;
  error: string | null;
  problemStatementFromFile: string | null;
}

const initialState: FileState = {
  storedFiles: [],
  loading: false,
  uploading: false,
  deleting: false,
  error: null,
  problemStatementFromFile: null,
};

// Constants
const BASE_URL = "https://tyn-server.azurewebsites.net/";

// Thunks

export const fetchProjectFiles = createAsyncThunk<StoredFile[], string>(
  "file/fetchProjectFiles",
  async (projectID, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/coinnovation/create-project/?project_id=${projectID}`);
      const files = response.data?.files || [];

      const formatted = files.map((file: any) => ({
        id: file.id,
        original_name: file.original_name || decodeURIComponent(file.file.split("/").pop()),
        name: file.original_name || decodeURIComponent(file.file.split("/").pop()),
        url: `${BASE_URL}${file.file}`,
      }));

      return formatted;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch files.");
    }
  }
);

export const uploadProjectFiles = createAsyncThunk<
  UploadResponse,
  { files: File[]; projectID?: string; problemStatement?: string }
>(
  "file/uploadProjectFiles",
  async ({ files, projectID, problemStatement }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));
      if (projectID) formData.append("project_id", projectID);
      if (problemStatement) formData.append("text", problemStatement); // ✅ Send the text

      const response = await axios.post(`${BASE_URL}/coinnovation/upload-file/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploaded = response.data?.files || [];

      const formatted = uploaded.map((file: any) => ({
        id: file.id,
        original_name: file.original_name || decodeURIComponent(file.file.split("/").pop()),
        name: file.original_name || decodeURIComponent(file.file.split("/").pop()),
        url: `${BASE_URL}${file.file}`,
      }));

      return {
        files: formatted,
        problem_statement: response.data?.problem_statement || null,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to upload files.");
    }
  }
);


export const deleteProjectFile = createAsyncThunk<number, number>(
  "file/deleteProjectFile",
  async (fileId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/coinnovation/delete-file/?file_id=${fileId}`);
      return fileId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete file.");
    }
  }
);

// Slice
const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    clearFiles: (state) => {
      state.storedFiles = [];
      state.problemStatementFromFile = null;
      state.loading = false;
      state.uploading = false;
      state.deleting = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProjectFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectFiles.fulfilled, (state, action: PayloadAction<StoredFile[]>) => {
        state.storedFiles = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjectFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Upload
      .addCase(uploadProjectFiles.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadProjectFiles.fulfilled, (state, action: PayloadAction<UploadResponse>) => {
        state.storedFiles = [...state.storedFiles, ...(action.payload.files || [])];
        state.problemStatementFromFile = action.payload.problem_statement || null;
        state.uploading = false;
      })
      .addCase(uploadProjectFiles.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteProjectFile.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteProjectFile.fulfilled, (state, action: PayloadAction<number>) => {
        state.storedFiles = state.storedFiles.filter((file) => file.id !== action.payload);
        state.deleting = false;
      })
      .addCase(deleteProjectFile.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFiles } = fileSlice.actions;
export default fileSlice.reducer;
