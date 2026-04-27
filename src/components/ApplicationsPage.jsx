import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5001/api";

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  submitted: {
    label: "Submitted",
    bg: "#eff6ff",
    color: "#1d4ed8",
    border: "#bfdbfe",
    dot: "#3b82f6",
    step: 1,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
      </svg>
    ),
  },
  applied: {
    label: "Submitted",
    bg: "#eff6ff",
    color: "#1d4ed8",
    border: "#bfdbfe",
    dot: "#3b82f6",
    step: 1,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
      </svg>
    ),
  },
  under_review: {
    label: "Under Review",
    bg: "#fffbeb",
    color: "#b45309",
    border: "#fde68a",
    dot: "#f59e0b",
    step: 2,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  interview: {
    label: "Interview",
    bg: "#f0fdf4",
    color: "#166534",
    border: "#bbf7d0",
    dot: "#22c55e",
    step: 3,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
      </svg>
    ),
  },
  hired: {
    label: "Hired",
    bg: "#f0fdf4",
    color: "#14532d",
    border: "#86efac",
    dot: "#16a34a",
    step: 4,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  rejected: {
    label: "Rejected",
    bg: "#fef2f2",
    color: "#991b1b",
    border: "#fecaca",
    dot: "#ef4444",
    step: 0,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  },
};

const TIMELINE_STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "interview", label: "Interview" },
  { key: "hired", label: "Hired" },
];

