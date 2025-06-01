import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiRequest } from "../../../../utils/apiWrapper/apiRequest";
import {
  Agreement,
  AgreementEditContext,
  GroupedAgreement,
} from "../../../../admin/agreements/types/agreements";

interface AgreementState {
  loading: boolean;
  agreements: Agreement[];
  groupedAgreements: GroupedAgreement[];
  selectedAgreement: AgreementEditContext | null;
  isModalOpen: boolean;
  mode: "edit" | "create";
  error?: string;
  message?: string;
}

const initialState: AgreementState = {
  loading: false,
  agreements: [],
  groupedAgreements: [],
  selectedAgreement: null,
  isModalOpen: false,
  mode: "create",
  error: undefined,
  message: undefined,
};

export const fetchGroupedAgreements = createAsyncThunk<
  GroupedAgreement[],
  void,
  { rejectValue: string }
>("agreement/fetchGroupedAgreements", async (_, { rejectWithValue }) => {
  try {
    const response = await apiRequest("get", "/agreements/grouped/", null, false);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch grouped agreements");
  }
});

export const fetchAgreements = createAsyncThunk<
  Agreement[],
  void,
  { rejectValue: string }
>("agreement/fetchAgreements", async (_, { rejectWithValue }) => {
  try {
    const response = await apiRequest("get", "/agreements/", null, false);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch agreements");
  }
});

export const fetchAgreementById = createAsyncThunk<
  Agreement,
  number,
  { rejectValue: string }
>("agreement/fetchAgreementById", async (id, { rejectWithValue }) => {
  try {
    const response = await apiRequest("get", `/agreements/${id}/`, null, false);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch agreement");
  }
});

export const createAgreement = createAsyncThunk<
  Agreement,
  Partial<Agreement>,
  { rejectValue: string }
>("agreement/createAgreement", async (payload, { rejectWithValue }) => {
  try {
    const response = await apiRequest("post", "/agreements/", payload, false);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create agreement");
  }
});

export const updateAgreement = createAsyncThunk<
  Agreement,
  { id: number; payload: Partial<Agreement> },
  { rejectValue: string }
>("agreement/updateAgreement", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await apiRequest("put", `/agreements/${id}/`, payload, false);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update agreement");
  }
});

export const deleteAgreement = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("agreement/deleteAgreement", async (id, { rejectWithValue }) => {
  try {
    await apiRequest("delete", `/agreements/${id}/`, null, false);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete agreement");
  }
});

const agreementSlice = createSlice({
  name: "agreement",
  initialState,
  reducers: {
    clearAgreementState(state) {
      state.loading = false;
      state.error = undefined;
      state.message = undefined;
      state.selectedAgreement = null;
      state.isModalOpen = false;
    },
    setAgreementModalOpen(state, action: PayloadAction<boolean>) {
      state.isModalOpen = action.payload;
    },
    setSelectedAgreement(state, action: PayloadAction<AgreementEditContext | null>) {
      state.selectedAgreement = action.payload;
    },
    setAgreementMode(state, action: PayloadAction<"edit" | "create">) {
      state.mode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupedAgreements.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchGroupedAgreements.fulfilled, (state, action) => {
        state.loading = false;
        state.groupedAgreements = action.payload;
      })
      .addCase(fetchGroupedAgreements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAgreements.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchAgreements.fulfilled, (state, action) => {
        state.loading = false;
        state.agreements = action.payload;
      })
      .addCase(fetchAgreements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAgreementById.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchAgreementById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAgreement = {
          agreementId: action.payload.id,
          startupId: action.payload.startup,
          type: action.payload.agreement_type,
        };
      })
      .addCase(fetchAgreementById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createAgreement.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createAgreement.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Agreement created successfully";
        state.agreements.unshift(action.payload);
      })
      .addCase(createAgreement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAgreement.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateAgreement.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Agreement updated successfully";
        const index = state.agreements.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) state.agreements[index] = action.payload;
      })
      .addCase(updateAgreement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteAgreement.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(deleteAgreement.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Agreement deleted";
        state.agreements = state.agreements.filter((a) => a.id !== action.payload);
      })
      .addCase(deleteAgreement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAgreementState,
  setAgreementModalOpen,
  setSelectedAgreement,
  setAgreementMode,
} = agreementSlice.actions;
export default agreementSlice.reducer;
