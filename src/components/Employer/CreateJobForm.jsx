import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, Box, Slider, Chip } from "@mui/material";
import { Country, State, City } from "country-state-city";
import { useFormik } from "formik";
import { jobData } from "@/data/Job_titles";
import validateJobForm from "@/Validations/CreateJob-validation";
import { employerJobCreation } from "@/apiServices/userApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBuilding } from "react-icons/fa";

function CreateJobForm({ selectedData = null }) {
  const Employer = useSelector((state) => state.employer.employer);
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRequirements, setSelectedRequirements] = useState(
    selectedData?.requirements || []
  );
  const [availableRequirements, setAvailableRequirements] = useState([]);

  const formik = useFormik({
    initialValues: {
      jobTitle: selectedData?.title || "",
      email: selectedData?.email || "",
      phone: selectedData?.phone || "",
      countryCode: "+91",
      country: "IN",
      salaryFrom: selectedData?.salaryFrom || 0,
      salaryTo: selectedData?.salaryTo || 0,
      state: selectedData?.state || null,
      city: selectedData?.city || null,
      experienceRequired: selectedData?.experienceRequired || [0, 3],
      description: selectedData?.description || "",
      requirements: selectedData?.requirements || [],
    },
    validationSchema: validateJobForm,
    onSubmit: async (values) => {
      try {
        const status = await employerJobCreation(values, Employer?.employerId);
        if (status) {
          toast.success("Job created successfully");
          navigate("/employer/job_list");
          return;
        }
        toast.error(status?.message || "Error creating job post");
      } catch (error) {
        console.error("Job creation error:", error);

        // Extract and show detailed error message
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "An unexpected error occurred";
        toast.error(`Error: ${errorMessage}`);
      }
    },
  });

  useEffect(() => {
    if (formik.values.jobTitle) {
      const jobRequirements =
        jobData.jobs.find((job) => job.title === formik.values.jobTitle)
          ?.requirements || [];
      setAvailableRequirements(jobRequirements);
    }
  }, [formik.values.jobTitle]);

  useEffect(() => {
    if (formik.values.country) {
      const allStates = State.getStatesOfCountry(formik.values.country);
      setStates(allStates);
    } else {
      setStates([]);
    }
  }, [formik.values.country]);

  useEffect(() => {
    if (formik.values.state && formik.values.country) {
      const allCities = City.getCitiesOfState(
        formik.values.country,
        formik.values.state
      );
      setCities(allCities);
    } else {
      setCities([]);
    }
  }, [formik.values.state, formik.values.country]);

  const handleJobTitleChange = (event, newValue) => {
    const jobTitle = newValue?.title || "";
    formik.setFieldValue("jobTitle", jobTitle);

    if (newValue) {
      const jobRequirements =
        jobData.jobs.find((job) => job.title === newValue.title)
          ?.requirements || [];
      setAvailableRequirements(jobRequirements);
      setSelectedRequirements([]);
    } else {
      setAvailableRequirements([]);
      setSelectedRequirements([]);
    }
  };

  const handleRequirementToggle = (requirement) => {
    const newRequirements = selectedRequirements.includes(requirement)
      ? selectedRequirements.filter((r) => r !== requirement)
      : [...selectedRequirements, requirement];

    setSelectedRequirements(newRequirements);
    console.log(
      "Selected requirements at handleToggle requirements: ",
      newRequirements
    );
    formik.setFieldValue("requirements", newRequirements);
  };

  // Find the selected job object
  const selectedJob =
    jobData.jobs.find((job) => job.title === formik.values.jobTitle) || null;

  // Find the selected state object
  const selectedState =
    states.find((state) => state.isoCode === formik.values.state) || null;

  // Find the selected city object
  const selectedCity =
    cities.find((city) => city.name === formik.values.city) || null;

  return (
    <>
        <Box className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
    
      {/* <Box className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto"> */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FaBuilding className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {Employer.name.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold">Create Job</h1>
          <p className="text-sm text-gray-600">{Employer.location}</p>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-6 p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Job Information</h2>

            {/* Job Title Dropdown */}
            <div className="w-full">
              <Autocomplete
                options={jobData.jobs}
                getOptionLabel={(option) => option.title}
                value={selectedJob}
                onChange={handleJobTitleChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Job Title"
                    variant="outlined"
                    fullWidth
                    error={
                      formik.touched.jobTitle && Boolean(formik.errors.jobTitle)
                    }
                    helperText={
                      formik.touched.jobTitle && formik.errors.jobTitle
                    }
                  />
                )}
              />
            </div>

            {/* Requirements Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Requirements
              </label>
              <div className="flex flex-wrap gap-2">
                {availableRequirements.map((requirement) => (
                  <Chip
                    key={requirement}
                    label={requirement}
                    onClick={() => handleRequirementToggle(requirement)}
                    color={
                      selectedRequirements.includes(requirement)
                        ? "primary"
                        : "default"
                    }
                    className="cursor-pointer"
                  />
                ))}
              </div>
              {formik.touched.requirements &&
                formik.errors.requirements &&
                selectedRequirements.length === 0 && (
                  <div className="text-red-600 text-sm mt-1">
                    {formik.errors.requirements}
                  </div>
                )}
            </div>

            {/* Contact Information */}
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                fullWidth
                label="Contact Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </div>

            <div className="flex gap-2 w-3/4">
              <TextField
                sx={{ width: 80 }}
                label="Country Code"
                value={formik.values.countryCode}
                InputProps={{
                  readOnly: true,
                  style: {
                    pointerEvents: "none",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                type="tel"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </div>

            {/* Location Selection */}
            <div className="grid gap-4 sm:grid-cols-3">
              <TextField
                fullWidth
                label="Country"
                value="India"
                InputProps={{
                  readOnly: true,
                  style: {
                    pointerEvents: "none",
                  },
                }}
              />

              <Autocomplete
                options={states}
                getOptionLabel={(option) => option.name}
                value={selectedState}
                disabled={!formik.values.country}
                onChange={(event, newValue) => {
                  formik.setFieldValue(
                    "state",
                    newValue ? newValue.isoCode : null
                  );
                  formik.setFieldValue("city", null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="State"
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                  />
                )}
              />

              <Autocomplete
                options={cities}
                getOptionLabel={(option) => option.name}
                value={selectedCity}
                disabled={!formik.values.state}
                onChange={(event, newValue) => {
                  formik.setFieldValue("city", newValue ? newValue.name : null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                  />
                )}
              />
            </div>

            {/* Salary Range */}
            <div className="flex gap-5">
              <TextField
                fullWidth
                label="Salary From"
                name="salaryFrom"
                type="number"
                value={formik.values.salaryFrom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.salaryFrom && Boolean(formik.errors.salaryFrom)
                }
                helperText={
                  formik.touched.salaryFrom && formik.errors.salaryFrom
                }
                InputProps={{
                  startAdornment: <span className="text-gray-500 mr-1">₹</span>,
                }}
              />
              <TextField
                fullWidth
                label="Salary To"
                name="salaryTo"
                type="number"
                value={formik.values.salaryTo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.salaryTo && Boolean(formik.errors.salaryTo)
                }
                helperText={formik.touched.salaryTo && formik.errors.salaryTo}
                InputProps={{
                  startAdornment: <span className="text-gray-500 mr-1">₹</span>,
                }}
              />
            </div>

            {/* Experience Required */}
            <div className="w-full max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Required
              </label>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={formik.values.experienceRequired}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("experienceRequired", newValue);
                  }}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10}
                  marks
                />
                <div className="text-sm text-gray-600">
                  {formik.values.experienceRequired[0]} -{" "}
                  {formik.values.experienceRequired[1]}
                  {formik.values.experienceRequired[1] === 10 ? "+" : ""} years
                </div>
              </Box>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Job Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            Submit
          </button>
        </form>
       
      </Box>
    </>
  );
}

export default CreateJobForm;
