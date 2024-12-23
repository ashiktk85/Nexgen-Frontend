'use client'

import { useState, useRef } from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid2,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  styled
} from '@mui/material'
import {
  BookmarkBorder as BookmarkIcon,
  MoreHoriz as MoreIcon,
  Edit as EditIcon,
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  FileUpload as FileUploadIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material'
import Navbar from '../components/User/Navbar'

// Styled components
const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 2,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    minWidth: 0,
    padding: '12px 24px',
    marginRight: theme.spacing(3),
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
  },
}))

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: 'transparent',
  },
}))

const StyledCard = styled(Card)({
  border: '1px solid #E0E0E0',
  boxShadow: 'none',
  borderRadius: '8px',
})

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(0)
  const [profileImage, setProfileImage] = useState('/placeholder.svg')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: 'Philip Maya',
    jobTitle: 'UI/UX Designer',
    location: 'Porto, Portugal',
    employmentStatus: 'Not Employed'
  })
  const fileInputRef = useRef(null)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const activities = [
    {
      id: 1,
      company: "Meta company",
      title: "Product Designer",
      location: "Porto, Portugal (On-Site)",
      time: "Archived 5 Days Ago"
    },
    {
      id: 2,
      company: "Meta company",
      title: "Product Designer",
      location: "Porto, Portugal (On-Site)",
      time: "Archived 5 Days Ago"
    }
  ]

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleEditProfile = () => {
    setIsEditDialogOpen(true)
  }

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <StyledCard sx={{ mx: 1 }}>
          <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Profile Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={profileImage}
                    sx={{ width: 80, height: 80 }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'white',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'white' }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </Box>
                <Box>
                  <Typography variant="h6">{profileData.fullName}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {profileData.jobTitle}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {profileData.location}
                  </Typography>
                </Box>
              </Box>
              <IconButton>
                <MoreIcon />
              </IconButton>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <StyledTabs value={activeTab} onChange={handleTabChange}>
                <Tab label="About" />
                <Tab label="Resume" />
                <Tab label="My Activities" />
                <Tab label="Skills" />
              </StyledTabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ py: 2 }}>
              {/* About Tab */}
              {activeTab === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" color="text.secondary">About</Typography>
                    <IconButton onClick={handleEditProfile}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                    Updating your information will offer you the most relevant content
                  </Typography>
                  <Grid2 container spacing={2}>
                    <Grid2 item xs={6}>
                      <Typography color="text.secondary" variant="caption" display="block">
                        Employment Status
                      </Typography>
                      <Typography variant="body2">{profileData.employmentStatus}</Typography>
                    </Grid2>
                    <Grid2 item xs={6}>
                      <Typography color="text.secondary" variant="caption" display="block">
                        Full Name
                      </Typography>
                      <Typography variant="body2">{profileData.fullName}</Typography>
                    </Grid2>
                    <Grid2 item xs={6}>
                      <Typography color="text.secondary" variant="caption" display="block">
                        Job Title
                      </Typography>
                      <Typography variant="body2">{profileData.jobTitle}</Typography>
                    </Grid2>
                    <Grid2 item xs={6}>
                      <Typography color="text.secondary" variant="caption" display="block">
                        Location
                      </Typography>
                      <Typography variant="body2">{profileData.location}</Typography>
                    </Grid2>
                  </Grid2>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <StyledButton endIcon={<ChevronRightIcon />}>
                      Show All Info
                    </StyledButton>
                  </Box>
                </Box>
              )}

              {/* Resume Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    Resume
                  </Typography>
                  <StyledCard sx={{ mb: 2 }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FileIcon color="action" />
                        <Box>
                          <Typography variant="body2">philip Resume.Pdf</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Date Added
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton size="small">
                        <MoreIcon />
                      </IconButton>
                    </CardContent>
                  </StyledCard>
                  <StyledButton startIcon={<AddIcon />}>
                    Add more
                  </StyledButton>
                </Box>
              )}

              {/* Activities Tab */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    My Activities
                  </Typography>
                  <Grid2 container spacing={2}>
                    {activities.map((activity) => (
                      <Grid2 item xs={6} key={activity.id}>
                        <StyledCard>
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 24, height: 24 }}>M</Avatar>
                                <Typography variant="body2" color="text.secondary">
                                  {activity.company}
                                </Typography>
                              </Box>
                              <Box>
                                <IconButton size="small">
                                  <BookmarkIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                                <IconButton size="small">
                                  <MoreIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                              </Box>
                            </Box>
                            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 500 }}>
                              {activity.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {activity.location}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 5,
                                  bgcolor: '#EEF4FF',
                                  color: '#246BFD',
                                  border: '1px solid rgba(36, 107, 253, 0.2)'
                                }}
                              >
                                {activity.time}
                              </Typography>
                            </Box>
                          </CardContent>
                        </StyledCard>
                      </Grid2>
                    ))}
                  </Grid2>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <StyledButton endIcon={<ChevronRightIcon />}>
                      Show All Info
                    </StyledButton>
                  </Box>
                </Box>
              )}

              {/* Skills Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Skills
                  </Typography>
                  {/* Add skills content */}
                </Box>
              )}
            </Box>
          </CardContent>
        </StyledCard>
      </Container>

      {/* Edit Profile Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2} sx={{ mt: 1 }}>
            <Grid2 item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                value={profileData.jobTitle}
                onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                fullWidth
                label="Employment Status"
                value={profileData.employmentStatus}
                onChange={(e) => setProfileData({ ...profileData, employmentStatus: e.target.value })}
              />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setIsEditDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={() => setIsEditDialogOpen(false)} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}