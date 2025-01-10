export const validateJobForm = (values) => {
    let errors = {};
  
    if (!values.jobTitle) {
      errors.jobTitle = "Job title is required";
    }
  
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email format";
    }
  
    if (!values.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(values.phone)) {
      errors.phone =
        "Phone number must be exactly 10 digits long and contain only numbers";
    }
  
    if (!values.location) {
      errors.location = "Location is required";
    }
  
    if (!values.experienceRequired) {
      errors.experienceRequired = "Experience is required";
    }
  
    if (!values.description) {
      errors.description = "Description is required";
    }
  
    if (!values.requirements) {
      errors.requirements = "Requirements is required";
    }
  
    return errors;
  };
  