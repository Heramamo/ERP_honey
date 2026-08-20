import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { EnseignantListState, EnseignantPayload } from "../../types/enseignant";
import { teacherService } from "../../service/teacher.service";

const initialState: EnseignantListState = {
    enseignants: [],
    loading: false,
    error: null,
}

export const fetchAllTeachers = createAsyncThunk(
    'enseignant/fetchAllTeachers',
    async (_, { rejectWithValue }) => {
        try {
            return await teacherService.getAll()
        } catch (error) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
            return rejectWithValue(message || "Erreur lors du chargement des enseignants")
        }
    }
)

const TeacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllTeachers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAllTeachers.fulfilled, (state, action: PayloadAction<EnseignantPayload[]>) => {
                state.loading = false
                state.enseignants = action.payload
            })
            .addCase(fetchAllTeachers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export default TeacherSlice.reducer;