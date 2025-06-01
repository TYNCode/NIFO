import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiRequest } from "@/app/utils/apiWrapper/apiRequest";
import {
  StartupEditContext,
  StartupNameType,
  StartupType,
} from "@/app/admin/startups/types/company";

interface StartupState {
  loading: boolean;
  companies: StartupType[];
  company: StartupType | null;
  searchResults: StartupNameType[];
  selectedStartup: StartupEditContext | null;
  isModalOpen: boolean;
  mode: "edit" | "create";
  error?: string;
  message?: string;
  hasMore: boolean;
  searchHasMore: boolean;
  isSearchMode: boolean;
}

const initialState: StartupState = {
  loading: false,
  companies: [],
  company: null,
  searchResults: [],
  // searchCompanies: [],
  selectedStartup: null,
  isModalOpen: false,
  mode: "create",
  error: undefined,
  message: undefined,
  hasMore: true,
  searchHasMore: true,
  isSearchMode: false,
};

export const fetchCompaniesByPagination = createAsyncThunk<
  StartupType[],
  { page: number; page_size: number },
  { rejectValue: string }
>(
  "startup/fetchCompaniesByPagination",
  async ({ page, page_size }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        "get",
        `/company/view/?page=${page}&page_size=${page_size}`,
        null,
        false
      );
      console.log("response.data.results ----------->", response);
      return response.data.results;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch startups"
      );
    }
  }
);

export const fetchCompaniesBySearch = createAsyncThunk<
  StartupType[],
  { query: string; page: number; page_size: number },
  { rejectValue: string }
>(
  "startup/fetchCompaniesBySearch",
  async ({ query, page, page_size }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        "get",
        `/company/view/?search=${encodeURIComponent(query)}&page=${page}&page_size=${page_size}`,
        null,
        false
      );
      console.log("search companies by search", response.data.results)
      return response.data.results;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search startups"
      );
    }
  }
);

export const fetchStartupById = createAsyncThunk<
  StartupType,
  number,
  { rejectValue: string }
>("startup/fetchStartupById", async (id, { rejectWithValue }) => {
  try {
    const response = await apiRequest(
      "get",
      `/company/view/${id}/`,
      null,
      false
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch startup"
    );
  }
});

export const fetchStartupSearchSuggestions = createAsyncThunk<
  StartupNameType[],
  string,
  { rejectValue: string }
>(
  "startup/fetchStartupSearchSuggestions",
  async (query, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        "get",
        `/company/registration-search/?search=${encodeURIComponent(query)}`,
        null,
        false
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search startups"
      );
    }
  }
);

export const createStartup = createAsyncThunk<
  StartupType,
  Partial<StartupType>,
  { rejectValue: string }
>("startup/createStartup", async (payload, { rejectWithValue }) => {
  try {
    const response = await apiRequest("post", "/company/view/", payload, false);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create startup"
    );
  }
});

export const updateStartup = createAsyncThunk<
  StartupType,
  { id: number; payload: Partial<StartupType> },
  { rejectValue: string }
>("startup/updateStartup", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await apiRequest(
      "put",
      `/company/view/${id}/`,
      payload,
      false
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update startup"
    );
  }
});

export const deleteStartup = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("startup/deleteStartup", async (id, { rejectWithValue }) => {
  try {
    await apiRequest("delete", `/company/view/${id}/`, null, false);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete startup"
    );
  }
});

const mergeUniqueStartups = (
  oldList: StartupType[],
  newList: StartupType[]
): StartupType[] => {
  const map = new Map<number, StartupType>();
  oldList.forEach((item) => map.set(item.startup_id, item));
  newList.forEach((item) => map.set(item.startup_id, item));
  return Array.from(map.values());
};

const startupSlice = createSlice({
  name: "startup",
  initialState,
  reducers: {
    clearStartupState(state) {
      state.loading = false;
      state.error = undefined;
      state.message = undefined;
      state.selectedStartup = null;
      state.isModalOpen = false;
    },
    setStartupModalOpen(state, action: PayloadAction<boolean>) {
      state.isModalOpen = action.payload;
    },
    setSelectedStartup(
      state,
      action: PayloadAction<StartupEditContext | null>
    ) {
      state.selectedStartup = action.payload;
    },
    setStartupMode(state, action: PayloadAction<"edit" | "create">) {
      state.mode = action.payload;
    },
    setSearchMode(state, action: PayloadAction<boolean>) {
      state.isSearchMode = action.payload;
      if (!action.payload) {
        state.companies = [];
        state.searchResults = [];
        state.searchHasMore = true;
      }
    },
    clearSearchResults(state) {
      state.companies = [];
      state.searchResults = [];
      state.searchHasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompaniesByPagination.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchCompaniesByPagination.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.page === 1) {
          // First page: replace list
          state.companies = action.payload;
        } else {
          // Subsequent pages: append uniquely
          state.companies = mergeUniqueStartups(
            state.companies,
            action.payload
          );
        }
        state.hasMore = action.payload.length > 0;
      })
      .addCase(fetchCompaniesByPagination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCompaniesBySearch.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchCompaniesBySearch.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.page === 1) {
          state.companies = action.payload;
        } else {
          state.companies = mergeUniqueStartups(
            state.companies,
            action.payload
          );
        }
        state.searchHasMore = action.payload.length > 0;
      })
      .addCase(fetchCompaniesBySearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchStartupById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStartupById.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(fetchStartupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchStartupSearchSuggestions.pending, (state) => {
        // Don't set loading to true for suggestions as it interferes with main loading
        state.error = undefined;
      })
      .addCase(fetchStartupSearchSuggestions.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addCase(fetchStartupSearchSuggestions.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(createStartup.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createStartup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Startup created successfully";
        state.companies.push(action.payload);
      })
      .addCase(createStartup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateStartup.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateStartup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Startup updated successfully";
        const index = state.companies.findIndex(
          (s) => s.startup_id === action.payload.startup_id
        );
        if (index !== -1) state.companies[index] = action.payload;

        const searchIndex = state.companies.findIndex(
          (s) => s.startup_id === action.payload.startup_id
        );
        if (searchIndex !== -1)
          state.companies[searchIndex] = action.payload;
      })
      .addCase(updateStartup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteStartup.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(deleteStartup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Startup deleted";
        state.companies = state.companies.filter(
          (s) => s.startup_id !== action.payload
        );
        state.companies = state.companies.filter(
          (s) => s.startup_id !== action.payload
        );
      })
      .addCase(deleteStartup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearStartupState,
  setStartupModalOpen,
  setSelectedStartup,
  setStartupMode,
  setSearchMode,
  clearSearchResults,
} = startupSlice.actions;
export default startupSlice.reducer;
