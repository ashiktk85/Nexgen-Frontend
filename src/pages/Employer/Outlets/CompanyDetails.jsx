import {
  Box,
  Container,
  Typography,
  Grid,
  Avatar,
  Stack,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddCardIcon from "@mui/icons-material/AddCard";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import GppMaybeTwoToneIcon from "@mui/icons-material/GppMaybeTwoTone";

import { useEffect, useRef, useState } from "react";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import EditProfileModal from "@/components/Employer/EditProfileModal";

import { updateEmployer } from "@/redux/actions/EmployerAction";
import CompanyProfile from "@/components/Employer/CompanyProfile";

export default function CompanyDetails() {
  const aboutRef = useRef(null);
  const jobsRef = useRef(null);
  const peopleRef = useRef(null);
  const lifeRef = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [modalState, setModalState] = useState({
    editProfile: false,
    editCompany: false,
  });
  const [selectedComp, setSelectedComp] = useState(null);
  const employer = useSelector((state) => state.employer.employer);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const { data } = await employerAxiosInstance.get(
          `/job-list/${employer?.employerId}`
        );
        setJobs(data.jobPosts);
      } catch (error) {
        console.error("An error occurred while fetching jobs", error);
      }
    };
    fetchJobData();
  }, []);

  
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const { data } = await employerAxiosInstance.get(`/company-list/${employer?.employerId}`);
        setCompanies(data);
        console.log(data);
      } catch (error) {
        console.error("An error occurred in fetching company", error);
      }
    }
    fetchCompanyData();
  }, []);
  
  const openModal = (modalType) => {
    setModalState((prev) => ({ ...prev, [modalType]: true }));
  };

  // Close a specific modal
  const closeModal = (modalType) => {
    setModalState((prev) => ({ ...prev, [modalType]: false }));
  };

  // Handle save for profile edit

