import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { PaiePayload, PaieState } from "../../types/paie";
import { paieService } from "../../service/paie.service";
import type { GeneratePaieDto } from "../../service/paie.service";
import type { Charge } from "../../service/finance.service";
import { getApiErrorMessage } from "../../service/error";
import type { RootState } from "../index";

export interface UpdateStatutPaieResult {
    paie: PaiePayload;
    charge?: Charge;
}

const initialState: PaieState = {
    all: [],
    mine: [],
    loading: false,
    error: null,
}

export const fetchAllPaies = createAsyncThunk(
    'paie/fetchAll',
    async (mois: string | undefined, { rejectWithValue }) => {
        try {
            return await paieService.getAll(mois)
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors du chargement des fiches de paie"))
        }
    }
)

export const fetchMyPaies = createAsyncThunk(
    'paie/fetchMine',
    async (_, { rejectWithValue }) => {
        try {
            return await paieService.getMine()
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors du chargement de vos fiches de paie"))
        }
    }
)

export const generatePaie = createAsyncThunk(
    'paie/generate',
    async (dto: GeneratePaieDto, { rejectWithValue }) => {
        try {
            return await paieService.generate(dto)
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors de la génération de la fiche de paie"))
        }
    }
)

export const updateStatutPaie = createAsyncThunk(
    'paie/updateStatus',
    async ({ id, statutpaie }: { id: number; statutpaie: string }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const paie = state.paie.all.find(p => p.id === id) ?? state.paie.mine.find(p => p.id === id);
            return await paieService.updateStatus(id, statutpaie, paie)
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors de la mise à jour du statut"))
        }
    }
)

const paieSlice = createSlice({
    name: 'paie',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPaies.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAllPaies.fulfilled, (state, action: PayloadAction<PaiePayload[]>) => {
                state.loading = false
                state.all = action.payload
            })
            .addCase(fetchAllPaies.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            .addCase(fetchMyPaies.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMyPaies.fulfilled, (state, action: PayloadAction<PaiePayload[]>) => {
                state.loading = false
                state.mine = action.payload
            })
            .addCase(fetchMyPaies.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            .addCase(generatePaie.fulfilled, (state, action: PayloadAction<PaiePayload>) => {
                console.log(action.payload)
                state.all.unshift(action.payload)
            })
            .addCase(generatePaie.rejected, (state, action) => {
                state.error = action.payload as string
            })

            .addCase(updateStatutPaie.fulfilled, (state, action: PayloadAction<UpdateStatutPaieResult>) => {
                const apply = (p: PaiePayload) => {
                    if (p.id === action.payload.paie.id) p.statutpaie = action.payload.paie.statutpaie
                    return p
                }
                state.all = state.all.map(apply)
                state.mine = state.mine.map(apply)
            })
            .addCase(updateStatutPaie.rejected, (state, action) => {
                state.error = action.payload as string
            })
    }
})

export const { clearError } = paieSlice.actions
export default paieSlice.reducer
