import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import NavbarEmp from "../../../components/Employer/NavbarEmp";
import { Outlet } from "react-router-dom";
import { ShieldAlert, ChevronRight } from "lucide-react";

const HomeLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const employer = useSelector((state) => state.employer.employer);
  const hasVerificationDocs =
    !!employer?.ownerName ||
    !!employer?.ownerAddress ||
    !!employer?.aadharFront ||
    !!employer?.aadharBack ||
    !!employer?.certificate;
  const verificationStatus =
    employer?.isVerified || (hasVerificationDocs ? "Requested" : "NotVerified");

  return (
    <div className="relative bg-[#f7f6f9] h-full min-h-screen font-[sans-serif]">
      <div className="flex items-start">
        <section className="main-content w-full px-4 lg:px-10">
          <NavbarEmp isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <div className={`transition-all duration-300 pt-8 ${isCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[250px]'}`}>
            {employer && verificationStatus !== "Verified" && (
              <div className="flex justify-end mb-3">
                <Link
                  to="/employer/account"
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm transition-colors ${
                    verificationStatus === "Requested"
                      ? "border-sky-200 bg-sky-50/90 text-sky-800 hover:bg-sky-100/90 hover:border-sky-300"
                      : verificationStatus === "Rejected"
                      ? "border-red-200 bg-red-50/90 text-red-800 hover:bg-red-100/90 hover:border-red-300"
                      : "border-amber-200 bg-amber-50/90 text-amber-800 hover:bg-amber-100/90 hover:border-amber-300"
                  }`}
                >
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>
                    {verificationStatus === "Requested"
                      ? "Verification pending"
                      : verificationStatus === "Rejected"
                      ? "Verification rejected"
                      : "Account not verified"}
                  </span>
                  <span
                    className={
                      verificationStatus === "Requested"
                        ? "text-sky-600"
                        : verificationStatus === "Rejected"
                        ? "text-red-600"
                        : "text-amber-600"
                    }
                  >
                    Go to Account
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </div>
            )}
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeLayout;
