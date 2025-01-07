import React from "react";
import { FaBuilding, FaPhone, FaUpload } from "react-icons/fa";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Countries_Dataset from "../../../data/Countries_Dataset.json";
import { useFormik } from "formik";
import Slider from "@mui/material/Slider";
import CreateJobForm from "@/components/Employer/CreateJobForm";

function CreateJob() {
  const formik = useFormik({
    initialValues: {
      jobTitle: "",
      email: "",
      phone: "",
      countryCode: "+91",
      location: "",
      experienceRequired: [0, 3],
      description: "",
      requirements: "",
    },
    validate: (values) => {
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
    },
    onSubmit: (values) => {
      console.log("Form Data", values);
    },
  });

  const handleChange = (event, newValue) => {
    formik.setFieldValue("experienceRequired", newValue);
  };

  const formSubmittionURL = "http:localhost:3000/api/job_create";

  return (
    <div className="my-6 px-2">
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Job Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaBuilding className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Nexgen Company</span>
            </div>
            <h1 className="text-2xl font-bold">Create Job</h1>
            <p className="text-sm text-gray-600">Porto, Portugal</p>
          </div>
          <CreateJobForm formSubmittionURL={formSubmittionURL} />
        </div>
      </main>
    </div>
  );
}

export default CreateJob;
