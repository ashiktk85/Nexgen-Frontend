"use client";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Plus, FileText, Trash2, Check, X } from "lucide-react";
import userAxiosInstance from "../../../config/axiosConfig/userAxiosInstance";
import { toast } from "sonner";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempUser, setTempUser] = useState(null);

  // File upload states
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [selectedResumeFile, setSelectedResumeFile] = useState(null);
  const [isImageConfirmationOpen, setIsImageConfirmationOpen] = useState(false);
  const [isResumeConfirmationOpen, setIsResumeConfirmationOpen] =
    useState(false);

  // Education and experience dialog states
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [currentEducation, setCurrentEducation] = useState(null);
  const [currentExperience, setCurrentExperience] = useState(null);
  const [educationIndex, setEducationIndex] = useState(null);
  const [experienceIndex, setExperienceIndex] = useState(null);

  const userId = useSelector((state) => state.user.seekerInfo.userId);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await userAxiosInstance.get(`/user-profile/${userId}`);
      console.log("User data response:", response.data.userData);
      if (response.status === 200) {
        setUser(response.data.userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // Profile image handling
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      // Create the preview URL here and store it in state
      const previewUrl = URL.createObjectURL(file);
      setPreviewImageUrl(previewUrl);
      setIsImageConfirmationOpen(true);
    }
  };

  const confirmImageUpload = async () => {
    if (!selectedImageFile) return;

    const formData = new FormData();
    formData.append("profileImg", selectedImageFile);

    try {
      const response = await userAxiosInstance.post(
        `/update-profileImg/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Image uploaded successfully");

        await fetchUserData();
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
    } finally {
      // Clean up the object URL to avoid memory leaks
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
      setIsImageConfirmationOpen(false);
      setSelectedImageFile(null);
      setPreviewImageUrl(null);
    }
  };

  const cancelImageUpload = () => {
    // Clean up the object URL to avoid memory leaks
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
    }
    setIsImageConfirmationOpen(false);
    setSelectedImageFile(null);
    setPreviewImageUrl(null);
  };

  // Resume handling
  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload only PDF files");
      return;
    }

    if (user?.resume && user.resume.length >= 5) {
      alert("Maximum 5 resumes allowed");
      return;
    }

    setSelectedResumeFile(file);
    setIsResumeConfirmationOpen(true);
  };

  const confirmResumeUpload = async () => {
    if (!selectedResumeFile) return;

    const formData = new FormData();
    formData.append("resume", selectedResumeFile);

    try {
      const response = await userAxiosInstance.post(
        `/update-resume/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Resume uploaded successfully");
        await fetchUserData();
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
    } finally {
      setIsResumeConfirmationOpen(false);
      setSelectedResumeFile(null);
    }
  };

  const handleRemoveResume = async (resumeUrl) => {
    try {
      const response = await userAxiosInstance.delete("/delete-resume", {
        data: { resumeUrl },
      });

      if (response.data.success) {
        await fetchUserData();
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  // Profile update handling
  const handleUpdateProfile = async () => {
    try {
      const response = await userAxiosInstance.post(
        `/update-profile/${userId}`,
        tempUser
      );

      if (response.data.success) {
        setUser(response.data.response || tempUser);
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Education handling
  const openEducationDialog = (index = null) => {
    if (index !== null) {
      setCurrentEducation({ ...user.education[index] });
      setEducationIndex(index);
    } else {
      setCurrentEducation({
        qualification: "",
        institute: "",
        startYear: new Date().getFullYear(),
        endYear: null,
      });
      setEducationIndex(null);
    }
    setIsEducationDialogOpen(true);
  };

  const saveEducation = async () => {
    const updatedUser = { ...user };

    if (educationIndex !== null) {
      updatedUser.education[educationIndex] = currentEducation;
    } else {
      updatedUser.education = [
        ...(updatedUser.education || []),
        currentEducation,
      ];
    }

    try {
      const response = await userAxiosInstance.post(
        `/update-profile/${userId}`,
        updatedUser
      );

      if (response.data.success) {
        setUser(response.data.response || updatedUser);
      }
    } catch (error) {
      console.error("Error updating education:", error);
    } finally {
      setIsEducationDialogOpen(false);
      setCurrentEducation(null);
      setEducationIndex(null);
    }
  };

  const deleteEducation = async (index) => {
    const updatedUser = { ...user };
    updatedUser.education = updatedUser.education.filter((_, i) => i !== index);

    try {
      const response = await userAxiosInstance.post(
        `/update-profile/${userId}`,
        updatedUser
      );

      if (response.data.success) {
        setUser(response.data.response || updatedUser);
      }
    } catch (error) {
      console.error("Error deleting education:", error);
    }
  };

  // Experience handling
  const openExperienceDialog = (index = null) => {
    if (index !== null) {
      setCurrentExperience({ ...user.experience[index] });
      setExperienceIndex(index);
    } else {
      setCurrentExperience({
        company: "",
        jobTitle: "",
        startYear: new Date().getFullYear(),
        endYear: null,
      });
      setExperienceIndex(null);
    }
    setIsExperienceDialogOpen(true);
  };

  const saveExperience = async () => {
    const updatedUser = { ...user };

    if (experienceIndex !== null) {
      updatedUser.experience[experienceIndex] = currentExperience;
    } else {
      updatedUser.experience = [
        ...(updatedUser.experience || []),
        currentExperience,
      ];
    }

    try {
      const response = await userAxiosInstance.post(
        `/update-profile/${userId}`,
        updatedUser
      );

      if (response.data.success) {
        setUser(response.data.response || updatedUser);
      }
    } catch (error) {
      console.error("Error updating experience:", error);
    } finally {
      setIsExperienceDialogOpen(false);
      setCurrentExperience(null);
      setExperienceIndex(null);
    }
  };

  const deleteExperience = async (index) => {
    const updatedUser = { ...user };
    updatedUser.experience = updatedUser.experience.filter(
      (_, i) => i !== index
    );

    try {
      const response = await userAxiosInstance.post(
        `/update-profile/${userId}`,
        updatedUser
      );

      if (response.data.success) {
        setUser(response.data.response || updatedUser);
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Failed to load user data
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const getResumeFileName = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  return (
    <div className="bg-background min-h-screen py-20">
      <div className="container max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <Card className="border border-border rounded-lg shadow-sm overflow-hidden">
          {/* Profile Header - Made more prominent */}
          <div className="bg-muted/30 p-6 sm:p-8 border-b">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="relative">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-md">
                  <AvatarImage
                    src={
                      user.profileUrl || "/placeholder.svg?height=112&width=112"
                    }
                    alt={fullName}
                  />
                  <AvatarFallback className="text-2xl">
                    {user.firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-background shadow-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Change profile picture</span>
                </Button>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                  {fullName}
                </h1>
                {/* {user.experience && user.experience.length > 0 && (
                  <p className="text-lg text-muted-foreground mb-1">
                    {user.experience[0].jobTitle}
                  </p>
                )} */}
                <p className="text-sm text-muted-foreground mb-3">
                  {user.location || "No location set"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setTempUser({ ...user });
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs - Improved styling and spacing */}
          <Tabs
            defaultValue="about"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b sticky top-0 bg-background z-10">
              <TabsList className="bg-transparent h-auto p-0 w-full justify-start overflow-x-auto flex">
                <TabsTrigger
                  value="about"
                  className="px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none font-medium"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="resume"
                  className="px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none font-medium"
                >
                  Resume
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none font-medium"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none font-medium"
                >
                  Experience
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content - Better spacing and organization */}
            <div className="p-6 sm:p-8">
              <TabsContent value="about" className="mt-0 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">About</h3>
                  <div className="bg-muted/20 rounded-lg p-4 mb-6">
                    <p className="text-muted-foreground">
                      {user.about || "No about information provided."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="space-y-1 p-3 rounded-md bg-muted/10">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        Full Name
                      </span>
                      <p className="font-medium">{fullName}</p>
                    </div>
                    <div className="space-y-1 p-3 rounded-md bg-muted/10">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        Email
                      </span>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div className="space-y-1 p-3 rounded-md bg-muted/10">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        Phone
                      </span>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                    {user.DOB && (
                      <div className="space-y-1 p-3 rounded-md bg-muted/10">
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          Date of Birth
                        </span>
                        <p className="font-medium">
                          {new Date(user.DOB).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {user.location && (
                      <div className="space-y-1 p-3 rounded-md bg-muted/10">
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          Location
                        </span>
                        <p className="font-medium">{user.location}</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resume" className="mt-0">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Resume</h3>
                    {!user.resume ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resumeInputRef.current?.click()}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Add Resume
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resumeInputRef.current?.click()}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Change Resume
                      </Button>
                    )}
                    <input
                      type="file"
                      hidden
                      ref={resumeInputRef}
                      onChange={handleResumeUpload}
                      accept=".pdf"
                    />
                  </div>

                  {user.resume ? (
                    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-md">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="truncate max-w-[150px]">
                            <p className="font-medium truncate">
                              {getResumeFileName(user.resume)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF Document
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveResume(user.resume)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="bg-muted/20 rounded-lg p-6 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">
                        No resume uploaded yet
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => resumeInputRef.current?.click()}
                        className="mx-auto"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Upload Resume (PDF only)
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="education" className="mt-0">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Education</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEducationDialog()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>

                  {user.education && user.education.length > 0 ? (
                    <div className="grid gap-4">
                      {user.education.map((edu, index) => (
                        <Card
                          key={index}
                          className="border border-border shadow-sm hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-5">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold mb-1">
                                  {edu.qualification}
                                </h4>
                                <p className="text-muted-foreground mb-1">
                                  {edu.institute}
                                </p>
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                  {edu.startYear} - {edu.endYear || "Present"}
                                </div>
                              </div>
                              <div className="flex gap-2 sm:self-start">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEducationDialog(index)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => deleteEducation(index)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/20 rounded-lg p-6 text-center">
                      <p className="text-muted-foreground mb-4">
                        No education history added yet
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => openEducationDialog()}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="experience" className="mt-0">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Experience</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openExperienceDialog()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>

                  {user.experience && user.experience.length > 0 ? (
                    <div className="grid gap-4">
                      {user.experience.map((exp, index) => (
                        <Card
                          key={index}
                          className="border border-border shadow-sm hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-5">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold mb-1">
                                  {exp.jobTitle}
                                </h4>
                                <p className="text-muted-foreground mb-1">
                                  {exp.company}
                                </p>
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                  {exp.startYear} - {exp.endYear || "Present"}
                                </div>
                              </div>
                              <div className="flex gap-2 sm:self-start">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openExperienceDialog(index)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => deleteExperience(index)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/20 rounded-lg p-6 text-center">
                      <p className="text-muted-foreground mb-4">
                        No work experience added yet
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => openExperienceDialog()}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  placeholder="Enter your first name"
                  value={tempUser?.firstName || ""}
                  onChange={(e) =>
                    setTempUser({ ...tempUser, firstName: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  placeholder="Enter your last name"
                  value={tempUser?.lastName || ""}
                  onChange={(e) =>
                    setTempUser({ ...tempUser, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                value={tempUser?.email || ""}
                onChange={(e) =>
                  setTempUser({ ...tempUser, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                value={tempUser?.phone || ""}
                onChange={(e) =>
                  setTempUser({ ...tempUser, phone: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="about">About</Label>
              <Input
                id="about"
                placeholder="Enter your about yourself"
                type="textarea"
                value={tempUser?.about || ""}
                onChange={(e) =>
                  setTempUser({ ...tempUser, about: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={
                  tempUser?.DOB
                    ? new Date(tempUser.DOB).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setTempUser({ ...tempUser, DOB: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter your location"
                value={tempUser?.location || ""}
                onChange={(e) =>
                  setTempUser({ ...tempUser, location: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Education Dialog */}
      <Dialog
        open={isEducationDialogOpen}
        onOpenChange={setIsEducationDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {educationIndex !== null ? "Edit Education" : "Add Education"}
            </DialogTitle>
            <DialogDescription>
              {educationIndex !== null
                ? "Update your education details"
                : "Add your education details"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="qualification">Qualification/Degree</Label>
              <Input
                id="qualification"
                placeholder="e.g. Bachelor of Science in Computer Science"
                value={currentEducation?.qualification || ""}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    qualification: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="institute">Institute/School</Label>
              <Input
                id="institute"
                placeholder="e.g. University of California"
                value={currentEducation?.institute || ""}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    institute: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startYear">Start Year</Label>
                <Input
                  id="startYear"
                  type="number"
                  placeholder="e.g. 2018"
                  value={currentEducation?.startYear || ""}
                  onChange={(e) =>
                    setCurrentEducation({
                      ...currentEducation,
                      startYear: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endYear">
                  End Year (or leave blank if current)
                </Label>
                <Input
                  id="endYear"
                  type="number"
                  placeholder="e.g. 2022"
                  value={currentEducation?.endYear || ""}
                  onChange={(e) =>
                    setCurrentEducation({
                      ...currentEducation,
                      endYear: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEducationDialogOpen(false);
                setCurrentEducation(null);
                setEducationIndex(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={saveEducation}>
              {educationIndex !== null ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Experience Dialog */}
      <Dialog
        open={isExperienceDialogOpen}
        onOpenChange={setIsExperienceDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {experienceIndex !== null ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
            <DialogDescription>
              {experienceIndex !== null
                ? "Update your work experience"
                : "Add your work experience"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="e.g. Software Engineer"
                value={currentExperience?.jobTitle || ""}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    jobTitle: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="e.g. Google"
                value={currentExperience?.company || ""}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    company: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expStartYear">Start Year</Label>
                <Input
                  id="expStartYear"
                  type="number"
                  placeholder="e.g. 2020"
                  value={currentExperience?.startYear || ""}
                  onChange={(e) =>
                    setCurrentExperience({
                      ...currentExperience,
                      startYear: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expEndYear">
                  End Year (or leave blank if current)
                </Label>
                <Input
                  id="expEndYear"
                  type="number"
                  placeholder="e.g. 2023"
                  value={currentExperience?.endYear || ""}
                  onChange={(e) =>
                    setCurrentExperience({
                      ...currentExperience,
                      endYear: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsExperienceDialogOpen(false);
                setCurrentExperience(null);
                setExperienceIndex(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={saveExperience}>
              {experienceIndex !== null ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Image Confirmation Dialog */}
      <Dialog
        open={isImageConfirmationOpen}
        onOpenChange={setIsImageConfirmationOpen}
      >
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Confirm Profile Picture</DialogTitle>
            <DialogDescription>
              Would you like to use this image as your profile picture?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={
                  previewImageUrl ||
                  user.profileUrl ||
                  "/placeholder.svg?height=80&width=80"
                }
                alt="Profile preview"
              />
              <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <DialogFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" onClick={cancelImageUpload}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={confirmImageUpload}>
              <Check className="h-4 w-4 mr-2" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resume Confirmation Dialog */}
      <Dialog
        open={isResumeConfirmationOpen}
        onOpenChange={setIsResumeConfirmationOpen}
      >
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Confirm Resume Upload</DialogTitle>
            <DialogDescription>
              Would you like to upload this resume to your profile?
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 py-4">
            <FileText className="h-10 w-10 text-primary" />
            <div>
              <p className="font-medium">{selectedResumeFile?.name}</p>
              <p className="text-sm text-muted-foreground">
                {selectedResumeFile
                  ? `${(selectedResumeFile.size / 1024 / 1024).toFixed(2)} MB`
                  : ""}
              </p>
            </div>
          </div>
          <DialogFooter className="flex justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsResumeConfirmationOpen(false);
                setSelectedResumeFile(null);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={confirmResumeUpload}>
              <Check className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
