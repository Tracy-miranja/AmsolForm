// UserProfileDashboard.jsx
// Mount at /profile route. Matches the polished sidebar-based design from the AMSOL mockup.

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "./Context/UserContext";
import HandleLogout from "./logout";

const API = "https://amsol-api-production.up.railway.app/api";

// ─── Icon helpers (inline SVGs so no extra dep needed) ────────────────────────
const Icon = {
  home: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
  apps: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  msg: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
    </svg>
  ),
  bookmark: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  ),
  save: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  ),
  upload: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  ),
  spin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ animation: "spin 1s linear infinite" }}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0110 10" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  ),
};

// ─── Completion bar ────────────────────────────────────────────────────────────
const completionFields = ["firstName", "lastName", "email", "phoneNumber", "nationality",
  "location", "specialization", "academicLevel", "savedCvFileId"];

function calcCompletion(profile) {
  if (!profile) return 0;
  const filled = completionFields.filter((f) => profile[f]).length;
  return Math.round((filled / completionFields.length) * 100);
}

// ─── Field / Input / Select ────────────────────────────────────────────────────
const inputCls = `w-full px-3 py-2 rounded-lg border border-[rgba(0,0,0,0.1)] bg-[#f8f9fc]
  text-[13.5px] text-[#1a1a2e] placeholder-[#9090a8]
  focus:outline-none focus:ring-2 focus:ring-[#1a6edb40] focus:border-[#1a6edb]
  disabled:bg-[#f4f6fb] disabled:text-[#9090a8] transition`;

const Inp = (props) => <input {...props} className={inputCls} />;
const Sel = ({ children, ...props }) => (
  <select {...props} className={inputCls + " cursor-pointer"}>{children}</select>
);

const FieldRow = ({ label, children }) => (
  <div className="flex flex-col gap-1 mb-3">
    <span className="text-[11px] font-medium text-[#9090a8] uppercase tracking-[0.07em]">{label}</span>
    {children}
  </div>
);

