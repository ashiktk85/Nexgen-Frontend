import { createAsyncThunk } from "@reduxjs/toolkit";
import employerAxiosInstnce from "@/config/axiosConfig/employerAxiosInstance";

export const employerLogin = createAsyncThunk(
    'employer/login',
    async (values, { rejectWithValue }) => {
        try {
            const response = await employerAxiosInstnce.post('/login', values);
            console.log(response.data.employerCred, response.message);

            return {
                status: response.status,
                message: response.message,
                employerData: response.data.employerCred
            };
        } catch (error) {
            console.error('Error in employerLoginAction thunk:', error);
            throw new Error(error.response?.data?.message || 'emp reg failed')
        }
    }
);
