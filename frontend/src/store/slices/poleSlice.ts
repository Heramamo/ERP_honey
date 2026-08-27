import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { PoleState } from "../../types/finance";
import type { CreatePoleDto, Pole } from "../../service/finance.service";
import { financeService } from "../../service/finance.service";
import { getApiErrorMessage } from "../../service/error";

const initialState: PoleState = {
    poles: [],
    loading: false,
    error: null,
};

export const fetchPoles = createAsyncThunk(
    'pole/fetchPoles',
    async (_, { rejectWithValue }) => {
        try {
            return await financeService.getPoles();
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors du chargement des pôles"));
        }
    }
);

export const createPole = createAsyncThunk(
    'pole/createPole',
    async (dto: CreatePoleDto, { rejectWithValue }) => {
        try {
            return await financeService.createPole(dto);
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors de la création du pôle"));
        }
    }
);

const PoleSlice = createSlice({
    name: 'pole',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPoles.fulfilled, (state, action: PayloadAction<{ message: string; poles: Pole[] }>) => {
                state.loading = false;
                state.poles = action.payload.poles;
            })
            .addCase(fetchPoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(createPole.fulfilled, (state, action: PayloadAction<Pole>) => {
                state.poles.push(action.payload);
            })
            .addCase(createPole.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = PoleSlice.actions;
export default PoleSlice.reducer;
