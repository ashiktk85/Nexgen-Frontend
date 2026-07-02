import { createAsyncThunk } from "@reduxjs/toolkit";
import adminAxiosInstance from "@/config/axiosConfig/adminAxiosInstance";
import { getApiErrorMessage } from "@/utils/apiError";

export const adminLoginAction = createAsyncThunk(
    'admin/login',
    async (values, { rejectWithValue }) => {
        try {
            const response = await adminAxiosInstance.post('/login', values);
            console.log('Response after login: ', response)

            if(response.status === 200){
                return {
                    success: true,
                    message: 'Admin login successfully',
                    adminData: response.data.cred,
                }
            }
        } catch (error) {
            console.error('Error in adminLoginAction thunk:', error);
            return rejectWithValue(getApiErrorMessage(error, "Login failed"));
        }
    }
);
