import React from "react";
import { FaBuilding } from "react-icons/fa";
import { useFormik } from "formik";
import CreateJobForm from "@/components/Employer/CreateJobForm";
import { useSelector } from "react-redux";

function CreateJob() {
 
  
  
  return (
    <div className="my-6 px-2">
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Job Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaBuilding className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Nexgen Company</span>
            </div>
            <h1 className="text-2xl font-bold">Create Job</h1>
            <p className="text-sm text-gray-600">Porto, Portugal</p>
          </div>
          <CreateJobForm  />
        </div>
      </main>
    </div>
  );
}

export default CreateJob;
