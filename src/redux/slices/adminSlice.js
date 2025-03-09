import { createSlice } from "@reduxjs/toolkit";
import { adminLoginAction } from "../actions/AdminAction"; 


const initialState = {
  adminInfo:{},
  error: null,
}

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        logout: (state) => {
            state.adminInfo = {}
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(adminLoginAction.fulfilled, (state, action) => {
            if(action.payload){
                state.adminInfo = action.payload?.adminData || {}
              
            }
        })
        .addCase(adminLoginAction.rejected, (state, action) => {
            state.error = action.payload || 'Login failed'
        })

    }
})

export const {logout} = adminSlice.actions

export default adminSlice.reducer