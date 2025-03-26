import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditCompanyModal = ({ company = {}, open, close, onSave }) => {
  const [formData, setFormData] = useState({
    companyName: company.companyName || "",
    email: company.email || "",
    phone: company.phone || "",
    location: company.location || "",
    about: company.about || "",
    website: company.webSite || "",
  });

  const [errors, setErrors] = useState({});

  // Sync state when company prop updates
  useEffect(() => {
    setFormData({
      companyName: company.companyName || "",
      email: company.email || "",
      phone: company.phone || "",
      location: company.location || "",
      about: company.about || "",
      website: company.webSite || "",
    });
  }, [company]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    validateField(e.target.name, e.target.value);
  };

  // Validate individual fields
  const validateField = (name, value) => {
    let errorMsg = "";
    if (name === "companyName" && !value.trim()) {
      errorMsg = "Company Name is required";
    } else if (
      name === "email" &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
    ) {
      errorMsg = "Enter a valid email address";
    } else if (name === "phone" && !/^\d{7,15}$/.test(value)) {
      errorMsg = "Phone number must be between 7-15 digits";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  // Check if the form is valid
  const isFormValid = () => {
    return (
      Object.values(errors).every((err) => !err) &&
      formData.companyName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== ""
    );
  };

  // Handle Save button click
  const handleSave = () => {
    if (isFormValid()) {
      onSave(formData);
      close(); // Close modal after saving
    }
  };

  return (
    <Modal open={open} onClose={close}>
      <Box
        className="bg-white p-6 rounded-lg shadow-lg"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          width: 450,
          p: 4,
        }}
      >
        <IconButton
          onClick={close}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "gray",
            "&:hover": { color: "text.secondary" },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" className="pb-7 text-center">
          Edit Company Details
        </Typography>

        <TextField
          fullWidth
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          error={!!errors.companyName}
          helperText={errors.companyName}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="About"
          name="about"
          value={formData.about}
          onChange={handleChange}
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />

        <Box className="flex justify-end gap-4">
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={!isFormValid()}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditCompanyModal;
