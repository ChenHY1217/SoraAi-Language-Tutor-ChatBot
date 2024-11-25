import {createSlice} from '@reduxjs/toolkit';

const profileSlice = createSlice({
    name: 'auth',
    initialState: false,
    reducers: {
        toggleProfile: (state) => !state,
        setProfile: (_state, action) => action.payload,
    },
});

export const { toggleProfile, setProfile } = profileSlice.actions;
export default profileSlice.reducer;
