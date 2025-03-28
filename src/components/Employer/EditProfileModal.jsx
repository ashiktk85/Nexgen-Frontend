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

const EditProfileModal = ({ employer = {}, open, close, onSave }) => {
  const [formData, setFormData] = useState(employer);

  // Sync formData when employer prop changes
  useEffect(() => {
    setFormData(employer);
  }, [employer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
    close(); // Ensure modal closes after save
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
          width: 400,
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
          Edit Employer Details
        </Typography>

        <TextField
          fullWidth
          label="Employer Name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formData.location || ""}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="About"
          name="about"
          value={formData.about || ""}
          onChange={handleChange}
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />

        <Box className="flex justify-end gap-4">
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProfileModal;
