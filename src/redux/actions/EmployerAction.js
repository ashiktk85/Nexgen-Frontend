import { createAsyncThunk } from "@reduxjs/toolkit";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";

export const employerLogin = createAsyncThunk(
    'employer/login',
    async (values, { rejectWithValue }) => {
        try {
            const response = await employerAxiosInstance.post('/login', values);
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


export const updateEmployer = createAsyncThunk("employer/updateProfile",
    async (updatedEmp, { rejectWithValue }) => {
        try {
            const response = await employerAxiosInstance.put('/updateProfile', updatedEmp);
            console.log("updates Employer in Actions file  :",response, response.message);

            return {
                status: response.status,
                employerData: response.data.response,
            };
        } catch (error) {
            console.error('Error in employer update thunk:', error);
            return rejectWithValue(error.response?.data?.message || 'Profile update failed')
        }
    }
)
