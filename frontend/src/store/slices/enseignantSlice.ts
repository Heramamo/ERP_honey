import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { EnseignantProfile, EnseignantState } from "../../types/enseignant";
import { teacherService } from "../../service/teacher.service";

const initialState: EnseignantState = {
    enseignant: null,
    loading: false,
    error: null,
}

export const fetchMyProfile = createAsyncThunk(
    'enseignant/fetchMyProfile',
    async (_, { rejectWithValue }) => {
        try {
            return await teacherService.getMyProfile()
        } catch (error) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
            return rejectWithValue(message || "Erreur lors du chargement du profil")
        }
    }
)

const EnseignantSlice = createSlice({
    name: 'enseignant',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyProfile.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMyProfile.fulfilled, (state, action: PayloadAction<EnseignantProfile>) => {
                state.loading = false
                state.enseignant = action.payload
            })
            .addCase(fetchMyProfile.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export default EnseignantSlice.reducer;
