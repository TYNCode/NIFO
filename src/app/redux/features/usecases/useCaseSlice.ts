import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


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

export const fetchUseCases = createAsyncThunk('useCase/fetchUseCases', async () => {
    try {
        const response = await axios.get('https://tyn-server.azurewebsites.net/usecases/');
        return response.data.usecases;
    } catch (error) {
        throw new Error(error.message);
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
