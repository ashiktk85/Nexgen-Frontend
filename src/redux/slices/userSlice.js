
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isBlocked: false
}


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: {

    }
})


export default userSlice.reducer