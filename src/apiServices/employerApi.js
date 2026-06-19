import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";

export const getActiveJobTitles = async () => {
  try {
    const response = await employerAxiosInstance.get("/job-titles");
    return response?.data?.response || [];
  } catch (error) {
    console.error("Error fetching job titles:", error);
    return [];
  }
};

export const employerAnalyticsData = async (employerId) => {
    try {
        const response = await employerAxiosInstance.get(`/analytics/${employerId}`)
        return response
    } catch (error) {
        console.error('Error in Analytics Data at employer Api service: ', error)
        let errorMessage = "An unexpected error occurred";
        if(error.response){
            errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`
        }
        toast.error(errorMessage)
    }
}