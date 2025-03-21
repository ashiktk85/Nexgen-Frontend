import { createSlice } from "@reduxjs/toolkit";
import { employerLogin, updateEmployer } from "../actions/EmployerAction";

const initialState = {
    employer: {},
    error: null,
    loading: false,
};

const employerSlice = createSlice({
    name: "employer",
    initialState,
    reducers: {
        logout: (state) => {
            state.employer = {};
            state.error = null;
        },
        setEmployer: (state, action) => {
            state.employer = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle employer login
            .addCase(employerLogin.fulfilled, (state, action) => {
                if (action.payload) {
                    state.employer = action.payload.employerData || {};

                }
            })
            .addCase(employerLogin.rejected, (state, action) => {
                state.error = action.payload || 'Login failed';
            })
            // Handle employer profile update
            .addCase(updateEmployer.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateEmployer.fulfilled, (state, action) => {
                state.loading = false;
                state.employer = { ...state.employer, ...action.payload.employerData };
            })
            .addCase(updateEmployer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});

export const { logout, setEmployer } = employerSlice.actions;
export default employerSlice.reducer;
