import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
  };


export const AdminProtectedRoute = ({ children }) => {
    const  admin  = useSelector((state) => state.admin.adminInfo);
    if (isEmptyObject(admin)) {
        toast.warning("please login to continue")
        return <Navigate to="/admin-login" replace />;
    }
    return children;
  };