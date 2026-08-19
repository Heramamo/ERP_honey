import { configureStore } from "@reduxjs/toolkit";

import authReducer from './slices/authSlice'
import saisieReducer from './slices/saisieSlice'
export const store = configureStore({
    reducer:{
        auth:authReducer,
        saisies:saisieReducer
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;