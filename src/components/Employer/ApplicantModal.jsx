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
import { toast } from "sonner";
import useRequestUser from "@/hooks/useRequestUser";

function ApplicantModal({
  isDialogOpen,
  setIsDialogOpen,
  application,
  fetchApplications,
  setSelectedData,
}) {
  const [applicationStatus, setApplicationStatus] = useState("");
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);
  const { data, loading, error, sendRequest } = useRequestUser();

  const handleDecision = async (applicationId) => {
    if (applicationStatus) {
      const applicationStatusData = {
        applicationStatus: applicationStatus,
      };

      sendRequest({
        url: `/job-applications/${applicationId}/update_status`,
        method: "POST",
        data: applicationStatusData,
        onSuccess: (data) => {
          setSelectedData(null);
          fetchApplications();
          console.log("Application status successfully:", data);
        },
        onError: (err) =>
          console.error("Error application status change:", err),
      });
    } else {
      toast.error("Please select status option");
    }
  };

  if (application)
    return (
      <>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[1000px] h-5/6 mx-3">
            <DialogHeader>
              <DialogTitle>View Application</DialogTitle>
            </DialogHeader>
            <div className="w-full md:grid-cols-2 grid-cols-1 space-y-2">
              <div className="flex items-center">
                <p className="text-2xl font-semibold leading-none tracking-tight">Status: <span className={application.status === "Hired"? "text-green-500": application.status === "Rejected"?"text-red-500":"text-orange-500"}>{application.status}</span></p>
              </div>
              <div className="flex items-center md:justify-end  space-x-2">
                {/* "flex items-end justify-end space-y-6 space-x-2" */}
                <div className="md:w-1/3">
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
                  onClick={() => {
                    if (applicationStatus) {
                      setIsDecisionDialogOpen(true);
                    } else {
                      toast.error("Please select status option");
                    }
                  }}
                  className="block text-gray-700 font-medium "
                >
                  Change status
                </Button>
              </div>
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
                      <div className="text-muted-foreground">
                        {application.name}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaPhone className="h-4 w-4 text-muted-foreground" />
                      <div className="font-medium">Phone</div>
                      <div className="text-muted-foreground">
                        {application.phone}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <IoMail className="h-4 w-4 text-muted-foreground" />
                      <div className="font-medium">Email</div>
                      <div className="text-muted-foreground">
                        {application.email}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaLocationDot className="h-4 w-4 text-muted-foreground" />
                      <div className="font-medium">Location</div>
                      <div className="text-muted-foreground">
                        {application.location}
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
                    {application.resume && (
                      <div className="flex items-center gap-2">
                        {/* <FileText className="h-4 w-4 text-muted-foreground" /> */}
                        <div className="font-medium">Resume</div>
                        <div className="text-muted-foreground">
                          {application.resume}
                        </div>
                      </div>
                    )}

                    {application.resume && (
                      <div className="flex items-center gap-2">
                        {/* <FileText className="h-4 w-4 text-muted-foreground" /> */}
                        <div className="font-medium">Additional File</div>
                        <div className="text-muted-foreground">
                          {application.resume}
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
                    {application.coverLetter && (
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          {/* <FileText className="h-4 w-4 text-muted-foreground" /> */}
                          <div className="font-medium">Cover Letter</div>
                        </div>
                        <div className="text-muted-foreground whitespace-pre-wrap rounded-lg border bg-muted p-4">
                          {application.coverLetter}
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
                  onClick={() => handleDecision(application?._id)}
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
