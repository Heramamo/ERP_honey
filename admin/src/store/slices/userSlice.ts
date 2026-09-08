import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { UserState } from '../../types/user';
import { userService } from '../../service/user.service';

export const fetchUsers = createAsyncThunk('user/fetchAll', async () => {
    const response = await userService.fetchAll();
    return response;
});

export const createUser = createAsyncThunk('user/create', async (data: {
    email: string;
    mot_de_passe: string;
    nom: string;
    prenom: string;
    role: 'ADMIN' | 'RH' | 'FINANCE' | 'ENSEIGNANT';
}) => {
    const response = await userService.create(data);
    return response.user;
});

const initialState: UserState = {
    users: [],
    loading: false,
    error: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erreur lors de la récupération des utilisateurs';
            })
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erreur lors de la création de l\'utilisateur';
            });
    }
});

export default userSlice.reducer;