import { configureStore } from "@reduxjs/toolkit";

import authReducer from './slices/authSlice'
import saisieReducer from './slices/saisieSlice'
import enseignantReducer from './slices/enseignantSlice'
export const store = configureStore({
    reducer:{
        auth:authReducer,
        saisies:saisieReducer,
        enseignant:enseignantReducer
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;