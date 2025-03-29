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
  return (
    <>
      <Box>
        {companies.map((company) => (
          <Box
            key={company._id}
            className="flex items-start gap-6 mb-6 border rounded-lg p-4 bg-white shadow-md transition hover:shadow-lg"
          >
            {/* Company Logo */}
            <Box className="relative inline-block group">
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
                <span className="whitespace-nowrap min-w-max absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-gray-900 text-gray-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-80 transition-opacity">
                  Visit Website
                </span>
              </MuiLink>
            </Box>

            {/* Company Details */}
            <Box className="flex-1">
              <Box className="flex justify-between items-center pb-3">
                <Typography variant="h6" className="text-gray-800 font-bold">
                  {company.companyName}
                </Typography>
                
                  <IconButton onClick={()=> handleEditClick(company)}>
                    <EditIcon color="primary" />
                  </IconButton>
            
              </Box>

              {/* Company Info with Icons */}
              <Stack spacing={1.2}>
                <Box display="flex" alignItems="center">
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
                </Box>

                <Box display="flex" alignItems="center">
                  <BusinessIcon
                    fontSize="small"
                    className="text-gray-600 mr-2"
                  />
                  <Typography variant="body2" className="text-gray-600">
                    <strong>Industry:</strong>{" "}
                    {company.industry || "Not specified"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <LocationOnIcon
                    fontSize="small"
                    className="text-gray-600 mr-2"
                  />
                  <Typography variant="body2" className="text-gray-600">
                    <strong>Location:</strong>{" "}
                    {company.location || "Not available"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <InfoIcon fontSize="small" className="text-gray-600 mr-2" />
                  <Typography variant="body2" className="text-gray-600">
                    <strong>Description:</strong>{" "}
                    {company.about || "Not available"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <HomeIcon fontSize="small" className="text-gray-600 mr-2" />
                  <Typography variant="body2" className="text-gray-600">
                    <strong>Address:</strong>{" "}
                    {company.address || "Not available"}
                  </Typography>
                </Box>
              </Stack>

              {/* Social Links with Icons */}
              <Stack direction="row" spacing={2} className="mt-3">
                {company.socialLinks?.linkedin && (
                  <MuiLink
                    href={company.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    <LinkedInIcon />
                  </MuiLink>
                )}
                {company.socialLinks?.twitter && (
                  <MuiLink
                    href={company.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    <TwitterIcon />
                  </MuiLink>
                )}
                {company.socialLinks?.facebook && (
                  <MuiLink
                    href={company.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    <FacebookIcon />
                  </MuiLink>
                )}
              </Stack>
            </Box>
          </Box>
        ))}
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

export default CompanyProfile;
