import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";

export const userLoginAction = createAsyncThunk(
  "user/login",
  async ({ email, password }, { isRejectedWithValue }) => {
    try {
      const response = await userAxiosInstance.post("/login", {
        email,
        password,
      });
      console.log("Response after login: ", response);
      if (response.status === 200) {
        return {
          success: true,
          message: "User login successfully",
          userData: response.data.cred,
        };
      }
    } catch (error) {
      console.error("Error in userLoginAction thunk: ", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }
);

export const userGoogleLoginAction = createAsyncThunk(
  "user/login",
  async (id_token, { rejectWithValue }) => {
    try {
      const response = await userAxiosInstance.post("/google-login", {
        credential: id_token,
      });
      console.log("Response after google login: ", response);
      console.log("Response after google login cred: ", response.data.cred);
      if (response.status === 200) {
        return {
          message: "Google Auth successfully",
          userData: response.data.cred,
        };
      }
    } catch (error) {
      console.error("Error in userGoogleLoginAction thunk: ", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }
);
