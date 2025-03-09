"use client";
import { useState, useRef, useEffect } from "react";
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
import { Edit, Plus, FileText, Trash2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";
import userAxiosInstance from "../../../config/axiosConfig/userAxiosInstance";
import { useSelector } from "react-redux";

export default function ProfilePage() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [activeTab, setActiveTab] = useState("about");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const userId = useSelector((state) => state.user.seekerInfo.userId);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await userAxiosInstance.get(
          `/user-profile/${userId}`
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.data.userData
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a FormData object to send the file to the server
      const formData = new FormData();
      formData.append("profileImage", file);

      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/user/profile-image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload profile image");
        }

        const data = await response.json();
        // Update the user state with the new profile URL
        if (user) {
          setUser({
            ...user,
            profileUrl: data.profileUrl,
          });
        }
      } catch (error) {
        console.error("Error uploading profile image:", error);
      }
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload only PDF files");
        return;
      }

      if (user?.resume && user.resume.length >= 5) {
        alert("Maximum 5 resumes allowed");
        return;
      }

      // Create a FormData object to send the file to the server
      const formData = new FormData();
      formData.append("resume", file);

      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/user/resume", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload resume");
        }

        const data = await response.json();
        // Update the user state with the new resume
        if (user) {
          setUser({
            ...user,
            resume: [...(user.resume || []), data.resumeUrl],
          });
        }
      } catch (error) {
        console.error("Error uploading resume:", error);
      }
    }
  };

  const handleRemoveResume = async (resumeUrl) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/user/resume", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete resume");
      }

      // Update the user state by removing the deleted resume
      if (user) {
        setUser({
          ...user,
          resume: user.resume.filter((url) => url !== resumeUrl),
        });
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
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
    // Extract filename from URL or path
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container pt-14 py-4 px-4">
        <Card className="border border-border rounded-lg shadow-none">
          <CardContent className="p-4 sm:p-6">
            {/* Profile Header */}
            <div className="flex justify-between mb-6">
              <div className="flex gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={
                        user.profileUrl || "/placeholder.svg?height=80&width=80"
                      }
                      alt={fullName}
                    />
                    <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-background"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Edit className="h-3.5 w-3.5" />
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
                <div>
                  <h2 className="text-lg font-semibold">{fullName}</h2>
                  {user.experience && user.experience.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {user.experience[0].jobTitle}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {user.location || "No location set"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              defaultValue="about"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b overflow-x-auto scrollbar-hide">
                <TabsList className="bg-transparent h-auto p-0 w-full justify-start">
                  <TabsTrigger
                    value="about"
                    className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="resume"
                    className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                  >
                    Resume
                  </TabsTrigger>
                  <TabsTrigger
                    value="education"
                    className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                  >
                    Education
                  </TabsTrigger>
                  <TabsTrigger
                    value="experience"
                    className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                  >
                    Experience
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <div className="py-4">
                <TabsContent value="about" className="mt-0">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-medium text-muted-foreground">
                      About
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Updating your information will offer you the most relevant
                    content
                  </p>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Full Name
                      </span>
                      <p className="text-sm">{fullName}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Email
                      </span>
                      <p className="text-sm">{user.email}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Phone
                      </span>
                      <p className="text-sm">{user.phone}</p>
                    </div>
                    {user.DOB && (
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Date of Birth
                        </span>
                        <p className="text-sm">
                          {new Date(user.DOB).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {user.location && (
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Location
                        </span>
                        <p className="text-sm">{user.location}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="resume" className="mt-0">
                  <h3 className="text-lg font-medium text-muted-foreground mb-4">
                    Resume
                  </h3>
                  {user.resume && user.resume.length > 0 ? (
                    user.resume.map((resumeUrl, index) => (
                      <Card
                        key={index}
                        className="mb-3 border border-border shadow-none"
                      >
                        <CardContent className="p-3 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm">
                                {getResumeFileName(resumeUrl)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveResume(resumeUrl)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No resumes uploaded yet.
                    </p>
                  )}
                  {(!user.resume || user.resume.length < 5) && (
                    <Button
                      variant="ghost"
                      className="text-primary p-0 h-auto"
                      onClick={() => resumeInputRef.current?.click()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Resume (PDF only, max 5)
                    </Button>
                  )}
                  <input
                    type="file"
                    hidden
                    ref={resumeInputRef}
                    onChange={handleResumeUpload}
                    accept=".pdf"
                  />
                </TabsContent>

                <TabsContent value="education" className="mt-0">
                  <h3 className="text-lg font-medium text-muted-foreground mb-4">
                    Education
                  </h3>
                  {user.education && user.education.length > 0 ? (
                    <div className="space-y-3">
                      {user.education.map((edu, index) => (
                        <Card
                          key={index}
                          className="border border-border shadow-none"
                        >
                          <CardContent className="p-4">
                            <h4 className="text-base font-medium">
                              {edu.qualification}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {edu.institute}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {edu.startYear} - {edu.endYear || "Present"}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No education history added yet.
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="experience" className="mt-0">
                  <h3 className="text-lg font-medium text-muted-foreground mb-4">
                    Experience
                  </h3>
                  {user.experience && user.experience.length > 0 ? (
                    <div className="space-y-3">
                      {user.experience.map((exp, index) => (
                        <Card
                          key={index}
                          className="border border-border shadow-none"
                        >
                          <CardContent className="p-4">
                            <h4 className="text-base font-medium">
                              {exp.jobTitle}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {exp.company}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {exp.startYear} - {exp.endYear || "Present"}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No work experience added yet.
                    </p>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
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
                  value={user.firstName}
                  onChange={(e) =>
                    setUser({ ...user, firstName: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  placeholder="Enter your last name"
                  value={user.lastName}
                  onChange={(e) =>
                    setUser({ ...user, lastName: e.target.value })
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
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={
                  user.DOB ? new Date(user.DOB).toISOString().split("T")[0] : ""
                }
                onChange={(e) => setUser({ ...user, DOB: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter your location"
                value={user.location || ""}
                onChange={(e) => setUser({ ...user, location: e.target.value })}
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
            <Button onClick={() => handleUpdateProfile(user)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
