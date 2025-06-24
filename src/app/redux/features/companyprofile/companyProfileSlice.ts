import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiRequest } from "@/app/utils/apiWrapper/apiRequest";

// Base Company Interface
interface BaseCompany {
  id: number;
  name: string;
  url: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  user_registration?: boolean;
}

// Startup-specific interface
interface StartupType extends BaseCompany {
  startup_id: number;
  startup_name: string;
  startup_url: string;
  startup_description?: string;
}

// Enterprise-specific interface
interface EnterpriseType extends BaseCompany {
  enterprise_id: number;
  enterprise_name: string;
  enterprise_url: string;
  enterprise_description?: string;
}

// Union type for companies
export type CompanyType = StartupType | EnterpriseType;

// Registration search results
interface CompanyNameType {
  startup_id?: number;
  startup_name?: string;
  enterprise_id?: number;
  enterprise_name?: string;
}

// Edit context
interface CompanyEditContext {
  id: number;
  name: string;
  url: string;
  description?: string;
  type: "startup" | "enterprise";
}

interface CompanyState {
  loading: boolean;
  companies: CompanyType[];
  company: CompanyType | null;
  searchResults: CompanyNameType[];
  selectedCompany: CompanyEditContext | null;
  isModalOpen: boolean;
  mode: "edit" | "create";
  companyType: "startup" | "enterprise";
  error?: string;
  message?: string;
  hasMore: boolean;
  searchHasMore: boolean;
  isSearchMode: boolean;
}

const initialState: CompanyState = {
  loading: false,
  companies: [],
  company: null,
  searchResults: [],
  selectedCompany: null,
  isModalOpen: false,
  mode: "create",
  companyType: "startup",
  error: undefined,
  message: undefined,
  hasMore: true,
  searchHasMore: true,
  isSearchMode: false,
};

// Helper function to get company ID based on type
const getCompanyId = (company: CompanyType): number => {
  return 'startup_id' in company ? company.startup_id : company.enterprise_id;
};

// Helper function to get company name based on type
const getCompanyName = (company: CompanyType): string => {
  return 'startup_name' in company ? company.startup_name : company.enterprise_name;
};

// Fetch companies with pagination
export const fetchCompaniesByPagination = createAsyncThunk<
  CompanyType[],
  { page: number; page_size: number; type: "startup" | "enterprise" },
  { rejectValue: string }
>(
  "company/fetchCompaniesByPagination",
  async ({ page, page_size, type }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        "get",
        `/companies/view/?page=${page}&page_size=${page_size}&type=${type}`,
        null,
        false
      );
      console.log("Fetch companies response:", response.data.results);
      return response.data.results;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch companies"
      );
    }
  }
);

// Search companies with pagination
export const fetchCompaniesBySearch = createAsyncThunk<
  CompanyType[],
  { query: string; page: number; page_size: number; type: "startup" | "enterprise" },
  { rejectValue: string }
>(
  "company/fetchCompaniesBySearch",
  async ({ query, page, page_size, type }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        "get",
        `/companies/view/?search=${encodeURIComponent(query)}&page=${page}&page_size=${page_size}&type=${type}`,
        null,
        false
      );
      console.log("Search companies response:", response.data.results);
      return response.data.results;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search companies"
      );
    }
  }
);

// Fetch single company by ID
export const fetchCompanyById = createAsyncThunk<
  CompanyType,
  { id: number; type: "startup" | "enterprise" },
  { rejectValue: string }
>("company/fetchCompanyById", async ({ id, type }, { rejectWithValue }) => {
  try {
    const response = await apiRequest(
      "get",
      `/companies/view/${id}/?type=${type}`,
      null,
      false
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch company"
    );
  }
});

// Fetch company search suggestions for registration (renamed from fetchStartupSearchSuggestions)
export const fetchCompanySearchSuggestions = createAsyncThunk<
  CompanyNameType[],
  { query: string; type: "startup" | "enterprise" },
  { rejectValue: string }
