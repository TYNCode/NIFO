import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../../utils/apiWrapper/apiRequest';

interface UseCase {
    id: number;
    title: string;
    description: string;
    posted_on: string;
    status: string;
}

interface UseCaseState {
    useCases: UseCase[];
    loading: boolean;
    error: string | null;
}

const initialState: UseCaseState = {
    useCases: [],
    loading: false,
    error: null,
};

export const fetchUseCases = createAsyncThunk('useCase/fetchUseCases', async (_, { rejectWithValue }) => {
    try {
        const response = await apiRequest('get', '/usecases/', {}, false);
        return response.data.usecases;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const useCaseSlice = createSlice({
    name: 'useCase',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUseCases.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUseCases.fulfilled, (state, action) => {
                state.loading = false;
                state.useCases = action.payload;
                state.error = null;
            })
            .addCase(fetchUseCases.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch use cases';
            });
    },
});

export default useCaseSlice.reducer;
