import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useUser } from "./Context/UserContext";
import { getSession, homeFor, saveSession } from "./employer/employerAuth";

// Reads #t=<code> once and clears it from the address bar
const readLoginCode = () => {
  const m = window.location.hash.match(/[#&]t=([^&]+)/);
  if (m) window.history.replaceState(null, "", window.location.pathname);
  return m ? decodeURIComponent(m[1]) : null;
};

const GoogleSuccess = () => {
  const { setUserId, setToken } = useUser();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const code = readLoginCode();

        // Preferred: exchange the signed code (works cross-site, no cookie needed).
        // Fallback: the old cookie-based refresh.
        const { data } = code
          ? await api.post("/api/auth/google/session", { code })
          : await api.post("/api/auth/refresh", {}, { withCredentials: true });

        const user = data.user || {};
        const id = data.id ?? user.id ?? user._id;
        const role = data.role || user.role || "";

        setUserId(id);
        setToken(data.token);

        saveSession({
          role,
          name: data.username || data.name || user.username || user.name || getSession()?.name || "",
        });

        navigate(homeFor(role), { replace: true });
      } catch (err) {
        console.error("[GoogleSuccess] failed:", err.response?.status, err.response?.data || err.message);
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