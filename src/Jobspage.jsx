import { useState, useEffect } from "react";
import { fuzuCss } from "./DashboardHome";
import { sortByMatch, sortLatest, jobTime, locationOf } from "./jobUtils";

const GREEN = "#059669", AMBER = "#d97706", RED = "#dc2626";
const BLUE = "#1a6edb", INK = "#14213d", MUTED = "#64708a", LINE = "#e3e8f2";
const strip = (h) => (h || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

/* ───────── data helpers ───────── */
const deadlineOf = (j) =>
  j.closing_date || j.closingDate || j.deadline || j.closeDate || j.expiryDate || j.applicationDeadline || j.endDate || null;
const postedOf = (j) => {
  const t = jobTime(j);
  if (t > 0) return t;
  const p = Date.parse(j.created_at || j.createdAt || "");
  return Number.isNaN(p) ? 0 : p;
};
const daysLeft = (d) => { const t = new Date(d).getTime(); return Number.isNaN(t) ? null : Math.ceil((t - Date.now()) / 86400000); };
const fmtDate = (t) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// `place` is the location field in the API
const placeOf = (j, fallback) => (j.place && String(j.place).trim()) || (fallback ? fallback(j) : "") || "";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const typeLabel = (j) => cap(String(j.employment_type || j.employmentType || "").replace(/_/g, "-").toLowerCase());

const workMode = (j) => {
  const t = strip(`${j.title || ""} ${j.description || ""}`);
  const m = t.match(/work arrangement:?\s*(on-?site|remote|hybrid)/i) || t.match(/\b(on-?site|remote|hybrid)\b/i);
  if (!m) return null;
  const v = m[1].toLowerCase();
  return v === "remote" ? "Remote" : v === "hybrid" ? "Hybrid" : "On-site";
};

const experienceOf = (j) => {
  const t = strip(j.requirements || j.description);
  const r = t.match(/(\d+)\s*(?:-|–|to)\s*(\d+)\+?\s*years?/i);
  if (r) return `${r[1]}-${r[2]} years exp.`;
  const s = t.match(/(\d+)\+?\s*years?/i);
  return s ? `${s[1]}+ years exp.` : null;
};

const summaryOf = (j) => {
  const paras = String(j.description || "").match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
  for (const p of paras) {
    const t = strip(p);
    if (t.length > 60 && !/^(📍|💼|🏢|✓)/.test(t) && !/location:/i.test(t)) return t;
  }
  return strip(j.description);
};

const salaryOf = (j) => {
  const s = j.salary_range || j.salaryRange || j.salary;
  return s && String(s).trim() ? String(s).trim() : "Not disclosed";
};

const peekIntent = () => { try { return JSON.parse(sessionStorage.getItem("jobsIntent") || "null"); } catch { return null; } };
const copyJobLink = async (job) => {
  try { await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?job=${job.id}`); return true; } catch { return false; }
};

/* ───────── icons ───────── */
const Svg = ({ children, size = 15, fill = "none", sw = 2 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const PinIcon = ({ size = 15 }) => <Svg size={size}><path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></Svg>;
const CalIcon = () => <Svg size={14}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></Svg>;
const SearchIcon = () => <Svg size={18}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></Svg>;
const ShareIcon = () => <Svg size={16}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></Svg>;
const BookmarkIcon = ({ filled }) => <Svg size={17} fill={filled ? "currentColor" : "none"}><path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" /></Svg>;
const Verified = () => (
  <svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="11" fill={BLUE} /><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const Tag = ({ children }) => (
  <span style={{ fontSize: 12, fontWeight: 500, color: "#4a5873", background: "#eef2f9", borderRadius: 6, padding: "4px 10px", whiteSpace: "nowrap" }}>{children}</span>
);

const Logo = ({ size = 34 }) => (
  <span style={{ width: size, height: size, borderRadius: 9, background: BLUE, color: "#fff", display: "grid", placeItems: "center", fontSize: size * 0.45, fontWeight: 700, flexShrink: 0 }}>A</span>
);

/* ───────── job card ───────── */
const JobCard = ({ job, location, selected, saved, isApplied, isApplying, onOpen, onApply, onSave }) => {
  const [copied, setCopied] = useState(false);
  const dl = deadlineOf(job);
  const left = dl ? daysLeft(dl) : null;
  const closed = left !== null && left < 0;
  const posted = postedOf(job);
  const mode = workMode(job);
  const exp = experienceOf(job);
  const type = typeLabel(job);
  const summary = summaryOf(job);

  const badge = closed
    ? { t: "Closed", bg: "#fee2e2", c: "#b91c1c", dot: RED }
    : left === 0
      ? { t: "Closing today", bg: "#fef3c7", c: "#92400e", dot: AMBER }
      : { t: "Open", bg: "#f5870b", c: "#f5f2ee", dot:LINE };

  return (
    <div
      onClick={() => onOpen(job)}
      style={{
        background: "#fff", borderRadius: 14, padding: 16, cursor: "pointer", display: "flex", flexDirection: "column", gap: 9,
        border: `${selected ? 2 : 1}px solid ${selected ? BLUE : LINE}`, transition: "box-shadow .2s, border-color .2s, transform .2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 10px 28px -12px rgba(26,110,219,.28)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
    >
      {/* employer row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Logo />
        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.25 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: INK }}>AMSOL <Verified /></div>
          <div style={{ fontSize: 11.5, color: MUTED }}>Verified employer</div>
        </div>
        <button
          aria-label={saved ? "Remove from saved" : "Save job"}
          onClick={(e) => { e.stopPropagation(); onSave?.(job); }}
          style={{ border: "none", background: "none", cursor: "pointer", color: saved ? BLUE : "#8a96ad", padding: 4, display: "grid", placeItems: "center" }}
        >
          <BookmarkIcon filled={saved} />
        </button>
      </div>

      {/* title + status */}
      <div style={{ fontSize: 16, fontWeight: 700, color: INK, lineHeight: 1.3 }}>{job.title}</div>
      <div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 600, background: badge.bg, color: badge.c, borderRadius: 99, padding: "3px 10px" }}>
          <i style={{ width: 6, height: 6, borderRadius: "50%", background: badge.dot, display: "block" }} /> {badge.t}
        </span>
      </div>

      {/* meta */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, color: MUTED }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <PinIcon size={14} /> <span>{location || "Location not specified"}</span>
        </div>
        {(posted > 0 || dl) && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <CalIcon />
            {posted > 0 && <span>Posted {fmtDate(posted)}</span>}
            {posted > 0 && dl && <span>·</span>}
            {dl && <span style={{ color: closed ? "#b91c1c" : MUTED }}>Apply by {fmtDate(dl)}</span>}
          </div>
        )}
      </div>

      {/* tags */}
      {(type || mode || exp) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {type && <Tag>{type}</Tag>}
          {mode && <Tag>{mode}</Tag>}
          {exp && <Tag>{exp}</Tag>}
        </div>
      )}

      <div style={{ fontSize: 12.5, color: INK }}>
        <b style={{ fontWeight: 600 }}>Salary:</b> <span style={{ color: MUTED }}>{salaryOf(job)}</span>
      </div>

      {summary && (
        <p style={{
          margin: 0, fontSize: 12.5, lineHeight: 1.5, color: MUTED,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{summary}</p>
      )}

      {/* actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", paddingTop: 4 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(job); }}
          style={{ flex: 1, height: 36, borderRadius: 8, border: `1.5px solid ${BLUE}`, background: "#fff", color: BLUE, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "background .2s, color .2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#eef4fe"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
        >
          View details
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); if (!isApplied && !closed) onApply?.(job); }}
          disabled={isApplied || isApplying || closed}
          style={{
            flex: 1, height: 36, borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13, fontFamily: "inherit",
            background: isApplied ? "#d1fae5" : closed ? "#e5e9f2" : BLUE,
            color: isApplied ? "#065f46" : closed ? "#8a96ad" : "#fff",
            cursor: isApplied || closed ? "default" : "pointer",
            boxShadow: isApplied || closed ? "none" : "0 6px 14px -6px rgba(26,110,219,.6)",
          }}
        >
          {isApplied ? "Applied ✓" : isApplying ? "Applying…" : closed ? "Closed" : "Apply now"}
        </button>
        <button
          title={copied ? "Link copied" : "Share"}
          aria-label="Share job"
          onClick={async (e) => { e.stopPropagation(); if (await copyJobLink(job)) { setCopied(true); setTimeout(() => setCopied(false), 1600); } }}
          style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${LINE}`, background: copied ? "#d1fae5" : "#fff", color: copied ? "#065f46" : INK, cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}
        >
          {copied ? "✓" : <ShareIcon />}
        </button>
      </div>
    </div>
  );
};

