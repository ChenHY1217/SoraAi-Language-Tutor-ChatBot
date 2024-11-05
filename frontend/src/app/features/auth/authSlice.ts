import {createSlice, current} from '@reduxjs/toolkit';

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as string) : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));

            // Set expiration time for the token
            const currentTime: number = new Date().getTime();
            const expirationTime: number = currentTime + 30 * 24 * 60 * 60 * 1000; // 30 days
            localStorage.setItem('expirationTime', expirationTime.toString()); // Store expiration time in local storage
        },

        logout: (state) => {
            state.userInfo = null;
            localStorage.clear();
        },
    },
});

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;
