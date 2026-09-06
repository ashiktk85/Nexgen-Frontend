import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** Employer analytics removed — job listing is the primary dashboard. */
export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/employer/job_list", { replace: true });
  }, [navigate]);

  return null;
}
