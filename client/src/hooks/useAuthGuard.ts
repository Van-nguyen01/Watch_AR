import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthGuard(requiredRole?: "admin" | "user") {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return;
    }

    if (requiredRole && role !== requiredRole) {
      navigate("/");
    }
  }, [navigate, requiredRole]);
}