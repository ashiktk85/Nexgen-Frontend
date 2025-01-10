import { createSlice } from "@reduxjs/toolkit";
import { userLoginAction } from "../actions/userAction";


const initialState = {
  seekerInfo:{},
  error: null
}


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            state.seekerInfo = {}
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(userLoginAction.fulfilled, (state, action) => {
            if(action.payload){
                state.seekerInfo = action.payload?.userData || {}
                console.log('User data in store: ', state.seekerInfo)
            }
        })
        .addCase(userLoginAction.rejected, (state, action) => {
            state.error = action.payload || 'Login failed'
        })

    }
})

export const {logout} = userSlice.actions

export default userSlice.reducer