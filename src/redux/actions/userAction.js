import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";


export const userLoginAction = createAsyncThunk('user/login',
    async ({email, password}, {isRejectedWithValue}) => {
        try {
            const response = await userAxiosInstance.post('/login', {email, password})
            console.log('Response after login: ', response)
            if(response.status === 200){
                return {
                    success: true,
                    message: 'User login successfully',
                    userData: response.data.userData
                }
            }
        } catch (error) {
            console.error('Error in userLoginAction thunk: ', error)
            return isRejectedWithValue(error.response?.data?.message || 'Login failed')
        }
    }
)