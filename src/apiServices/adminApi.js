import adminAxiosInstance from "@/config/axiosConfig/adminAxiosInstance";

import { toast } from "sonner";

export const getAllUsersSerive = async (page, limit) => {
  try {
    const response = await adminAxiosInstance.get(
      `/getUsers?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error("Error in get all users at admin Api service: ", error);
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage =
        error.response.data.message ||
        `Error ${error.response.status}: ${error.response.statusText}`;
    }
    toast.error(errorMessage);
  }
};

export const userChangeStatusService = async (userId) => {
  try {
    const response = await adminAxiosInstance.put(`/changeStatus/${userId}`);
    return response;
  } catch (error) {
    console.error("Error in get all users at admin Api service: ", error);
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage =
        error.response.data.message ||
        `Error ${error.response.status}: ${error.response.statusText}`;
    }
    toast.error(errorMessage);
  }
};

export const getAllEmployerVerification = async (page, limit) => {
  try {
    const response = await adminAxiosInstance.get(
      `/getAllApplication?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error("Error in get all users at admin Api service: ", error);
    let errorMessage = "An unexpec ted error occurred";
    if (error.response) {
      errorMessage =
        error.response.data.message ||
        `Error ${error.response.status}: ${error.response.statusText}`;
    }
    toast.error(errorMessage);
  }
};

export const employerVerificationChangeStatus = async (applicationId, decision) => {
  try {
    const data = {
        'verificationStatus' : decision,
    }
    const response = await adminAxiosInstance.put(`/changeEmployerVerification/${applicationId}`, data);
    return response;
  } catch (error) {
    console.error("Error in get updating verification at admin Api service: ", error);
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage =
        error.response.data.message ||
        `Error ${error.response.status}: ${error.response.statusText}`;
    }
    toast.error(errorMessage);
  }
};
