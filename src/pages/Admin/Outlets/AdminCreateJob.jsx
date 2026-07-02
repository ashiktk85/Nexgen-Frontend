import { useNavigate } from "react-router-dom";
import CreateJobForm from "@/components/Employer/CreateJobForm";

const AdminCreateJob = () => {
  const navigate = useNavigate();

  return (
    <CreateJobForm
      mode="admin"
      page="create"
      onClose={() => navigate("/admin/jobs")}
    />
  );
};

export default AdminCreateJob;
