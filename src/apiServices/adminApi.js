import adminAxiosInstance from "@/config/axiosConfig/adminAxiosInstance";

import { toast } from "sonner";

export const getAllUsersSerive = async (page, limit, search = "") => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await adminAxiosInstance.get(
      `/getUsers?${params.toString()}`
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

export const getAllUsersUnified = async (page, limit, filters = {}) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filters.search) params.append("search", filters.search);
    if (filters.role && filters.role !== "all") params.append("role", filters.role);
    if (filters.status && filters.status !== "all") params.append("status", filters.status);
    if (filters.registeredFrom) params.append("registeredFrom", filters.registeredFrom);
    if (filters.registeredTo) params.append("registeredTo", filters.registeredTo);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await adminAxiosInstance.get(`/all-users?${params.toString()}`);
    return response;
  } catch (error) {
    console.error("Error in getAllUsersUnified:", error);
    toast.error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const exportAllUsersXlsx = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.role && filters.role !== "all") params.append("role", filters.role);
    if (filters.status && filters.status !== "all") params.append("status", filters.status);
    if (filters.registeredFrom) params.append("registeredFrom", filters.registeredFrom);
    if (filters.registeredTo) params.append("registeredTo", filters.registeredTo);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await adminAxiosInstance.get(`/all-users/export?${params.toString()}`, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    console.error("Error in exportAllUsersXlsx:", error);
    toast.error(error.response?.data?.message || "Failed to export users");
    throw error;
  }
};

export const exportReport = async ({
  segment,
  format = "xlsx",
  search = "",
  from = "",
  to = "",
} = {}) => {
  const params = new URLSearchParams();
  params.append("segment", segment);
  params.append("format", format);
  if (search) params.append("search", search);
  if (from) params.append("from", from);
  if (to) params.append("to", to);
  const response = await adminAxiosInstance.get(`/reports/export?${params.toString()}`, {
    responseType: "blob",
  });
  return response;
};

export const getPlacementTracking = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);
  if (filters.from) params.append("from", filters.from);
  if (filters.to) params.append("to", filters.to);
  const response = await adminAxiosInstance.get(
    `/placement-tracking?${params.toString()}`
  );
  return response.data;
};

export const updatePlacementStatus = async (applicationId, status) => {
  const response = await adminAxiosInstance.patch(
    `/placement-tracking/${applicationId}`,
    { status }
  );
  return response.data;
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

// PRIORITY VISIBILITY FEATURE — update user role (public/student)
export const changeUserRoleService = async (userId, data) => {
  try {
    const response = await adminAxiosInstance.put(
      `/changeUserRole/${userId}`,
      data
    );
    return response;
  } catch (error) {
    console.error(
      "Error in changeUserRoleService at admin Api service: ",
      error
    );
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage =
        error.response.data.message ||
        `Error ${error.response.status}: ${error.response.statusText}`;
    }
    toast.error(errorMessage);
  }
};

export const getAllEmployerVerification = async (page, limit, type, search = "") => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await adminAxiosInstance.get(
      `/getAllApplication/${type}?${params.toString()}`
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

export const employerVerificationChangeStatus = async (employerId, decision, reason) => {
  try {
    if (decision === "Rejected") {
      const response = await adminAxiosInstance.post(
        `/rejectEmployer/${employerId}`,
        { reason }
      );
      return response;
    }

    const data = {
      verificationStatus: decision,
    };
    const response = await adminAxiosInstance.put(
      `/changeEmployerVerification/${employerId}`,
      data
    );
    return response;
  } catch (error) {
    console.error(
      "Error in get updating verification at admin Api service: ",
      error
    );
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage =
        error.response.data.message ||
        `Error ${error.response.status}: ${error.response.statusText}`;
    }
    toast.error(errorMessage);
  }
};

export const getAllEmployers = async (page, limit, search = "", filters = {}) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search) {
      params.append("search", search);
    }

    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);

    const response = await adminAxiosInstance.get(
      `/getEmployers?${params.toString()}`
    );
    return response;
  } catch (error) {
    console.error("Error in get all employers at admin Api service: ", error);
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage =
        error.response.data.message ||
        `Error ${error.response.status}: ${error.response.statusText}`;
    }
    toast.error(errorMessage);
  }
};

export const getAllShops = async (page, limit, filters = {}) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filters.search) params.append("search", filters.search);
    if (filters.listing && filters.listing !== "all") params.append("listing", filters.listing);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);
    const response = await adminAxiosInstance.get(
      `/getShops?${params.toString()}`
    );
    return response;
  } catch (error) {
    console.error("Error in get all shops at admin Api service: ", error);
    let errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    toast.error(errorMessage);
  }
};

