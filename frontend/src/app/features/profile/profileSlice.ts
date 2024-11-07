import {createSlice} from '@reduxjs/toolkit';

const profileSlice = createSlice({
    name: 'auth',
    initialState: false,
    reducers: {
        toggleProfile: (state) => !state,
    },
});

export const { toggleProfile } = profileSlice.actions;
export default profileSlice.reducer;
