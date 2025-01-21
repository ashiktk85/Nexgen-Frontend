import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";

import employerAxiosInstnce from "@/config/axiosConfig/employerAxiosInstance";
import { LocalSee } from "@mui/icons-material";

// export const employerRegisterAction = createAsyncThunk('employer/register',
//     async (values, {isRejectedWithValue}) => {
//         try {
//             console.log(values , "val");
//             localStorage.setItem("otp-email" , values.email)
            
//             const response = await employerAxiosInstnce.post('/signup', values)
//             console.log(response.data);
//             return true;
            
//         } catch (error) {
//             console.error('Error in employerLoginAction thunk: ', error)
//             return isRejectedWithValue(error.response?.data?.message || 'emp reg failed')
//         }
//     }
// )

export const employerLogin = createAsyncThunk('employer/login' , 
    async (values , {isRejectedWithValue}) => {
        try {
            const  response = await employerAxiosInstnce('/login' ,values)
            console.log("redux file , user login" ,response);
            
        } catch (error) {
            console.error('Error in employerLoginAction thunk: ', error)
            throw new Error(error.response?.data?.message || 'emp reg failed')
        }
    }   
)