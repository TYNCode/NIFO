import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StartupType } from "../../../interfaces";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../hooks";

// Define the state shape for company profiles
interface CompanyProfileState {
  loading: boolean;
  companies: StartupType[];
  company: StartupType | null;
  error: string | null;
  hasMore: boolean;
}

// Initial state
const initialState: CompanyProfileState = {
  companies: [],
  company: null,
  loading: false,
  error: null,
  hasMore: true,
};

// Thunk to fetch companies with pagination
export const fetchCompaniesByPagination = createAsyncThunk<
  StartupType[],
  { page: number; page_size: number },
  { rejectValue: string }
>(
  "companyProfile/fetchCompaniesByPagination",
  async ({ page, page_size }, { rejectWithValue }) => {
    try {
      const response = await getRequest(
        `http://127.0.0.1:8000/directorysearch/companyview/?page=${page}&page_size=${page_size}/`
      );
      return response.data.results;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Error in fetching companies with pagination"
      );
    }
  }
);

// Thunk to fetch all companies used in Register page
export const fetchAllCompanies = createAsyncThunk<
  StartupType[],
  void,
  { rejectValue: string }
>("companyProfile/fetchAllCompanies", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest(
      `http://127.0.0.1:8000/directorysearch/companyregistrationsearch/`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "Error in fetching companies"
    );
  }
});

// Thunk to fetch a single company by ID
export const fetchCompanyById = createAsyncThunk<
  StartupType,
  string,
  { rejectValue: string }
>("companyProfile/fetchCompanyById", async (id, { rejectWithValue }) => {
  try {
    const response = await getRequest(
      `http://127.0.0.1:8000/directorysearch/companyview/${id}/`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || `Error in fetching company with ID: ${id}`
    );
  }
});

// Thunk to create a new company
export const postCompany = createAsyncThunk<any, any, { rejectValue: string }>(
  "companyProfile/postCompany",
  async (newCompanyData, { rejectWithValue }) => {
    console.log(
      "Registration of company into the postCompany Api endpointr",
      newCompanyData
    );
    try {
      const response = await postRequest(
        `http://127.0.0.1:8000/directorysearch/companyview/`,
        newCompanyData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Error in posting new company"
      );
    }
  }
);

// Thunk to update a company by ID
export const updateCompanyById = createAsyncThunk<
  StartupType,
  { id: string; data: Partial<StartupType> },
  { rejectValue: string }
>(
  "companyProfile/updateCompanyById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await putRequest(
        `http://127.0.0.1:8000/directorysearch/companyview/${id}/`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || `Error in updating company with ID: ${id}`
      );
    }
  }
);

// Thunk to delete a company by ID
export const deleteCompanyById = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("companyProfile/deleteCompanyById", async (id, { rejectWithValue }) => {
  try {
    await deleteRequest(
      `http://127.0.0.1:8000/directorysearch/companyview/${id}/`
    );
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || `Error in deleting company with ID: ${id}`
    );
  }
});

const companyProfileSlice = createSlice({
  name: "companyProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch companies by pagination
    builder
      .addCase(fetchCompaniesByPagination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCompaniesByPagination.fulfilled,
        (state, action: PayloadAction<StartupType[]>) => {
          state.companies = [...state.companies, ...action.payload];
          state.loading = false;
          state.hasMore = action.payload.length > 0;
        }
      )
      .addCase(
        fetchCompaniesByPagination.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error =
            action.payload || "Failed to fetch companies with pagination";
          state.loading = false;
        }
      );

    // Fetch all companies
    builder
      .addCase(fetchAllCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllCompanies.fulfilled,
        (state, action: PayloadAction<StartupType[]>) => {
          state.companies = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchAllCompanies.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload || "Failed to fetch companies";
          state.loading = false;
        }
      );

    // Fetch a company by ID
    builder
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCompanyById.fulfilled,
        (state, action: PayloadAction<StartupType>) => {
          state.company = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchCompanyById.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload || "Failed to fetch company by ID";
          state.loading = false;
        }
      );

    // Create a new company
    builder
      .addCase(postCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        postCompany.fulfilled,
        (state, action: PayloadAction<StartupType>) => {
          state.companies = [...state.companies, action.payload];
          state.loading = false;
        }
      )
      .addCase(
        postCompany.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload || "Failed to post new company";
          state.loading = false;
        }
      );

    // Update a company by ID
    builder
      .addCase(updateCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCompanyById.fulfilled,
        (state, action: PayloadAction<StartupType>) => {
          state.company = action.payload;
          state.companies = state.companies.map((company) =>
            company.startup_id === action.payload.startup_id
              ? action.payload
              : company
          );
          state.loading = false;
        }
      )
      .addCase(
        updateCompanyById.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload || "Failed to update company";
          state.loading = false;
        }
      );

    // Delete a company by ID
    builder
      .addCase(deleteCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCompanyById.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.companies = state.companies.filter(
            (company) => company.startup_id !== Number(action.payload)
          );
          state.loading = false;
        }
      )
      .addCase(
        deleteCompanyById.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload || "Failed to delete company";
          state.loading = false;
        }
      );
  },
});

export default companyProfileSlice.reducer;
