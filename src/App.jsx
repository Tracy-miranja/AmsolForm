import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Cookies from "js-cookie";
import Auth from "./Auth";
import Home from "./Home";
import RotationLandingPage from "./RotationLandingPage";
import UpdateCV from "./cvupdate";
import HandleLogout from "./logout";
import { UserProvider } from "./Context/UserContext";
import ProfileDetailsPage from "./ProfileDetailsPage";
import FormLayout from "./Formlayout";
import ForgetPassword from "./ForgetPassword";
import ResetPassword from "./ResetPassword";
import ForgetPrompt from "./forgetprompt";
import Register from "./Register";
import NurseForm from "./NurseForm";
import Profilepage from "./userdashboard/ProfilePage";
import Job from "./job";
import UserDashbaord from "./userdashboard/userDashboard";
import Application from "./userdashboard/Application";
import UserProfileDashboard from "./Userprofiledashboard";
import { JobProvider } from "./JobContext";
import EmployerLandingPage from "./employerlandingpage";
import PricingPage from "./PricingPage";
import CareerGuidePage from "./CareerGuidePage";
import CoursesPage from "./CoursesPage";
import GoogleSuccess from "./GoogleSuccess";
import ChooseRole from "./ChooseRole";
import Discussions from "./Discussions";
import Announcements from "./Forum";
import RemoteJobs from "./RemoteJobs";
import RequireEmployer from "./employer/RequireEmployer";
import EmployerLayout from "./employer/EmployerLayout";
import EmployerDashboard from "./employer/EmployerDashboard";
import EmployerComingSoon from "./employer/EmployerComingSoon";
import PostJob from "./employer/PostJob";
import MyJobs from "./employer/MyJobs";
import FindTalent from "./employer/FindTalent";
import Applicants from "./employer/Applicants";
import Interviews from "./employer/Interviews";
import Billing from "./employer/Billing";
import Checkout from "./employer/Checkout";
import Notifications from "./employer/Notifications";
import Chat from "./employer/Chat";
import { clearSession } from "./employer/employerAuth";
import MyProfile from "./employer/MyProfile";


// Checked at render time, so it is correct right after any login (email or Google)
const hasToken = () =>
  !!(localStorage.getItem("accessToken") || Cookies.get("token") || localStorage.getItem("token"));

const PrivateRoute = ({ children }) => (hasToken() ? children : <Navigate to="/auth" replace />);

// The dashboard's "View Applicants" link lands here
const ToJobApplicants = () => {
  const { id } = useParams();
  return <Navigate to={`/employer/applicants?job=${id}`} replace />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(hasToken());

  useEffect(() => {
    console.log("Login state changed:", isLoggedIn);
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    toast.success("Login successful!");
    setIsLoggedIn(true);
  };

  const handleLoginError = () => {
    toast.error("Login failed! Please check your credentials.");
  };

  return (
    <UserProvider>
      <JobProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RotationLandingPage />} />
            <Route
              path="/auth"
              element={<Auth setIsLoggedIn={setIsLoggedIn} onSuccess={handleLoginSuccess} onError={handleLoginError} />}
            />
            <Route path="/blog" element={<CareerGuidePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/applications" element={<Application />} />
            <Route path="/profile" element={<UserProfileDashboard />} />
            <Route path="/dashboard" element={<UserDashbaord />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgetPassword" element={<ForgetPassword />} />
            <Route path="/forgetPrompt" element={<ForgetPrompt />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/Profilepage" element={<Profilepage />} />
            <Route path="/Jobs" element={<Job />} />
            <Route path="/auth/google/success" element={<GoogleSuccess />} />
            <Route path="/choose-role" element={<ChooseRole />} />
            <Route path="/forum/discussions" element={<Discussions />} />
            <Route path="/forum/announcements" element={<Announcements />} />
            <Route path="/remote-jobs" element={<RemoteJobs />} />
            <Route path="/employerlandingpage" element={<EmployerLandingPage />} />
            <Route path="/NurseForm" element={<NurseForm />} />

            {/* Private Routes */}
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/cv-update" element={<PrivateRoute><UpdateCV /></PrivateRoute>} />
            <Route path="/Formlayout" element={<PrivateRoute><FormLayout /></PrivateRoute>} />
            <Route path="/profile-details" element={<PrivateRoute><ProfileDetailsPage /></PrivateRoute>} />

            {/* Employer area: guard + sidebar/navbar layout, one page per file */}
            <Route path="/employer" element={<RequireEmployer><EmployerLayout /></RequireEmployer>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<EmployerDashboard />} />
              <Route path="post-job" element={<PostJob />} />
              <Route path="jobs" element={<MyJobs />} />
              <Route path="jobs/:id/edit" element={<PostJob />} />
              <Route path="jobs/:id/applicants" element={<ToJobApplicants />} />
              <Route path="find-talent" element={<FindTalent />} />
              <Route path="applicants" element={<Applicants />} />
              <Route path="interviews" element={<Interviews />} />
              <Route path="billing" element={<Billing />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="chat" element={<Chat />} />
              <Route path="profile" element={<MyProfile />} />

              {/* Not built yet */}
              <Route path="notifications" element={<EmployerComingSoon title="Notifications" />} />
              <Route path="chat" element={<EmployerComingSoon title="Chat" />} />
              <Route path="profile" element={<EmployerComingSoon title="My Profile" />} />
              <Route path="*" element={<EmployerComingSoon title="Page not found" />} />
            </Route>

            {/* Logout Route */}
            <Route path="/logout" element={<HandleLogout setIsLoggedIn={setIsLoggedIn} />} />
          </Routes>
        </Router>
      </JobProvider>
    </UserProvider>
  );
};

export default App;