// PRIORITY VISIBILITY FEATURE — bulk-create institute students
export const bulkCreateStudentsService = async (students) => {
  try {
    const response = await adminAxiosInstance.post("/students/bulk", {
      students,
    });
    return response;
  } catch (error) {
    console.error(
      "Error in bulkCreateStudentsService at admin Api service: ",
      error
    );
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage =
        error.response.data.message ||
        `Error ${error.response.status}: ${error.response.statusText}`;
    }
    toast.error(errorMessage);
  }
};
export const shopListUnList = async (shopId) => {
  try {
    const response = await adminAxiosInstance.put(`/changeShopStatus/${shopId}`);
    return response;
  } catch (error) {
    console.error("Error in shopListUnList at admin Api service: ", error);
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage =
        error.response.data.message ||
        `Error ${error.response.status}: ${error.response.statusText}`;
    }
    toast.error(errorMessage);
  }
};

export const trashShopAdmin = async (shopId) => {
  try {
    const response = await adminAxiosInstance.patch(`/shops/${shopId}/trash`);
    return response;
  } catch (error) {
    console.error("Error in trashShopAdmin:", error);
    toast.error(error.response?.data?.message || "Failed to move shop to trash");
    throw error;
  }
};

export const restoreShopAdmin = async (shopId) => {
  try {
    const response = await adminAxiosInstance.patch(`/shops/${shopId}/restore`);
    return response;
  } catch (error) {
    console.error("Error in restoreShopAdmin:", error);
    toast.error(error.response?.data?.message || "Failed to restore shop");
    throw error;
  }
};

export const deleteShopAdmin = async (shopId) => {
  try {
    const response = await adminAxiosInstance.delete(`/shops/${shopId}`);
    return response;
  } catch (error) {
    console.error("Error in deleteShopAdmin:", error);
    toast.error(error.response?.data?.message || "Failed to delete shop");
    throw error;
  }
};

export const getJobApplicationsAdmin = async (page, limit, search = "", filters = {}) => {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.append("search", search);
    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);
    return await adminAxiosInstance.get(`/job-applications?${params.toString()}`);
  } catch (error) {
    console.error("Error in getJobApplicationsAdmin:", error);
    toast.error(error.response?.data?.message || "Failed to fetch applications");
  }
};

export const getJobApplicantsByJobAdmin = async (jobId) => {
  try {
    return await adminAxiosInstance.get(`/job-applications/${jobId}`);
  } catch (error) {
    console.error("Error in getJobApplicantsByJobAdmin:", error);
    toast.error(error.response?.data?.message || "Failed to fetch applicants");
    throw error;
  }
};

export const employerListUnList = async (employerId) => {
    try {
        const response = await adminAxiosInstance.put(`/changeEmployerStatus/${employerId}`)
        return response
    } catch (error) {
        console.error('Error in employerListUnList at admin Api service: ', error)
        let errorMessage = "An unexpected error occurred";
        if(error.response){
            errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`
        }
        toast.error(errorMessage)
    }
}

export const getAllJobs = async (page, limit, filters = {}) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filters.search) params.append("search", filters.search);
    if (filters.listing && filters.listing !== "all") params.append("listing", filters.listing);
    if (filters.status && filters.status !== "all") params.append("status", filters.status);
    if (filters.jobType && filters.jobType !== "all") params.append("jobType", filters.jobType);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);

    const response = await adminAxiosInstance.get(
      `/getJobs?${params.toString()}`
    );
    return response;
  } catch (error) {
    console.error("Error in get all jobs at admin Api service: ", error);
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage =
        error.response.data.message ||
        `Error ${error.response.status}: ${error.response.statusText}`;
    }
    toast.error(errorMessage);
  }
};

export const deleteJobAdmin = async (jobId) => {
  try {
    return await adminAxiosInstance.delete(`/jobs/${jobId}`);
  } catch (error) {
    console.error("Error deleting job at admin Api service: ", error);
    let errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    toast.error(errorMessage);
    throw error;
  }
};



export const jobListUnList = async (jobId) => {
  try {
      const response = await adminAxiosInstance.put(`/changeJobStatus/${jobId}`)
      return response
  } catch (error) {
      console.error('Error in job ListUnList at admin Api service: ', error)
      let errorMessage = "An unexpected error occurred";
      if(error.response){
          errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`
      }
      toast.error(errorMessage)
  }
}

