import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { BilanState } from "../../types/finance";
import type { BilanPole } from "../../service/finance.service";
import { financeService } from "../../service/finance.service";
import { getApiErrorMessage } from "../../service/error";

const initialState: BilanState = {
    bilans: {},
    current: null,
    loading: false,
    error: null,
};

export const fetchBilanPole = createAsyncThunk(
    'bilan/fetchBilanPole',
    async ({ idPole, mois }: { idPole: number; mois: string }, { rejectWithValue }) => {
        try {
            return await financeService.getBilanPole(idPole, mois);
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors du chargement du bilan"));
        }
    }
);

const BilanSlice = createSlice({
    name: 'bilan',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearBilans: (state) => {
            state.bilans = {};
            state.current = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBilanPole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBilanPole.fulfilled, (state, action: PayloadAction<BilanPole>) => {
                state.loading = false;
                state.bilans[action.payload.idPole] = action.payload;
                state.current = action.payload;
            })
            .addCase(fetchBilanPole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearBilans } = BilanSlice.actions;
export default BilanSlice.reducer;
