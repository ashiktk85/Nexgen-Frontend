import { useState } from "react";
import {
    Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { Button } from "@mui/material";

function ApplicantModal({ isDialogOpen, setIsDialogOpen, user }) {
  const [applicationStatus, setApplicationStatus] = useState(user?.status);
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);

  if (user)
    return (
      <>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[1000px] h-5/6 mx-3">
            <DialogHeader>
              <DialogTitle>View Application</DialogTitle>
            </DialogHeader>

            <div className="flex items-end justify-end space-y-6 space-x-2">
              <div className="w-1/3">
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={applicationStatus}
                  onChange={(e) => setApplicationStatus(e.target.value)}
                >
                  <option className="text-sm" value="">
                    Change Status
                  </option>
                  <option className="text-sm" value="Hired">
                    Hire
                  </option>
                  <option className="text-sm" value="Rejected">
                    Reject
                  </option>
                  <option className="text-sm" value="Pending">
                    Pending
                  </option>
                </select>
              </div>
              <Button
                variant="contained"
                onClick={() => setIsDecisionDialogOpen(true)}
                className="block text-gray-700 font-medium mb-2"
              >
                Change status
              </Button>
            </div>

            <div className="space-y-4 py-4 overflow-y-scroll">
              <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-2">
                      <FaUser className="h-4 w-4 text-muted-foreground" />
                      <div className="font-medium">Name</div>
                      <div className="text-muted-foreground">{user.name}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaPhone className="h-4 w-4 text-muted-foreground" />
                      <div className="font-medium">Phone</div>
                      <div className="text-muted-foreground">{user.phone}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <IoMail className="h-4 w-4 text-muted-foreground" />
                      <div className="font-medium">Email</div>
                      <div className="text-muted-foreground">{user.email}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaLocationDot className="h-4 w-4 text-muted-foreground" />
                      <div className="font-medium">Location</div>
                      <div className="text-muted-foreground">
                        {user.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-4">
                    {user.resume && (
                      <div className="flex items-center gap-2">
                        {/* <FileText className="h-4 w-4 text-muted-foreground" /> */}
                        <div className="font-medium">Resume</div>
                        <div className="text-muted-foreground">
                          {user.resume}
                        </div>
                      </div>
                    )}

                    {user.resume && (
                      <div className="flex items-center gap-2">
                        {/* <FileText className="h-4 w-4 text-muted-foreground" /> */}
                        <div className="font-medium">Additional File</div>
                        <div className="text-muted-foreground">
                          {user.resume}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-4">
                    {user.coverLetter && (
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          {/* <FileText className="h-4 w-4 text-muted-foreground" /> */}
                          <div className="font-medium">Cover Letter</div>
                        </div>
                        <div className="text-muted-foreground whitespace-pre-wrap rounded-lg border bg-muted p-4">
                          {user.coverLetter}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* Deletion confirmation modal */}
        <Dialog
          open={isDecisionDialogOpen}
          onOpenChange={setIsDecisionDialogOpen}
        >
          <DialogContent className="w-[1000px] ">
            <DialogHeader>
              <DialogTitle>Confirm Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {applicationStatus === "Hired" ? (
                <p>
                  Are you sure you want to hire this application? This action
                  cannot be undone.
                </p>
              ) : applicationStatus === "Rejected" ? (
                <p>
                  Are you sure you want to reject this job? This action cannot
                  be undone.
                </p>
              ) : (
                <p>
                  Are you sure you want to change the status to pending this
                  job? This action cannot be undone.
                </p>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsDecisionDialogOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(user?._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
}

export default ApplicantModal;
