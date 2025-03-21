import { useState, useEffect } from "react";
import ListTable from "../common/ListTable";
import ConfirmDialog from "../common/ConfirmDialog";
import { Button } from "antd";

import { getAllJobs, jobListUnList } from "@/apiServices/adminApi";
import { toast } from "sonner";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  async function fetchJobs(page) {
    try {
      const result = await getAllJobs(page, rowsPerPage);

      if (result?.data?.response) {
        const { jobs, totalPages } = result.data.response;
        setJobs(jobs);
        setTotalPages(totalPages);
        console.log('jobs', jobs)
      }
    } catch (error) {
      console.log("Error in jobs listing component: ", error.message);
      toast.error("An unexpected error occured");
    }
  }

  const handleListUnlist = async (jobId) => {
    try {
      const result = await jobListUnList(jobId);
      console.log("response after job change status: ", result);
      if (result?.data?.response) {
        // const updated = result.data.response;
        const {message, response} = result.data
        toast.success(message)
        setJobs((prev) =>
          prev.map((item) =>
            item._id === jobId
              ? { ...item, isBlocked: response.isBlocked }
              : item
          )
        );
        // toast.success('Updated!')
      }
    } catch (error) {
      console.log(
        "Error in handleListUnlist at job listing component: ",
        error.message
      );
      toast.error("An unexpected error occured");
    }
  };

  const columns = [
    { key: "jobTitle", label: "Job Title" },
    { key: "employerName", label: "Employer" },
    { key: "createdAt", label: "Posted on" },
    { key: "status", label: "Open/Close" },
    { key: "isBlocked", label: "Status" },
    { key: "action", label: "" },
  ];

  const tableData = jobs.map((item) => ({
    ...item,
    isBlocked: item.isBlocked ? (
      <span className="text-red-500">Unlisted</span>
    ) : (
      <span className="text-green-500">Listed</span>
    ),

    action: (
      <ConfirmDialog
        title={item.isBlocked ? "List job" : "Unlist job"}
        description={`Are you sure you want to ${
          item.isBlocked ? "list" : "unlist"
        } this job?`}
        onConfirm={() => handleListUnlist(item._id)}
      >
        <Button className="font-semibold w-28">
          {item.isBlocked ? "List" : "Unlist"}
        </Button>
      </ConfirmDialog>
    ),
  }));

  return (
    <div className="mt-6 px-6">
      <h1 className="text-start text-2xl font-bold mb-4">Jobs</h1>
      <div className="mt-2">
        <ListTable
          columns={columns}
          data={tableData}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Jobs;
