import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StartupType } from "../../../interfaces";
import { getRequest, getRequestWithAccessToken, putRequestWithAccessToken } from "../../hooks";

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
  company: null,  // New state for a single company profile
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


// // Thunk to fetch companies (pagination)
// export const fetchCompanies = createAsyncThunk(
//   'companyProfile/fetchCompanies',
//   async ({ page, page_size }: { page: number, page_size: number }, { rejectWithValue }) => {
//     try {
//       const response = await getRequestWithAccessToken(
//         `http://127.0.0.1:8000/directorysearch/companyview/?page=${page}&page_size=${page_size}`, 
//       );

//       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate a delay

//       return response.data.results;
//     } catch (error: any) {
//       if (error.response && error.response.status === 404) {
//         return rejectWithValue('No more data');
//       }
//       return rejectWithValue('An error occurred while fetching data');
//     }
//   }
// );




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

// Thunk to update a company by ID
export const updateCompanyById = createAsyncThunk<
  StartupType,
  { id: string; data: Partial<StartupType> },
  { rejectValue: string }
>("companyProfile/updateCompanyById", async ({ id, data }, { rejectWithValue }) => {
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
});




const companyProfileSlice = createSlice({
  name: 'companyProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all companies
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



    // Update a company by ID
    builder
      .addCase(updateCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanyById.fulfilled, (state, action: PayloadAction<StartupType>) => {
        state.company = action.payload; // Update the company with the new data
        state.loading = false;
      })
      .addCase(updateCompanyById.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "Failed to update company";
        state.loading = false;
      });



    //  builder
    //  .addCase(fetchCompanies.pending, (state) => {
    //    state.loading = true;
    //  })
    //  .addCase(fetchCompanies.fulfilled, (state, action) => {
    //    state.loading = false;  // Ensure loading is set to false in both success and failure cases
    //    if (action.payload.length === 0) {
    //      state.hasMore = false;  
    //    } else {
    //      state.companies = [...state.companies, ...action.payload];
    //    }
    //  })
    //  .addCase(fetchCompanies.rejected, (state, action) => {
    //    state.loading = false;  // Ensure loading is set to false in both success and failure cases
    //    if (action.payload === 'No more data') {
    //      state.hasMore = false;
    //    } else {
    //      state.error = action.error?.message || 'Something went wrong';
    //    }
    //  });

  },

});

export default companyProfileSlice.reducer;
