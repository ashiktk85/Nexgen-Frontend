import { createSlice } from "@reduxjs/toolkit";
import { employerLogin } from "../actions/EmplyerAction";

const initialState = {
    employer: {},
    error: null
};

const employerSlice = createSlice({
    name: "employer",
    initialState,
    reducers: {
        logout: (state) => {
            state.employer = {};
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(employerLogin.fulfilled, (state, action) => {
                if (action.payload) {
                    state.employer = action.payload.employerData || {};
                   
                }
            })
            .addCase(employerLogin.rejected, (state, action) => {
                state.error = action.payload || 'Login failed';
            });
    }
});

export const { logout } = employerSlice.actions;
export default employerSlice.reducer;
