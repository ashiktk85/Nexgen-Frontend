// ProtectedRoutes.js
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
  };

export const UserProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.seekerInfo);
  console.log(user, "user");
  
  if (isEmptyObject(user)) {
    toast.warning("please login to continue")
    return <Navigate to="/login" replace />;
  }
  return children;
};