/* ───────── slide-in panel ───────── */
const JobPanel = ({ job, location, saved, isApplied, isApplying, onClose, onApply, onSave, renderDescription }) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const share = async () => {
    if (await copyJobLink(job)) { setCopied(true); setTimeout(() => setCopied(false), 1800); }
  };
  const btn = { height: 44, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" };
  const dl = deadlineOf(job);
  const left = dl ? daysLeft(dl) : null;
  const closed = left !== null && left < 0;
  const type = typeLabel(job);
  const mode = workMode(job);
  const exp = experienceOf(job);

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
              <Logo size={40} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13.5, fontWeight: 700, color: INK }}>AMSOL <Verified /></div>
                <div style={{ fontSize: 12, color: MUTED }}>Verified employer</div>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${LINE}`, background: "#f4f6fb", cursor: "pointer", fontSize: 16, color: "#5a5a72" }}>✕</button>
          </div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 21, fontWeight: 600, lineHeight: 1.25, margin: "14px 0 10px" }}>{job.title}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            {location && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, background: "#f4f6fb", border: `1px solid ${LINE}`, borderRadius: 99, padding: "4px 10px", color: "#5a5a72" }}>
                <PinIcon size={13} /> {location}
              </span>
            )}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, background: closed ? "#fee2e2" : "#d1fae5", borderRadius: 99, padding: "4px 10px", color: closed ? "#b91c1c" : "#065f46", fontWeight: 600 }}>
              ● {closed ? "Closed" : "Open"}
            </span>
            {type && <Tag>{type}</Tag>}
            {mode && <Tag>{mode}</Tag>}
            {exp && <Tag>{exp}</Tag>}
          </div>
          <div style={{ marginTop: 10, fontSize: 12.5, color: MUTED }}>
            <b style={{ color: INK, fontWeight: 600 }}>Salary:</b> {salaryOf(job)}
            {dl && <> · <b style={{ color: INK, fontWeight: 600 }}>Apply by:</b> {fmtDate(dl)}</>}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {renderDescription ? renderDescription(job) : <p style={{ fontSize: 14, lineHeight: 1.7 }}>{strip(job.description)}</p>}
        </div>

        <div style={{ padding: "16px 24px", borderTop: `1px solid ${LINE}`, background: "#fafbfd", display: "flex", gap: 10 }}>
          <button
            onClick={() => !isApplied && !closed && onApply(job)}
            disabled={isApplied || isApplying || closed}
            style={{ ...btn, flex: 1, border: isApplied ? "1.5px solid #6ee7b7" : "none", background: isApplied ? "#d1fae5" : closed ? "#e5e9f2" : BLUE, color: isApplied ? "#065f46" : closed ? "#8a96ad" : "#fff", cursor: isApplied || closed ? "default" : "pointer", boxShadow: isApplied || closed ? "none" : "0 4px 14px rgba(26,110,219,.3)" }}
          >
            {isApplied ? "Applied ✓" : isApplying ? "Applying…" : closed ? "Closed" : "Apply"}
          </button>
          <button onClick={() => onSave(job)} style={{ ...btn, padding: "0 18px", border: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", gap: 8, color: saved ? BLUE : INK }}>
            <BookmarkIcon filled={saved} /> {saved ? "Saved" : "Save"}
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

  const where = (j) => placeOf(j, getLocation); // `place` first, then the old resolver

  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [applied, setApplied] = useState({ q: "", loc: "" });
  const [locFilter, setLocFilter] = useState("All");
  const [sort, setSort] = useState(intent?.sort || initialSort);
  const [openId, setOpenId] = useState(initialJobId ? String(initialJobId) : intent?.jobId ? String(intent.jobId) : null);
  useEffect(() => { if (initialJobId) setOpenId(String(initialJobId)); }, [initialJobId]);

  const locations = [...new Set(jobs.map(where).filter(Boolean))];

  let list = jobs.filter((j) => {
    const hay = `${j.title} ${strip(j.description)}`.toLowerCase();
    const jl = where(j).toLowerCase();
    return (!applied.q || hay.includes(applied.q.toLowerCase())) &&
      (!applied.loc || jl.includes(applied.loc.toLowerCase())) &&
      (locFilter === "All" || where(j) === locFilter);
  });
  if (sort === "Recommended") list = sortByMatch(list, profile);
  else if (sort === "Latest") list = sortLatest(list);
  else if (sort === "A–Z") list = [...list].sort((a, b) => a.title.localeCompare(b.title));

  const openJob = openId ? jobs.find((j) => String(j.id) === openId) : null;

  const bare = { border: "none", outline: "none", background: "transparent", fontSize: 14, fontFamily: "inherit", color: INK, width: "100%" };

  return (
    <div className="fz" style={{ background: "linear-gradient(180deg,#f3f7fd 0%,#f8fafd 100%)", minHeight: "100vh" }}>
      <style>{fuzuCss}</style>

      {/* search bar */}
      <div style={{ padding: "18px 24px 6px" }}>
        <form
          onSubmit={(e) => { e.preventDefault(); setApplied({ q, loc }); }}
          style={{ display: "flex", alignItems: "stretch", gap: 12, flexWrap: "wrap", maxWidth: 1400, margin: "0 auto" }}
        >
          <div style={{ flex: "2 1 460px", display: "flex", alignItems: "center", background: "#fff", border: `1px solid ${LINE}`, borderRadius: 12, boxShadow: "0 4px 14px -8px rgba(26,110,219,.2)" }}>
            <label style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "0 16px", height: 48, color: "#8a96ad" }}>
              <SearchIcon />
              <input style={bare} placeholder="Job title or keyword" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <span style={{ width: 1, height: 26, background: LINE }} />
            <label style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "0 16px", height: 48, color: "#8a96ad" }}>
              <PinIcon size={18} />
              <input style={bare} placeholder="Country, state, city or town" value={loc} onChange={(e) => setLoc(e.target.value)} />
            </label>
          </div>
          <select
            value={locFilter}
            onChange={(e) => setLocFilter(e.target.value)}
            style={{ flex: "0 1 220px", height: 48, padding: "0 14px", border: `1px solid ${LINE}`, borderRadius: 12, background: "#fff", fontSize: 14, color: INK, fontFamily: "inherit", boxShadow: "0 4px 14px -8px rgba(26,110,219,.2)" }}
          >
            <option value="All">All locations</option>
            {locations.map((l) => <option key={l}>{l}</option>)}
          </select>
          <button type="submit" style={{ flex: "0 0 auto", padding: "0 36px", height: 48, background: BLUE, color: "#fff", border: "none", borderRadius: 12, fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 18px -8px rgba(26,110,219,.6)" }}>
            Search jobs
          </button>
        </form>
      </div>

      <div className="fz-wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: INK }}>Find jobs</h1>
            <div style={{ fontSize: 13, marginTop: 4, color: MUTED }}>{loading ? "Loading…" : `${list.length} job${list.length !== 1 ? "s" : ""} found`}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: MUTED }}>
            Sort by:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ padding: "8px 12px", width: 170, border: `1px solid ${LINE}`, borderRadius: 10, background: "#fff", fontSize: 13.5, fontWeight: 600, color: INK, fontFamily: "inherit" }}
            >
              <option value="Latest">Most recent</option>
              <option value="Recommended">Recommended</option>
              <option value="A–Z">A–Z</option>
            </select>
          </div>
        </div>

        {list.length === 0 && !loading ? (
          <div style={{ padding: 40, textAlign: "center", color: MUTED }}>
            No jobs match these filters.{" "}
            <button onClick={() => { setQ(""); setLoc(""); setApplied({ q: "", loc: "" }); setLocFilter("All"); }} style={{ color: BLUE, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Clear filters</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14, marginTop: 16 }}>
            {list.map((j) => (
              <JobCard
                key={j.id}
                job={j}
                location={where(j)}
                selected={openId === String(j.id)}
                saved={savedJobIds?.has(String(j.id))}
                isApplied={appliedIds.has(String(j.id))}
                isApplying={applyingId === j.id}
                onOpen={(job) => setOpenId(String(job.id))}
                onApply={onApply}
                onSave={onToggleSave}
              />
            ))}
          </div>
        )}
      </div>

      {openJob && (
        <JobPanel
          job={openJob}
          location={where(openJob)}
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