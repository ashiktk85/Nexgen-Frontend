import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";
import { useFormik } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import validateCompanyForm from "@/Validations/Createcompany-validation";
import { FaBuilding } from "react-icons/fa";
import {
  employerCompanyCreation,
  employerCompanyUpdate,
} from "@/apiServices/userApi";
import { useSelector } from "react-redux";

const availableSocials = ["LinkedIn", "Twitter", "Facebook"];

const CompanyForm = ({ company = null }) => {
  const [selectedSocials, setSelectedSocials] = useState([]);
  const Employer = useSelector((state) => state.employer.employer);
  const navigate = useNavigate();

  // Determine if we are in "Edit" or "Add" mode
  const isEditMode = !!company;

  // Initial Form Values (Pre-filled if Editing)
  const initialValues = {
    companyName: company?.companyName || "",
    location: company?.location || "",
    industry: company?.industry || "",
    logo: null,
    address: company?.address || "",
    companyCertificate: null,
    about: company?.about || "",
    webSite: company?.webSite || "",
    socialLinks: {
      linkedin: company?.socialLinks?.linkedin || "",
      twitter: company?.socialLinks?.twitter || "",
      facebook: company?.socialLinks?.facebook || "",
    },
  };

  // Pre-select social links if editing
  useEffect(() => {
    if (company) {
      const existingSocials = availableSocials.filter(
        (social) => company?.socialLinks?.[social.toLowerCase()]
      );
      setSelectedSocials(existingSocials);
    }
  }, [company]);

  const formik = useFormik({
    initialValues,
    validationSchema: validateCompanyForm,
    onSubmit: async (values) => {
      console.log("Form submitted with values:", values); // Debugging step
      try {
        let response;
        if (isEditMode && company?._id) {
          response = await employerCompanyUpdate(company._id, values);
        } else {
          response = await employerCompanyCreation(
            values,
            Employer?.employerId
          );
        }

        if (response) {
          toast.success(
            isEditMode
              ? "Company updated successfully!"
              : "Company created successfully!"
          );
          setTimeout(() => {
            navigate("/employer/company_details");
          }, 1000);
        } else {
          toast.error(
            `Error: ${response?.message || "An unexpected error occurred"}`
          );
        }
      } catch (error) {
        console.error("Company form error:", error);
        toast.error(error.message || "Something went wrong");
      }
    },
  });

  return (
    <Box className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
      {/* Header */}
      <Box className="space-y-2">
        <div className="flex items-center gap-2">
          <FaBuilding className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600 py-2 font-semibold">
            {isEditMode ? "Edit Your Company" : "Add Your Company"}
          </span>
        </div>
        <Typography variant="h5 text-2xl font-bold">
          {isEditMode ? "Update Company Profile" : "Create a Company Profile"}
        </Typography>
      </Box>

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-6 mt-5">
        {/* Company Name */}
        <TextField
          fullWidth
          label="Company Name"
          name="companyName"
          {...formik.getFieldProps("companyName")}
          error={
            formik.touched.companyName && Boolean(formik.errors.companyName)
          }
          helperText={formik.touched.companyName && formik.errors.companyName}
        />
        {/* Industry */}
        <TextField
          fullWidth
          label="Industry"
          name="industry"
          {...formik.getFieldProps("industry")}
          error={formik.touched.industry && Boolean(formik.errors.industry)}
          helperText={formik.touched.industry && formik.errors.industry}
        />
        {/* Location */}
        <TextField
          fullWidth
          label="Location"
          name="location"
          {...formik.getFieldProps("location")}
          error={formik.touched.location && Boolean(formik.errors.location)}
          helperText={formik.touched.location && formik.errors.location}
        />
        {/* About */}
        <TextField
          fullWidth
          label="About Company"
          name="about"
          multiline
          rows={4}
          {...formik.getFieldProps("about")}
          error={formik.touched.about && Boolean(formik.errors.about)}
          helperText={formik.touched.about && formik.errors.about}
        />
        {/* Website */}
        <TextField
          fullWidth
          label="Company Website"
          name="webSite"
          type="url"
          {...formik.getFieldProps("webSite")}
          error={formik.touched.webSite && Boolean(formik.errors.webSite)}
          helperText={formik.touched.webSite && formik.errors.webSite}
        />
        {/* Address */}
        <TextField
          fullWidth
          label="Company Address"
          name="address"
          multiline
          rows={2}
          {...formik.getFieldProps("address")}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />
        {/* Logo Upload */}
        <Box className="space-y-2 border p-2">
          <label className="text-sm font-medium pr-3 text-gray-700">
            Company Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.currentTarget.files[0];
              if (file) {
                formik.setFieldValue("logo", file);
              }
            }}
          />
          {formik.touched.logo && formik.errors.logo && (
            <Typography variant="caption" color="error">
              {formik.errors.logo}
            </Typography>
          )}
          {company?.logo && (
            <Avatar
              src={company.logo}
              sx={{ width: 80, height: 80, mt: 1, borderRadius: 2 }}
            />
          )}
        </Box>
        {/* Company Certificate Upload */}
        <Box className="space-y-2 border p-2">
          <label className="text-sm font-medium pr-3 text-gray-700 py-1">
            Company Certificate
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) =>
              formik.setFieldValue(
                "companyCertificate",
                event.currentTarget.files[0]
              )
            }
          />
          {formik.touched.companyCertificate &&
            formik.errors.companyCertificate && (
              <Typography variant="caption" color="error">
                {formik.errors.companyCertificate}
              </Typography>
            )}
        </Box>
        {/* Social Media Links */}
        <Box>
          <Typography variant="body1 text-2xl font-bold">
            Social Media Links
          </Typography>
          <div className="flex flex-wrap gap-2 mt-2">
            {availableSocials.map((social) => (
              <Chip
                key={social}
                label={social}
                onClick={() =>
                  setSelectedSocials((prev) =>
                    prev.includes(social)
                      ? prev.filter((s) => s !== social)
                      : [...prev, social]
                  )
                }
                color={selectedSocials.includes(social) ? "primary" : "default"}
                className="cursor-pointer"
              />
            ))}
          </div>
          {selectedSocials.includes("LinkedIn") && (
            <TextField
              fullWidth
              label="LinkedIn Profile URL"
              name="socialLinks.linkedin"
              {...formik.getFieldProps("socialLinks.linkedin")}
              error={
                formik.touched.socialLinks?.linkedin &&
                Boolean(formik.errors.socialLinks?.linkedin)
              }
              helperText={
                formik.touched.socialLinks?.linkedin &&
                formik.errors.socialLinks?.linkedin
              }
            />
          )}
          {selectedSocials.includes("Twitter") && (
            <TextField
              fullWidth
              label="Twitter Profile URL"
              name="socialLinks.twitter"
              {...formik.getFieldProps("socialLinks.twitter")}
              error={
                formik.touched.socialLinks?.twitter &&
                Boolean(formik.errors.socialLinks?.twitter)
              }
              helperText={
                formik.touched.socialLinks?.twitter &&
                formik.errors.socialLinks?.twitter
              }
            />
          )}
          {selectedSocials.includes("Facebook") && (
            <TextField
              fullWidth
              label="Facebook Page URL"
              name="socialLinks.facebook"
              {...formik.getFieldProps("socialLinks.facebook")}
              error={
                formik.touched.socialLinks?.facebook &&
                Boolean(formik.errors.socialLinks?.facebook)
              }
              helperText={
                formik.touched.socialLinks?.facebook &&
                formik.errors.socialLinks?.facebook
              }
            />
          )}
        </Box>
        {/* Submit & Cancel Buttons */}
        <Box className="flex gap-4 mt-4">
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {isEditMode ? "Update Company Info" : "Submit Company Info"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => navigate("/employer/company_details")}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CompanyForm;
