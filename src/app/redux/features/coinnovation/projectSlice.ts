import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectData } from "../../../interfaces/coinnovation";
import { apiRequest } from "../../../utils/apiWrapper/apiRequest";
import axios from "axios";

interface ProjectState {
  projects: ProjectData[] | null;
  projectDetails: ProjectData | null;
  projectID: string | null;
  creating: boolean;
  fetching: boolean;
  saving: boolean;
  error: string | null;
  selectedTab: number;
  enabledSteps: number[];
  problemStatement: string | null;
  hasFetchedProjects: boolean;
}

const initialState: ProjectState = {
  projects: null,
  projectDetails: null,
  projectID: null,
  creating: false,
  fetching: false,
  saving: false,
  error: null,
  selectedTab: 1,
  enabledSteps: [1],
  problemStatement: null,
  hasFetchedProjects: false,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("get", "coinnovation/create-project/", {}, true);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch projects"
      );
    }
  }
);

export const fetchProjectDetails = createAsyncThunk(
  "projects/fetchProjectDetails",
  async (projectID: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest("get", `coinnovation/create-project/?project_id=${projectID}`, {}, true);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch project details"
      );
    }
  }
);

export const createOrUpdateProject = createAsyncThunk(
  "projects/createOrUpdateProject",
  async (
    {
      projectID,
      projectData,
    }: {
      projectID: string | null;
      projectData: ProjectData;
      mode: "describe" | "save";
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      Object.entries(projectData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });

      // Use direct axios call for create-project endpoint to handle FormData properly
      const token = localStorage.getItem("jwtAccessToken");
      const headers: any = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      // Don't set Content-Type for FormData - let browser set it automatically

      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseURL}coinnovation/create-project/`;
      
      const response = projectID
        ? await axios.put(url, formData, { headers })
        : await axios.post(url, formData, { headers });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create/update project"
      );
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
    enableStep: (state, action: PayloadAction<number>) => {
        if(!state.enabledSteps.includes(action.payload)) {
          state.enabledSteps.push(action.payload)
        }
    },
    setProblemStatement: (state, action: PayloadAction<string | null>) => {
      state.problemStatement = action.payload;
    },
    clearProjectState: (state) => {
      Object.assign(state, initialState);
    },
    updateProjectField: (
      state,
      action: PayloadAction<{ key: string; value: any }>
    ) => {
      if (state.projectDetails) {
        (state.projectDetails as any)[action.payload.key] =
          action.payload.value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.fetching = true;
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<ProjectData[]>) => {
          state.projects = action.payload;
          state.fetching = false;
          state.hasFetchedProjects = true;
        }
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProjectDetails.pending, (state) => {
        state.fetching = true;
        state.error = null;
      })
      .addCase(
        fetchProjectDetails.fulfilled,
        (state, action: PayloadAction<ProjectData>) => {
          state.projectDetails = action.payload;
          state.problemStatement = action.payload.problem_statement || "";
          state.fetching = false;
          // Use backend-provided progress
          state.enabledSteps = action.payload.completed_steps || [1];
          // Optionally, expose last_active_define_step_tab for substep restore logic
          // (handled in challengeSlice or component as needed)
        }
      )
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.payload as string;
      })
      .addCase(createOrUpdateProject.pending, (state, action) => {
        const mode = action.meta.arg.mode;
        if (mode === "describe") state.creating = true;
        if (mode === "save") state.saving = true;
      })
      .addCase(
        createOrUpdateProject.fulfilled,
        (state, action: PayloadAction<ProjectData>) => {
          state.projectDetails = action.payload;
          state.saving = false;
          state.creating = false;
        }
      )
      .addCase(createOrUpdateProject.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
        state.creating = false;
      });
  },
});

export const {
  setProjectID,
  setSelectedTab,
  enableStep,
  clearProjectState,
  setProblemStatement,
  updateProjectField,
} = projectSlice.actions;

export default projectSlice.reducer;