>(
  "company/fetchCompanySearchSuggestions",
  async ({ query, type }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        "get",
        `/companies/registration-search/?search=${encodeURIComponent(query)}&type=${type}`,
        null,
        false
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search companies"
      );
    }
  }
);

// Legacy function name for backward compatibility
export const fetchStartupSearchSuggestions = createAsyncThunk<
  CompanyNameType[],
  string,
  { rejectValue: string }
>(
  "company/fetchStartupSearchSuggestions",
  async (query, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        "get",
        `/companies/registration-search/?search=${encodeURIComponent(query)}&type=startup`,
        null,
        false
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search companies"
      );
    }
  }
);

// Add after fetchStartupSearchSuggestions
export const fetchEnterpriseSearchSuggestions = createAsyncThunk<
  CompanyNameType[],
  string,
  { rejectValue: string }
>(
  "company/fetchEnterpriseSearchSuggestions",
  async (query, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        "get",
        `/companies/registration-search/?search=${encodeURIComponent(query)}&type=enterprise`,
        null,
        false
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search companies"
      );
    }
  }
);

// Check company by exact name (for duplicate validation)
export const checkCompanyByExactName = createAsyncThunk<
  CompanyType | null,
  { name: string; type: "startup" | "enterprise" },
  { rejectValue: string }
>(
  "company/checkCompanyByExactName",
  async ({ name, type }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        "get",
        `/companies/search/?name=${encodeURIComponent(name)}&type=${type}`,
        null,
        false
      );
      return response.data || null;
    } catch (error: any) {
      // If company not found, return null instead of error
      if (error.response?.status === 404) {
        return null;
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to check company name"
      );
    }
  }
);

// Create new company
export const createCompany = createAsyncThunk<
  CompanyType,
  Partial<CompanyType> & { type: "startup" | "enterprise" },
  { rejectValue: string }
>("company/createCompany", async (payload, { rejectWithValue }) => {
  try {
    const response = await apiRequest("post", "/companies/view/", payload, false);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || "Failed to create company"
    );
  }
});

// Create startup (legacy function name for backward compatibility)
export const createStartup = createAsyncThunk<
  CompanyType,
  any,
  { rejectValue: string }
>("company/createStartup", async (payload, { rejectWithValue }) => {
  try {
    const response = await apiRequest("post", "/companies/view/", { ...payload, type: "startup" }, false);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || "Failed to create startup"
    );
  }
});

// Update existing company
export const updateCompany = createAsyncThunk<
  CompanyType,
  { id: number; payload: Partial<CompanyType>; type: "startup" | "enterprise" },
  { rejectValue: string }
>("company/updateCompany", async ({ id, payload, type }, { rejectWithValue }) => {
  try {
    const response = await apiRequest(
      "put",
      `/companies/view/${id}/?type=${type}`,
      payload,
      false
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update company"
    );
  }
});

// Delete company
export const deleteCompany = createAsyncThunk<
  number,
  { id: number; type: "startup" | "enterprise" },
  { rejectValue: string }
>("company/deleteCompany", async ({ id, type }, { rejectWithValue }) => {
  try {
    await apiRequest("delete", `/companies/view/${id}/?type=${type}`, null, false);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete company"
    );
  }
});

