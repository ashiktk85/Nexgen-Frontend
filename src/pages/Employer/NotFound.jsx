import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2 text-center px-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        type="primary"
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        onClick={() => navigate("/employer/dashboard")}
      >
        Go Back Home
      </Button>
    </div>
  );
};

export default NotFound;
