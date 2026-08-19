import type { UserPayload, AuthState } from './../../types/auth';
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from "jwt-decode"

const initialToken = localStorage.getItem('access_token')

let initialUser: UserPayload | null = null

if (initialToken) {
    try {
        const decoded = jwtDecode<UserPayload>(initialToken)
        if (decoded.exp * 1000 > Date.now())
            initialUser = decoded
        else
            localStorage.removeItem('access_token')
    } catch (error) {
        localStorage.removeItem('access_token')
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
            console.log(token)
            state.token = token
            localStorage.setItem('access_token', token)

            try {
                const decode = jwtDecode<UserPayload>(token)
                console.log(token)
                console.log(decode)
                if (decode) {
                    state.user = decode
                    state.isAuthenticated = true
                }
            }
            catch (error) {
                state.user = null;
                state.isAuthenticated = false;
            }
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('access_token');
        },
    }
})
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;