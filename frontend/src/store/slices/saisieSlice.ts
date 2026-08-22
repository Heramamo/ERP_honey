import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

import type { UserSaisieState, SaisiePayload } from "../../types/saisieFeuille";
import { saisieFeuilleService } from "../../service/saisieFeuille.service";
import type { CreateSaisieDto } from "../../service/saisieFeuille.service";
import { getApiErrorMessage } from "../../service/error";

const initialState:UserSaisieState = {
    saisies:[],
    all:[],
    pending:[],
    loading: false,
    error: null,
}

export const fetchMySaisie = createAsyncThunk(
    'saisieFeuille/fetchMySaisies',
    async (_, {rejectWithValue})=>{
        try {
            return await saisieFeuilleService.getMySaisie()
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors du chargement des feuilles de temps"))
        }
    }
)

export const createSaisie = createAsyncThunk(
    'saisieFeuille/createSaisie',
    async(dto:CreateSaisieDto, {rejectWithValue})=>{
        try {
            return await saisieFeuilleService.create(dto)
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors de la création de la saisie"))
        }
    }
)

export const fetchAllSaisies = createAsyncThunk(
    'saisieFeuille/fetchAllSaisies',
    async (_, {rejectWithValue})=>{
        try {
            return await saisieFeuilleService.getAll()
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors du chargement des feuilles de saisie"))
        }
    }
)

export const fetchPendingSaisies = createAsyncThunk(
    'saisieFeuille/fetchPendingSaisies',
    async (_, {rejectWithValue})=>{
        try {
            return await saisieFeuilleService.getPending()
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors du chargement des feuilles en attente"))
        }
    }
)

export const validateSaisie = createAsyncThunk(
    'saisieFeuille/validateSaisie',
    async ({ id, statut }: { id: number; statut: 'VALIDE' | 'REFUSE' }, { rejectWithValue }) => {
        try {
            await saisieFeuilleService.validate(id, statut)
            return { id, statut }
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors de la validation de la feuille"))
        }
    }
)

const SaisieSlice = createSlice({
    name:'saisie',
    initialState,
    reducers:{
        clearError:(state)=>{
            state.error = null
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchMySaisie.pending, (state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(fetchMySaisie.fulfilled, (state, action:PayloadAction<SaisiePayload[]>)=>{
            state.loading = false
            state.saisies = action.payload
        })
        .addCase(fetchMySaisie.rejected, (state, action)=>{
            state.loading = false
            state.error = action.payload as string
        })

        .addCase(createSaisie.fulfilled, (state, action:PayloadAction<SaisiePayload>)=>{
            state.saisies.unshift(action.payload)
        })
        .addCase(createSaisie.rejected, (state, action)=>{
            state.error = action.payload as string
        })

        .addCase(fetchAllSaisies.pending, (state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(fetchAllSaisies.fulfilled, (state, action:PayloadAction<SaisiePayload[]>)=>{
            state.loading = false
            state.all = action.payload
        })
        .addCase(fetchAllSaisies.rejected, (state, action)=>{
            state.loading = false
            state.error = action.payload as string
        })

        .addCase(fetchPendingSaisies.pending, (state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(fetchPendingSaisies.fulfilled, (state, action:PayloadAction<SaisiePayload[]>)=>{
            state.loading = false
            state.pending = action.payload
        })
        .addCase(fetchPendingSaisies.rejected, (state, action)=>{
            state.loading = false
            state.error = action.payload as string
        })

        .addCase(validateSaisie.fulfilled, (state, action:PayloadAction<{id:number, statut:string}>)=>{
            const { id, statut } = action.payload
            const target = state.all.find((s)=>s.id === id)
            if (target)
                target.statut = statut
            state.pending = state.pending.filter((s)=>s.id !== id)
        })
        .addCase(validateSaisie.rejected, (state, action)=>{
            state.error = action.payload as string
        })
    }
})

export const { clearError } = SaisieSlice.actions
export default SaisieSlice.reducer;
