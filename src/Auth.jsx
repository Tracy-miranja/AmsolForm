import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useUser } from "./Context/UserContext";
import Cookies from "js-cookie";
import { Toaster, toast } from "react-hot-toast";
import { FiEye, FiEyeOff, FiArrowRight, FiSearch } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import api from "../api/axiosInstance";
import axios from "axios";
import heroImage from "./assets/amsol-career-portrait.jpg";
import logo from "./assets/Amsollogo.png";

const Auth = ({ isLogin = true, setIsLoggedIn, onSuccess, onError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("job applicant");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpMessage, setHelpMessage] = useState("");
  const [guidance, setGuidance] = useState(null);
  const [guidanceLoading, setGuidanceLoading] = useState(false);
  const { setUserId, setToken } = useUser();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

useEffect(() => {
  const err = searchParams.get("error");
  if (!err) return;
  const messages = {
    google_cancelled: "Google sign-in was cancelled.",
    google_state: "Google sign-in expired. Please try again.",
    google_email_unverified: "Your Google email isn't verified.",
    account_suspended: "This account is suspended.",
    google_failed: "Google sign-in failed. Please try again.",
  };
  toast.error(messages[err] || "Sign-in failed.");
}, [searchParams]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    if (!isLogin && !agreeToTerms) {
      return toast.error("Please agree to the Terms and Privacy Policy to continue.");
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const { data } = await api.post(endpoint, { email, password, username, role });

      setUserId(data.id);
      setToken(data.token);

      if (data.role === "nurse") {
  navigate("/NurseForm");
} else if (data.role === "employer") {
  navigate("/profile"); // change this to your employer page
} else {
  navigate("/profile");
}

      if (typeof onSuccess === "function") onSuccess();
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors) {
        data.errors.forEach((err) => toast.error(err.msg));
      } else {
        toast.error(data?.message || "Something went wrong!");
      }

      if (typeof onError === "function") onError();
    } finally {
      setLoading(false);
    }
  };

  // Placeholder — wire up to your real OAuth flow when the backend endpoint exists.
