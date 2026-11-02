export const pad2 = (n) => String(n ?? 0).padStart(2, "0");

export const fmtDate = (d) => {
  const t = new Date(d);
  return Number.isNaN(t.getTime()) ? "—" : t.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export const fmtTime = (d) => {
  const t = new Date(d);
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

export const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();

export const initials = (n = "") =>
  n.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

// Accepts snake_case or camelCase job rows from the API
export const normJob = (j) => {
  const c = j.counts || j.stats || {};
  return {
    id: j.id || j._id,
    title: j.title,
    place: j.place || j.location || "Location not specified",
    created: j.created_at || j.createdAt,
    expires: j.closing_date || j.closingDate,
    status: j.status || "open",
    applicants: c.applicants ?? j.applicants_count ?? 0,
    fresh: c.new ?? j.new_count ?? 0,
    reviewed: c.reviewed ?? j.reviewed_count ?? 0,
    rejected: c.rejected ?? j.rejected_count ?? 0,
    hired: c.hired ?? j.hired_count ?? 0,
  };
};