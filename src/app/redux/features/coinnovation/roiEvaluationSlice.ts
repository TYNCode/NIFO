import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchROIEvaluation = createAsyncThunk(
    'roiEvaluation/fetchROIEvaluation',
    async ({
        project_id,
        solution_provider_id,
        force_refresh = false
    }: {
        project_id: string;
        solution_provider_id: string;
        force_refresh?: boolean;
    }) => {
        const response = await axios.post(
            'https://tyn-server.azurewebsites.net/coinnovation/roi-evaluation/',
            {
                project_id,
                solution_provider_id,
                force_refresh,
            }
        );
        return response.data;
    }
);

export const saveROISectionParameters = createAsyncThunk(
    'roiEvaluation/saveROISectionParameters',
    async ({
        roiId,
        section,
        updates,
    }: {
        roiId: number;
        section: string;
        updates: {
            id: number;
            uom?: string;
            per_unit_cost?: number;
            units?: number;
        }[];
    }) => {
        const response = await axios.patch(
            `https://tyn-server.azurewebsites.net/coinnovation/roi-evaluation/${roiId}/section/${section}/`,
            updates
        );
        return response.data;
    }
);

export const deleteSubParameter = createAsyncThunk(
    'roiEvaluation/deleteSubParameter',
    async (
        {
            roiId,
            section,
            id,
        }: {
            roiId: number;
            section: string;
            id: number;
        },
        { rejectWithValue }
    ) => {
        try {
            const url = `https://tyn-server.azurewebsites.net/coinnovation/roi-evaluation/${roiId}/section/${section}/`;
            await axios.delete(url, { data: [id] }); 
            return { id };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Delete failed');
        }
    }
);

const roiEvaluationSlice = createSlice({
    name: 'roiEvaluation',
    initialState: {
        data: null as any,
        status: 'idle',
        error: null as string | null,
    },
    reducers: {
        updateSubParameter: (state, action) => {
            const { id, updates } = action.payload;
            const param = state.data?.sub_parameters?.find((p: any) => p.id === id);
            if (param) {
                Object.assign(param, updates);
            }
        },
        resetROIEvaluation: (state) => {
            state.data = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch ROI
            .addCase(fetchROIEvaluation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchROIEvaluation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchROIEvaluation.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })

            // Delete Sub-Parameter
            .addCase(deleteSubParameter.fulfilled, (state, action) => {
                const deletedId = action.payload.id;
                if (state.data?.sub_parameters) {
                    state.data.sub_parameters = state.data.sub_parameters.filter(
                        (p: any) => p.id !== deletedId
                    );
                }
            });
    },
});

export const { updateSubParameter, resetROIEvaluation } = roiEvaluationSlice.actions;

export default roiEvaluationSlice.reducer;
