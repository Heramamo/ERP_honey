import { configureStore } from "@reduxjs/toolkit";

import authReducer from './slices/authSlice'
import saisieReducer from './slices/saisieSlice'
import enseignantReducer from './slices/enseignantSlice'
import teacherReducer from './slices/teacherSlice'
import paieReducer from './slices/paieSlice'
export const store = configureStore({
    reducer:{
        auth:authReducer,
        saisies:saisieReducer,
        enseignant:enseignantReducer,
        teachers:teacherReducer,
        paie:paieReducer
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;