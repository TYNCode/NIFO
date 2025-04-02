import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectData } from "../../../interfaces/coinnovation";
import axios from "axios";

interface ProjectState {
  projects: ProjectData[];
  projectDetails: ProjectData | null;
  projectID: string | null;
  fetching: boolean;
  saving: boolean;
  error: string | null;
  selectedTab: number;
  problemStatement: string | null;
}

const initialState: ProjectState = {
  projects: [],
  projectDetails: null,
  projectID: null,
  fetching: false,
  saving: false,
  error: null,
  selectedTab: 1,
  problemStatement: null,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://tyn-server.azurewebsites.net/coinnovation/create-project/");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch projects");
    }
  }
);

export const fetchProjectDetails = createAsyncThunk(
  "projects/fetchProjectDetails",
  async (projectID: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://tyn-server.azurewebsites.net/coinnovation/create-project/?project_id=${projectID}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch project details");
    }
  }
);

export const createOrUpdateProject = createAsyncThunk(
  "projects/createOrUpdateProject",
  async (
    { projectID, projectData }: { projectID: string | null; projectData: ProjectData },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      Object.entries(projectData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = projectID
        ? await axios.put("https://tyn-server.azurewebsites.net/coinnovation/create-project/", formData)
        : await axios.post("https://tyn-server.azurewebsites.net/coinnovation/create-project/", formData);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create/update project");
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjectID: (state, action: PayloadAction<string | null>) => {
      state.projectID = action.payload;
    },
    setSelectedTab: (state, action: PayloadAction<number>) => {
      state.selectedTab = action.payload;
    },
    setProblemStatement: (state, action: PayloadAction<string | null>) => {
      state.problemStatement = action.payload;
    },
    clearProjectState: (state) => {
      Object.assign(state, initialState);
    },
    updateProjectField: (state, action: PayloadAction<{ key: string; value: any }>) => {
      if (state.projectDetails) {
        (state.projectDetails as any)[action.payload.key] = action.payload.value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.fetching = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<ProjectData[]>) => {
        state.projects = action.payload;
        state.fetching = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProjectDetails.pending, (state) => {
        state.fetching = true;
        state.error = null;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action: PayloadAction<ProjectData>) => {
        state.projectDetails = action.payload;
        state.problemStatement = action.payload.problem_statement || ""; // ✅ sync
        state.fetching = false;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.payload as string;
      })
      .addCase(createOrUpdateProject.pending, (state) => {
        state.saving = true;
      })
      .addCase(createOrUpdateProject.fulfilled, (state, action: PayloadAction<ProjectData>) => {
        state.projectDetails = action.payload;
        state.saving = false;
      })
      .addCase(createOrUpdateProject.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setProjectID,
  setSelectedTab,
  clearProjectState,
  setProblemStatement,
  updateProjectField
} = projectSlice.actions;

export default projectSlice.reducer;