// Helper function to merge unique companies
const mergeUniqueCompanies = (
  oldList: CompanyType[],
  newList: CompanyType[]
): CompanyType[] => {
  const map = new Map<number, CompanyType>();
  oldList.forEach((item) => map.set(getCompanyId(item), item));
  newList.forEach((item) => map.set(getCompanyId(item), item));
  return Array.from(map.values());
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompanyState(state) {
      state.loading = false;
      state.error = undefined;
      state.message = undefined;
      state.selectedCompany = null;
      state.isModalOpen = false;
    },
    setCompanyModalOpen(state, action: PayloadAction<boolean>) {
      state.isModalOpen = action.payload;
    },
    setSelectedCompany(
      state,
      action: PayloadAction<CompanyEditContext | null>
    ) {
      state.selectedCompany = action.payload;
    },
    setCompanyMode(state, action: PayloadAction<"edit" | "create">) {
      state.mode = action.payload;
    },
    setCompanyType(state, action: PayloadAction<"startup" | "enterprise">) {
      state.companyType = action.payload;
      // Clear data when switching company type
      state.companies = [];
      state.searchResults = [];
      state.company = null;
      state.hasMore = true;
      state.searchHasMore = true;
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
    clearError(state) {
      state.error = undefined;
    },
    clearMessage(state) {
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch companies by pagination
      .addCase(fetchCompaniesByPagination.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchCompaniesByPagination.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.page === 1) {
          state.companies = action.payload;
        } else {
          state.companies = mergeUniqueCompanies(
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

      // Search companies
      .addCase(fetchCompaniesBySearch.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchCompaniesBySearch.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.page === 1) {
          state.companies = action.payload;
        } else {
          state.companies = mergeUniqueCompanies(
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

      // Fetch company by ID
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch search suggestions (both old and new function names)
      .addCase(fetchCompanySearchSuggestions.pending, (state) => {
        state.error = undefined;
      })
      .addCase(fetchCompanySearchSuggestions.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addCase(fetchCompanySearchSuggestions.rejected, (state, action) => {
        state.error = action.payload;
        state.searchResults = [];
      })
      .addCase(fetchStartupSearchSuggestions.pending, (state) => {
        state.error = undefined;
      })
      .addCase(fetchStartupSearchSuggestions.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addCase(fetchStartupSearchSuggestions.rejected, (state, action) => {
        state.error = action.payload;
        state.searchResults = [];
      })
      .addCase(fetchEnterpriseSearchSuggestions.pending, (state) => {
        state.error = undefined;
      })
      .addCase(fetchEnterpriseSearchSuggestions.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addCase(fetchEnterpriseSearchSuggestions.rejected, (state, action) => {
        state.error = action.payload;
        state.searchResults = [];
      })

      // Check company by exact name
      .addCase(checkCompanyByExactName.pending, (state) => {
        state.error = undefined;
      })
      .addCase(checkCompanyByExactName.fulfilled, (state, action) => {
        // This is used for validation, so we don't store the result in state
        // The component will handle the result directly
      })
      .addCase(checkCompanyByExactName.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Create company
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.message = undefined;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.message = `${state.companyType.charAt(0).toUpperCase() + state.companyType.slice(1)} created successfully`;
        state.companies.unshift(action.payload); // Add to beginning of list
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create startup (legacy)
      .addCase(createStartup.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.message = undefined;
      })
      .addCase(createStartup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Startup created successfully";
        state.companies.unshift(action.payload); // Add to beginning of list
      })
      .addCase(createStartup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update company
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.message = undefined;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.message = `${state.companyType.charAt(0).toUpperCase() + state.companyType.slice(1)} updated successfully`;
        const companyId = getCompanyId(action.payload);
        const index = state.companies.findIndex(
          (company) => getCompanyId(company) === companyId
        );
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete company
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.message = undefined;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.message = `${state.companyType.charAt(0).toUpperCase() + state.companyType.slice(1)} deleted successfully`;
        state.companies = state.companies.filter(
          (company) => getCompanyId(company) !== action.payload
        );
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCompanyState,
  setCompanyModalOpen,
  setSelectedCompany,
  setCompanyMode,
  setCompanyType,
  setSearchMode,
  clearSearchResults,
  clearError,
  clearMessage,
} = companySlice.actions;

export default companySlice.reducer;

// Export types for use in components (removed duplicate CompanyType export)
export type { StartupType, EnterpriseType, CompanyEditContext, CompanyNameType };