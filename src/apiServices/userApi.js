import employerAxiosInstnce from "@/config/axiosConfig/employerAxiosInstance"
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance"



// export const employerJobCreation = async (data, id) => {
//     try {
//         const response = await employerAxiosInstnce.post(`/createJobPost/${id}`, data);
//         console.log('Response after job creation: ', response);
//         return response.data.status;
//     } catch (error) {
//         if (error.response && error.response.status === 409) {
//             console.error("Job already exists. Please try a different title.");
//         } else {
//             console.error('Error in createJob at API services: ', error);
//         }
//         return false;
//     }
// };

export const employerJobCreation = async (data, id) => {
    try {
        const response = await employerAxiosInstnce.post(`/createJobPost/${id}`, data);
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

