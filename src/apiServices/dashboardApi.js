import adminAxiosInstance from "@/config/axiosConfig/adminAxiosInstance";


export const getDashboardStats = async (timeRange) => {
  try {
    const response = await adminAxiosInstance.get(`/dashboard?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllJobs = async (page, limit) => {
  try {
    const response = await adminAxiosInstance.get(`/jobs?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const jobListUnList = async (jobId) => {
  try {
    const response = await adminAxiosInstance.patch(`/jobs/${jobId}/status`);
    return response.data;
  } catch (error) {
    throw error;
  }
};