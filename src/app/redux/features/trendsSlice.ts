import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../utils/apiWrapper/apiRequest';

export interface Trend {
  id: number;
  challenge_title: string;
  challenge: string;
  solution: string[];
  impact: string[];
  solution_provider: string;
  solution_provider_website?: string;
  enterprise_name?: string;
  testimonials?: string;
  references: string[];
  images: string[];
  sector: string;
  industry: string;
  sub_industry: string;
}

export interface TrendPayload extends Omit<Trend, 'id'> {}

interface TrendsState {
  trends: Trend[];
  loading: boolean;
  error: string | null;
  success: boolean;
  sectorOptions: (string | { label: string; value: string })[];
  industryOptions: (string | { label: string; value: string })[];
  subIndustryOptions: (string | { label: string; value: string })[];
  optionsLoading: boolean;
}

const initialState: TrendsState = {
  trends: [],
  loading: false,
  error: null,
  success: false,
  sectorOptions: [],
  industryOptions: [],
  subIndustryOptions: [],
  optionsLoading: false,
};

export const addTrend = createAsyncThunk(
  'trends/addTrend',
  async (payload: TrendPayload, { rejectWithValue }) => {
    try {
      await apiRequest('post', '/trends/', payload, false);
      return true;
    } catch (err: any) {
      return rejectWithValue('Failed to add trend.');
    }
  }
);

export const fetchSectors = createAsyncThunk(
  'trends/fetchSectors',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest('get', '/trends/sector-industry-subindustry/', {}, false);
      if (Array.isArray(res.data.sectors)) {
        return res.data.sectors;
      } else if (Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (err) {
      return rejectWithValue('Failed to fetch sectors.');
    }
  }
);

export const fetchIndustries = createAsyncThunk(
  'trends/fetchIndustries',
  async (sector: string, { rejectWithValue }) => {
    try {
      const res = await apiRequest('get', '/trends/sector-industry-subindustry/', { sector }, false);
      if (Array.isArray(res.data.industries)) {
        return res.data.industries;
      } else if (Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (err) {
      return rejectWithValue('Failed to fetch industries.');
    }
  }
);

export const fetchSubIndustries = createAsyncThunk(
  'trends/fetchSubIndustries',
  async ({ sector, industry }: { sector: string; industry: string }, { rejectWithValue }) => {
    try {
      const res = await apiRequest('get', '/trends/sector-industry-subindustry/', { sector, industry }, false);
      if (Array.isArray(res.data.subindustries)) {
        return res.data.subindustries;
      } else if (Array.isArray(res.data.sub_industries)) {
        return res.data.sub_industries;
      } else if (Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (err) {
      return rejectWithValue('Failed to fetch sub-industries.');
    }
  }
);

export const fetchTrends = createAsyncThunk(
  'trends/fetchTrends',
  async (
    { selectedSector, selectedIndustry, selectedSubIndustry }: 
    { selectedSector?: string; selectedIndustry?: string; selectedSubIndustry?: string },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      if (selectedSector) params.append('sector', selectedSector);
      if (selectedIndustry) params.append('industry', selectedIndustry);
      if (selectedSubIndustry) params.append('sub_industry', selectedSubIndustry);
      
      const response = await apiRequest('get', `/trends/?${params.toString()}`, {}, false);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch trends');
    }
  }
);

export const deleteTrend = createAsyncThunk(
  'trends/deleteTrend',
  async (trendId: number, { rejectWithValue, dispatch }) => {
    try {
      await apiRequest('delete', `/trends/${trendId}/`, {}, false);
      return trendId;
    } catch (error) {
      return rejectWithValue('Failed to delete trend');
    }
  }
);

const trendsSlice = createSlice({
  name: 'trends',
  initialState,
  reducers: {
    resetTrendsState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    resetOptions: (state) => {
      state.sectorOptions = [];
      state.industryOptions = [];
      state.subIndustryOptions = [];
      state.optionsLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTrend.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addTrend.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSectors.pending, (state) => {
        state.optionsLoading = true;
        state.sectorOptions = [];
      })
      .addCase(fetchSectors.fulfilled, (state, action) => {
        state.optionsLoading = false;
        state.sectorOptions = action.payload as string[];
      })
      .addCase(fetchSectors.rejected, (state) => {
        state.optionsLoading = false;
        state.sectorOptions = [];
      })
      .addCase(fetchIndustries.pending, (state) => {
        state.optionsLoading = true;
        state.industryOptions = [];
      })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.optionsLoading = false;
        state.industryOptions = action.payload as string[];
      })
      .addCase(fetchIndustries.rejected, (state) => {
        state.optionsLoading = false;
        state.industryOptions = [];
      })
      .addCase(fetchSubIndustries.pending, (state) => {
        state.optionsLoading = true;
        state.subIndustryOptions = [];
      })
      .addCase(fetchSubIndustries.fulfilled, (state, action) => {
        state.optionsLoading = false;
        state.subIndustryOptions = action.payload as string[];
      })
      .addCase(fetchSubIndustries.rejected, (state) => {
        state.optionsLoading = false;
        state.subIndustryOptions = [];
      })
      .addCase(fetchTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.trends = action.payload;
      })
      .addCase(fetchTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTrend.pending, (state) => {
        state.loading = true; 
      })
      .addCase(deleteTrend.fulfilled, (state, action) => {
        state.loading = false;
        state.trends = state.trends.filter((trend) => trend.id !== action.payload);
      })
      .addCase(deleteTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetTrendsState, resetOptions } = trendsSlice.actions;
export default trendsSlice.reducer; 