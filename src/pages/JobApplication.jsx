import React from "react";
import { FaBuilding, FaPhone, FaUpload } from "react-icons/fa";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Countries_Dataset from "../data/Countries_Dataset.json";
import { useFormik } from "formik";
import Navbar from "../components/User/Navbar";

const JobApplication = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      countryCode: "+91",
      resume: null,
      additionalDoc: null,
      coverLetter: "",
    },
    validate: (values) => {
      let errors = {};
      if (!values.name) {
        errors.name = "Name is required";
      }
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Invalid email format";
      }
      if (!values.phone) {
        errors.phone = "Phone number is required";
      }
      if (!values.resume) {
        errors.resume = "Resume is required";
      }
      return errors;
    },
    onSubmit: (values) => {
      console.log("Form Data", values);
    },
  });

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("resume", file);
    }
  };

  const handleAdditionalDocs = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("additionalDoc", file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Job Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaBuilding className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Nexgen Company</span>
            </div>
            <h1 className="text-2xl font-bold">Product Designer</h1>
            <p className="text-sm text-gray-600">Porto, Portugal</p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="font-semibold">Personal Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name*
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formik.errors.name && (
                    <span className="text-red-500 text-sm">
                      {formik.errors.name}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <div className="flex">
                    <Autocomplete
                      id="country-code"
                      options={Countries_Dataset}
                      autoHighlight
                      value={
                        Countries_Dataset.find(
                          (option) =>
                            option.dial_code === formik.values.countryCode
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        formik.setFieldValue(
                          "countryCode",
                          newValue ? newValue.dial_code : "+91"
                        );
                      }}
                      getOptionLabel={(option) =>
                        `${option.dial_code} (${option.name})`
                      }
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                          {...props}
                        >
                          <img
                            loading="lazy"
                            width="20"
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            alt={option.name}
                          />
                          {option.name} ({option.dial_code})
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Country Code"
                          variant="outlined"
                        />
                      )}
                      sx={{ width: 150 }}
                    />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  {formik.errors.phone && (
                    <span className="text-red-500 text-sm">
                      {formik.errors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email*
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formik.errors.email && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Resume Upload */}
            <div className="space-y-2">
              <label
                htmlFor="resume"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Resume*
              </label>
              <label
                htmlFor="resume"
                className="rounded-lg border border-dashed border-gray-300 p-4 cursor-pointer flex items-center justify-center gap-2"
              >
                <FaUpload className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Browse file</span>
              </label>
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
              />
              {formik.values.resume && (
                <div className="mt-2 text-sm text-gray-600">
                  Uploaded file: <strong>{formik.values.resume.name}</strong>
                </div>
              )}
              {formik.errors.resume && (
                <span className="text-red-500 text-sm">
                  {formik.errors.resume}
                </span>
              )}
            </div>

            {/* Additional file Upload */}
            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="aadditionalFile"
              >
                Additional file (optional)
              </label>
              <label
                htmlFor="aadditionalFile"
                className="rounded-lg border border-dashed border-gray-300 p-4 cursor-pointer flex items-center justify-center gap-2"
              >
                <FaUpload className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Browse file</span>
              </label>
              <input
                type="file"
                id="additionalFile"
                name="additionalFile"
                accept=".pdf,.doc,.docx"
                onChange={handleAdditionalDocs}
                className="hidden"
              />
              {formik.values.additionalDoc && (
                <div className="mt-2 text-sm text-gray-600">
                  Uploaded file:{" "}
                  <strong>{formik.values.additionalDoc.name}</strong>
                </div>
              )}
              {formik.errors.resume && (
                <span className="text-red-500 text-sm">
                  {formik.errors.resume}
                </span>
              )}
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <label
                htmlFor="coverLetter"
                className="block text-sm font-medium text-gray-700"
              >
                Cover Letter (optional)
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formik.values.coverLetter}
                onChange={formik.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Application
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default JobApplication;
