// Shared helpers: match jobs to an applicant, and sort by newest.

const STOP = new Set(["and","the","for","with","from","that","this","are","you","our","will","have","has","job","role","work","working","experience","years","year","ability","skills","strong","team","manager","officer","senior","junior","assistant"]);
const tokens = (s) =>
  String(s || "").toLowerCase().split(/[^a-z0-9+#]+/).filter((w) => w.length > 2 && !STOP.has(w));
const plain = (html) => String(html || "").replace(/<[^>]*>/g, " ").toLowerCase();

/** Words from the applicant's profile, each with a weight (bigger = matters more). */
export const profileKeywords = (profile = {}) => {
  const map = new Map();
  const add = (text, weight) => tokens(text).forEach((w) => map.set(w, Math.max(map.get(w) || 0, weight)));

  const spec = Array.isArray(profile.specialization) ? profile.specialization.join(" ") : profile.specialization;
  add(spec, 4);                                                              // what they want to do
  (profile.workExperience || []).forEach((w) => add(w.position, 3));        // jobs they've done
  (profile.academicLevel || []).forEach((e) => add(e.courseName, 3));       // what they studied
  (profile.professionalQualifications || []).forEach((q) => add(q.name, 2)); // certificates
  (profile.professionalMemberships || []).forEach((m) => add(m.organization, 1));
  return map;
};

/** Higher number = better fit for this applicant. */
export const scoreJob = (job, profile) => {
  const kws = profileKeywords(profile);
  if (kws.size === 0) return 0;
  const title = new Set(tokens(job.title));
  const body = plain(job.description);
  let score = 0;
  kws.forEach((weight, word) => {
    if (title.has(word)) score += weight * 3;       // word is in the job title = strong match
    else if (body.includes(word)) score += weight;  // word is somewhere in the description
  });
  return score;
};

/** Newest first. Uses a date field if your job has one, otherwise the biggest id. */
export const jobTime = (j) => {
  const d = j.createdAt || j.postedAt || j.postedDate || j.datePosted || j.publishedAt || j.publishDate || j.datePublished || j.dateCreated || j.created_at || j.date || j.updatedAt;
  const t = d ? new Date(d).getTime() : NaN;
  return Number.isNaN(t) ? 0 : t;
};
export const sortLatest = (jobs) =>
  [...jobs].sort((a, b) => jobTime(b) - jobTime(a) || (Number(b.id) || 0) - (Number(a.id) || 0));

/** Jobs that fit the profile first (best on top). Jobs with no match come after, newest first. */
export const sortByMatch = (jobs, profile) =>
  sortLatest(jobs)
    .map((j) => ({ j, s: scoreJob(j, profile) }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.j);

/** Only the jobs that actually match something in the profile. */
export const matchingJobs = (jobs, profile) =>
  sortByMatch(jobs, profile).filter((j) => scoreJob(j, profile) > 0);


// ─── Location: use job.location, otherwise read it out of the description ────
const decode = (str) => {
  if (typeof document === "undefined") return str;
  const t = document.createElement("textarea");
  t.innerHTML = str;
  return t.value;
};
const STOP_LABELS = "Employment Type|Contract Type|Job Type|Industry|Department|Reporting To|Reports To|Work Arrangement|Salary|Deadline|Job Title|Closing Date|Experience|Education";

export const locationOf = (job) => {
  if (job?.location && String(job.location).trim()) return String(job.location).trim();
  const html = String(job?.description || "");
  if (!html) return null;
  const text = decode(
    html.replace(/<\s*br\s*\/?>/gi, "\n").replace(/<\/\s*(p|div|li|h[1-6]|tr)\s*>/gi, "\n").replace(/<[^>]+>/g, " ")
  ).replace(/[ \t]+/g, " ");

  const stop = `(?=\\s*(?:${STOP_LABELS})\\b|\\n|\\p{Extended_Pictographic}|$)`;
  const tries = [
    new RegExp(`Location\\s*:\\s*(.+?)${stop}`, "iu"),      
    new RegExp(`\\bLocation\\s*([A-Z][^\\n]+?)${stop}`, "u"),  
  ];
  for (const re of tries) {
    const m = text.match(re);
    if (m) {
      const v = m[1].trim().replace(/[,;:\s]+$/, "");
      if (v.length > 1 && v.length < 70) return v;
    }
  }
  return null;
};