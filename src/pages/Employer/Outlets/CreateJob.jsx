import React from "react";
import CreateJobForm from "@/components/Employer/CreateJobForm";



function CreateJob() {

  return (
    <div className="my-6 px-2">
      <main className="container mx-auto px-8 py-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <CreateJobForm  />
        </div>
      </main>
    </div>
  );
}

export default CreateJob;
