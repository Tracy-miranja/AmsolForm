import { useEffect, useMemo, useState } from "react";
import api from "../../api/axiosInstance";

const API = "/api";

const iconStyle = { width: 16, height: 16, flexShrink: 0 };

const Icons = {
  spark: (
    <svg viewBox="0 0 20 20" fill="currentColor" style={iconStyle}>
      <path d="M11.3 1.046A1 1 0 0112 2v4.2l2.262-2.262a1 1 0 111.414 1.414L13.414 7.6H18a1 1 0 110 2h-4.586l2.262 2.248a1 1 0 11-1.414 1.428L12 11v4a1 1 0 11-2 0v-4l-2.262 2.276a1 1 0 11-1.414-1.428L8.586 9.6H4a1 1 0 010-2h4.586L6.324 5.352A1 1 0 117.738 3.94L10 6.2V2a1 1 0 011.3-.954z" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 20 20" fill="currentColor" style={iconStyle}>
      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
    </svg>
  ),
  bookmark: (
    <svg viewBox="0 0 20 20" fill="currentColor" style={iconStyle}>
      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 20 20" fill="currentColor" style={iconStyle}>
      <path d="M3 3a1 1 0 000 2v10a2 2 0 002 2h10a1 1 0 100-2H5V5a1 1 0 00-2 0z" />
      <path d="M7 11a1 1 0 011-1h1a1 1 0 011 1v2H7v-2zM11 8a1 1 0 011-1h1a1 1 0 011 1v5h-3V8zM15 5a1 1 0 011-1h1a1 1 0 011 1v8h-3V5z" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 20 20" fill="currentColor" style={iconStyle}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-3.5A4.5 4.5 0 1010 5.5a4.5 4.5 0 000 9zm0-2.5a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 20 20" fill="currentColor" style={iconStyle}>
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  ),
};

const sectionTitle = {
  fontSize: 11,
  fontWeight: 700,
  color: "#9090a8",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
};

const getCategoryName = (job, categoriesMap) => {
  if (!job?.category_id) return "General";
  if (typeof job.category_id === "object") {
    return job.category_id.category_name || "General";
  }
  return categoriesMap.get(job.category_id) || "General";
};

const formatDate = (value) => {
  if (!value) return "Recent";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const StatCard = ({ label, value, detail, color, bg, icon }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 18,
      border: "1px solid rgba(0,0,0,0.08)",
      padding: "18px 18px 16px",
      boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <span style={{ ...sectionTitle, marginBottom: 0 }}>{label}</span>
      <span
        style={{
          width: 36,
          height: 36,
          display: "grid",
          placeItems: "center",
          borderRadius: 12,
          background: bg,
          color,
        }}
      >
        {icon}
      </span>
    </div>
    <div style={{ fontSize: 30, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{value}</div>
    <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280", lineHeight: 1.55 }}>{detail}</div>
  </div>
);

const ActionCard = ({ title, body, meta, color, onClick }) => (
  <button
    onClick={onClick}
    style={{
      textAlign: "left",
      width: "100%",
      background: "#fff",
      border: "1px solid rgba(0,0,0,0.08)",
      borderRadius: 18,
      padding: 18,
      cursor: "pointer",
      transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
      boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 12px 32px rgba(15,23,42,0.08)";
      e.currentTarget.style.borderColor = `${color}40`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,0.05)";
      e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)";
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 650, color: "#111827" }}>{title}</div>
        <div style={{ marginTop: 6, fontSize: 13.5, color: "#6b7280", lineHeight: 1.55 }}>{body}</div>
      </div>
      <span style={{ color }}>{Icons.arrow}</span>
    </div>
    <div style={{ marginTop: 14, fontSize: 12, fontWeight: 600, color }}>{meta}</div>
  </button>
);

const Chip = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { bg: "#e8f1fd", color: "#1a6edb" },
    green: { bg: "#eafaf1", color: "#15803d" },
    amber: { bg: "#fff7e8", color: "#b45309" },
    slate: { bg: "#f4f6fb", color: "#475569" },
  };
  const palette = tones[tone] || tones.blue;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "7px 12px",
        borderRadius: 999,
        background: palette.bg,
        color: palette.color,
        fontSize: 12.5,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
};

