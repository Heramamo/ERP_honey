import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RevenuState } from "../../types/finance";
import type { CreateRevenuDto, Revenu } from "../../service/finance.service";
import { financeService } from "../../service/finance.service";
import { getApiErrorMessage } from "../../service/error";

const initialState: RevenuState = {
    revenus: [],
    loading: false,
    error: null,
};

export const createRevenu = createAsyncThunk(
    'revenu/createRevenu',
    async (dto: CreateRevenuDto, { rejectWithValue }) => {
        try {
            return await financeService.createRevenu(dto);
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors de la création du revenu"));
        }
    }
);

export const fetchRevenus = createAsyncThunk(
    'revenu/fetchRevenus',
    async (_, { rejectWithValue }) => {
        try {
            return await financeService.getRevenus();
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors du chargement des revenus"));
        }
    }
);

const RevenuSlice = createSlice({
    name: 'revenu',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createRevenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRevenu.fulfilled, (state, action: PayloadAction<Revenu>) => {
                state.loading = false;
                state.revenus.unshift(action.payload);
            })
            .addCase(createRevenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchRevenus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRevenus.fulfilled, (state, action: PayloadAction<Revenu[]>) => {
                state.loading = false;
                state.revenus = action.payload;
            })
            .addCase(fetchRevenus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = RevenuSlice.actions;
export default RevenuSlice.reducer;
