import { useRef } from "react";
import { matchingJobs, sortLatest, locationOf } from "./jobUtils";

// AMSOL palette
const BLUE = "#1a6edb", BLUE_DK = "#0d4fa3", ORANGE = "#f26722", INK = "#1a1a2e", MUTED = "#9090a8", BG = "#f7f8fa", LINE = "rgba(0,0,0,0.08)";
// kept as Y for JobsPage compatibility (primary accent)
export const Y = BLUE;

export const fuzuCss = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@600&display=swap');
.fz { font-family:'DM Sans',sans-serif; color:${INK}; background:${BG}; min-height:100%; }
.fz button { font-family:inherit; }
.fz-wrap { width:100%; padding:28px 32px 60px; }
.fz-row { display:flex; gap:14px; overflow-x:auto; scroll-behavior:smooth; scrollbar-width:none; padding:4px 2px 10px; }
.fz-row::-webkit-scrollbar { display:none; }
.fz-arrow { width:32px; height:32px; border-radius:50%; border:1px solid ${LINE}; background:#fff; cursor:pointer; font-size:16px; color:${INK}; }
.fz-arrow:hover { border-color:${BLUE}; color:${BLUE}; }
.fz-jobcard { flex:0 0 270px; background:#fff; border:1px solid ${LINE}; border-radius:14px; padding:16px; position:relative; cursor:pointer; display:flex; flex-direction:column; min-height:230px; transition:box-shadow .18s, border-color .18s; }
.fz-jobcard:hover { border-color:rgba(26,110,219,.4); box-shadow:0 4px 16px rgba(0,0,0,.07); }
.fz-quick { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; }
@media (max-width:1000px){ .fz-quick{grid-template-columns:repeat(3,1fr)} }
@media (max-width:640px){ .fz-quick{grid-template-columns:repeat(2,1fr)} .fz-jobcard{flex-basis:78%} .fz-wrap{padding:16px} .fz-banner{flex-direction:column !important; align-items:flex-start !important; gap:16px !important} }
`;

export const Heart = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill={filled ? "#e11d48" : "none"} stroke={filled ? "#e11d48" : INK} strokeWidth="2">
    <path d="M12 21s-7-4.6-9.3-9A5.3 5.3 0 0112 6a5.3 5.3 0 019.3 6c-2.3 4.4-9.3 9-9.3 9z" />
  </svg>
);

const Ico = {
  profile:  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>,
  cv:       <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/></svg>,
  apps:     <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/></svg>,
  saved:    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/></svg>,
  msg:      <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd"/></svg>,
  arrow:    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>,
  lightning:<svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/></svg>,
};

const QuickLink = ({ icon, label, desc, color, bg, onClick, badge }) => (
  <button onClick={onClick} style={{
    background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.07)",
    padding: "20px 22px 18px", textAlign: "left", cursor: "pointer", width: "100%",
    transition: "box-shadow 0.18s, transform 0.18s, border-color 0.18s",
    position: "relative", display: "flex", flexDirection: "column", gap: 10,
  }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = color + "40"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.07)"; }}
  >
    {badge ? <span style={{ position: "absolute", top: 10, right: 12, background: "#ef4444", color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "1px 7px" }}>{badge}</span> : null}
    <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 13.5, fontWeight: 650, color: INK, letterSpacing: "-0.01em" }}>{label}</div>
      <div style={{ fontSize: 11.5, color: MUTED, marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
    </div>
    <div style={{ marginTop: "auto", color, opacity: 0.6 }}>{Ico.arrow}</div>
  </button>
);

const JobCard = ({ job, saved, onSave, onOpen, tag, location }) => (
  <div className="fz-jobcard" onClick={() => onOpen(job)}>
    {tag && <span style={{ position: "absolute", top: -10, right: 12, background: ORANGE, color: "#fff", fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: "6px 6px 0 0" }}>{tag}</span>}
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ width: 52, height: 52, borderRadius: 12, background: "linear-gradient(135deg,#e8f1fd,#dbeafe)", color: BLUE, display: "grid", placeItems: "center", fontWeight: 700 }}>AM</div>
      <button onClick={e => { e.stopPropagation(); onSave(job); }} title={saved ? "Remove from saved" : "Save job"}
        style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${LINE}`, background: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}>
        <Heart filled={saved} />
      </button>
    </div>
    <div style={{ fontSize: 15, fontWeight: 650, marginTop: 14, lineHeight: 1.3 }}>{job.title}</div>
    <div style={{ fontSize: 13, color: "#5a5a72", marginTop: 10 }}>AMSOL</div>
    <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>{location || job.location || "Location not specified"}</div>
    <div style={{ marginTop: "auto", paddingTop: 12, fontSize: 12, fontWeight: 500, color: job.closingDate ? "#5a5a72" : "#047857" }}>
      {job.closingDate ? `Closes ${job.closingDate}` : "Open for applications"}
    </div>
  </div>
);