const handleSaveProfile = async(updatedEmp)=>{
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
}
  

  return (
    <Container maxWidth="lg" className="py-8">
      {/* Employer Section */}
      <Box className="bg-white shadow-lg rounded-lg p-6 mb-6 relative">
        <Box className=" absolute flex relative items-center gap-4">
          <Box className="flex-1">
            <Box className="flex justify-between items-center pb-3">
              <Typography variant="h5" className="font-semibold">
                Employer
              </Typography>

              <IconButton onClick={() => openModal("editProfile")}>
                <EditIcon />
              </IconButton>
            </Box>
            <Box className="flex-1 space-y-1">
              <Box className="flex gap-2 items-center">
                <Typography variant="body1" className="text-gray-700">
                  {employer.name?.toUpperCase()}
                </Typography>
                {employer.isVerified ? (
                  <VerifiedUserIcon
                    sx={{
                      fontSize: 24, // Corrected font size
                      color: "rgb(18, 171, 241)",
                      borderRadius: "50%",
                      padding: "4px", // Corrected padding
                      boxShadow: "0 0 7px rgba(61, 184, 255, 0.8)", // Glow effect
                      transition: "0.3s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 0 10px rgba(61, 184, 255, 1)", // Stronger glow on hover
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                ) : (
                  <Link to="/employer/verification">
                    <GppMaybeTwoToneIcon
                      sx={{
                        fontSize: 24, // Corrected font size
                        color: "rgb(105, 105, 105)",
                        borderRadius: "50%",
                        padding: "4px", // Corrected padding
                        boxShadow: "0 0 7px rgba(75, 81, 85, 0.8)", // Glow effect
                        transition: "0.3s ease-in-out",
                        "&:hover": {
                          boxShadow: "0 0 15px rgba(75, 81, 85, 1)", // Stronger glow on hover
                          transform: "scale(1.1)",
                        },
                      }}
                    />
                  </Link>
                )}
              </Box>
              {/* Email & Phone */}
              <Typography variant="body2" className="text-gray-500">
                Email: {employer.email}
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                Phone: {employer.phone}
              </Typography>
              {/* Location */}
              <Typography variant="body2" className="text-gray-400">
                Location: {employer.location}
              </Typography>

              {/* Company Verification & Status */}
              <Typography variant="body2" className="text-gray-700">
                {employer.isBlocked ? "❌ Blocked" : "✅ Active"}
              </Typography>

              {/* About Section */}
              <Typography variant="body1" className="text-gray-700 pt-2">
                {employer.about || "add About"}
              </Typography>

              {/* Social Links */}
              <Stack direction="row" spacing={2} className="mt-3">
                {employer.socialLinks?.linkedin && (
                  <Link
                    to={employer.socialLinks.linkedin}
                    className="text-blue-600"
                  >
                    LinkedIn
                  </Link>
                )}
                {employer.socialLinks?.twitter && (
                  <Link
                    to={employer.socialLinks.twitter}
                    className="text-blue-600"
                  >
                    Twitter
                  </Link>
                )}
                {employer.socialLinks?.facebook && (
                  <Link
                    to={employer.socialLinks.facebook}
                    className="text-blue-600"
                  >
                    Facebook
                  </Link>
                )}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Company Section */}
      <Box className="bg-white shadow-lg rounded-lg p-6 mb-6 relative">
        <Typography variant="h5" className="font-semibold">
          {companies.length > 0 ? "Company Details" : "Add Your Company"}
        </Typography>
        {/* If Employer Has Companies, Show List */}
        {companies.length > 0 ? (
          // companies.map((company) => (
          //   <Box
          //     key={company._id}
          //     className="flex items-start gap-6 mb-6 border-b pb-4"
          //   >
          //     {/* Company Logo */}
          //     <Box className="relative inline-block group">
          //       <Link
          //         to={company.webSite || "#"}
          //         className="text-blue-600 relative"
          //       >
          //         <Avatar
          //           src={company.logo || "/src/assets/Company-logo.png"}
          //           sx={{ width: 100, height: 100, border: "4px solid white" }}
          //         />
          //         <span className="whitespace-nowrap min-w-max absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-gray-900 text-gray-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-80 transition-opacity">
          //           Visit Website
          //         </span>
          //       </Link>
          //     </Box>

          //     {/* Company Info */}
          //     <Box className="flex-1">
          //       <Box className="flex justify-between items-center pb-3">
          //         <Typography variant="h6" className="text-gray-800">
          //           {company.companyName}
          //         </Typography>
          //         <IconButton
          //           onClick={() => {
          //             setSelectedComp(company._id);
          //             openModal("editCompany");
          //           }}
          //         >
          //           <EditIcon />
          //         </IconButton>
          //       </Box>
          //       <Typography variant="body2" className="text-gray-600">
          //         <strong>Website:</strong> {company.webSite || "Not specified"}
          //       </Typography>
          //       <Typography variant="body2" className="text-gray-600">
          //         <strong>Industry:</strong>{" "}
          //         {company.industry || "Not specified"}
          //       </Typography>

          //       <Typography variant="body2" className="text-gray-400">
          //         <strong>Location:</strong>{" "}
          //         {company.location || "Not available"}
          //       </Typography>
          //       <Typography variant="body2" className="text-gray-400">
          //         <strong>Description:</strong>{" "}
          //         {company.about || "Not available"}
          //       </Typography>
          //       <Typography variant="body2" className="text-gray-400">
          //         <strong>Address:</strong>{" "}
          //         {company.address || "Not available"}
          //       </Typography>

          //       {/* <Stack direction="row" spacing={2} className="mt-2">
          //         <Chip
          //           label={`Verified: ${
          //             company.isVerified ? "✅ Yes" : "❌ No"
          //           }`}
          //           color={company.isVerified ? "success" : "default"}
          //         />
          //         <Chip
          //           label={`Status: ${
          //             company.isBlocked ? "❌ Blocked" : "✅ Active"
          //           }`}
          //           color={company.isBlocked ? "error" : "primary"}
          //         />
          //       </Stack> */}

          //       {/* About Section */}
          //       {company.about && (
          //         <Typography variant="body1" className="text-gray-700 pt-2">
          //           {company.about}
          //         </Typography>
          //       )}

          //       {/* Social Links */}
          //       <Stack direction="row" spacing={2} className="mt-3">
          //         {company.socialLinks?.linkedin && (
          //           <Link
          //             to={company.socialLinks.linkedin}
          //             className="text-blue-600"
          //           >
          //             LinkedIn
          //           </Link>
          //         )}
          //         {company.socialLinks?.twitter && (
          //           <Link
          //             to={company.socialLinks.twitter}
          //             className="text-blue-600"
          //           >
          //             Twitter
          //           </Link>
          //         )}
          //         {company.socialLinks?.facebook && (
          //           <Link
          //             to={company.socialLinks.facebook}
          //             className="text-blue-600"
          //           >
          //             Facebook
          //           </Link>
          //         )}
          //       </Stack>
          //     </Box>
          //   </Box>
          // ))
          <CompanyProfile
            companies={companies}
            openModal={openModal}
            closeModal={closeModal}
            modalState={modalState}
            selectedComp={selectedComp}
            setSelectedComp={setSelectedComp}
          />
        ) : (
          // If No Company, Show "Add Company" Message
          <Box className="text-center p-6">
            <Typography variant="body1" className="text-gray-500">
              You haven't added a company yet. Click below to add one.
            </Typography>
            <Link to="/employer/addCompany">
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Add Company
              </button>
            </Link>
          </Box>
        )}
      </Box>

      {/* Jobs Section */}
      <Box className="bg-white shadow-lg rounded-lg p-6 mb-6" ref={jobsRef}>
        <Box className="flex justify-between items-center">
          <Typography variant="h5" className="font-semibold">
            Jobs
          </Typography>
          <Box className="relative inline-block group">
            <Link to="/employer/create_job" className="text-blue-600 relative">
              <IconButton>
                <AddCardIcon />
              </IconButton>
              <span className="whitespace-nowrap min-w-ma absolute bottom-[-30px] left-1/2 transform -transform-x-1/2 bg-gray-900 text-gray-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-80 transition-opacity">
                create new job post
              </span>
            </Link>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} sm={6} key={job._id}>
              <Box className="border border-gray-200 rounded-lg p-4 shadow-md">
                <Typography variant="h6" className="font-semibold">
                  {job.jobTitle}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {job.city} • Jobtype
                </Typography>
                {/* <Stack direction="row" spacing={1} className="mt-2">
                  {job.requirements.map((requ, index) => (
                    <Chip key={index} label={requ} />
                  ))}
                </Stack> */}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* People Section */}
      {/* <Box className="bg-white shadow-lg rounded-lg p-6 mb-6" ref={peopleRef}>
        <Typography variant="h5" className="font-semibold">
          People
        </Typography>
        <Box className="flex mt-4">
          {[...Array(6)].map((_, i) => (
            <Avatar
              key={i}
              src="/src/assets/Candidate.png"
              className="w-10 h-10 -ml-4"
            />
          ))}
        </Box>
      </Box> */}

      {/* Life Section */}
      {/* <Box className="bg-white shadow-lg rounded-lg p-6" ref={lifeRef}>
        <Typography variant="h5" className="font-semibold">
          Life
        </Typography>
        <Grid container spacing={2} className="mt-4">
          <Grid item xs={12} sm={6}>
            <img
              src="/src/assets/companyLife.jpg"
              alt="Company life"
              className="rounded-lg w-full h-full object-cover"
              style={{ maxHeight: "300px" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
              {[1, 2, 3].map((_, i) => (
                <Grid item xs={6} key={i}>
                  <img
                    src="/src/assets/companyLife.jpg"
                    alt={`Company life ${i}`}
                    className="rounded-lg w-full object-cover"
                    style={{ height: "100px" }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box> */}

      {modalState.editProfile && (
        <EditProfileModal
          employer={employer}
          open={modalState.editProfile}
          close={() => closeModal("editProfile")}
          onSave={handleSaveProfile}
        />
      )}

      {/* {modalState.editCompany && (
        <EditCompanyModal
          company={selectedComp} // Pass the selected company for editing
          open={modalState.editCompany}
          close={() => closeModal("editCompany")}
          onSave={handleSaveCompany}
        />
      )} */}
    </Container>
  );
}
