import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiBookmark, FiMapPin, FiClock, FiGlobe, FiX } from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "./Navbar"; // adjust path/name if yours differs
import Footer from "./Footer"; // adjust path/name if yours differs

const FIELDS = ["All", "Nursing", "Healthcare admin", "Recruitment", "Support", "Other"];
const REGIONS = ["Anywhere", "Africa", "Kenya"];
const TYPES = ["Full-time", "Part-time", "Contract"];

// Sample data. Replace with an API call (e.g. GET /api/jobs?remote=true) when your backend is ready.
const JOBS = [
  {
    id: 1,
    title: "Telehealth Nurse",
    company: "CareBridge Health",
    field: "Nursing",
    region: "Africa",
    type: "Full-time",
    salary: "KES 120,000 to 160,000 / month",
    posted: "2 days ago",
    summary: "Provide virtual triage and follow-up care to patients. Active nursing licence required.",
  },
  {
    id: 2,
    title: "Medical Records Coordinator",
    company: "Nairobi Women's Clinic",
    field: "Healthcare admin",
    region: "Kenya",
    type: "Full-time",
    salary: "KES 70,000 to 90,000 / month",
    posted: "3 days ago",
    summary: "Keep digital patient records accurate and up to date. Experience with health information systems preferred.",
  },
  {
    id: 3,
    title: "Healthcare Recruiter",
    company: "Amsol Partners",
    field: "Recruitment",
    region: "Anywhere",
    type: "Contract",
    salary: "USD 1,200 to 1,800 / month",
    posted: "5 days ago",
    summary: "Source and screen nurses and allied health staff for hiring teams across East Africa.",
  },
  {
    id: 4,
    title: "Patient Support Specialist",
    company: "MediLink",
    field: "Support",
    type: "Part-time",
    region: "Africa",
    salary: "KES 45,000 to 60,000 / month",
    posted: "1 week ago",
    summary: "Answer patient questions by chat and email and help them book appointments.",
  },
  {
    id: 5,
    title: "Clinical Documentation Reviewer",
    company: "Savanna Health Group",
    field: "Healthcare admin",
    region: "Anywhere",
    type: "Contract",
    salary: "USD 1,500 to 2,200 / month",
    posted: "1 week ago",
    summary: "Review clinical notes for accuracy and completeness. A clinical background is an advantage.",
  },
  {
    id: 6,
    title: "Health Content Writer",
    company: "WellPath Africa",
    field: "Other",
    region: "Africa",
    type: "Part-time",
    salary: "KES 50,000 to 75,000 / month",
    posted: "2 weeks ago",
    summary: "Write clear, accurate articles that help patients understand common conditions and treatments.",
  },
];

const chip = (active) =>
  `rounded-full border px-4 py-2 text-sm font-medium transition ${
    active
      ? "border-[#0E2A4D] bg-[#0E2A4D] text-white"
      : "border-[#E4E9EF] bg-white text-slate-600 hover:bg-[#F6F8FB]"
  }`;

