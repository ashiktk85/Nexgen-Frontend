import React, { useEffect, useState } from "react";
import CreateJobForm from "@/components/Employer/CreateJobForm";
import { useLocation } from "react-router-dom";

function UpdateJob() {
  const location = useLocation();
  const [jobData, setJobData] = useState();

  useEffect(() => {
    if (location.state?.job) {
      setJobData(location.state.job);
      console.log("jobData",jobData);
    }
  }, [location.state]);

  if (!jobData ) return <p>Loading...</p>;

  return (
    <div className="my-6 px-2">
      <main className="container mx-auto px-8 py-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <CreateJobForm selectedData={jobData} page="update" />
        </div>
      </main>
    </div>
  );
}

export default UpdateJob;