const Section = ({ title, onSeeAll, children }) => {
  const ref = useRef(null);
  const scroll = d => ref.current?.scrollBy({ left: d * 540 });
  return (
    <section style={{ marginTop: 36 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 650, margin: 0, letterSpacing: "-0.01em" }}>{title}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onSeeAll} style={{ background: "none", border: "none", color: BLUE, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>See all</button>
          <button className="fz-arrow" onClick={() => scroll(-1)} aria-label="Previous">‹</button>
          <button className="fz-arrow" onClick={() => scroll(1)} aria-label="Next">›</button>
        </div>
      </div>
      <div className="fz-row" ref={ref}>{children}</div>
    </section>
  );
};

const DashboardHome = ({ profile, jobs = [], savedJobIds, onToggleSave, onNav, onOpenJob, onSeeAllJobs, onApplyForm, getLocation }) => {
  const firstName = profile?.firstName || "there";
  const missingCv = !profile?.savedCvFileId;
  const best = matchingJobs(jobs, profile).slice(0, 10);
  const latest = sortLatest(jobs).slice(0, 10);
  const isSaved = id => savedJobIds?.has(String(id));
  const savedCount = savedJobIds?.size || 0;

  // Works even if the parent forgot to pass onOpenJob / onSeeAllJobs:
  // we leave a note for the Jobs page and just switch to the "jobs" page.
  const goJobs = (sort, job) => {
    try { sessionStorage.setItem("jobsIntent", JSON.stringify({ sort, jobId: job ? job.id : null })); } catch {}
    if (job && onOpenJob) return onOpenJob(job);
    if (!job && onSeeAllJobs) return onSeeAllJobs(sort);
    onNav && onNav("jobs");
  };
  const openJob = (job) => goJobs("Latest", job);
  const seeAll = (sort) => goJobs(sort, null);

  return (
    <div className="fz">
      <style>{fuzuCss}</style>
      <div className="fz-wrap">
        {/* Welcome banner (original) */}
        <div className="fz-banner" style={{
          background: "linear-gradient(135deg, #1054b8 0%, #1a6edb 40%, #4f46e5 100%)",
          borderRadius: 18, padding: "26px 32px", display: "flex", alignItems: "center",
          justifyContent: "space-between", color: "#fff", overflow: "hidden", position: "relative",
        }}>
          <div style={{ position: "absolute", right: -50, top: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", right: 100, bottom: -80, width: 170, height: 170, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ position: "absolute", left: "35%", top: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7, marginBottom: 6 }}>Welcome back</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 25, fontWeight: 600, lineHeight: 1.2 }}>Hello, {firstName}!</div>
            <div style={{ fontSize: 13.5, opacity: 0.82, marginTop: 7, maxWidth: 440, lineHeight: 1.55 }}>
              {missingCv
                ? "Upload your CV to start applying to jobs with one click."
                : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} available — apply instantly using your saved profile & CV.`}
            </div>
          </div>
          <button onClick={onApplyForm} style={{
            flexShrink: 0, padding: "12px 26px", borderRadius: 13, background: ORANGE, color: "#fff", border: "none",
            fontSize: 13.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 18px rgba(242,103,34,0.45)",
            display: "flex", alignItems: "center", gap: 7, position: "relative", zIndex: 1,
          }}>
            {Ico.lightning} Apply using form
          </button>
        </div>

        {/* Quick links (original cards with icons) */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>Quick Links</div>
          <div className="fz-quick">
            <QuickLink icon={Ico.profile} label="My Profile" desc="View & edit details" color={BLUE} bg="#e8f1fd" onClick={() => onNav("profile")} />
            <QuickLink icon={Ico.cv} label="Uploaded CV" desc="Manage your CV file" color="#7c3aed" bg="#ede9fe" onClick={() => onNav("cv")} />
            <QuickLink icon={Ico.apps} label="Applications" desc="Track your submissions" color="#0d9488" bg="#ccfbf1" onClick={() => onNav("applications")} />
            <QuickLink icon={Ico.saved} label="Saved Jobs" desc="Jobs you bookmarked" color="#d97706" bg="#fef3c7" onClick={() => onNav("saved")} badge={savedCount || undefined} />
            <QuickLink icon={Ico.msg} label="Messages" desc="Recruiter conversations" color="#6366f1" bg="#eef2ff" onClick={() => onNav("messages")} />
          </div>
        </div>

        {best.length > 0 && (
          <Section title="Best matching jobs for you" onSeeAll={() => seeAll("Recommended")}>
            {best.map((j, i) => <JobCard key={j.id} job={j} tag={i === 0 ? "Best match" : null} saved={isSaved(j.id)} onSave={onToggleSave} onOpen={openJob} location={getLocation ? getLocation(j) : locationOf(j)} />)}
          </Section>
        )}
        <Section title="Latest jobs for you" onSeeAll={() => seeAll("Latest")}>
          {latest.map(j => <JobCard key={j.id} job={j} saved={isSaved(j.id)} onSave={onToggleSave} onOpen={openJob} location={getLocation ? getLocation(j) : locationOf(j)} />)}
        </Section>
      </div>
    </div>
  );
};

export default DashboardHome;