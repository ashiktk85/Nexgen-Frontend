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

export const getCustomCities = async ({ state, country = "IN", search = "" }) => {
  try {
    const params = new URLSearchParams({ state, country });
    if (search) params.append("search", search);
    const response = await employerAxiosInstance.get(`/cities?${params.toString()}`);
    return response?.data?.response || [];
  } catch (error) {
    console.error("Error fetching custom cities:", error);
    return [];
  }
};

export const saveCustomCity = async ({ name, state, country = "IN" }) => {
  const response = await employerAxiosInstance.post("/cities", { name, state, country });
  return response?.data?.response;
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