const handleGoogleAuth = () => {
  const backend = import.meta.env.DEV
    ? "http://localhost:5001"
    : api.defaults.baseURL || "";
  window.location.href = `${backend}/api/auth/google`;
};
  // Placeholder guidance — swap this for a real call to your support/AI backend,
  // sending helpMessage and returning steps tailored to what the person typed.
  const handleGetGuidance = () => {
    if (!helpMessage.trim()) {
      return toast.error("Describe what's happening first.");
    }

    setGuidanceLoading(true);
    setTimeout(() => {
      setGuidance([
        "Double-check the email address and make sure you're on the right sign-in page.",
        "Clear any autofilled password, then type the new one in manually.",
        "Try a private/incognito window in case an old saved password is cached.",
        "Still stuck? Use Forgot password to send yourself a fresh reset link.",
      ]);
      setGuidanceLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-[#FAF7F1]">
      <Toaster />

      {/* Hero panel — hidden on small screens, shown from lg up */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden px-14 py-12 text-[#EFE9DD]">
        {/* Photo background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Navy overlay: lighter over the window on the right, darker on the left and along the bottom for text contrast */}
        <div
  className="pointer-events-none absolute inset-0"
  style={{
    backgroundImage: `
      linear-gradient(90deg,
        rgba(10, 28, 52, 0.94) 0%,
        rgba(14, 42, 77, 0.82) 30%,
        rgba(14, 42, 77, 0.35) 58%,
        rgba(14, 42, 77, 0.06) 82%,
        rgba(14, 42, 77, 0) 100%),
      linear-gradient(180deg,
        rgba(14, 42, 77, 0) 0%,
        rgba(14, 42, 77, 0) 45%,
        rgba(10, 28, 52, 0.55) 78%,
        rgba(10, 28, 52, 0.85) 100%)
    `,
  }}
/>

        <Link to="/" className="relative flex items-center gap-2">
          {/* <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffff] text-sm font-bold text-[#0E2A4D]">
            A
          </span> */}
           <Link to="/" className="shrink-0 rounded-xl px-2.5 py-1.5">
                        <img src={logo} alt="Amsol" className="w-[110px]" />
                      </Link>
          <span className="font-medium tracking-wide text-[#ffff]">|</span>
          <span className="ml-1 rounded-full border border-[#2C4A78] px-2 py-0.5 text-[10px] tracking-wide text-[#C9D6EA]">
            JOBS
          </span>
        </Link>

        <div className="relative max-w-md">
          <p className="flex items-center gap-2 text-sm text-[#E3A857]">
            <span className="h-px w-6 bg-[#E3A857]" />
            {isLogin ? "Welcome back" : "Join the roster"}
          </p>
          <h1
            className="mt-4 text-[2.75rem] leading-[1.05] font-bold text-[#ffff]"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {isLogin
              ? "Good work starts with showing up."
              : "Where care teams find their next shift."}
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-[#C9D6EA]">
            {isLogin
              ? "Sign in to pick up your saved applications, track interviews, and see new roles matched to you."
              : "One profile gets you in front of hiring teams looking for nurses and healthcare staff, ready when you are."}
          </p>

          <div className="mt-8 flex gap-8 border-t border-[#1E3A63] pt-6 text-[#EFE9DD]">
            <div>
              <p className="text-2xl font-semibold">3.1k+</p>
              <p className="text-xs text-[#8FA3C2]">Open roles</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">600+</p>
              <p className="text-xs text-[#8FA3C2]">Hiring teams</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">88%</p>
              <p className="text-xs text-[#8FA3C2]">Reply rate</p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-[#8FA3C2]">
          © {new Date().getFullYear()} Amsol. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-10 bg-[#ffff]">
        <div className="w-full max-w-sm">
          {/* Brand mark shown on mobile only, since the hero panel is hidden there */}
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0E2A4D] text-sm font-bold text-[#E3A857]">
              A
            </span>
            <span className="font-medium tracking-wide text-[#0E2A4D]">Amsol</span>
          </Link>

          <h2
            className="text-[1.9rem] text-[#0E2A4D]"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {isLogin ? "Sign in" : "Create your account"}
          </h2>
          <p className="mt-2 text-sm text-[#5C6864]">
            {isLogin
              ? "Enter your details to continue."
              : "Takes about two minutes — no recruiter calls required."}
          </p>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[#DDD6C7] bg-white py-2.5 text-sm font-medium text-[#0E2A4D] transition hover:bg-[#F4F0E6]"
          >
            <FcGoogle className="text-lg" />
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-[#A8ACA3]">
            <span className="h-px flex-1 bg-[#E3DED0]" />
            or use email
            <span className="h-px flex-1 bg-[#E3DED0]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#33403B]">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. John Doe"
                    required
                    className="w-full rounded-lg border border-[#DDD6C7] bg-white px-4 py-2.5 text-[#1C2321] placeholder:text-[#A8ACA3] focus:outline-none focus:ring-2 focus:ring-[#E3A857]/60 focus:border-[#E3A857]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#33403B]">
                    I'm signing up as
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full rounded-lg border border-[#DDD6C7] bg-white px-4 py-2.5 text-[#1C2321] focus:outline-none focus:ring-2 focus:ring-[#E3A857]/60 focus:border-[#E3A857]"
                  >
                    <option value="nurse">Employee: Nurse</option>
<option value="job applicant">Employee: Other roles</option>
<option value="employer">Employer</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#33403B]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full rounded-lg border border-[#DDD6C7] bg-white px-4 py-2.5 text-[#1C2321] placeholder:text-[#A8ACA3] focus:outline-none focus:ring-2 focus:ring-[#E3A857]/60 focus:border-[#E3A857]"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-[#33403B]">Password</label>
                {isLogin && (
                  <Link
                    to="/forgetPassword"
                    className="text-xs font-medium text-[#0E2A4D] underline-offset-2 hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-[#DDD6C7] bg-white px-4 py-2.5 pr-11 text-[#1C2321] placeholder:text-[#A8ACA3] focus:outline-none focus:ring-2 focus:ring-[#E3A857]/60 focus:border-[#E3A857]"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B9490] hover:text-[#33403B]"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#33403B]">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    className="w-full rounded-lg border border-[#DDD6C7] bg-white px-4 py-2.5 pr-11 text-[#1C2321] placeholder:text-[#A8ACA3] focus:outline-none focus:ring-2 focus:ring-[#E3A857]/60 focus:border-[#E3A857]"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B9490] hover:text-[#33403B]"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            )}

            {!isLogin && (
              <label className="flex items-start gap-2.5 pt-1 text-sm text-[#5C6864]">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 rounded border-[#DDD6C7] text-[#0E2A4D] focus:ring-[#E3A857]"
                />
                <span>
                  I agree to the{" "}
                  <Link to="/terms" className="font-medium text-[#0E2A4D] underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="font-medium text-[#0E2A4D] underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0E2A4D] py-2.5 font-medium text-[#F4F0E6] transition hover:bg-[#0A2140] focus:outline-none focus:ring-2 focus:ring-[#E3A857]/60 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Loading..." : isLogin ? "Sign in" : "Create account"}
              {!loading && <FiArrowRight className="text-base" />}
            </button>
          </form>

          {isLogin && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowHelp((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg border border-[#DDD6C7] bg-white px-4 py-3 text-sm font-medium text-[#0E2A4D] transition hover:bg-[#F4F0E6]"
              >
                <span className="flex items-center gap-2">
                  <HiOutlineSparkles className="text-[#E3A857]" />
                  Trouble signing in?
                </span>
                <span className="text-[10px] uppercase tracking-wide text-[#8B9490]">
                  AI help
                </span>
              </button>

              {showHelp && (
                <div className="mt-2 rounded-lg border border-[#DDD6C7] bg-white p-4">
                  <p className="text-sm font-medium text-[#0E2A4D]">What's going wrong?</p>
                  <p className="mt-1 text-xs text-[#8B9490]">
                    Describe what happens. Never include your password or security code.
                  </p>
                  <textarea
                    value={helpMessage}
                    onChange={(e) => setHelpMessage(e.target.value)}
                    placeholder="e.g. I reset my password, but the new one is still rejected."
                    rows={3}
                    className="mt-3 w-full resize-none rounded-lg border border-[#DDD6C7] bg-[#FAF7F1] px-3 py-2 text-sm text-[#1C2321] placeholder:text-[#A8ACA3] focus:outline-none focus:ring-2 focus:ring-[#E3A857]/60 focus:border-[#E3A857]"
                  />
                  <button
                    type="button"
                    onClick={handleGetGuidance}
                    disabled={guidanceLoading}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0E2A4D] py-2.5 text-sm font-medium text-[#F4F0E6] transition hover:bg-[#0A2140] disabled:opacity-60"
                  >
                    <FiSearch />
                    {guidanceLoading ? "Getting guidance..." : "Get tailored guidance"}
                  </button>

                  {guidance && (
                    <div className="mt-4 rounded-lg bg-[#F4F0E6] p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-[#8B9490]">
                        Suggested next steps
                      </p>
                      <ol className="mt-2 space-y-1.5 text-sm text-[#33403B]">
                        {guidance.map((step, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="font-medium text-[#0E2A4D]">{i + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <p className="mt-6 text-center text-sm text-[#5C6864]">
            {isLogin ? (
              <>
                New here?{" "}
                <Link to="/register" className="font-medium text-[#0E2A4D] underline">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link to="/auth" className="font-medium text-[#0E2A4D] underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;