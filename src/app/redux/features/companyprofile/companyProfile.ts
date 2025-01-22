import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StartupType, CompanyProfile } from "../../../interfaces";
import {
  getRequest,
  getRequestWithAccessToken,
  putRequestWithAccessToken,
} from "../../hooks";

interface CompanyProfileState {
  loading: boolean;
  companies: StartupType[];
  companiesList: StartupType[];
  company: StartupType | null;
  searchSuggestResults: CompanyProfile[];
  searchResults: CompanyProfile[];
  error: string | null;
  hasMore: boolean;
}

// Initial state
const initialState: CompanyProfileState = {
  companies: [],
  companiesList: [],
  company: null,
  searchSuggestResults:[],
  searchResults: [],
  loading: false,
  error: null,
  hasMore: true,
};

// Thunk to fetch all companies used in Register page
export const fetchCompanies = createAsyncThunk<
  StartupType[],
  void,
  { rejectValue: string }
>("companyProfile/fetchCompanies", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest(
      `http://127.0.0.1:8000/directorysearch/companyview/`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "Error in fetching companies"
    );
  }
});

export const fetchCompaniesList = createAsyncThunk(
  'companyProfile/fetchCompaniesList',
  async ({ page, page_size }: { page: number, page_size: number }, { rejectWithValue }) => {
    try {
      const response = await getRequestWithAccessToken(
        `http://127.0.0.1:8000/directorysearch/companyview/?page=${page}&page_size=${page_size}`,
      );

      await new Promise(resolve => setTimeout(resolve, 1000));

      return response.data.results;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return rejectWithValue('No more data');
      }
      return rejectWithValue('An error occurred while fetching data');
    }
  }
);


export const searchCompaniesSuggestion = createAsyncThunk<
  StartupType[],
  string,
  { rejectValue: string }
>("companyProfile/searchCompaniesSuggestion", async (query, { rejectWithValue }) => {
  try {
    const response = await getRequest(
      `http://127.0.0.1:8000/directorysearch/companyview/searchSuggestion/?query=${query}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "Error in searching companies"
    );
  }
});


export const searchCompanies = createAsyncThunk<
  StartupType[],
  string,
  { rejectValue: string }
>("companyProfile/searchCompanies", async (query, { rejectWithValue }) => {
  try {
    const response = await getRequest(
      `http://127.0.0.1:8000/directorysearch/companyview/search/?query=${query}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "Error in searching companies"
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
    const response = await getRequestWithAccessToken(
      `http://127.0.0.1:8000/directorysearch/companyview/${id}/`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || `Error in fetching company with ID: ${id}`
    );
  }
});


// Thunk to fetch a single company profile by ID
export const fetchCompanyProfileById = createAsyncThunk<
  StartupType,
  string,
  { rejectValue: string }
>("companyProfile/fetchCompanyProfileById", async (id, { rejectWithValue }) => {
  try {
    const response = await getRequestWithAccessToken(
      `http://127.0.0.1:8000/directorysearch/companyview/${id}/`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || `Error in fetching company with ID: ${id}`
    );
  }
});


// Thunk to update a company by ID
export const updateCompanyById = createAsyncThunk<
  StartupType,
  { id: string; data: Partial<StartupType> },
  { rejectValue: string }
>(
  "companyProfile/updateCompanyById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await putRequestWithAccessToken(
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

const companyProfileSlice = createSlice({
  name: "companyProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCompanies.fulfilled,
        (state, action: PayloadAction<StartupType[]>) => {
          state.companies = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchCompanies.rejected,
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


    // Fetch a company profile by ID
    builder
      .addCase(fetchCompanyProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCompanyProfileById.fulfilled,
        (state, action: PayloadAction<StartupType>) => {
          state.companiesList = [action.payload];
          state.loading = false;
        }
      )
      .addCase(
        fetchCompanyProfileById.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload || "Failed to fetch company by ID";
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

    //Companies List
    builder
      .addCase(fetchCompaniesList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompaniesList.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.length === 0) {
          state.hasMore = false;
        } else {
          state.companiesList = [...state.companiesList, ...action.payload];
        }
      })
      .addCase(fetchCompaniesList.rejected, (state, action) => {
        state.loading = false;
        if (action.payload === 'No more data') {
          state.hasMore = false;
        } else {
          state.error = action.error?.message || 'Something went wrong';
        }
      });



    // Handle search suggestion results
    builder
      .addCase(searchCompaniesSuggestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchCompaniesSuggestion.fulfilled,
        (state, action: PayloadAction<StartupType[]>) => {
          state.searchSuggestResults = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        searchCompaniesSuggestion.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload || "Failed to search companies";
          state.loading = false;
        }
      );


      
    // Handle search suggestion results
    builder
    .addCase(searchCompanies.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(
      searchCompanies.fulfilled,
      (state, action: PayloadAction<StartupType[]>) => {
        state.searchResults = action.payload;
        state.loading = false;
      }
    )
    .addCase(
      searchCompanies.rejected,
      (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "Failed to search companies";
        state.loading = false;
      }
    );

  },
});

export default companyProfileSlice.reducer;