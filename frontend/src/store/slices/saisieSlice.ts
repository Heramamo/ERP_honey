import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

import type { UserSaisieState, SaisiePayload } from "../../types/saisieFeuille";
import { saisieFeuilleService, type CreateSaisieDto } from "../../service/saisieFeuille.service";

const initialState:UserSaisieState = {
    saisies:[],
    loading: false,
    error: null,
}

export const fetchMySaisie = createAsyncThunk(
    'saisieFeuille/fetchMySaisies',
    async (_, {rejectWithValue})=>{
        try {
            return await saisieFeuilleService.getMySaisie()
        } catch (error:any) {
            return rejectWithValue(error.response?.data?.message) || "Erreur lors de chargement du saisie"
        }
    }
)

export const createSaisie = createAsyncThunk(
    'saisieFeuille/createSaisie',
    async(dto:CreateSaisieDto, {rejectWithValue})=>{
        try {
            return await saisieFeuilleService.create(dto)
        } catch (error:any) {
            return rejectWithValue(error.response?.data?.message) || "Erreur lors de creation du saisie"
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
            state.loading = false,
            state.error = action.payload as string
        })

        .addCase(createSaisie.fulfilled, (state, action:PayloadAction<SaisiePayload>)=>{
            state.saisies.unshift(action.payload)
        })
    }
})

export const { clearError } = SaisieSlice.actions
export default SaisieSlice.reducer;