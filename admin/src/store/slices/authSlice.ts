import type { UserPayload, AuthState } from './../../types/auth';
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from "jwt-decode"

const initialToken = localStorage.getItem('admin_token')

let initialUser: UserPayload | null = null

if (initialToken) {
    try {
        const decoded = jwtDecode<UserPayload>(initialToken)
        if (decoded.exp * 1000 > Date.now() && decoded.role === 'ADMIN')
            initialUser = decoded
        else
            localStorage.removeItem('admin_token')
    } catch {
        localStorage.removeItem('admin_token')
    }

}
const initialState: AuthState = {
    token: initialUser ? initialToken : null,
    user: initialUser,
    isAuthenticated: !!initialUser
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string }>) => {
            const { token } = action.payload
            state.token = token
            localStorage.setItem('admin_token', token)

            try {
                const decoded = jwtDecode<UserPayload>(token)
                if (decoded && decoded.role === 'ADMIN') {
                    state.user = decoded
                    state.isAuthenticated = true
                }
            }
            catch {
                state.user = null;
                state.isAuthenticated = false;
            }
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('admin_token');
        },
    }
})
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
