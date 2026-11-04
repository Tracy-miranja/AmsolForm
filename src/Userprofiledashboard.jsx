import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useUser } from "./Context/UserContext";
import Dashboard from "./Dashboard";
import { useSavedJobs } from "../hooks/useSavedJobs";
import { SavedJobsPanel } from "./components/SavedJobsPanel";
import ApplicationsPage from "./components/ApplicationsPage";
import JobSettingsPage from "./components/JobSettingsPage";
import MessagesPage from "./components/MessagesPage";

import profileCss from "./profile/shared/styles";
import { API, API_ORIGIN } from "./profile/shared/api";
import { PAGE_TITLES } from "./profile/shared/constants";
import { getMissingRequired } from "./profile/shared/utils";

import useProfileData from "./profile/hooks/useProfileData";
import useProfileSocket from "./profile/hooks/useProfileSocket";
import { CvAutofillProvider } from "./profile/hooks/CvAutofillContext";

import Sidebar from "./profile/layout/Sidebar";
import TopBar from "./profile/layout/TopBar";
import BottomNav from "./profile/layout/BottomNav";

import ProfilePage from "./profile/sections/ProfilePage";
import CvSection from "./profile/sections/CvSection";
import TermsPage from "./profile/pages/TermsPage";
import LoadingSkeleton from "./profile/pages/LoadingSkeleton";
import LearnPage from "./profile/pages/LearnPage";
import CareerServicesPage from "./profile/pages/CareerServicesPage";

import PersonalModal from "./profile/modals/PersonalModal";
import SummaryModal from "./profile/modals/SummaryModal";
import SkillsModal from "./profile/modals/SkillsModal";
import WorkExpModal from "./profile/modals/WorkExpModal";
import EducationModal from "./profile/modals/EducationModal";
import ProfessionalModal from "./profile/modals/ProfessionalModal";
import AvatarModal from "./profile/modals/AvatarModal";
import CvPreviewModal from "./profile/modals/CvPreviewModal";
import QuickApplyModal from "./profile/modals/QuickApplyModal";
import GeneralApplyModal from "./profile/modals/GeneralApplyModal";

