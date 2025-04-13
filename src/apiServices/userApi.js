import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance"


export const employerCompanyCreation = async (data, id) => {
    try {
        const response = await employerAxiosInstance.post(`/createCompany/${id}`, data);
        console.log("Response after compny creation ", response);
        return response.data;
    } catch (error) {
        let errorMessage = "Something went wrong";
        if (error.response) {
            errorMessage = error.response.data?.message || "Server error occurred";
        } else if (error.request) {
            errorMessage = "No response received from server";
        } else {
            errorMessage = error.message;
        }
        throw new Error(errorMessage);
    }
}

export const employerCompanyUpdate = async (id ,data) => {
    try {
        const response = await employerAxiosInstance.put(`/editCompany/${id}`, data);
        console.log("Response after compny creation ", response);
        return response.data;
    } catch (error) {
        console.error("Error updating company:", error);
        let errorMessage = "Something went wrong";
        if (error.response) {
            console.error("Server Response Error:", error.response.data);
            errorMessage = error.response.data?.message || "Server error occurred";
        } else if (error.request) {
            console.error("No response received from server");
            errorMessage = "No response received from server";
        } else {
            console.error("Request Error:", error.message);
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
}

export const employerJobCreation = async (data, id) => {
    try {
        const response = await employerAxiosInstance.post(`/createJobPost/${id}`, data);
        console.log('Response after job creation: ', response);
        return response.data;
    } catch (error) {
        console.error("Error in createJob at API services: ", error);
        let errorMessage = "An unexpected error occurred";
        if (error.response) {
            errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`;
        }
        throw new Error(errorMessage);
    }
};

export const employerJobUpdate = async (data, id) => {
    try {
        const response = await employerAxiosInstance.put(`/updateJobPost/${id}`, data);
        console.log('Response after job updation: ', response);
        return response.data;
    } catch (error) {
        console.error("Error in updation Job at API services: ", error);
        let errorMessage = "An unexpected error occurred";
        if (error.response) {
            errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`;
        }
        throw new Error(errorMessage);
    }
};

export const employerJobStatusChange = async ( JobId, data ) => {
    try {
        const response = await employerAxiosInstance.put(`/updateJobStatus/${JobId}`, data);
        console.log('Response after job status updation: ', response);
        return response;
    } catch (error) {
        console.error("Error in updation Job at API services: ", error);
        let errorMessage = "An unexpected error occurred";
        if (error.response) {
            errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`;
        }
        throw new Error(errorMessage);
    }
};

export const employerJobDelete = async ( jobId, empId ) => {
    try {
        const response = await employerAxiosInstance.delete(`/jobs/${jobId}`, {
            data: { empId },
        });
        console.log('Response after job deletion: ', response);
        return response;
    } catch (error) {
        console.error("Error in Job deletion: ", error);
        let errorMessage = "An unexpected error occurred";
        if (error.response) {
            errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`;
        }
        throw new Error(errorMessage);
    }
};

export const getCompanyById = async (data, id) => {
    try {
        const response = await employerAxiosInstance.post(`/getcompanybyid/${id}`, data);
        console.log('Response after job creation: ', response);
        return response.data;  // Return full response, not just status
    } catch (error) {
        console.error("Error in createJob at API services: ", error);

        // Extract error message from backend
        let errorMessage = "An unexpected error occurred";
        if (error.response) {
            errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`;
        }

        // Throw error instead of returning false
        throw new Error(errorMessage);
    }
};

