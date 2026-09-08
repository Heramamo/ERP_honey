import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ChargeState } from "../../types/finance";
import type { Charge, CreateChargeDto } from "../../service/finance.service";
import { financeService } from "../../service/finance.service";
import { getApiErrorMessage } from "../../service/error";
import { updateStatutPaie } from "./paieSlice";
import type { UpdateStatutPaieResult } from "./paieSlice";

const initialState: ChargeState = {
    charges: [],
    current: null,
    loading: false,
    error: null,
};

export const fetchCharges = createAsyncThunk(
    'charge/fetchCharges',
    async (_, { rejectWithValue }) => {
        try {
            return await financeService.getCharges();
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors du chargement des charges"));
        }
    }
);

export const fetchChargeById = createAsyncThunk(
    'charge/fetchChargeById',
    async (id: number, { rejectWithValue }) => {
        try {
            return await financeService.getChargeById(id);
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors du chargement de la charge"));
        }
    }
);

export const createCharge = createAsyncThunk(
    'charge/createCharge',
    async (dto: CreateChargeDto, { rejectWithValue }) => {
        try {
            return await financeService.createCharge(dto);
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors de la création de la charge"));
        }
    }
);

const ChargeSlice = createSlice({
    name: 'charge',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCharges.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCharges.fulfilled, (state, action: PayloadAction<Charge[]>) => {
                state.loading = false;
                state.charges = action.payload;
            })
            .addCase(fetchCharges.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchChargeById.fulfilled, (state, action: PayloadAction<Charge>) => {
                state.current = action.payload;
            })
            .addCase(fetchChargeById.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            .addCase(createCharge.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCharge.fulfilled, (state, action: PayloadAction<Charge>) => {
                state.loading = false;
                state.charges.unshift(action.payload);
            })
            .addCase(createCharge.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateStatutPaie.fulfilled, (state, action: PayloadAction<UpdateStatutPaieResult>) => {
                if (action.payload.charge) {
                    state.charges.unshift(action.payload.charge);
                }
            });
    },
});

export const { clearError } = ChargeSlice.actions;
export default ChargeSlice.reducer;