const UserProfileDashboard = () => {
  const { token, userId, logout } = useUser();
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [workExp, setWorkExp] = useState({ entry: {}, index: -1, isNew: true });
  const [showApply, setShowApply] = useState(false);
  const [generalApply, setGeneralApply] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const socketRef = useProfileSocket(token);
  const { savedJobIds, savedJobs, loadingSaved, toggleSave } = useSavedJobs(userId, token);
  const data = useProfileData(token, { onNoProfile: () => setModal("personal") });
  const { profile, form, setForm, saving, saveMsg, setSaveMsg, flashMsg } = data;

  const closeModal = () => setModal(null);
  const openModal = (name, opts = {}) => {
    if (opts.workExp) setWorkExp(opts.workExp);
    if (opts.resetForm) { setForm(profile); setSaveMsg(""); }
    setModal(name);
  };

  // ── derived ──
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "—";
  const initials = [profile?.firstName?.[0], profile?.lastName?.[0]].filter(Boolean).join("") || "?";
  const displayAvatar = data.avatarUrl || profile?.profilePhotoUrl;
  const cvPreviewUrl =
    profile?.savedCvUrl ||
    (profile?.savedCvFileId ? `${API_ORIGIN}${API}/profile/cv/${profile.savedCvFileId}` : null);

  // ── handlers ──
  const handleLogoutClick = async () => {
    try { await api.post("/api/auth/logout"); } catch (e) { console.error("Logout request failed:", e); }
    finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      logout();
      navigate("/");
    }
  };

  const handlePreviewCv = () => {
    if (!profile?.savedCvUrl && !profile?.savedCvFileId) {
      flashMsg("No CV uploaded yet. Please upload a CV first.");
      return;
    }
    setModal("cvpreview");
  };

  const handleQuickApply = () => {
    const missing = getMissingRequired(profile);
    if (missing.length) {
      flashMsg("⚠️ Profile incomplete — please fill in: " + missing.join(", "));
      setActiveNav("profile");
      return;
    }
    setGeneralApply(true);
  };

  const cvProps = {
    cvFile: data.cvFile, setCvFile: data.setCvFile, cvUploading: data.cvUploading,
    cvMsg: data.cvMsg, onUpload: data.uploadCv,
  };

  // ── pages ──
  const renderPage = () => {
    if (data.loading) return <LoadingSkeleton />;

    switch (activeNav) {
      case "dashboard":
      case "jobs":
        return (
          <Dashboard page={activeNav} profile={profile} token={token} onNav={setActiveNav}
            onQuickApply={() => setShowApply(true)} savedJobIds={savedJobIds} onToggleSave={toggleSave}
            onViewTerms={() => setActiveNav("terms")} />
        );
      case "cv":
        return (
          <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
            <CvSection profile={profile} variant="page" onPreview={() => setModal("cvpreview")} {...cvProps} />
          </div>
        );
      case "saved":
        return <SavedJobsPanel savedJobs={savedJobs} loading={loadingSaved} onUnsave={toggleSave} onApply={() => setShowApply(true)} />;
      case "settings":
        return (
          <JobSettingsPage token={token} profile={profile} savedJobs={savedJobs} loadingSaved={loadingSaved}
            onBrowseJobs={() => setActiveNav("dashboard")} onOpenProfile={() => setActiveNav("profile")}
            onOpenSaved={() => setActiveNav("saved")} onOpenApplications={() => setActiveNav("applications")} />
        );
      case "applications":
        return <ApplicationsPage token={token} profile={profile} onBrowseJobs={() => setActiveNav("dashboard")} />;
      case "messages":
        return <MessagesPage token={token} userId={userId} socket={socketRef.current} />;
      case "learn":
        return <LearnPage userId={userId} />;
      case "career":
        return <CareerServicesPage profile={profile} skills={data.skills} workExperience={data.workExperience} />;
      case "terms":
        return <TermsPage />;
      default:
        return (
          <ProfilePage data={data} displayAvatar={displayAvatar} token={token} saveMsg={saveMsg}
            modalOpen={!!modal} openModal={openModal} cv={cvProps} onPreviewCv={() => setModal("cvpreview")}
            onImportWork={data.importWorkExp} />
        );
    }
  };

  return (
    <CvAutofillProvider cvFileId={profile?.savedCvFileId} cvName={profile?.savedCvName} cvKey={profile?.savedCvFileId}>
      <style>{profileCss}</style>

      {/* ── Modals ── */}
      {showApply && <QuickApplyModal onClose={() => setShowApply(false)} savedCvName={profile?.savedCvName} />}
      {generalApply && <GeneralApplyModal profile={profile} onClose={() => setGeneralApply(false)} />}

      {modal === "personal" && (
        <PersonalModal form={form} onChange={data.changeForm} saving={saving} saveMsg={saving ? "" : saveMsg}
          onSave={() => data.savePersonal(closeModal)}
          onClose={() => { closeModal(); setForm(profile); setSaveMsg(""); }} />
      )}
      {modal === "summary" && (
        <SummaryModal form={form} saving={saving} onClose={closeModal} onSave={(local) => data.saveSummary(local, closeModal)} />
      )}
      {modal === "skills" && (
        <SkillsModal skills={data.skills} saving={saving} onClose={closeModal} onSave={(s) => data.saveSkills(s, closeModal)} />
      )}
      {modal === "education" && (
        <EducationModal education={data.education} saving={saving} onClose={closeModal} onSave={(e) => data.saveEducation(e, closeModal)} />
      )}
      {modal === "professional" && (
        <ProfessionalModal qualifications={data.qualifications} memberships={data.memberships} token={token}
          saving={saving} onClose={closeModal} onSave={(v) => data.saveProfessional(v, closeModal)} />
      )}
      {modal === "workexp" && (
        <WorkExpModal entry={workExp.entry} index={workExp.index} isNew={workExp.isNew} existing={data.workExperience}
          saving={saving} onClose={closeModal}
          onSave={(entry) => data.saveWorkExp(entry, workExp, closeModal)}
          onDelete={(i) => data.deleteWorkExp(i, closeModal)} />
      )}
      {modal === "avatar" && (
        <AvatarModal currentUrl={displayAvatar} saving={saving} onClose={closeModal} onSave={(f) => data.saveAvatar(f, closeModal)} />
      )}
      {modal === "cvpreview" && <CvPreviewModal cvUrl={cvPreviewUrl} cvName={profile?.savedCvName} onClose={closeModal} />}

      {/* ── Layout ── */}
      <div className="main-layout" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Sidebar activeNav={activeNav} onNav={setActiveNav} open={sidebarOpen} onClose={() => setSidebarOpen(false)}
          applicationsCount={data.applicationsCount} displayAvatar={displayAvatar} initials={initials}
          fullName={fullName} onLogout={handleLogoutClick} />

        <div className="main-content" style={{ overflowY: "auto" }}>
          <TopBar title={PAGE_TITLES[activeNav] || "Profile"} onMenu={() => setSidebarOpen(true)}
            onPreviewCv={handlePreviewCv} onQuickApply={handleQuickApply} />
          {renderPage()}
        </div>
      </div>

      <BottomNav activeNav={activeNav} onNav={setActiveNav} />
    </CvAutofillProvider>
  );
};

export default UserProfileDashboard;
