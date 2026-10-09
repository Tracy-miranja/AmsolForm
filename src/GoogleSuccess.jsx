import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useUser } from "./Context/UserContext";

const GoogleSuccess = () => {
  const { setUserId, setToken } = useUser();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const { data } = await api.post("/api/auth/refresh", {}, { withCredentials: true });
        setUserId(data.id);
        setToken(data.token);
        navigate(data.role === "nurse" ? "/NurseForm" : "/profile", { replace: true });
      } catch {
        navigate("/auth?error=google_failed", { replace: true });
      }
    })();
  }, [navigate, setUserId, setToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F1] text-[#0E2A4D]">
      Signing you in...
    </div>
  );
};

export default GoogleSuccess;