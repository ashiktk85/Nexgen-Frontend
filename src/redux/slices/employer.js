import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  seekerInfo:{},
  error: null
}


const employerSlice = createSlice({
    name: "employer",
    initialState,
    reducers: {
        logout: (state) => {
            state.seekerInfo = {}
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(employerLogin.fulfilled, (state, action) => {
            if(action.payload){
                state.seekerInfo = action.payload?.userData || {}
                console.log('employer data in store: ', state.seekerInfo)
            }
        })
        .addCase(employerLogin.rejected, (state, action) => {
            state.error = action.payload || 'Login failed'
        })

    }
})

export const {logout} = employerSlice.actions

export default employerSlice.reducer 