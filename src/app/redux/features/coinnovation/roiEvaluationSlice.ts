import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchROIEvaluation = createAsyncThunk(
    'roiEvaluation/fetchROIEvaluation',
    async ({ project_id, solution_provider_id, force_refresh = false }: { project_id: string; solution_provider_id: string; force_refresh?: boolean }) => {
        const response = await axios.post('http://127.0.0.1:8000coinnovation/roi-evaluation/', {
            project_id,
            solution_provider_id,
            force_refresh
        });
        return response.data;
    }
);


const roiEvaluationSlice = createSlice({
    name: 'roiEvaluation',
    initialState: {
        data: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        updateSubParameter: (state, action) => {
            const { id, updates } = action.payload;
            const param = state.data?.sub_parameters.find(p => p.id === id);
            if (param) {
                Object.assign(param, updates);
            }
        },
        resetROIEvaluation: (state) => {
            state.data = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchROIEvaluation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchROIEvaluation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchROIEvaluation.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { updateSubParameter, resetROIEvaluation } = roiEvaluationSlice.actions;
export default roiEvaluationSlice.reducer;