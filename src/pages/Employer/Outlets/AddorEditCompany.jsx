import React, { useState } from "react";
import CompanyForm from "@/components/Employer/CompanyForm";
import { useLocation, useParams } from "react-router-dom";

const AddorEditCompany = () => {
const { companyId } = useParams();
const location = useLocation();
const [company, setCompany] = useState(location.state?.company || null);

  return (
    <div className="my-6 px-2">
      <main className="container mx-auto px-8 py-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <CompanyForm company={company} />
        </div>
      </main>
    </div>
  );
};

export default AddorEditCompany;
