import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, Box, Slider, Chip } from "@mui/material";
import { Country, State, City } from "country-state-city";
import { useFormik } from "formik";
import Countries_Dataset from "@/data/Countries_Dataset.json";
import { jobData } from "@/data/Job_titles";
import { validateJobForm } from "@/Validations/CreateJob-validation";

function CreateJobForm({ selectedData = null }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRequirements, setSelectedRequirements] = useState(selectedData?.requirements || []);
  const [availableRequirements, setAvailableRequirements] = useState([]);

  const formik = useFormik({
    initialValues: {
      jobTitle: selectedData?.title || "",
      email: selectedData?.email || "",
      phone: selectedData?.phone || "",
      countryCode: selectedData?.countryCode || "+91",
      country: selectedData?.country || null,
      state: selectedData?.state || null,
      city: selectedData?.city || null,
      experienceRequired: selectedData?.experienceRequired || [0, 3],
      description: selectedData?.description || "",
      requirements: selectedData?.requirements || [],
    },
    validate: validateJobForm,
    onSubmit: (values, { setSubmitting }) => {
      console.log("Form Data", {
        ...values,
        selectedRequirements,
      });
      setSubmitting(false);
    },
  });

  // Initialize available requirements if there's a selected job title
  useEffect(() => {
    if (formik.values.jobTitle) {
      const jobRequirements =
        jobData.jobs.find((job) => job.title === formik.values.jobTitle)?.requirements || [];
      setAvailableRequirements(jobRequirements);
    }
  }, []);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

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
    formik.setFieldValue("jobTitle", newValue?.title || "");
    formik.setFieldTouched("jobTitle", true);
    if (newValue) {
      const jobRequirements =
        jobData.jobs.find((job) => job.title === newValue.title)?.requirements ||
        [];
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
    formik.setFieldValue("requirements", newRequirements);
    formik.setFieldTouched("requirements", true);
  };

  // Find the selected job object
  const selectedJob = jobData.jobs.find((job) => job.title === formik.values.jobTitle) || null;

  // Find the selected country object
  const selectedCountry = countries.find(
    (country) => country.isoCode === formik.values.country
  ) || null;

  // Find the selected state object
  const selectedState = states.find(
    (state) => state.isoCode === formik.values.state
  ) || null;

  // Find the selected city object
  const selectedCity = cities.find(
    (city) => city.name === formik.values.city
  ) || null;

  return (
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
                error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}
                helperText={formik.touched.jobTitle && formik.errors.jobTitle}
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
          {formik.touched.requirements && formik.errors.requirements && (
            <div className="text-red-500 text-sm mt-1">
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
          <Autocomplete
            options={Countries_Dataset}
            getOptionLabel={(option) => option.dial_code}
            value={Countries_Dataset.find(
              (option) => option.dial_code === formik.values.countryCode
            ) || null}
            onChange={(event, newValue) => {
              formik.setFieldValue(
                "countryCode",
                newValue ? newValue.dial_code : "+91"
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label="Code" />
            )}
            sx={{ width: 120 }}
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
          <Autocomplete
            options={countries}
            getOptionLabel={(option) => option.name}
            value={selectedCountry}
            onChange={(event, newValue) => {
              formik.setFieldValue("country", newValue ? newValue.isoCode : null);
              formik.setFieldValue("state", null);
              formik.setFieldValue("city", null);
              formik.setFieldTouched("country", true);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Country"
                error={formik.touched.country && Boolean(formik.errors.country)}
                helperText={formik.touched.country && formik.errors.country}
              />
            )}
          />

          <Autocomplete
            options={states}
            getOptionLabel={(option) => option.name}
            value={selectedState}
            disabled={!formik.values.country}
            onChange={(event, newValue) => {
              formik.setFieldValue("state", newValue ? newValue.isoCode : null);
              formik.setFieldValue("city", null);
              formik.setFieldTouched("state", true);
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
              formik.setFieldTouched("city", true);
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
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
  );
}

export default CreateJobForm;