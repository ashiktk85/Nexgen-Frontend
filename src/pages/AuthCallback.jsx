import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FullPageLoader from "@/components/FullPageLoader";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { applyAuth } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      const token = params.get("token");
      if (!token) {
        setError("Missing token");
        navigate("/login", { replace: true });
        return;
      }

      try {
        localStorage.setItem("token", token);
        const meRes = await authService.me();
        applyAuth(token, meRes.user);
        toast.success("Login successful!");
        navigate("/", { replace: true });
      } catch (e) {
        localStorage.removeItem("token");
        setError("Login failed");
        navigate("/login", { replace: true });
      }
    };
    run();
  }, [applyAuth, navigate, params]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return <FullPageLoader />;
};

export default AuthCallback;