// ─── Quick Apply Modal ─────────────────────────────────────────────────────────
const QuickApplyModal = ({ onClose, savedCvName, token }) => {
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [useSaved, setUseSaved] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [terms, setTerms] = useState(false);
  const fileRef = useRef();

  const submit = async () => {
    if (!terms) { setError("Please accept the terms before submitting."); return; }
    if (!position.trim()) { setError("Please enter the position you are applying for."); return; }
    if (!savedCvName && !cvFile) { setError("Please upload a CV."); return; }
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("positionapplied", position);
      fd.append("salaryInfo", salary);
      if (!useSaved && cvFile) fd.append("cv", cvFile);
      await axios.post(`${API}/quick-apply`, fd, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting application.");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)]">
          <div>
            <h2 className="font-semibold text-[#1a1a2e] text-[15px]">Quick Apply</h2>
            <p className="text-[#9090a8] text-xs mt-0.5">Your saved profile will be attached automatically</p>
          </div>
          <button onClick={onClose} className="text-[#9090a8] hover:text-[#1a1a2e] transition p-1 rounded-lg hover:bg-[#f4f6fb]">
            {Icon.x}
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-500">
              {Icon.check}
            </div>
            <p className="font-semibold text-[#1a1a2e]">Application Submitted!</p>
            <p className="text-[#9090a8] text-sm text-center px-8">We've received your application and will be in touch soon.</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <FieldRow label="Position Applying For *">
              <Inp type="text" placeholder="e.g. Senior Accountant" value={position} onChange={e => setPosition(e.target.value)} />
            </FieldRow>
            <FieldRow label="Current Salary (optional)">
              <Inp type="number" placeholder="e.g. 80000" value={salary} onChange={e => setSalary(e.target.value)} />
            </FieldRow>
            <div>
              <span className="text-[11px] font-medium text-[#9090a8] uppercase tracking-[0.07em]">CV / Resume</span>
              <div className="mt-2 space-y-2">
                {savedCvName && (
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-[#5a5a72]">
                    <input type="radio" checked={useSaved} onChange={() => { setUseSaved(true); setCvFile(null); }} />
                    Use saved: <span className="font-medium text-[#1a6edb]">{savedCvName}</span>
                  </label>
                )}
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#5a5a72]">
                  <input type="radio" checked={!useSaved} onChange={() => setUseSaved(false)} />
                  Upload a different CV
                </label>
                {!useSaved && (
                  <>
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={e => setCvFile(e.target.files[0])} className="hidden" />
                    <button onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-[#1a6edb60] rounded-lg text-[#1a6edb] hover:bg-[#e8f1fd] transition text-sm">
                      {Icon.upload}
                      {cvFile ? cvFile.name : "Choose file (PDF / DOC)"}
                    </button>
                  </>
                )}
              </div>
            </div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={terms} onChange={e => { setTerms(e.target.checked); setError(""); }} className="mt-0.5 w-4 h-4" />
              <span className="text-xs text-[#9090a8]">I confirm all profile information is accurate and consent to AMSOL processing my data for recruitment.</span>
            </label>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button onClick={submit} disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#1a6edb] text-white text-sm font-semibold hover:bg-[#0d4fa3] disabled:opacity-50 flex items-center justify-center gap-2 transition">
              {loading ? <>{Icon.spin} Submitting…</> : "Submit Application"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Sidebar nav item ──────────────────────────────────────────────────────────
const NavItem = ({ icon, label, active, badge, onClick }) => (
  <button onClick={onClick}
    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-[10px] text-[13.5px] transition text-left
      ${active ? "bg-[#e8f1fd] text-[#1a6edb] font-medium" : "text-[#5a5a72] hover:bg-[#f4f6fb] hover:text-[#1a1a2e]"}`}>
    <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
    {label}
    {badge != null && (
      <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-px rounded-full font-medium">{badge}</span>
    )}
  </button>
);

// ─── Section card wrapper ──────────────────────────────────────────────────────
const SectionCard = ({ dotColor = "#1a6edb", title, action, children }) => (
  <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.08)] overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: dotColor }} />
        <span className="text-[14px] font-medium text-[#1a1a2e]">{title}</span>
      </div>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const GhostBtn = ({ onClick, children }) => (
  <button onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,0,0,0.13)] text-[#5a5a72] text-[12.5px] hover:bg-[#f4f6fb] transition">
    {children}
  </button>
);

const AddBtn = ({ onClick, children }) => (
  <button onClick={onClick}
    className="flex items-center gap-1.5 px-3.5 py-1.5 border-[1.5px] border-dashed border-[#1a6edb60] rounded-[9px] text-[#1a6edb] text-[12.5px] font-medium hover:bg-[#e8f1fd] transition">
    {Icon.plus}{children}
  </button>
);

// ─── Main component ────────────────────────────────────────────────────────────
const UserProfileDashboard = () => {
  const { token } = useUser();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvMsg, setCvMsg] = useState("");
  const [showApply, setShowApply] = useState(false);
  const [loading, setLoading] = useState(true);
  const cvRef = useRef();

  useEffect(() => {
    if (!token) return;
    axios.get(`${API}/profile`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
      .then(({ data }) => { setProfile(data); setForm(data); })
      .catch(err => {
        if (err.response?.status === 404) { setProfile({}); setForm({}); setEditing(true); }
      })
      .finally(() => setLoading(false));
  }, [token]);

  const change = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const changeWE = (i, k, v) => {
    const we = [...(form.workExperience || [{}, {}, {}])];
    if (!we[i]) we[i] = {};
    we[i] = { ...we[i], [k]: v };
    setForm(f => ({ ...f, workExperience: we }));
  };

  const saveProfile = async () => {
    setSaving(true); setSaveMsg("");
    try {
      const { data } = await axios.post(`${API}/profile`, form, {
        headers: { Authorization: `Bearer ${token}` }, withCredentials: true,
      });
      setProfile(data.profile); setForm(data.profile); setEditing(false);
      setSaveMsg("Profile saved successfully!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setSaveMsg(err.response?.data?.message || "Error saving profile.");
    } finally { setSaving(false); }
  };

  const uploadCv = async () => {
    if (!cvFile) return;
    setCvUploading(true); setCvMsg("");
    try {
      const fd = new FormData(); fd.append("cv", cvFile);
      const { data } = await axios.post(`${API}/profile/cv`, fd, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setProfile(p => ({ ...p, savedCvFileId: data.cvFileId, savedCvName: data.cvName }));
      setCvMsg(`CV "${data.cvName}" saved to your profile.`);
      setCvFile(null);
    } catch (err) {
      setCvMsg(err.response?.data?.message || "Error uploading CV.");
    } finally { setCvUploading(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
      <div style={{ animation: "spin 1s linear infinite" }} className="w-8 h-8 border-4 border-[#1a6edb] border-t-transparent rounded-full" />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const pct = calcCompletion(profile);
  const barColor = pct < 50 ? "#ef4444" : pct < 80 ? "#f59e0b" : "#1a6edb";
  const we = form.workExperience || [{}, {}, {}];
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "—";
  const initials = [profile?.firstName?.[0], profile?.lastName?.[0]].filter(Boolean).join("") || "?";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.25s ease; }
      `}</style>

      {showApply && <QuickApplyModal onClose={() => setShowApply(false)} savedCvName={profile?.savedCvName} token={token} />}

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh", background: "#f4f6fb", fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Sidebar ── */}
        <aside style={{ background: "#fff", borderRight: "1px solid rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", padding: "28px 0" }}>
          {/* Logo */}
          <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(0,0,0,0.08)", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, background: "#1a6edb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 16 16" width="14" height="14" fill="white">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 9a5.25 5.25 0 01-4.374-2.344C3.956 9.312 6.391 8.5 8 8.5c1.607 0 4.045.812 4.374 2.156A5.25 5.25 0 018 13z" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: "#1a1a2e" }}>AMSOL</div>
                <div style={{ fontSize: 10, color: "#9090a8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Jobs Portal</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div style={{ padding: "0 12px", flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: "#9090a8", letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 12px 4px" }}>Main</div>
            <NavItem icon={Icon.apps} label="Dashboard" active={activeNav === "dashboard"} onClick={() => setActiveNav("dashboard")} />
            <NavItem icon={Icon.user} label="Profile" active={activeNav === "profile"} onClick={() => setActiveNav("profile")} />
            <NavItem icon={Icon.file} label="Uploaded CV" active={activeNav === "cv"} onClick={() => setActiveNav("cv")} />
            <NavItem icon={Icon.bookmark} label="Saved Jobs" active={activeNav === "saved"} onClick={() => setActiveNav("saved")} />

            <div style={{ fontSize: 10, fontWeight: 500, color: "#9090a8", letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 12px 4px" }}>Career</div>
            <NavItem icon={Icon.settings} label="Job Settings" active={activeNav === "settings"} onClick={() => setActiveNav("settings")} />
            <NavItem icon={Icon.briefcase} label="Applications" active={activeNav === "applications"} badge={3} onClick={() => setActiveNav("applications")} />
            <NavItem icon={Icon.msg} label="Messages" active={activeNav === "messages"} onClick={() => setActiveNav("messages")} />
          </div>

          {/* User chip */}
          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#1a6edb,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "white", flexShrink: 0 }}>
                {initials}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fullName}</div>
                <div style={{ fontSize: 11, color: "#9090a8" }}>Job Seeker</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div style={{ overflowY: "auto" }}>
          {/* Topbar */}
          <div style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: "#1a1a2e" }}>Profile Update</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="flex items-center gap-1.5 px-4 py-2 rounded-[9px] border border-[rgba(0,0,0,0.13)] text-[#5a5a72] text-[13px] font-medium hover:bg-[#f4f6fb] transition">
                {Icon.eye} Preview CV
              </button>
              <button
                onClick={() => setShowApply(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-[9px] bg-[#f26722] text-white text-[13px] font-medium hover:bg-[#d95a1a] transition">
                {Icon.download} Quick Apply
              </button>
            </div>
          </div>

          {/* Page content */}
          <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>

            {/* ── Completion ── */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)", padding: "18px 24px", display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ flex: "0 0 auto" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e", marginBottom: 3 }}>Complete your profile</div>
                <div style={{ fontSize: 12, color: "#9090a8" }}>Employers find you 4× faster with a complete profile</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: barColor }}>{pct}%</span>
                  {pct < 80 && <span style={{ fontSize: 12, color: "#1a6edb", fontWeight: 500 }}>+{Math.round((100 - pct) / 2)}% — add experience</span>}
                </div>
                <div style={{ height: 7, background: "#e8edf5", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${barColor}, #6366f1)`, borderRadius: 99, transition: "width 0.7s" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", flexShrink: 0 }}>
                {!profile?.workExperience?.length && (
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500, background: "#fef0e8", color: "#f26722" }}>Missing: work experience</span>
                )}
                {!profile?.specialization && (
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500, background: "#e8f1fd", color: "#1a6edb" }}>Missing: specialization</span>
                )}
              </div>
            </div>

            {/* ── Personal Information ── */}
            <SectionCard
              dotColor="#1a6edb"
              title="Personal information"
              action={
                !editing ? (
                  <GhostBtn onClick={() => setEditing(true)}>{Icon.edit} Edit</GhostBtn>
                ) : (
                  <div className="flex gap-2">
                    <GhostBtn onClick={() => { setEditing(false); setForm(profile); }}>{Icon.x} Cancel</GhostBtn>
                    <button onClick={saveProfile} disabled={saving}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a6edb] text-white text-[12.5px] font-medium hover:bg-[#0d4fa3] disabled:opacity-50 transition">
                      {saving ? Icon.spin : Icon.save}
                      {saving ? "Saving…" : "Save"}
                    </button>
                  </div>
                )
              }
            >
              {saveMsg && (
                <p className={`mb-4 text-sm font-medium ${saveMsg.includes("success") ? "text-green-600" : "text-red-500"}`}>{saveMsg}</p>
              )}

              {/* Photo + fields */}
              <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                {/* Avatar */}
                <div style={{ flexShrink: 0, textAlign: "center" }}>
                  <div style={{ width: 88, height: 88, borderRadius: 16, background: "linear-gradient(135deg,#e0e8f8,#c8d8f0)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(0,0,0,0.08)", overflow: "hidden" }}>
                    <svg viewBox="0 0 60 60" fill="#a0b4d0" width="44" height="44">
                      <circle cx="30" cy="22" r="12" /><path d="M8 52c0-12.15 9.85-22 22-22s22 9.85 22 22" />
                    </svg>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: "#1a6edb", cursor: "pointer", fontWeight: 500 }}>Change photo</div>
                </div>

                {/* Grid */}
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px" }}>
                  {[
                    ["Full Name", null],
                    ["Email", "email"],
                    ["Phone", "phoneNumber"],
                    ["Age", "age"],
                    ["Nationality", "nationality"],
                    ["Location", "location"],
                    ["WhatsApp No.", "whatsAppNo"],
                    ["ID Number", "idNumber"],
                    ["Passport No.", "PassportNo"],
                    ["Driving Licence", "hasDrivingLicence"],
                  ].map(([label, field]) => {
                    if (label === "Full Name") {
                      return (
                        <div key="name" style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                          <span style={{ fontSize: 11, fontWeight: 500, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Full Name</span>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }} className={editing ? "" : ""}>
                            {editing ? (
                              <>
                                <Inp type="text" placeholder="First" value={form.firstName || ""} onChange={e => change("firstName", e.target.value)} />
                                <Inp type="text" placeholder="Middle" value={form.secondName || ""} onChange={e => change("secondName", e.target.value)} />
                                <Inp type="text" placeholder="Last" value={form.lastName || ""} onChange={e => change("lastName", e.target.value)} />
                              </>
                            ) : (
                              <span style={{ fontSize: "13.5px", color: fullName === "—" ? "#9090a8" : "#1a1a2e", fontStyle: fullName === "—" ? "italic" : "normal", gridColumn: "1/-1" }}>{fullName}</span>
                            )}
                          </div>
                        </div>
                      );
                    }
                    if (field === "hasDrivingLicence") {
                      return (
                        <div key={field} style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                          <span style={{ fontSize: 11, fontWeight: 500, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
                          {editing ? (
                            <Sel value={form[field] || ""} onChange={e => change(field, e.target.value)}>
                              <option value="">Select…</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </Sel>
                          ) : (
                            <span style={{ fontSize: "13.5px", color: form[field] ? "#1a1a2e" : "#9090a8", fontStyle: form[field] ? "normal" : "italic" }}>
                              {form[field] ? (form[field] === "yes" ? "Yes" : "No") : "Not provided"}
                            </span>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div key={field} style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 500, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
                        {editing ? (
                          <Inp type={field === "email" ? "email" : field === "age" ? "number" : "text"} placeholder={`Enter ${label.toLowerCase()}`} value={form[field] || ""} onChange={e => change(field, e.target.value)} />
                        ) : (
                          <span style={{ fontSize: "13.5px", color: form[field] ? (field === "email" ? "#1a6edb" : "#1a1a2e") : "#9090a8", fontStyle: form[field] ? "normal" : "italic" }}>
                            {form[field] || "Not provided"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </SectionCard>

            {/* ── Two-column row ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

              {/* Professional Summary */}
              <SectionCard dotColor="#6366f1" title="Professional summary"
                action={<GhostBtn onClick={() => setEditing(true)}>{Icon.edit} Edit</GhostBtn>}>
                {form.specialization ? (
                  <div>
                    <p style={{ fontSize: 13.5, color: "#5a5a72", lineHeight: 1.6 }}>{form.specialization}</p>
                    <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {form.positionApplied && <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 99, background: "#e8f1fd", color: "#1a6edb", fontWeight: 500 }}>{form.positionApplied}</span>}
                      {form.academicLevel && <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 99, background: "#f0f0ff", color: "#6366f1", fontWeight: 500 }}>{form.academicLevel}</span>}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f4f6fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg viewBox="0 0 20 20" fill="#9090a8" width="16" height="16"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: "#9090a8" }}>No summary added yet</div>
                      <AddBtn onClick={() => setEditing(true)}>Add summary ↗</AddBtn>
                    </div>
                  </div>
                )}
              </SectionCard>

              {/* Skills */}
              <SectionCard dotColor="#f26722" title="Skills"
                action={<GhostBtn onClick={() => {}}>{Icon.edit} Edit</GhostBtn>}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Microsoft Office", "Data Entry", "Communication", "Team Leadership"].map(s => (
                    <span key={s} style={{ padding: "6px 13px", borderRadius: 99, fontSize: 12, fontWeight: 500, background: "#f4f6fb", border: "1px solid rgba(0,0,0,0.1)", color: "#5a5a72" }}>{s}</span>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  <AddBtn onClick={() => {}}>Add skill ↗</AddBtn>
                </div>
              </SectionCard>
            </div>

            {/* ── Work Experience ── */}
            <SectionCard dotColor="#0d9488" title="Work experience"
              action={<AddBtn onClick={() => setEditing(true)}>Add experience ↗</AddBtn>}>
              {(profile?.workExperience?.length > 0 && profile.workExperience.some(w => w.company)) ? (
                <div>
                  {profile.workExperience.filter(w => w.company).map((w, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < profile.workExperience.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 9, background: "#f4f6fb", border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {Icon.briefcase}
                      </div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1a2e" }}>{w.position || "—"}</div>
                        <div style={{ fontSize: 12, color: "#5a5a72", marginTop: 2 }}>{w.company}</div>
                        {w.duration && <div style={{ fontSize: 11.5, color: "#9090a8", marginTop: 3 }}>{w.duration}</div>}
                      </div>
                    </div>
                  ))}
                  {editing && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Edit Work Experience</div>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{ marginBottom: 12, padding: 16, background: "#f8f9fc", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)" }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#9090a8", marginBottom: 10 }}>Company {i + 1}</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                            <Inp placeholder="Company name" value={we[i]?.company || ""} onChange={e => changeWE(i, "company", e.target.value)} />
                            <Inp placeholder="Position held" value={we[i]?.position || ""} onChange={e => changeWE(i, "position", e.target.value)} />
                            <Inp placeholder="Duration (e.g. 2 years)" value={we[i]?.duration || ""} onChange={e => changeWE(i, "duration", e.target.value)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : editing ? (
                <div>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ marginBottom: 12, padding: 16, background: "#f8f9fc", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#9090a8", marginBottom: 10 }}>Company {i + 1}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        <Inp placeholder="Company name" value={we[i]?.company || ""} onChange={e => changeWE(i, "company", e.target.value)} />
                        <Inp placeholder="Position held" value={we[i]?.position || ""} onChange={e => changeWE(i, "position", e.target.value)} />
                        <Inp placeholder="Duration (e.g. 2 years)" value={we[i]?.duration || ""} onChange={e => changeWE(i, "duration", e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f4f6fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {Icon.briefcase}
                  </div>
                  <div style={{ fontSize: 13, color: "#5a5a72" }}>
                    No work experience added yet. Adding experience increases your profile completion by <strong>+20%</strong>.
                  </div>
                </div>
              )}
            </SectionCard>

            {/* ── Education (from academicLevel) ── */}
            <SectionCard dotColor="#7c3aed" title="Education"
              action={<AddBtn onClick={() => setEditing(true)}>Add education ↗</AddBtn>}>
              {form.academicLevel ? (
                <div style={{ display: "flex", gap: 14, padding: "4px 0" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 600, color: "#7c3aed" }}>
                    {form.academicLevel[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1a2e" }}>{form.academicLevel}</div>
                    {form.specialization && <div style={{ fontSize: 12, color: "#5a5a72", marginTop: 2 }}>{form.specialization}</div>}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f4f6fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg viewBox="0 0 20 20" fill="#9090a8" width="16" height="16"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" /></svg>
                  </div>
                  <div style={{ fontSize: 13, color: "#9090a8" }}>No education added yet</div>
                </div>
              )}
            </SectionCard>

            {/* ── Saved CV ── */}
            <SectionCard dotColor="#1a6edb" title="Uploaded CV"
              action={
                <button onClick={() => cvRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 border-[1.5px] border-dashed border-[#1a6edb60] rounded-[9px] text-[#1a6edb] text-[12.5px] font-medium hover:bg-[#e8f1fd] transition">
                  {Icon.upload} {profile?.savedCvName ? "Replace CV" : "Upload CV"}
                </button>
              }>
              <input ref={cvRef} type="file" accept=".pdf,.doc,.docx" onChange={e => setCvFile(e.target.files[0])} className="hidden" />

              {profile?.savedCvName ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#f0fdf4", borderRadius: 12, border: "1px solid #bbf7d0" }}>
                  <span style={{ color: "#22c55e", flexShrink: 0 }}>{Icon.check}</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1a2e" }}>{profile.savedCvName}</div>
                    <div style={{ fontSize: 12, color: "#9090a8", marginTop: 2 }}>This CV will be used for quick applications</div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "12px 16px", background: "#fffbeb", borderRadius: 12, border: "1px solid #fde68a", fontSize: 13, color: "#92400e" }}>
                  No CV saved yet. Upload one to enable Quick Apply.
                </div>
              )}

              {cvFile && (
                <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#5a5a72" }}>{cvFile.name}</span>
                  <button onClick={uploadCv} disabled={cvUploading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1a6edb] text-white rounded-xl text-sm font-medium hover:bg-[#0d4fa3] disabled:opacity-50 transition">
                    {cvUploading ? Icon.spin : Icon.save}
                    {cvUploading ? "Uploading…" : "Save to Profile"}
                  </button>
                </div>
              )}
              {cvMsg && <p className={`mt-3 text-sm ${cvMsg.includes("saved") || cvMsg.includes("CV") ? "text-green-600" : "text-red-500"}`}>{cvMsg}</p>}
            </SectionCard>

          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileDashboard;