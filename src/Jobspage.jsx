import { useState, useEffect } from "react";
import { fuzuCss, Heart } from "./DashboardHome";
import { sortByMatch, sortLatest, jobTime, locationOf } from "./jobUtils";

const ORANGE = "#f26722", GREEN = "#059669", AMBER = "#d97706", RED = "#dc2626";
const BLUE = "#1a6edb", INK = "#1a1a2e", MUTED = "#6b6b82", LINE = "#e3e6ee";
const strip = (h) => (h || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const field = { padding: "12px 14px", border: `1px solid ${LINE}`, borderRadius: 8, fontSize: 14, background: "#fff", fontFamily: "inherit", color: INK };

// Try the usual field names for a closing date
const deadlineOf = (j) => j.closingDate || j.deadline || j.closeDate || j.expiryDate || j.applicationDeadline || j.endDate || null;
const daysLeft = (d) => { const t = new Date(d).getTime(); return Number.isNaN(t) ? null : Math.ceil((t - Date.now()) / 86400000); };
const fmtDate = (t) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const PinIcon = () => (
  <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
);
const peekIntent = () => { try { return JSON.parse(sessionStorage.getItem("jobsIntent") || "null"); } catch { return null; } };

/** Job card — logo + company, title, location, days left / posted date */
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg>
);
const copyJobLink = async (job) => {
  try { await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?job=${job.id}`); return true; } catch { return false; }
};

const JobCard = ({ job, location, selected, onOpen }) => {
  const [copied, setCopied] = useState(false);
  const dl = deadlineOf(job);
  const left = dl ? daysLeft(dl) : null;
  const posted = jobTime(job);
  let leftText = null, leftColor = MUTED, clockColor = GREEN;   // green = still open
  if (left !== null) {
    if (left < 0) { leftText = "Closed"; leftColor = "#b91c1c"; clockColor = RED; }
    else if (left === 0) { leftText = "Closing today"; leftColor = "#b91c1c"; clockColor = AMBER; }
    else leftText = `${left} day${left === 1 ? "" : "s"} left to apply`;
  }
  return (
    <div onClick={() => onOpen(job)} style={{
      background: "#fff", borderRadius: 12, padding: 18, cursor: "pointer", display: "flex", flexDirection: "column", gap: 12,
      border: `${selected ? 2 : 1}px solid ${selected ? BLUE : LINE}`, transition: "box-shadow .18s, border-color .18s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,.08)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 500 }}>
        <span style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#e8f1fd,#dbeafe)", color: BLUE, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 }}>AM</span>
        AMSOL
      </div>
      <div style={{ fontSize: 17, fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 3, lineHeight: 1.35 }}>{job.title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: MUTED, fontSize: 14 }}>
        <span style={{ color: ORANGE, display: "flex" }}><PinIcon /></span> {location || "Location not specified"}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, fontSize: 13.5, color: MUTED, marginTop: "auto", flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, color: leftColor }}>
          <span style={{ color: clockColor, display: "flex" }}><ClockIcon /></span> {leftText || "Open for applications"}
        </span>
        {posted > 0 && <span>Posted: {fmtDate(posted)}</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
        <button onClick={(e) => { e.stopPropagation(); onOpen(job); }}
          style={{ flex: 1, height: 38, borderRadius: 8, border: `1.5px solid ${BLUE}`, background: "#fff", color: BLUE, fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = BLUE; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = BLUE; }}>
          View details
        </button>
        <button title={copied ? "Link copied" : "Share"} aria-label="Share job"
          onClick={async (e) => { e.stopPropagation(); if (await copyJobLink(job)) { setCopied(true); setTimeout(() => setCopied(false), 1600); } }}
          style={{ width: 38, height: 38, borderRadius: 8, border: `1px solid ${LINE}`, background: copied ? "#d1fae5" : "#fff", color: copied ? "#065f46" : INK, cursor: "pointer", display: "grid", placeItems: "center" }}>
          {copied ? "✓" : <ShareIcon />}
        </button>
      </div>
    </div>
  );
};

/** Slide-in panel with the full job */
const JobPanel = ({ job, location, saved, isApplied, isApplying, onClose, onApply, onSave, renderDescription }) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const share = async () => {
    try { await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?job=${job.id}`); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };
  const btn = { height: 44, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,21,35,.35)", zIndex: 59 }} />
      <aside style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 60, width: "min(560px, 100vw)", background: "#fff",
        boxShadow: "-8px 0 40px rgba(0,0,0,.15)", display: "flex", flexDirection: "column", animation: "fzSlide .25s cubic-bezier(.22,1,.36,1)",
      }}>
        <style>{`@keyframes fzSlide{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${LINE}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#e8f1fd,#dbeafe)", color: BLUE, display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700 }}>AM</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#9090a8", letterSpacing: ".08em", textTransform: "uppercase" }}>Job opening</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#5a5a72" }}>AMSOL Careers</div>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${LINE}`, background: "#f4f6fb", cursor: "pointer", fontSize: 16, color: "#5a5a72" }}>✕</button>
          </div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 21, fontWeight: 600, lineHeight: 1.25, margin: "14px 0 10px" }}>{job.title}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {location && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, background: "#f4f6fb", border: `1px solid ${LINE}`, borderRadius: 99, padding: "4px 10px", color: "#5a5a72" }}><span style={{ color: ORANGE, display: "flex" }}><PinIcon /></span> {location}</span>}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, background: "#d1fae5", borderRadius: 99, padding: "4px 10px", color: "#065f46", fontWeight: 600 }}>● Open</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {renderDescription ? renderDescription(job) : <p style={{ fontSize: 14, lineHeight: 1.7 }}>{strip(job.description)}</p>}
        </div>

        <div style={{ padding: "16px 24px", borderTop: `1px solid ${LINE}`, background: "#fafbfd", display: "flex", gap: 10 }}>
          <button onClick={() => !isApplied && onApply(job)} disabled={isApplied || isApplying}
            style={{ ...btn, flex: 1, border: isApplied ? "1.5px solid #6ee7b7" : "none", background: isApplied ? "#d1fae5" : BLUE, color: isApplied ? "#065f46" : "#fff", cursor: isApplied ? "default" : "pointer", boxShadow: isApplied ? "none" : "0 4px 14px rgba(26,110,219,.3)" }}>
            {isApplied ? "Applied ✓" : isApplying ? "Applying…" : "Apply"}
          </button>
          <button onClick={() => onSave(job)} style={{ ...btn, padding: "0 18px", border: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", gap: 8, color: INK }}>
            <Heart filled={saved} /> {saved ? "Saved" : "Save"}
          </button>
          <button onClick={share} style={{ ...btn, padding: "0 18px", border: `1px solid ${LINE}`, background: "#fff", color: INK }}>
            {copied ? "Link copied" : "Share"}
          </button>
        </div>
      </aside>
    </>
  );
};

