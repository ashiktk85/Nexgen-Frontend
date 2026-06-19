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

export const getAllEmployers = async (page, limit, search = "") => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search) {
      params.append("search", search);
    }

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

export const getAllShops = async (page, limit, search = "") => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) params.append("search", search);
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

export const getAllJobs = async (page, limit, search = "") => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search) {
      params.append("search", search);
    }

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
}



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