const JobSettingsPage = ({
  token,
  profile,
  savedJobs,
  loadingSaved,
  onBrowseJobs,
  onOpenProfile,
  onOpenSaved,
  onOpenApplications,
}) => {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      const requests = await Promise.allSettled([
  api.get(`${API}/jobs?page=1&limit=120`),
  api.get(`${API}/categories`),
  api.get(`${API}/my-applications`),
]);

      if (cancelled) return;

      const [jobsRes, categoriesRes, applicationsRes] = requests;

      if (jobsRes.status === "fulfilled") {
        setJobs(jobsRes.value.data.jobs || []);
      }

      if (categoriesRes.status === "fulfilled") {
        setCategories(categoriesRes.value.data || []);
      }

      if (applicationsRes.status === "fulfilled") {
        setApplications(applicationsRes.value.data.applications || []);
      }

      if (
        jobsRes.status === "rejected" &&
        categoriesRes.status === "rejected" &&
        applicationsRes.status === "rejected"
      ) {
        setError("We couldn’t load your live career data right now. Please try again shortly.");
      }

      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const categoriesMap = useMemo(
    () => new Map(categories.map((category) => [category._id, category.category_name])),
    [categories]
  );

  const openJobs = useMemo(
    () =>
      jobs.filter((job) => {
        const status = `${job.job_status || ""}`.toLowerCase();
        return !status || !["closed", "archived", "inactive"].includes(status);
      }),
    [jobs]
  );

  const topCategories = useMemo(() => {
    const counts = new Map();
    openJobs.forEach((job) => {
      const name = getCategoryName(job, categoriesMap);
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({ name, count }));
  }, [openJobs, categoriesMap]);

  const savedCategoryInsights = useMemo(() => {
    const counts = new Map();
    savedJobs.forEach((job) => {
      const name = getCategoryName(job, categoriesMap);
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
  }, [savedJobs, categoriesMap]);

  const recentApplications = useMemo(
    () => [...applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3),
    [applications]
  );

 const preferenceChips = [
    profile?.positionApplied || profile?.positionapplied,
    profile?.specialization,
    profile?.location,
    // academicLevel is an array of objects from DB — extract the highest level string
    Array.isArray(profile?.academicLevel)
      ? profile.academicLevel[0]?.level || null
      : typeof profile?.academicLevel === "string"
      ? profile.academicLevel
      : null,
    profile?.nationality,
  ].filter(Boolean);

  const profileSignals = [
    !!profile?.specialization,
    !!profile?.location,
  !!(Array.isArray(profile?.academicLevel) ? profile.academicLevel.length : profile?.academicLevel),
    !!profile?.savedCvFileId,
    (savedJobs || []).length > 0,
    applications.length > 0,
  ].filter(Boolean).length;

  const featuredRole =
    profile?.positionApplied ||
    profile?.positionapplied ||
    recentApplications[0]?.positionapplied ||
    savedJobs[0]?.title ||
    "Open opportunities";

  return (
    <div style={{ padding: "clamp(16px, 4vw, 32px)", paddingBottom: 36, display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}

        .js-hero-grid { display: grid; grid-template-columns: minmax(0,1.35fr) minmax(320px,1fr); gap: 18px; }
        .js-stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 14px; }
        .js-mid-grid   { display: grid; grid-template-columns: minmax(0,1.15fr) minmax(0,0.85fr); gap: 18px; }
        .js-action-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; }
        .js-hero-h2 { font-size: 30px; }
        .js-cat-row { display: grid; grid-template-columns: 52px 1fr auto; align-items: center; gap: 14px; }
        .js-recent-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }

        @media (max-width: 900px) {
          .js-hero-grid  { grid-template-columns: 1fr; }
          .js-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .js-mid-grid   { grid-template-columns: 1fr; }
          .js-action-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 540px) {
          .js-stats-grid  { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .js-action-grid { grid-template-columns: 1fr; }
          .js-hero-h2     { font-size: 22px !important; }
          .js-cat-row     { grid-template-columns: 40px 1fr; }
          .js-cat-chip    { display: none; }
          .js-recent-header { flex-direction: column; align-items: flex-start; }
          .js-recent-header button { width: 100%; }
        }
      `}</style>
      {error && (
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 14,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            fontSize: 13.5,
          }}
        >
          {error}
        </div>
      )}

     <div className="js-hero-grid">
        <div
          style={{
            borderRadius: 24,
            padding: "clamp(16px, 3vw, 24px)",
            background:
              "radial-gradient(circle at top right, rgba(249,115,22,0.18), transparent 32%), linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)",
            color: "#fff",
            minHeight: 200,
            boxShadow: "0 20px 50px rgba(15,23,42,0.16)",
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(255,255,255,0.12)", fontSize: 12, fontWeight: 600 }}>
            {Icons.spark}
            Live career settings
          </div>
          <h2 className="js-hero-h2" style={{ margin: "18px 0 10px", lineHeight: 1.15, fontWeight: 700, letterSpacing: "-0.03em" }}>
            Your search is aligned around {featuredRole}
          </h2>
          <p style={{ margin: 0, maxWidth: 620, color: "rgba(255,255,255,0.82)", fontSize: 14.5, lineHeight: 1.7 }}>
            This page now reads your actual profile, saved roles, open jobs, and applications so you can steer your search with real platform data instead of placeholders.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
            {preferenceChips.length > 0 ? (
              preferenceChips.map((chip) => (
                <span
                  key={chip}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  {chip}
                </span>
              ))
            ) : (
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.82)" }}>
                Add your preferred role, location, and specialization in Profile to sharpen matching.
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
            <button
              onClick={onBrowseJobs}
              style={{
                padding: "11px 16px",
                borderRadius: 12,
                border: "none",
                background: "#fff",
                color: "#0f172a",
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Browse live jobs
            </button>
            <button
              onClick={onOpenProfile}
              style={{
                padding: "11px 16px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.24)",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Update profile data
            </button>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            border: "1px solid rgba(0,0,0,0.08)",
            padding: 22,
            boxShadow: "0 12px 34px rgba(15,23,42,0.06)",
          }}
        >
          <div style={sectionTitle}>Career momentum</div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ padding: 14, borderRadius: 16, background: "#f8fbff", border: "1px solid #dbeafe" }}>
              <div style={{ fontSize: 12, color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Profile signal score
              </div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 34, fontWeight: 700, color: "#111827" }}>{profileSignals}/6</span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>career signals active</span>
              </div>
              <div style={{ marginTop: 12, height: 8, borderRadius: 999, background: "#dbeafe", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${(profileSignals / 6) * 100}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: "linear-gradient(90deg,#1d4ed8,#38bdf8)",
                  }}
                />
              </div>
            </div>

            <div style={{ padding: 14, borderRadius: 16, background: "#fffbeb", border: "1px solid #fde68a" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#b45309", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {Icons.target}
                Best next move
              </div>
              <div style={{ marginTop: 8, fontSize: 14, color: "#78350f", lineHeight: 1.6 }}>
                {!profile?.savedCvFileId
                  ? "Upload your CV to unlock quick apply across live roles."
                  : applications.length === 0
                    ? "You have a CV ready. Start applying to open roles that match your specialization."
                    : savedJobs.length === 0
                      ? "Save a few promising roles so AMSOL can surface stronger job-fit patterns."
                      : "Your job settings are active. Keep your profile updated to improve recruiter visibility."}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="js-mid-grid">
        <StatCard
          label="Open Roles"
          value={openJobs.length}
          detail={loading ? "Loading live opportunities..." : "Current opportunities available across the platform."}
          color="#1d4ed8"
          bg="#e8f1fd"
          icon={Icons.briefcase}
        />
        <StatCard
          label="Saved Jobs"
          value={loadingSaved ? "..." : savedJobs.length}
          detail={loading ? "Loading saved roles..." : "Roles you have bookmarked for later review."}
          color="#d97706"
          bg="#fff7e8"
          icon={Icons.bookmark}
        />
        <StatCard
          label="Applications"
          value={applications.length}
          detail={loading ? "Loading your applications..." : "Live submissions linked to your account and email."}
          color="#15803d"
          bg="#eafaf1"
          icon={Icons.spark}
        />
        <StatCard
          label="Hiring Categories"
          value={topCategories.length}
          detail={loading ? "Loading hiring categories..." : "Active categories now showing visible hiring demand."}
          color="#7c3aed"
          bg="#f3e8ff"
          icon={Icons.chart}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(0,0.85fr)", gap: 18 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 22,
            border: "1px solid rgba(0,0,0,0.08)",
            padding: 22,
            boxShadow: "0 12px 34px rgba(15,23,42,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={sectionTitle}>Live market focus</div>
              <h3 style={{ margin: "8px 0 0", fontSize: 22, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>
                Categories hiring right now
              </h3>
            </div>
            <Chip tone="slate">{openJobs.length} live roles</Chip>
          </div>

          <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
            {loading ? (
              <div style={{ display: "grid", gap: 12 }}>
                {[1, 2, 3].map((item) => (
                  <div key={item} style={{ height: 84, borderRadius: 18, background: "#f8fafc", border: "1px solid rgba(0,0,0,0.06)", animation: "pulse 1.5s ease-in-out infinite" }} />
                ))}
              </div>
            ) : topCategories.length > 0 ? (
              topCategories.map((item, index) => (
                <div
                 key={item.name}
                  className="js-cat-row"
                  style={{
                    padding: 14,
                    borderRadius: 18,
                    background: index === 0 ? "#f8fbff" : "#fbfcfe",
                    border: `1px solid ${index === 0 ? "#dbeafe" : "rgba(0,0,0,0.06)"}`,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 16,
                      background: index === 0 ? "linear-gradient(135deg,#1d4ed8,#38bdf8)" : "#eef2ff",
                      color: index === 0 ? "#fff" : "#4f46e5",
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 650, color: "#111827" }}>{item.name}</div>
                    <div style={{ marginTop: 5, fontSize: 13, color: "#6b7280" }}>
                      Strong hiring activity based on currently open roles.
                    </div>
                  </div>
                  <span className="js-cat-chip">
                    <Chip tone={index === 0 ? "blue" : "green"}>{item.count} openings</Chip>
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: "16px 0", fontSize: 14, color: "#6b7280" }}>
                Open job categories will appear here once live job data is available.
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 22,
            border: "1px solid rgba(0,0,0,0.08)",
            padding: 22,
            boxShadow: "0 12px 34px rgba(15,23,42,0.05)",
          }}
        >
          <div style={sectionTitle}>Your real signals</div>
          <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {preferenceChips.length > 0 ? (
              preferenceChips.map((chip, index) => (
                <Chip key={`${chip}-${index}`} tone={index % 2 === 0 ? "blue" : "slate"}>
                  {chip}
                </Chip>
              ))
            ) : (
              <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
                Your profile has not been tuned yet. Add role, specialization, and location to start matching against live data.
              </div>
            )}

            {profile?.savedCvFileId && <Chip tone="green">CV ready</Chip>}
            {!profile?.savedCvFileId && <Chip tone="amber">CV missing</Chip>}
          </div>

          <div style={{ marginTop: 22 }}>
            <div style={{ ...sectionTitle, marginBottom: 10 }}>Saved interest pattern</div>
            {loading ? (
              <div style={{ display: "grid", gap: 10 }}>
                {[1, 2].map((item) => (
                  <div key={item} style={{ height: 48, borderRadius: 14, background: "#f8fafc", animation: "pulse 1.5s ease-in-out infinite" }} />
                ))}
              </div>
            ) : savedCategoryInsights.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {savedCategoryInsights.map((item) => (
                  <div
                    key={item.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      borderRadius: 14,
                      background: "#f8fafc",
                    }}
                  >
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: "#334155" }}>{item.name}</span>
                    <Chip tone="slate">{item.count} saved</Chip>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.6 }}>
                Save a few jobs and we’ll show which categories you’re leaning toward most.
              </div>
            )}
          </div>
        </div>
      </div>

     <div className="js-action-grid">
        <ActionCard
          title="Tune profile details"
          body="Keep your role preference, specialization, and location current so recruiters see the right match signals."
          meta="Open profile editor"
          color="#1d4ed8"
          onClick={onOpenProfile}
        />
        <ActionCard
          title="Review saved jobs"
          body="See the roles you’ve bookmarked and turn strong-fit opportunities into quick applications."
          meta={`${savedJobs.length} saved role${savedJobs.length === 1 ? "" : "s"}`}
          color="#d97706"
          onClick={onOpenSaved}
        />
        <ActionCard
          title="Track applications"
          body="Monitor your latest submissions, status updates, and interview progress from one place."
          meta={`${applications.length} application${applications.length === 1 ? "" : "s"} on record`}
          color="#15803d"
          onClick={onOpenApplications}
        />
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 22,
          border: "1px solid rgba(0,0,0,0.08)",
          padding: 22,
          boxShadow: "0 12px 34px rgba(15,23,42,0.05)",
        }}
      >
       <div className="js-recent-header">
          <div>
            <div style={sectionTitle}>Recent activity</div>
            <h3 style={{ margin: "8px 0 0", fontSize: 22, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>
              Latest applications from your account
            </h3>
          </div>
          <button
            onClick={onOpenApplications}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.1)",
              background: "#fff",
              color: "#334155",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            View all applications
          </button>
        </div>

        {loading ? (
          <div style={{ display: "grid", gap: 12 }}>
            {[1, 2].map((item) => (
              <div key={item} style={{ height: 76, borderRadius: 18, background: "#f8fafc", border: "1px solid rgba(0,0,0,0.06)", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : recentApplications.length > 0 ? (
          <div style={{ display: "grid", gap: 12 }}>
            {recentApplications.map((application) => (
              <div
                key={application._id}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  borderRadius: 18,
                  background: "#fbfcfe",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 650, color: "#111827" }}>
                    {application.positionapplied || "Application"}
                  </div>
                  <div style={{ marginTop: 5, fontSize: 13.5, color: "#6b7280" }}>
                    Submitted on {formatDate(application.createdAt)}
                    {application.location ? ` · ${application.location}` : ""}
                  </div>
                </div>
                <Chip tone="slate">{application.status || "applied"}</Chip>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>
            You haven’t submitted an application yet. Browse live roles and use your saved CV to apply faster.
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSettingsPage;