/**
 * Jobs page: search + filters, grid of job cards, slide-in panel for details.
 * Props: jobs, loading, profile, savedJobIds, onToggleSave, onApply, appliedIds, applyingId,
 *        initialSort, initialJobId, renderDescription(job), getLocation(job)
 */
const JobsPage = ({ profile, initialSort = "Latest", jobs = [], loading, savedJobIds, onToggleSave, onApply,
  appliedIds = new Set(), applyingId, initialJobId, renderDescription, getLocation = locationOf }) => {
  const [intent] = useState(peekIntent);
  useEffect(() => { try { sessionStorage.removeItem("jobsIntent"); } catch {} }, []);

  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [applied, setApplied] = useState({ q: "", loc: "" });
  const [locFilter, setLocFilter] = useState("All");
  const [sort, setSort] = useState(intent?.sort || initialSort);
  const [openId, setOpenId] = useState(initialJobId ? String(initialJobId) : intent?.jobId ? String(intent.jobId) : null);
  useEffect(() => { if (initialJobId) setOpenId(String(initialJobId)); }, [initialJobId]);

  const locations = [...new Set(jobs.map(getLocation).filter(Boolean))];

  let list = jobs.filter((j) => {
    const hay = `${j.title} ${strip(j.description)}`.toLowerCase();
    const jl = (getLocation(j) || "").toLowerCase();
    return (!applied.q || hay.includes(applied.q.toLowerCase())) &&
      (!applied.loc || jl.includes(applied.loc.toLowerCase())) &&
      (locFilter === "All" || getLocation(j) === locFilter);
  });
  if (sort === "Recommended") list = sortByMatch(list, profile);
  else if (sort === "Latest") list = sortLatest(list);
  else if (sort === "A–Z") list = [...list].sort((a, b) => a.title.localeCompare(b.title));

  const openJob = openId ? jobs.find((j) => String(j.id) === openId) : null;

  return (
    <div className="fz">
      <style>{fuzuCss}</style>

      <div style={{ background: "#fff", padding: "16px 24px", borderBottom: `1px solid ${LINE}` }}>
        <form onSubmit={(e) => { e.preventDefault(); setApplied({ q, loc }); }} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input style={{ ...field, flex: "1 1 240px" }} placeholder="Job title or keyword" value={q} onChange={(e) => setQ(e.target.value)} />
          <input style={{ ...field, flex: "1 1 240px" }} placeholder="Country, state, city or town" value={loc} onChange={(e) => setLoc(e.target.value)} />
          <select style={{ ...field, flex: "0 1 220px" }} value={locFilter} onChange={(e) => setLocFilter(e.target.value)}>
            <option value="All">Location: all</option>
            {locations.map((l) => <option key={l}>{l}</option>)}
          </select>
          <button type="submit" style={{ padding: "0 36px", height: 44, background: BLUE, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Show jobs</button>
        </form>
      </div>

      <div className="fz-wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 600, margin: 0 }}>Find jobs</h1>
            <div style={{ fontSize: 13.5, marginTop: 6, color: MUTED }}>{loading ? "Loading…" : `${list.length} job${list.length !== 1 ? "s" : ""} found`}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5 }}>
            Sorted by:
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ ...field, padding: "8px 10px", width: 170, fontWeight: 600 }}>
              <option>Latest</option><option>Recommended</option><option>A–Z</option>
            </select>
          </div>
        </div>

        {list.length === 0 && !loading ? (
          <div style={{ padding: 40, textAlign: "center", color: MUTED }}>
            No jobs match these filters.{" "}
            <button onClick={() => { setQ(""); setLoc(""); setApplied({ q: "", loc: "" }); setLocFilter("All"); }} style={{ color: BLUE, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Clear filters</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16, marginTop: 20 }}>
            {list.map((j) => (
              <JobCard key={j.id} job={j} location={getLocation(j)} selected={openId === String(j.id)} onOpen={(job) => setOpenId(String(job.id))} />
            ))}
          </div>
        )}
      </div>

      {openJob && (
        <JobPanel
          job={openJob}
          location={getLocation(openJob)}
          saved={savedJobIds?.has(String(openJob.id))}
          isApplied={appliedIds.has(String(openJob.id))}
          isApplying={applyingId === openJob.id}
          onClose={() => setOpenId(null)}
          onApply={onApply}
          onSave={onToggleSave}
          renderDescription={renderDescription}
        />
      )}
    </div>
  );
};

export default JobsPage;