export default function RemoteJobs() {
  const [query, setQuery] = useState("");
  const [field, setField] = useState("All");
  const [region, setRegion] = useState("Anywhere");
  const [types, setTypes] = useState([]);
  const [saved, setSaved] = useState([]);

  const toggleType = (t) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const toggleSave = (job) => {
    const isSaved = saved.includes(job.id);
    setSaved(isSaved ? saved.filter((id) => id !== job.id) : [...saved, job.id]);
    toast(isSaved ? "Removed from saved jobs" : "Saved to your jobs");
  };

  const clearAll = () => {
    setQuery("");
    setField("All");
    setRegion("Anywhere");
    setTypes([]);
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return JOBS.filter(
      (j) =>
        (field === "All" || j.field === field) &&
        // "Anywhere" jobs are open to everyone, so they match every region
        (region === "Anywhere" || j.region === region || j.region === "Anywhere") &&
        (types.length === 0 || types.includes(j.type)) &&
        (!q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q))
    );
  }, [query, field, region, types]);

  const filtersActive = query || field !== "All" || region !== "Anywhere" || types.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Toaster />
      <Navbar />

      {/* Header band */}
      <header
        className="px-5 pb-12 pt-28"
        style={{
          background: "linear-gradient(135deg, #E8F2FF 0%, #DCEBFF 100%)",
          borderRadius: "0 0 48px 48px",
        }}
      >
        <div className="mx-auto max-w-[1200px]">
          <h1 className="text-3xl font-bold text-[#0E2A4D] md:text-4xl">Remote jobs</h1>
          <p className="mt-2 max-w-xl text-[#0E2A4D]/75">
            Work from home in healthcare and beyond. Every role here can be done remotely.
          </p>

          <div className="mt-6 flex max-w-2xl items-center gap-3 rounded-full border border-[#E4E9EF] bg-white px-5 py-3 shadow-sm">
            <FiSearch className="text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by job title or company"
              aria-label="Search remote jobs"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-10">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Filters */}
          <aside className="h-fit space-y-7 lg:sticky lg:top-24">
            <div>
              <h2 className="mb-3 text-sm font-semibold text-[#0E2A4D]">Who can apply from</h2>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((r) => (
                  <button key={r} onClick={() => setRegion(r)} className={chip(region === r)}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold text-[#0E2A4D]">Field</h2>
              <div className="flex flex-wrap gap-2">
                {FIELDS.map((f) => (
                  <button key={f} onClick={() => setField(f)} className={chip(field === f)}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold text-[#0E2A4D]">Job type</h2>
              <div className="space-y-2">
                {TYPES.map((t) => (
                  <label key={t} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={types.includes(t)}
                      onChange={() => toggleType(t)}
                      className="h-4 w-4 rounded border-[#DDD6C7] accent-[#0E2A4D]"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            {filtersActive && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 text-sm font-medium text-[#0E2A4D] underline-offset-2 hover:underline"
              >
                <FiX /> Clear all filters
              </button>
            )}
          </aside>

          {/* Results */}
          <section>
            <p className="mb-4 text-sm text-slate-500" aria-live="polite">
              {visible.length} remote {visible.length === 1 ? "job" : "jobs"}
            </p>

            {visible.length === 0 ? (
              <div className="rounded-3xl border border-[#EEF1F5] px-6 py-14 text-center">
                <p className="text-slate-600">No remote jobs match these filters.</p>
                <button
                  onClick={clearAll}
                  className="mt-4 rounded-full bg-[#0E2A4D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0A2140]"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-[#EEF1F5] rounded-3xl border border-[#EEF1F5]">
                {visible.map((job) => {
                  const isSaved = saved.includes(job.id);
                  return (
                    <li key={job.id} className="flex gap-4 px-5 py-6 md:px-7">
                      <span
                        aria-hidden="true"
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0E2A4D] text-lg font-bold text-[#F2A93B]"
                      >
                        {job.company[0]}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold leading-snug text-[#0E2A4D]">{job.title}</h3>
                            <p className="text-sm text-slate-500">{job.company}</p>
                          </div>
                          <button
                            onClick={() => toggleSave(job)}
                            aria-pressed={isSaved}
                            aria-label={isSaved ? `Unsave ${job.title}` : `Save ${job.title}`}
                            className={`rounded-full p-2 transition hover:bg-[#F6F8FB] ${
                              isSaved ? "text-[#F2A93B]" : "text-slate-400"
                            }`}
                          >
                            <FiBookmark className={isSaved ? "fill-current" : ""} />
                          </button>
                        </div>

                        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600">{job.summary}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <FiGlobe /> Remote, {job.region === "Anywhere" ? "worldwide" : job.region}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FiMapPin /> {job.type}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FiClock /> {job.posted}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-[#0E2A4D]">{job.salary}</p>
                          {/* Point this at your real job details route, e.g. /jobs/${job.id} */}
                          <Link
                            to={`/jobs/${job.id}`}
                            className="rounded-full bg-[#F2A93B] px-5 py-2 text-sm font-semibold text-[#16233A] transition hover:bg-[#E39C2E]"
                          >
                            View job
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}