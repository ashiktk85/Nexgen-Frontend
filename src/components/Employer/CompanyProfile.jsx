import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Stack,
  Link as MuiLink,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LanguageIcon from "@mui/icons-material/Language";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import HomeIcon from "@mui/icons-material/Home";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import EditCompanyModal from "./EditCompanyModal";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CompanyProfile = ({
  companies,
  openModal,
  closeModal,
  modalState,
  selectedComp,
  setSelectedComp,
}) => {
  const navigate = useNavigate();

  const handleEditClick = (company) => {
    navigate(`/employer/addCompany/${company._id}`, { state: { company } });
  };

  const handleSaveCompany = async (updatedEmp) => {
    try {
      const resultAction = await dispatch(updateEmployer(updatedEmp));
      if (updateEmployer.fulfilled.match(resultAction)) {
        console.log("Profile updated successfully:", resultAction.payload);
        closeModal("editProfile"); // Close modal on success
      } else {
        console.error("Profile update failed:", resultAction.payload);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: i * 0.2 },
    }),
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.2, transition: { duration: 0.2 } },
    tap: { scale: 0.9 },
  };

  const avatarVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const tooltipVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 0.8, y: 0, transition: { duration: 0.2 } },
  };

  const iconVariants = {
    hover: { scale: 1.2, rotate: 5, transition: { duration: 0.2 } },
    tap: { scale: 0.9 },
  };

  return (
    <>
      <Box>
        <AnimatePresence>
          {companies.map((company, index) => (
            <motion.div
              key={company._id}
              className="flex items-start gap-6 mb-6 border rounded-lg p-4 bg-white shadow-md transition hover:shadow-lg"
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Company Logo */}
              <Box className="relative inline-block group">
                <motion.div
                  variants={avatarVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <MuiLink
                    href={company.webSite || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative"
                  >
                    <Avatar
                      src={company.logo || "/src/assets/Company-logo.png"}
                      sx={{ width: 100, height: 100, border: "4px solid white" }}
                    />
                    <motion.span
                      className="whitespace-nowrap min-w-max absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-gray-900 text-gray-400 text-xs px-2 py-1 rounded"
                      variants={tooltipVariants}
                      initial="hidden"
                      animate="hidden"
                      whileHover="visible"
                    >
                      Visit Website
                    </motion.span>
                  </MuiLink>
                </motion.div>
              </Box>

              {/* Company Details */}
              <Box className="flex-1">
                <Box className="flex justify-between items-center pb-3">
                  <Typography
                    variant="h6"
                    className="text-gray-800 font-bold"
                  >
                    {company.companyName}
                  </Typography>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <IconButton onClick={() => handleEditClick(company)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </motion.div>
                </Box>

                {/* Company Info with Icons */}
                <Stack spacing={1.2}>
                  <motion.div
                    className="flex items-center"
                    variants={itemVariants}
                  >
                    <LanguageIcon
                      fontSize="small"
                      className="text-gray-600 mr-2"
                    />
                    <Typography variant="body2" className="text-gray-600">
                      <strong>Website:</strong>{" "}
                      <MuiLink href={company.webSite || "#"} color="primary">
                        {company.webSite || "Not specified"}
                      </MuiLink>
                    </Typography>
                  </motion.div>

                  <motion.div
                    className="flex items-center"
                    variants={itemVariants}
                  >
                    <BusinessIcon
                      fontSize="small"
                      className="text-gray-600 mr-2"
                    />
                    <Typography variant="body2" className="text-gray-600">
                      <strong>Email:</strong>{" "}
                      {company.email || "Not specified"}
                    </Typography>
                  </motion.div>

                  <motion.div
                    className="flex items-center"
                    variants={itemVariants}
                  >
                    <BusinessIcon
                      fontSize="small"
                      className="text-gray-600 mr-2"
                    />
                    <Typography variant="body2" className="text-gray-600">
                      <strong>Phone:</strong>{" "}
                      {company.phone || "Not specified"}
                    </Typography>
                  </motion.div>

                  <motion.div
                    className="bg-slate-400 flex items-center "
                    variants={itemVariants}
                  >
                    <InfoIcon
                      fontSize="small"
                      className="text-gray-600 mr-2"
                    />
                    <Typography variant="body2" className="text-gray-600 "> {/*  text-sm lg:text-base whitespace-pre-wrap break-words */}
                      <strong>Description:</strong>{" "}
                      {company.about || "Not available"}
                    </Typography>
                  </motion.div>

                  <motion.div
                    className="flex items-center"
                    variants={itemVariants}
                  >
                    <HomeIcon
                      fontSize="small"
                      className="text-gray-600 mr-2"
                    />
                    <Typography variant="body2" className="text-gray-600">
                      <strong>Address:</strong>{" "}
                      {company.address || "Not available"}
                    </Typography>
                  </motion.div>
                </Stack>

                {/* Social Links with Icons */}
                <Stack direction="row" spacing={2} className="mt-3">
                  <AnimatePresence>
                    {company.socialLinks?.linkedin && (
                      <motion.div
                        variants={iconVariants}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <MuiLink
                          href={company.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600"
                        >
                          <LinkedInIcon />
                        </MuiLink>
                      </motion.div>
                    )}
                    {company.socialLinks?.twitter && (
                      <motion.div
                        variants={iconVariants}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <MuiLink
                          href={company.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600"
                        >
                          <TwitterIcon />
                        </MuiLink>
                      </motion.div>
                    )}
                    {company.socialLinks?.facebook && (
                      <motion.div
                        variants={iconVariants}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <MuiLink
                          href={company.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600"
                        >
                          <FacebookIcon />
                        </MuiLink>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Stack>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
      {/* {modalState.editCompany && (
        <EditCompanyModal
          company={selectedComp} // Pass the selected company for editing
          open={modalState.editCompany}
          close={() => closeModal("editCompany")}
          onSave={handleSaveCompany}
        />
      )} */}
    </>
  );
};

// Animation variants for stack items
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default CompanyProfile;