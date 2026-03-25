import { useState, useContext } from "react";
import axios from "axios";
import { JobContext } from "./JobContext";

const API = "https://amsol-api-production.up.railway.app/api";

// Strip HTML tags from job descriptions
const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

// ─── Pill filter button ───────────────────────────────────────────────────────
const Pill = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "6px 16px", borderRadius: 99, fontSize: 12.5, fontWeight: 500,
      cursor: "pointer", border: active ? "none" : "1px solid rgba(0,0,0,0.12)",
      background: active ? "#1a6edb" : "transparent",
      color: active ? "#fff" : "#5a5a72",
      transition: "all 0.18s",
    }}
  >
    {children}
  </button>
);

// ─── Quick-link card ──────────────────────────────────────────────────────────
const QuickLink = ({ icon, label, desc, color, bg, onClick, badge }) => (
  <button
    onClick={onClick}
    style={{
      background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)",
      padding: "18px 20px", textAlign: "left", cursor: "pointer", width: "100%",
      transition: "box-shadow 0.18s, transform 0.18s", position: "relative",
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
  >
    {badge && (
      <span style={{
        position: "absolute", top: 12, right: 14,
        background: "#ef4444", color: "#fff", borderRadius: 99,
        fontSize: 10, fontWeight: 700, padding: "1px 7px",
      }}>{badge}</span>
    )}
    <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, color }}>
      {icon}
    </div>
    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1a2e" }}>{label}</div>
    <div style={{ fontSize: 12, color: "#9090a8", marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
  </button>
);

// ─── Job card ─────────────────────────────────────────────────────────────────
const JobCard = ({ job, onApply, applyingId }) => {
  const [expanded, setExpanded] = useState(false);
  const plainDesc = stripHtml(job.description);
  const preview = plainDesc.length > 180 ? plainDesc.slice(0, 180) + "…" : plainDesc;
  const isApplying = applyingId === job.id;

  return (
    <div
      style={{
        background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)",
        overflow: "hidden", transition: "box-shadow 0.2s",
        display: "flex", flexDirection: "column",
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Title */}
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: "#1a1a2e", lineHeight: 1.35 }}>{job.title}</div>
          {job.location && (
            <div style={{ fontSize: 12, color: "#9090a8", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {job.location}
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{ fontSize: 12.5, color: "#6b6b82", lineHeight: 1.6, flex: 1 }}>
          {expanded ? plainDesc : preview}
          {plainDesc.length > 180 && (
            <button
              onClick={() => setExpanded(e => !e)}
              style={{ marginLeft: 6, color: "#1a6edb", fontSize: 12, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 500, color: "#065f46" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            Open
          </span>
          <button
            onClick={() => onApply(job)}
            disabled={isApplying}
            style={{
              padding: "8px 20px", borderRadius: 10, fontSize: 12.5, fontWeight: 600,
              background: "#1a6edb", color: "#fff", border: "none",
              cursor: isApplying ? "default" : "pointer",
              opacity: isApplying ? 0.6 : 1, transition: "background 0.18s",
            }}
            onMouseEnter={e => { if (!isApplying) e.currentTarget.style.background = "#0d4fa3"; }}
            onMouseLeave={e => { if (!isApplying) e.currentTarget.style.background = "#1a6edb"; }}
          >
            {isApplying ? "Applying…" : "Quick Apply"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Confirm Apply modal ──────────────────────────────────────────────────────
const ApplyConfirmModal = ({ job, profile, onConfirm, onClose, loading, error, success }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
    <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", width: "100%", maxWidth: 480, overflow: "hidden" }}>
      {success ? (
        <div style={{ padding: "48px 32px", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#059669" }}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="28" height="28"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>Application Sent!</div>
          <div style={{ fontSize: 13.5, color: "#6b6b82", marginTop: 6 }}>Your application for <strong>{job.title}</strong> has been submitted.</div>
        </div>
      ) : (
        <>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>Confirm Application</div>
              <div style={{ fontSize: 12, color: "#9090a8", marginTop: 2 }}>Review before submitting</div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9090a8", fontSize: 22, lineHeight: 1 }}>×</button>
          </div>

          <div style={{ padding: "20px 24px" }}>
            {/* Job info */}
            <div style={{ padding: "12px 16px", background: "#f4f6fb", borderRadius: 12, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "#e8f1fd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#1a6edb" }}>
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{job.title}</div>
                {job.location && <div style={{ fontSize: 12, color: "#5a5a72", marginTop: 2 }}>{job.location}</div>}
              </div>
            </div>

            {/* Profile summary */}
            <div style={{ fontSize: 12, color: "#6b6b82", marginBottom: 10, fontWeight: 500 }}>Submitting with your saved profile:</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ["Name",           [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "—"],
                ["Email",          profile?.email        || "—"],
                ["Phone",          profile?.phoneNumber  || "—"],
                ["Location",       profile?.location     || "—"],
                ["Specialization", profile?.specialization || "—"],
                ["CV",             profile?.savedCvName  || "Not uploaded"],
              ].map(([k, v]) => (
                <div key={k} style={{ background: "#f8f9fc", borderRadius: 8, padding: "8px 12px" }}>
                  <div style={{ color: "#9090a8", fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</div>
                  <div style={{ color: "#1a1a2e", marginTop: 2, fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v}</div>
                </div>
              ))}
            </div>

            {!profile?.savedCvFileId && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#fffbeb", borderRadius: 10, border: "1px solid #fde68a", fontSize: 12.5, color: "#92400e" }}>
                ⚠ No CV on profile — upload one for best results.
              </div>
            )}
            {(!profile?.firstName || !profile?.email) && (
              <div style={{ marginTop: 8, padding: "10px 14px", background: "#fee2e2", borderRadius: 10, border: "1px solid #fecaca", fontSize: 12.5, color: "#991b1b" }}>
                ✕ Profile incomplete — fill in your details before applying.
              </div>
            )}
            {error && (
              <div style={{ marginTop: 10, padding: "10px 14px", background: "#fee2e2", borderRadius: 10, fontSize: 12.5, color: "#991b1b" }}>{error}</div>
            )}
          </div>

          <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(0,0,0,0.08)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.13)", background: "transparent", color: "#5a5a72", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading || !profile?.firstName || !profile?.email}
              style={{
                padding: "9px 24px", borderRadius: 10,
                background: loading || !profile?.firstName || !profile?.email ? "#93c5fd" : "#1a6edb",
                color: "#fff", fontSize: 13, fontWeight: 600, border: "none",
                cursor: loading || !profile?.firstName || !profile?.email ? "default" : "pointer",
              }}
            >
              {loading ? "Submitting…" : "Submit Application"}
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);

// ─── Skeleton loader card ─────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)", padding: "18px 20px" }}>
    {[70, 35, 100, 100, 60].map((w, i) => (
      <div key={i} style={{ height: 11, background: "#f4f6fb", borderRadius: 6, width: `${w}%`, marginBottom: 10, animation: "pulse 1.5s ease-in-out infinite", animationDelay: `${i * 0.1}s` }} />
    ))}
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
      <div style={{ height: 34, width: 110, background: "#f4f6fb", borderRadius: 10, animation: "pulse 1.5s ease-in-out infinite" }} />
    </div>
  </div>
);

// ─── Inline icons ─────────────────────────────────────────────────────────────
const Ico = {
  profile: <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
  cv:      <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>,
  apply:   <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" /></svg>,
  apps:    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" /></svg>,
  saved:   <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>,
  msg:     <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" /></svg>,
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = ({ profile, token, onNav, onQuickApply }) => {
  const { jobs, loading: jobsLoading, error: jobsError } = useContext(JobContext);

  const [filter, setFilter]       = useState("All");
  const [search, setSearch]       = useState("");
  const [applyModal, setApplyModal] = useState(null);
  const [applying, setApplying]   = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  // Unique locations for filter pills (from API data)
  const locations = [...new Set(jobs.map(j => j.location).filter(Boolean))].slice(0, 5);

  // Filter + search logic
  const filteredJobs = jobs.filter(job => {
    const matchFilter = filter === "All" || job.location === filter;
    const q = search.toLowerCase();
    const matchSearch = !search ||
      job.title?.toLowerCase().includes(q) ||
      stripHtml(job.description).toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  // Profile completeness
  const missingProfile = !profile?.firstName || !profile?.email;
  const missingCv      = !profile?.savedCvFileId;
  const missingExp     = !(profile?.workExperience?.filter(w => w.company).length);
  const missingSummary = !profile?.specialization;
  const firstName      = profile?.firstName || "there";

  // Submit application via /api/quick-apply
  const submitApplication = async () => {
    if (!applyModal) return;
    setApplying(true);
    setApplyError("");
    setApplyingId(applyModal.job.id);
    try {
      const fd = new FormData();
      fd.append("positionapplied", applyModal.job.title);
      fd.append("salaryInfo", "");
      await axios.post(`${API}/quick-apply`, fd, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setApplySuccess(true);
      setTimeout(() => {
        setApplyModal(null);
        setApplySuccess(false);
        setApplyingId(null);
      }, 2500);
    } catch (err) {
      setApplyError(err.response?.data?.message || "Error submitting. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Welcome banner ─────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #1a6edb 0%, #3b5fc0 55%, #6366f1 100%)",
        borderRadius: 16, padding: "24px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        color: "#fff", overflow: "hidden", position: "relative",
      }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", right: 80, bottom: -70, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.75, marginBottom: 6 }}>Welcome back</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 600, lineHeight: 1.2 }}>Hello, {firstName}! </div>
          <div style={{ fontSize: 13.5, opacity: 0.85, marginTop: 6, maxWidth: 420 }}>
            {missingCv
              ? "Upload your CV to start applying to jobs with one click."
              : `${filteredJobs.length} job${filteredJobs.length !== 1 ? "s" : ""} available — apply instantly with your saved profile.`}
          </div>
        </div>
        <button
          onClick={onQuickApply}
          style={{
            flexShrink: 0, padding: "11px 24px", borderRadius: 12,
            background: "#f26722", color: "#fff", border: "none",
            fontSize: 13.5, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 16px rgba(242,103,34,0.4)",
            transition: "transform 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
        >
          ⚡ Quick Apply
        </button>
      </div>

      {/* ── Action alerts ───────────────────────────────────────────────────── */}
      {(missingProfile || missingCv || missingExp || missingSummary) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {missingProfile && (
            <div style={{ padding: "14px 18px", background: "#fff7ed", borderRadius: 12, border: "1px solid #fed7aa", display: "flex", gap: 12 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>👤</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#7c2d12" }}>Complete your profile</div>
                <div style={{ fontSize: 12, color: "#9a3412", marginTop: 2, lineHeight: 1.5 }}>Add personal details to get found by employers.</div>
                <button onClick={() => onNav("profile")} style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "#ea580c", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Go to Profile →</button>
              </div>
            </div>
          )}
          {missingSummary && (
            <div style={{ padding: "14px 18px", background: "#eff6ff", borderRadius: 12, border: "1px solid #bfdbfe", display: "flex", gap: 12 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>📝</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a8a" }}>Add your specialization</div>
                <div style={{ fontSize: 12, color: "#1d4ed8", marginTop: 2, lineHeight: 1.5 }}>Tell employers what role you're seeking.</div>
                <button onClick={() => onNav("profile")} style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "#2563eb", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Add now →</button>
              </div>
            </div>
          )}
          {missingExp && (
            <div style={{ padding: "14px 18px", background: "#f0fdf4", borderRadius: 12, border: "1px solid #bbf7d0", display: "flex", gap: 12 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>💼</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#14532d" }}>Add work experience</div>
                <div style={{ fontSize: 12, color: "#166534", marginTop: 2, lineHeight: 1.5 }}>Profiles with experience get 3× more views.</div>
                <button onClick={() => onNav("profile")} style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "#16a34a", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Add experience →</button>
              </div>
            </div>
          )}
          {missingCv && (
            <div style={{ padding: "14px 18px", background: "#fefce8", borderRadius: 12, border: "1px solid #fef08a", display: "flex", gap: 12 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>📄</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#713f12" }}>Upload your CV</div>
                <div style={{ fontSize: 12, color: "#92400e", marginTop: 2, lineHeight: 1.5 }}>Required for Quick Apply on job listings.</div>
                <button onClick={() => onNav("cv")} style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "#d97706", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Upload CV →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Quick links ─────────────────────────────────────────────────────── */}
      <div>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Quick Links</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 12 }}>
          <QuickLink icon={Ico.profile} label="My Profile"   desc="View & edit details"     color="#1a6edb" bg="#e8f1fd"  onClick={() => onNav("profile")} />
          <QuickLink icon={Ico.cv}      label="Uploaded CV"  desc="Manage your CV file"     color="#7c3aed" bg="#ede9fe"  onClick={() => onNav("cv")} />
          <QuickLink icon={Ico.apply}   label="Quick Apply"  desc="1-click applications"    color="#f26722" bg="#fff0e8"  onClick={onQuickApply} />
          <QuickLink icon={Ico.apps}    label="Applications" desc="Track your submissions"  color="#0d9488" bg="#ccfbf1"  onClick={() => onNav("applications")} badge="3" />
          <QuickLink icon={Ico.saved}   label="Saved Jobs"   desc="Jobs you bookmarked"     color="#d97706" bg="#fef3c7"  onClick={() => onNav("saved")} />
          <QuickLink icon={Ico.msg}     label="Messages"     desc="Recruiter conversations" color="#6366f1" bg="#eef2ff"  onClick={() => onNav("messages")} />
        </div>
      </div>

      {/* ── Job listings ────────────────────────────────────────────────────── */}
      <div>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Available Jobs
            {!jobsLoading && (
              <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, color: "#b0b0c0", textTransform: "none", letterSpacing: 0 }}>
                {filteredJobs.length} listing{filteredJobs.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {/* Search input */}
          <div style={{ position: "relative" }}>
            <svg viewBox="0 0 20 20" fill="#9090a8" width="14" height="14"
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text" placeholder="Search jobs…" value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                borderRadius: 9, border: "1px solid rgba(0,0,0,0.12)",
                fontSize: 13, color: "#1a1a2e", background: "#fff",
                outline: "none", width: 200,
              }}
            />
          </div>
        </div>

        {/* Location filter pills */}
        {locations.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {["All", ...locations].map(loc => (
              <Pill key={loc} active={filter === loc} onClick={() => setFilter(loc)}>{loc}</Pill>
            ))}
          </div>
        )}

        {/* Grid */}
        {jobsLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : jobsError ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#9090a8" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>⚠️</div>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>Could not load jobs. Please try again later.</div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#9090a8" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>🔍</div>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>No jobs match your search</div>
            <button onClick={() => { setSearch(""); setFilter("All"); }}
              style={{ marginTop: 10, fontSize: 13, color: "#1a6edb", background: "none", border: "none", cursor: "pointer" }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onApply={(j) => { setApplyModal({ job: j }); setApplyError(""); setApplySuccess(false); }}
                applyingId={applyingId}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Confirm modal ───────────────────────────────────────────────────── */}
      {applyModal && (
        <ApplyConfirmModal
          job={applyModal.job}
          profile={profile}
          onConfirm={submitApplication}
          onClose={() => { setApplyModal(null); setApplyingId(null); setApplyError(""); }}
          loading={applying}
          error={applyError}
          success={applySuccess}
        />
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
};

export default Dashboard;