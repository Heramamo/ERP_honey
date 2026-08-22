import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { EnseignantListState, EnseignantPayload } from "../../types/enseignant";
import { teacherService, type CreateTeacherDto } from "../../service/teacher.service";
import { getApiErrorMessage } from "../../service/error";

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
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors du chargement des enseignants"))
        }
    }
)

export const createTeacher = createAsyncThunk(
    'enseignant/createTeacher',
    async (dto: CreateTeacherDto, { rejectWithValue }) => {
        try {
            return await teacherService.createTeacher(dto)
        } catch (error) {
            return rejectWithValue(getApiErrorMessage(error, "Erreur lors de la création de l'enseignant"))
        }
    }
)

const TeacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        }
    },
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
            .addCase(createTeacher.fulfilled, (state, action: PayloadAction<EnseignantPayload>) => {
                state.loading = false
                state.enseignants.unshift(action.payload)
            })
            .addCase(createTeacher.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export const { clearError } = TeacherSlice.actions;
export default TeacherSlice.reducer;