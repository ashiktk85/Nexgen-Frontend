import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, Box, Slider, Chip } from "@mui/material";
import { Country, State, City } from "country-state-city";
import { useFormik } from "formik";
import Countries_Dataset from "@/data/Countries_Dataset.json";

const jobData = {
  jobs: [
    {
      title: "Mobile Service",
      requirements: [
        "Normal Works - Android Only",
        "Normal Work - Android & iPhone",
        "Chip-Level Work - Android Only",
        "Chip-Level Work - Android & iPhone",
        "Normal Glass Separating",
        "Edge Glass Separating",
        "Normal Software",
        "Advanced Software & Programming"
      ]
    },
    {
      title: "Mobile Service Faculty",
      requirements: [
        "Good Communication Skill",
        "Normal Works - Android Only",
        "Normal Work - Android & iPhone",
        "Chip-Level Work - Android Only",
        "Chip-Level Work - Android & iPhone",
        "Normal Glass Separating",
        "Edge Glass Separating",
        "Normal Software",
        "Advanced Software & Programming"
      ]
    },
    {
      title: "Mobile Service Manager",
      requirements: [
        "Good Communication Skill",
        "Normal Works - Android Only",
        "Normal Work - Android & iPhone",
        "Chip-Level Work - Android Only",
        "Chip-Level Work - Android & iPhone",
        "Normal Glass Separating",
        "Edge Glass Separating",
        "Normal Software",
        "Advanced Software & Programming",
        "Technical Knowledge of Mobile",
        "Problem Solving Skill",
        "Financial Management Skill",
        "Leadership & Team Management Skill"
      ]
    },
    {
      title: "Sales Executive",
      requirements: [
        "Communication Skills",
        "Customer Handling and Satisfaction Skill",
        "Problem-Solving Skill",
        "Teamwork and Collaboration",
        "Time Management",
        "Attention to Detail",
        "Adaptability to New Technologies",
        "Patience and Professionalism"
      ]
    },
    {
      title: "Sales & Mobile Service",
      requirements: [
        "Communication Skills",
        "Customer Handling and Satisfaction Skill",
        "Problem-Solving Skill",
        "Teamwork and Collaboration",
        "Time Management",
        "Attention to Detail",
        "Adaptability to New Technologies",
        "Patience and Professionalism",
        "Normal Works - Android Only",
        "Normal Work - Android & iPhone",
        "Chip-Level Work - Android Only",
        "Chip-Level Work - Android & iPhone",
        "Normal Glass Separating",
        "Edge Glass Separating",
        "Normal Software",
        "Advanced Software & Programming"
      ]
    },
    {
      title: "Junior/Training",
      requirements: [
        "Normal Works - Android Only",
        "Normal Work - Android & iPhone",
        "Chip-Level Work - Android Only",
        "Chip-Level Work - Android & iPhone",
        "Normal Glass Separating",
        "Edge Glass Separating",
        "Normal Software",
        "Advanced Software & Programming",
        "Driving Licence"
      ]
    }
  ]
};

function CreateJobForm({ selectedData = null }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [availableRequirements, setAvailableRequirements] = useState([]);

  const formik = useFormik({
    initialValues: {
      jobTitle: selectedData?.title || "",
      email: selectedData?.email || "",
      phone: selectedData?.phone || "",
      countryCode: selectedData?.countryCode || "+91",
      country: selectedData?.country || "",
      state: selectedData?.state || "",
      city: selectedData?.city || "",
      experienceRequired: selectedData?.experienceRequired || [0, 3],
      description: selectedData?.description || "",
      requirements: selectedData?.requirements || [],
    },
    onSubmit: (values) => {
      console.log("Form Data", {
        ...values,
        selectedRequirements,
      });
    },
  });

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (formik.values.country) {
      const allStates = State.getStatesOfCountry(formik.values.country);
      setStates(allStates);
    }
  }, [formik.values.country]);

  useEffect(() => {
    if (formik.values.state) {
      const allCities = City.getCitiesOfState(
        formik.values.country,
        formik.values.state
      );
      setCities(allCities);
    }
  }, [formik.values.state, formik.values.country]);

  const handleJobTitleChange = (event, newValue) => {
    formik.setFieldValue("jobTitle", newValue?.title || "");
    if (newValue) {
      const jobRequirements = jobData.jobs.find(
        (job) => job.title === newValue.title
      )?.requirements || [];
      setAvailableRequirements(jobRequirements);
      setSelectedRequirements([]); // Reset selected requirements
    } else {
      setAvailableRequirements([]);
      setSelectedRequirements([]);
    }
  };

  const handleRequirementToggle = (requirement) => {
    setSelectedRequirements((prev) =>
      prev.includes(requirement)
        ? prev.filter((r) => r !== requirement)
        : [...prev, requirement]
    );
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Job Information</h2>
        
        {/* Job Title Dropdown */}
        <div className="w-full">
          <Autocomplete
            options={jobData.jobs}
            getOptionLabel={(option) => option.title}
            onChange={handleJobTitleChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Job Title"
                variant="outlined"
                fullWidth
              />
            )}
          />
        </div>

        {/* Requirements Selection */}
        {availableRequirements.length > 0 && (
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
                  color={selectedRequirements.includes(requirement) ? "primary" : "default"}
                  className="cursor-pointer"
                />
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            fullWidth
            label="Contact Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          
          <div className="flex gap-2">
            <Autocomplete
              options={Countries_Dataset}
              getOptionLabel={(option) => option.dial_code}
              value={Countries_Dataset.find(
                (option) => option.dial_code === formik.values.countryCode
              )}
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
            />
          </div>
        </div>

        {/* Location Selection */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Autocomplete
            options={countries}
            getOptionLabel={(option) => option.name}
            value={countries.find((country) => country.isoCode === formik.values.country)}
            onChange={(event, newValue) => {
              formik.setFieldValue("country", newValue ? newValue.isoCode : "");
              formik.setFieldValue("state", "");
              formik.setFieldValue("city", "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Country" />
            )}
          />

          {formik.values.country && (
            <Autocomplete
              options={states}
              getOptionLabel={(option) => option.name}
              value={states.find((state) => state.isoCode === formik.values.state)}
              onChange={(event, newValue) => {
                formik.setFieldValue("state", newValue ? newValue.isoCode : "");
                formik.setFieldValue("city", "");
              }}
              renderInput={(params) => (
                <TextField {...params} label="State" />
              )}
            />
          )}

          {formik.values.state && (
            <Autocomplete
              options={cities}
              getOptionLabel={(option) => option.name}
              value={cities.find((city) => city.name === formik.values.city)}
              onChange={(event, newValue) => {
                formik.setFieldValue("city", newValue ? newValue.name : "");
              }}
              renderInput={(params) => (
                <TextField {...params} label="City" />
              )}
            />
          )}
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
              {formik.values.experienceRequired[0]} - {formik.values.experienceRequired[1]}{formik.values.experienceRequired[1] === 10 ? "+" : ""} years
            </div>
          </Box>
        </div>

        {/* Description and Additional Requirements */}
        <div className="space-y-4">
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Job Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
      >
        Save Job
      </button>
    </form>
  );
}

export default CreateJobForm;