export const createJobPostAdmin = async (data) => {
  try {
    return await adminAxiosInstance.post("/jobs", data);
  } catch (error) {
    console.error("Error creating admin job:", error);
    throw error;
  }
};

export const updateJobPostAdmin = async (jobId, data) => {
  try {
    return await adminAxiosInstance.put(`/jobs/${jobId}`, data);
  } catch (error) {
    console.error("Error updating admin job:", error);
    throw error;
  }
};

export const getActiveJobTitlesAdmin = async () => {
  try {
    const response = await adminAxiosInstance.get("/job-titles/active");
    return response?.data?.response || [];
  } catch (error) {
    console.error("Error fetching active job titles:", error);
    return [];
  }
};

export const getCustomCitiesAdmin = async ({ state, country = "IN", search = "" }) => {
  try {
    const params = new URLSearchParams({ state, country });
    if (search) params.append("search", search);
    const response = await adminAxiosInstance.get(`/cities?${params.toString()}`);
    return response?.data?.response || [];
  } catch (error) {
    console.error("Error fetching custom cities:", error);
    return [];
  }
};

export const saveCustomCityAdmin = async ({ name, state, country = "IN" }) => {
  const response = await adminAxiosInstance.post("/cities", { name, state, country });
  return response?.data?.response;
};

export const getEmployerVerificationDetails = async (id) => {
  try {
    const response = await adminAxiosInstance.get(
      `/employer-verification-files/${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getJobTitlesAdmin = async (page = 1, limit = 20, search = "") => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) params.append("search", search);
    return await adminAxiosInstance.get(`/job-titles?${params.toString()}`);
  } catch (error) {
    console.error("Error fetching job titles:", error);
    throw error;
  }
};

export const createJobTitleAdmin = async (data) => {
  try {
    return await adminAxiosInstance.post("/job-titles", data);
  } catch (error) {
    console.error("Error creating job title:", error);
    throw error;
  }
};

export const updateJobTitleAdmin = async (id, data) => {
  try {
    return await adminAxiosInstance.put(`/job-titles/${id}`, data);
  } catch (error) {
    console.error("Error updating job title:", error);
    throw error;
  }
};

export const deleteJobTitleAdmin = async (id) => {
  try {
    return await adminAxiosInstance.delete(`/job-titles/${id}`);
  } catch (error) {
    console.error("Error deleting job title:", error);
    throw error;
  }
};

export const getPlatformSettings = async () => {
  try {
    return await adminAxiosInstance.get("/settings");
  } catch (error) {
    console.error("Error fetching platform settings:", error);
    throw error;
  }
};

export const updatePlatformSettings = async (data) => {
  try {
    return await adminAxiosInstance.put("/settings", data);
  } catch (error) {
    console.error("Error updating platform settings:", error);
    throw error;
  }
};

export const exportAllShopsXlsx = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.listing && filters.listing !== "all") params.append("listing", filters.listing);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);

    const response = await adminAxiosInstance.get(`/getShops/export?${params.toString()}`, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    console.error("Error in exportAllShopsXlsx:", error);
    toast.error(error.response?.data?.message || "Failed to export shops");
    throw error;
  }
};

export const exportAllEmployersXlsx = async (search = "", filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);

    const response = await adminAxiosInstance.get(`/getEmployers/export?${params.toString()}`, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    console.error("Error in exportAllEmployersXlsx:", error);
    toast.error(error.response?.data?.message || "Failed to export employers");
    throw error;
  }
};

export const exportJobApplicationsXlsx = async (params = {}) => {
  try {
    const urlParams = new URLSearchParams();
    if (params.search) urlParams.append("search", params.search);
    if (params.jobId) urlParams.append("jobId", params.jobId);
    if (params.from) urlParams.append("from", params.from);
    if (params.to) urlParams.append("to", params.to);

    const response = await adminAxiosInstance.get(`/job-applications/export?${urlParams.toString()}`, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    console.error("Error in exportJobApplicationsXlsx:", error);
    toast.error(error.response?.data?.message || "Failed to export applied students");
    throw error;
  }
};

export const exportAllJobsXlsx = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.listing && filters.listing !== "all") params.append("listing", filters.listing);
    if (filters.status && filters.status !== "all") params.append("status", filters.status);
    if (filters.jobType && filters.jobType !== "all") params.append("jobType", filters.jobType);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);

    const response = await adminAxiosInstance.get(`/getJobs/export?${params.toString()}`, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    console.error("Error in exportAllJobsXlsx:", error);
    toast.error(error.response?.data?.message || "Failed to export jobs");
    throw error;
  }
};