function getStatus(raw) {
  if (!raw) return "submitted";
  const s = raw.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
  if (s === "applied") return "submitted";
  if (STATUS_CONFIG[s]) return s;
  return "submitted";
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Progress timeline bar ─────────────────────────────────────────────────────
const Timeline = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.submitted;
  const isRejected = status === "rejected";
  const currentStep = isRejected ? -1 : cfg.step;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 14 }}>
      {TIMELINE_STEPS.map((step, idx) => {
        const stepCfg = STATUS_CONFIG[step.key];
        const done = !isRejected && currentStep >= stepCfg.step;
        const active = !isRejected && currentStep === stepCfg.step;

        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center", flex: idx < TIMELINE_STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                background: isRejected ? "#f4f6fb" : done ? stepCfg.dot : "#e8edf5",
                border: `2px solid ${isRejected ? "#e8edf5" : done ? stepCfg.dot : "#d1d8e8"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s",
                boxShadow: active ? `0 0 0 3px ${stepCfg.dot}30` : "none",
              }}>
                {done && !isRejected && (
                  <svg viewBox="0 0 12 12" fill="white" width="9" height="9">
                    <path d="M2 6l3 3 5-5" strokeWidth="1.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                )}
              </div>
             <span className="timeline-label" style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: done && !isRejected ? stepCfg.color : "#9090a8", whiteSpace: "nowrap" }}>
                {step.label}
              </span>
            </div>
            {idx < TIMELINE_STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: "0 4px", marginBottom: 15,
                background: !isRejected && currentStep > stepCfg.step
                  ? STATUS_CONFIG[TIMELINE_STEPS[idx + 1].key].dot
                  : "#e8edf5",
                transition: "background 0.3s",
              }} />
            )}
          </div>
        );
      })}
      {isRejected && (
        <div style={{ marginLeft: 8, marginBottom: 15, display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 99, background: "#fee2e2", border: "1px solid #fecaca" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#991b1b" }}>Rejected</span>
        </div>
      )}
    </div>
  );
};

// ─── Single application card ────────────────────────────────────────────────────
const AppCard = ({ app }) => {
  const statusKey = getStatus(app.status);
  const cfg = STATUS_CONFIG[statusKey];
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: `1.5px solid ${expanded ? cfg.border : "rgba(0,0,0,0.07)"}`,
      overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s",
      boxShadow: expanded ? `0 0 0 3px ${cfg.dot}18` : "none",
    }}>
      {/* Card header */}
      <div
        onClick={() => setExpanded(e => !e)}
        className="app-card-header"
      >
        {/* Icon */}
        <div style={{
          width: 42, height: 42, borderRadius: 11, flexShrink: 0,
          background: cfg.bg, border: `1px solid ${cfg.border}`,
          display: "flex", alignItems: "center", justifyContent: "center", color: cfg.color,
        }}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="app-card-title">
            {app.positionapplied || app.positionApplied || "—"}
          </div>
          <div className="app-card-meta">
            Applied {formatDate(app.createdAt)}
            {app.location ? ` · ${app.location}` : ""}
          </div>
        </div>

        {/* Status badge */}
        <div
          className="app-status-badge"
          style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
          <span className="app-status-badge-text">{cfg.label}</span>
        </div>

        {/* Chevron */}
        <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" style={{ flexShrink: 0, color: "#9090a8", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: "0 20px 18px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
          <Timeline status={statusKey} />

          {/* What to expect messages */}
          <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 10, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>
              {cfg.icon} What this means
            </div>
            <div style={{ fontSize: 12.5, color: cfg.color, lineHeight: 1.6 }}>
              {statusKey === "submitted" && "Your application has been received. Our team will review it shortly."}
              {statusKey === "under_review" && "Our recruitment team is reviewing your application and CV. We'll be in touch soon."}
              {statusKey === "interview" && "Congratulations! You've been shortlisted. Expect an interview invitation via email or phone."}
              {statusKey === "hired" && "You've been selected for this role. Our team will reach out with next steps and onboarding details."}
              {statusKey === "rejected" && "Unfortunately your application was not successful for this role. We encourage you to apply for other open positions."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = ({ onBrowse }) => (
  <div style={{ textAlign: "center", padding: "64px 32px" }}>
    <div style={{ width: 72, height: 72, borderRadius: 18, background: "#f4f6fb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="#9090a8" strokeWidth="1.5" width="32" height="32">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m8-4v4" />
      </svg>
    </div>
    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: "#1a1a2e", marginBottom: 8 }}>No applications yet</div>
    <div style={{ fontSize: 13.5, color: "#9090a8", maxWidth: 320, margin: "0 auto 24px", lineHeight: 1.6 }}>
      When you apply for jobs, your applications and their statuses will appear here.
    </div>
    <button
      onClick={onBrowse}
      style={{ padding: "11px 28px", borderRadius: 12, background: "#1a6edb", color: "#fff", fontSize: 13.5, fontWeight: 650, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
      </svg>
      Browse Jobs
    </button>
  </div>
);

// ─── Stats bar ─────────────────────────────────────────────────────────────────
const StatsBar = ({ applications }) => {
  const counts = applications.reduce((acc, app) => {
    const s = getStatus(app.status);
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: "Total", value: applications.length, color: "#1a6edb", bg: "#eff6ff" },
    { label: "Under Review", value: (counts.under_review || 0), color: "#b45309", bg: "#fffbeb" },
    { label: "Interviews", value: (counts.interview || 0), color: "#166534", bg: "#f0fdf4" },
    { label: "Offers", value: (counts.hired || 0), color: "#14532d", bg: "#dcfce7" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 24 }}>
      {stats.map(s => (
        <div key={s.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)", padding: "14px 18px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
        </div>
      ))}
    </div>
  );
};

const SpotlightCard = ({ application }) => {
  if (!application) return null;
  const statusKey = getStatus(application.status);
  const cfg = STATUS_CONFIG[statusKey];

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at top right, rgba(59,130,246,0.16), transparent 30%), linear-gradient(135deg, #0f172a 0%, #1e3a8a 58%, #1d4ed8 100%)",
        color: "#fff",
        borderRadius: 20,
        padding: "20px 22px",
        minHeight: 180,
        boxShadow: "0 18px 44px rgba(15,23,42,0.16)",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.72)" }}>
        Latest application
      </div>
      <div className="spotlight-title">
        {application.positionapplied || application.positionApplied || "Recent role"}
      </div>
      <div style={{ marginTop: 10, fontSize: 13.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
        Submitted on {formatDate(application.createdAt)}
        {application.location ? ` from ${application.location}` : ""}.
      </div>

      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.18)",
            fontSize: 12.5,
            fontWeight: 700,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot }} />
          {cfg.label}
        </span>
        {application.nationality && (
          <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)" }}>{application.nationality}</span>
        )}
      </div>
    </div>
  );
};

// ─── Main ApplicationsPage component ───────────────────────────────────────────
const ApplicationsPage = ({ token, profile, onBrowseJobs }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!token) return;
    const fetchMyApplications = async () => {
      try {
        // Try the dedicated endpoint first
        const { data } = await axios.get(`${API}/my-applications`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setApplications(data.applications || []);
      } catch (err) {
        // Fallback: search by email from profile
        if (profile?.email) {
          try {
            const { data } = await axios.get(
              `${API}/applications/all/search?query=${encodeURIComponent(profile.email)}`,
              { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );
            const myApps = (data.applications || []).filter(
              a => a.email?.toLowerCase() === profile.email?.toLowerCase()
            );
            setApplications(myApps);
          } catch {
            setError("Could not load your applications. Please try again later.");
          }
        } else {
          setError("Could not load your applications. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMyApplications();
  }, [token, profile?.email]);

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "submitted", label: "Submitted" },
    { key: "under_review", label: "Under Review" },
    { key: "interview", label: "Interviews" },
    { key: "hired", label: "Offers" },
    { key: "rejected", label: "Rejected" },
  ];

  const filtered = applications
    .filter((a) => (filter === "all" ? true : getStatus(a.status) === filter))
    .filter((a) => {
      const haystack = [
        a.positionapplied,
        a.positionApplied,
        a.location,
        a.nationality,
        a.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    });

  const latestApplication = applications[0];

  return (
    <div style={{ padding: "clamp(16px, 4vw, 32px)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600&display=swap');
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}

        .app-card-header {
          padding: 16px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .app-card-title {
          font-size: 14px;
          font-weight: 650;
          color: #1a1a2e;
          letter-spacing: -0.01em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .app-card-meta {
          font-size: 12px;
          color: #9090a8;
          margin-top: 3px;
        }
        .app-status-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
          padding: 5px 12px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 600;
        }
        .spotlight-title {
          margin-top: 14px;
          font-family: 'Fraunces', serif;
          font-size: 24px;
          line-height: 1.15;
        }
        .tracker-heading {
          margin: 8px 0 10px;
          font-family: 'Fraunces', serif;
          font-size: 26px;
          color: #1a1a2e;
          line-height: 1.15;
        }

        @media (max-width: 480px) {
          .app-card-header { padding: 12px 14px; gap: 10px; }
          .app-card-title { font-size: 13px; }
          .app-card-meta { font-size: 11px; }
          .app-status-badge { padding: 4px 8px; font-size: 11px; }
          .app-status-badge-text { display: none; }
          .spotlight-title { font-size: 18px; }
          .tracker-heading { font-size: 20px; }
          .timeline-label { display: none; }
        }
      `}</style>

      {error && (
        <div style={{ padding: "12px 16px", background: "#fee2e2", borderRadius: 10, border: "1px solid #fecaca", fontSize: 13, color: "#991b1b", marginBottom: 20 }}>
          {error}
        </div>
      )}

      {!loading && applications.length === 0 && !error ? (
        <EmptyState onBrowse={onBrowseJobs} />
      ) : (
        <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 22 }}>
            <div
              style={{
                background: "#fff",
              borderRadius: 20,
              border: "1px solid rgba(0,0,0,0.08)",
              padding: "clamp(14px, 3vw, 22px)",
              boxShadow: "0 12px 34px rgba(15,23,42,0.05)",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9090a8" }}>
                Application tracker
              </div>
              <h2 className="tracker-heading" style={{ margin: 0 }}>
                See every live status update in one place
              </h2>
              <p style={{ margin: 0, fontSize: 13.5, color: "#6b7280", lineHeight: 1.7, maxWidth: 620 }}>
                This view uses your real AMSOL application data, so you can track progress, shortlist interviews, and quickly spot roles that need attention.
              </p>

              <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 10 }}>
                <span style={{ padding: "7px 12px", borderRadius: 999, background: "#e8f1fd", color: "#1d4ed8", fontSize: 12.5, fontWeight: 700 }}>
                  {applications.length} total applications
                </span>
                {profile?.email && (
                  <span style={{ padding: "7px 12px", borderRadius: 999, background: "#f4f6fb", color: "#475569", fontSize: 12.5, fontWeight: 700 }}>
                    {profile.email}
                  </span>
                )}
              </div>

              <div style={{ marginTop: 18, position: "relative" }}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by role, status, location, or nationality"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px 14px 11px 40px",
                    borderRadius: 14,
                    border: "1px solid rgba(0,0,0,0.1)",
                    background: "#f8fafc",
                    fontSize: 13.5,
                    color: "#1a1a2e",
                    outline: "none",
                  }}
                />
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" style={{ position: "absolute", left: 16, top: 15, color: "#94a3b8" }}>
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {loading ? (
              <div style={{ minHeight: 180, borderRadius: 20, background: "linear-gradient(135deg,#eff6ff,#dbeafe)", animation: "pulse 1.5s ease-in-out infinite" }} />
            ) : (
              <SpotlightCard application={latestApplication} />
            )}
          </div>

          <StatsBar applications={applications} />

          {/* Filter pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
            {filterOptions.map(opt => {
              const count = opt.key === "all"
                ? applications.length
                : applications.filter(a => getStatus(a.status) === opt.key).length;
              if (opt.key !== "all" && count === 0) return null;
              const active = filter === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setFilter(opt.key)}
                  style={{
                    padding: "6px 14px", borderRadius: 99, fontSize: 12.5, fontWeight: 500,
                    cursor: "pointer", border: active ? "none" : "1px solid rgba(0,0,0,0.12)",
                    background: active ? "#1a6edb" : "#fff",
                    color: active ? "#fff" : "#5a5a72",
                    transition: "all 0.18s",
                    display: "flex", alignItems: "center", gap: 5,
                  }}
                >
                  {opt.label}
                  <span style={{
                    fontSize: 10.5, fontWeight: 700,
                    background: active ? "rgba(255,255,255,0.25)" : "#f4f6fb",
                    color: active ? "#fff" : "#9090a8",
                    padding: "1px 6px", borderRadius: 99,
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Application cards */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.07)", padding: "20px", height: 82 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: "#f4f6fb", animation: "pulse 1.5s ease-in-out infinite" }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ height: 14, background: "#f4f6fb", borderRadius: 6, width: "40%", animation: "pulse 1.5s ease-in-out infinite" }} />
                      <div style={{ height: 11, background: "#f4f6fb", borderRadius: 6, width: "25%", animation: "pulse 1.5s ease-in-out infinite" }} />
                    </div>
                    <div style={{ width: 90, height: 26, background: "#f4f6fb", borderRadius: 99, animation: "pulse 1.5s ease-in-out infinite" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#9090a8", fontSize: 13.5 }}>
              No applications match this view. Try a different status or search term.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map(app => (
                <AppCard key={app._id} app={app} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationsPage;
