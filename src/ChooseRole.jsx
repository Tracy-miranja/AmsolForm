import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { FiArrowRight } from "react-icons/fi";
import api from "../api/axiosInstance";
import { useUser } from "./Context/UserContext";

const ChooseRole = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("nurse");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const { setUserId, setToken } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/auth/google/pending", { withCredentials: true })
      .then(({ data }) => {
        setEmail(data.email);
        setReady(true);
      })
      .catch(() => {
        navigate("/auth?error=google_state", { replace: true });
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      return toast.error("Please agree to the Terms and Privacy Policy to continue.");
    }
    setLoading(true);
    try {
      const { data } = await api.post(
        "/api/auth/google/complete",
        { role },
        { withCredentials: true }
      );
      setUserId(data.id);
      setToken(data.token);
      navigate(data.role === "nurse" ? "/NurseForm" : data.role === "employer" ? "/profile" : "/profile", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F1] px-6">
      <Toaster />
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm">
        <h2
          className="text-[1.9rem] text-[#0E2A4D]"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          One last step
        </h2>
        <p className="mt-2 text-sm text-[#5C6864]">
          Signing up as <span className="font-medium text-[#0E2A4D]">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#33403B]">
              I'm signing up as
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-[#DDD6C7] bg-white px-4 py-2.5 text-[#1C2321] focus:outline-none focus:ring-2 focus:ring-[#E3A857]/60 focus:border-[#E3A857]"
            >
              <option value="nurse">Employee: Nurse</option>
<option value="job applicant">Employee: Other roles</option>
<option value="employer">Employer</option>
            </select>
          </div>

          <label className="flex items-start gap-2.5 text-sm text-[#5C6864]">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#DDD6C7]"
            />
            <span>
              I agree to the{" "}
              <Link to="/terms" className="font-medium text-[#0E2A4D] underline">Terms</Link>{" "}
              and{" "}
              <Link to="/privacy" className="font-medium text-[#0E2A4D] underline">Privacy Policy</Link>.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0E2A4D] py-2.5 font-medium text-[#F4F0E6] transition hover:bg-[#0A2140] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
            {!loading && <FiArrowRight />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChooseRole;