import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchROIEvaluation = createAsyncThunk(
    'roiEvaluation/fetchROIEvaluation',
    async (projectID) => {
        const response = await axios.get(`/api/roi-evaluation/${projectID}/`);
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