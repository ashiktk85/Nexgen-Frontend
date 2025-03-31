import { useEffect, useState } from "react";
import ListTable from "@/components/common/ListTable";
import { Button } from "antd";
import { toast } from "sonner";
import { FaRegEye } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  getAllEmployerVerification,
  employerVerificationChangeStatus,
  getEmployerVerificationDetails,
} from "@/apiServices/adminApi";

const EmployerVerification = () => {
  const [tableData, setTableData] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 5;

  const handleTab = (value) => {
    console.log("value", value);
    setCurrentPage(1);

    switch (value) {
      case "requested":
        fetchVerificationAppli(1, "Requested");
        break;
      case "rejected":
        fetchVerificationAppli(1, "Rejected");
        break;
      case "verified":
        fetchVerificationAppli(1, "Verified");
        break;
      case "notverified":
        fetchVerificationAppli(1, "NotVerified");
        break;
      default:
        fetchVerificationAppli(1, "Requested");
    }
  };

  useEffect(() => {
    fetchVerificationAppli(currentPage, "requested");
  }, [currentPage]);

  async function fetchVerificationAppli(page, type) {
    try {
      const result = await getAllEmployerVerification(page, rowsPerPage, type);
      console.log("Reeeesss", result);
      if (result?.data?.response) {
        const { EmployerApplications, totalPages } = result.data.response;
        settingTableData(type, EmployerApplications);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.log("Error in user listing component: ", error.message);
      toast.error("An unexpected error occured");
    }
  }

  const columns = [
    { key: "ownerName", label: "Owner Name" },
    { key: "company", label: "Company" },
    { key: "email", label: "Email" },
    { key: "documents", label: "Documents" },
    { key: "action", label: "" },
  ];

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleViewDocs = async (id) => {
    try {
      // Add this API function to your adminApi.js
      const result = await getEmployerVerificationDetails(id);
      if (result?.data?.response) {
        setVerificationDetails(result.data.response);
        setIsViewDialogOpen(true);
      }
    } catch (error) {
      console.log("Error fetching verification details: ", error);
      toast.error("Failed to load verification details");
    }
  };

  const handleAction = (applicationId, decision) => {
    setIsDecisionDialogOpen(true);
    setApplicationId(applicationId);
    setApplicationStatus(decision);
  };

  const handleVerificatonDecision = async (applicationId, decision) => {
    try {
      console.log("Response before changing status: ", applicationId, decision);
      const result = await employerVerificationChangeStatus(
        applicationId,
        decision
      );
      console.log("Response after changing status: ", result, decision);
      if (result?.data?.response) {
        const { message, response } = result.data;
        toast.success(message);
        setTableData((prev) =>
          prev.filter((item) => item._id !== response._id)
        );
      }
    } catch (error) {
      console.log(
        "Error in handle employer verification at user listing: ",
        error
      );
      toast.error("An unexpected error occured");
    } finally {
      setIsDecisionDialogOpen(false);
    }
  };

  const settingTableData = (type, EmployerApplications) => {
    let tableData;
    if (type === "Requested") {
      tableData = EmployerApplications.map((item) => ({
        ...item,
        ownerName: item.ownerName,
        company: item.name,
        documents: (
          <>
            <Button
              className="font-semibold"
              onClick={() => handleViewDocs(item._id)}
            >
              <FaRegEye />
              View
            </Button>
          </>
        ),
        action: (
          <>
            <Button
              color="primary"
              variant="outlined"
              className="font-semibold mr-1"
              onClick={() => handleAction(item?._id, "Verified")}
            >
              Accept
            </Button>

            <Button
              danger
              className="font-semibold"
              onClick={() => handleAction(item?._id, "Rejected")}
            >
              Reject
            </Button>
          </>
        ),
      }));
    } else {
      tableData = EmployerApplications.map((item) => ({
        ...item,
        ownerName: item.ownerName,
        company: item.name,
        documents: (
          <>
            <Button
              className="font-semibold"
              onClick={() => handleViewDocs(item._id)}
            >
              <FaRegEye />
              View
            </Button>
          </>
        ),
      }));
    }
    setTableData(tableData);
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold mb-4">Verification Forms</h1>
        <Tabs
          defaultValue="requested"
          onValueChange={handleTab}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="requested">Requested</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="notverified">Unverified</TabsTrigger>
          </TabsList>
          <ListTable
            columns={columns}
            data={tableData}
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </Tabs>
      </div>

      {/* Decision Confirmation Dialog */}
      <Dialog
        open={isDecisionDialogOpen}
        onOpenChange={setIsDecisionDialogOpen}
      >
        <DialogContent className="w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirm Update</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {applicationStatus === "Verified" ? (
              <p>
                Are you sure you want to verify this application? This action
                cannot be undone.
              </p>
            ) : (
              <p>
                Are you sure you want to reject this application? This action
                cannot be undone.
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
                onClick={() =>
                  handleVerificatonDecision(applicationId, applicationStatus)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Documents Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verification Details</DialogTitle>
          </DialogHeader>

          {verificationDetails ? (
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-gray-900">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Company Name</p>
                    <p className="font-medium">{verificationDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Owner Name</p>
                    <p className="font-medium">
                      {verificationDetails.ownerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{verificationDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{verificationDetails.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p
                      className={`font-medium ${
                        verificationDetails.status === "Verified"
                          ? "text-green-600"
                          : verificationDetails.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {verificationDetails.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-gray-900">
                  Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Aadhar Front */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Aadhar Card (Front)
                    </p>
                    {verificationDetails.documents?.aadharFront ? (
                      <div className="border border-gray-300 rounded-md overflow-hidden">
                        <img
                          src={verificationDetails.documents.aadharFront}
                          alt="Aadhar Front"
                          className="w-full object-contain max-h-64"
                        />
                      </div>
                    ) : (
                      <p className="text-red-500">Document not available</p>
                    )}
                  </div>

                  {/* Aadhar Back */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Aadhar Card (Back)
                    </p>
                    {verificationDetails.documents?.aadharBack ? (
                      <div className="border border-gray-300 rounded-md overflow-hidden">
                        <img
                          src={verificationDetails.documents.aadharBack}
                          alt="Aadhar Back"
                          className="w-full object-contain max-h-64"
                        />
                      </div>
                    ) : (
                      <p className="text-red-500">Document not available</p>
                    )}
                  </div>

                  {/* Shop Certificate */}
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-2">
                      Shop Certificate
                    </p>
                    {verificationDetails.documents?.certificate ? (
                      <div className="border border-gray-300 rounded-md overflow-hidden">
                        <img
                          src={verificationDetails.documents.certificate}
                          alt="Shop Certificate"
                          className="w-full object-contain max-h-64"
                        />
                      </div>
                    ) : (
                      <p className="text-red-500">Document not available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Application Timeline */}
              {verificationDetails.timeline && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3 text-gray-900">
                    Application Timeline
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="min-w-24 text-sm text-gray-500">
                        Submitted:
                      </div>
                      <div>
                        {new Date(
                          verificationDetails.createdAt
                        ).toLocaleString()}
                      </div>
                    </div>
                    {verificationDetails.updatedAt && (
                      <div className="flex items-start">
                        <div className="min-w-24 text-sm text-gray-500">
                          Last Updated:
                        </div>
                        <div>
                          {new Date(
                            verificationDetails.updatedAt
                          ).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">Loading verification details...</p>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsViewDialogOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployerVerification;
