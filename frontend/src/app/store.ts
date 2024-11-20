import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import authReducer from './features/auth/authSlice';
import profileReducer from './features/profile/profileSlice';
import languageReducer from './features/language/languageSlice';
import { apiSlice } from './api/apiSlice.ts';

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        language: languageReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware: any) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
});  

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;