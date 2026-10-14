import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiCheck } from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "./Navbar"; // adjust path/name if yours differs
import Footer from "./Footer"; // adjust path/name if yours differs

const TYPES = ["All", "Product", "Platform", "Community"];

const TYPE_STYLES = {
  Product: "bg-blue-50 text-blue-700",
  Platform: "bg-amber-50 text-amber-700",
  Community: "bg-green-50 text-green-700",
};

// Sample data. Replace with an API call (e.g. GET /api/announcements) when your backend is ready.
const ANNOUNCEMENTS = [
  {
    id: 1,
    pinned: true,
    type: "Product",
    date: "2026-10-08",
    title: "Sign in with Google is now live",
    summary:
      "You can now create an account or sign in with your Google account. Choose whether you are an employee or an employer the first time you sign in.",
  },
  {
    id: 2,
    type: "Platform",
    date: "2026-10-03",
    title: "Scheduled maintenance on Sunday, 18 October",
    summary:
      "Amsol Jobs will be unavailable for about 30 minutes from 02:00 EAT while we upgrade our servers. Your saved jobs and applications are not affected.",
  },
  {
    id: 3,
    type: "Product",
    date: "2026-09-24",
    title: "Employers can now message applicants directly",
    summary:
      "Employer accounts can start a conversation from an application. Applicants get a notification and can reply from their inbox.",
  },
  {
    id: 4,
    type: "Community",
    date: "2026-09-12",
    title: "Forum guidelines updated",
    summary:
      "We clarified what we expect in discussions: be respectful, never share personal contact details publicly, and report anything that looks like a scam.",
  },
  {
    id: 5,
    type: "Platform",
    date: "2026-08-29",
    title: "Faster document uploads for certificates",
    summary:
      "Uploading licences and certificates is now quicker, and PDF files up to 10 MB are supported.",
  },
];

const fmt = (iso, opts) => new Date(iso).toLocaleDateString("en-GB", opts);

export default function Announcements() {
  const [type, setType] = useState("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const pinned = ANNOUNCEMENTS.find((a) => a.pinned);

  // Group the remaining announcements by month, newest first.
  const groups = useMemo(() => {
    const rest = ANNOUNCEMENTS.filter((a) => !a.pinned && (type === "All" || a.type === type)).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const map = new Map();
    rest.forEach((a) => {
      const key = fmt(a.date, { month: "long", year: "numeric" });
      map.set(key, [...(map.get(key) || []), a]);
    });
    return [...map.entries()];
  }, [type]);

  const subscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Enter a valid email address.");
    // TODO: POST the email to your backend, e.g. /api/announcements/subscribe
    setSubscribed(true);
    toast.success("You're subscribed");
  };

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
          <nav className="mb-4 text-sm text-[#0E2A4D]/70">
            <Link to="/forum" className="hover:underline">Forum</Link> / Announcements
          </nav>
          <h1 className="text-3xl font-bold text-[#0E2A4D] md:text-4xl">Announcements</h1>
          <p className="mt-2 max-w-xl text-[#0E2A4D]/75">
            Product news, platform updates and community notices from the Amsol team.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-10">
        {/* Pinned announcement */}
        {pinned && (
          <section className="rounded-3xl bg-[#0E2A4D] p-7 text-white md:p-10">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full bg-[#F2A93B] px-3 py-1 font-bold text-[#16233A]">Pinned</span>
              <span className="text-[#C9D6EA]">
                {pinned.type}, {fmt(pinned.date, { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <h2 className="mt-4 max-w-2xl text-2xl font-bold leading-tight md:text-3xl">{pinned.title}</h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#C9D6EA]">{pinned.summary}</p>
          </section>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Timeline */}
          <section>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    type === t
                      ? "border-[#0E2A4D] bg-[#0E2A4D] text-white"
                      : "border-[#E4E9EF] bg-white text-slate-600 hover:bg-[#F6F8FB]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {groups.length === 0 && (
              <p className="mt-10 rounded-3xl border border-[#EEF1F5] px-6 py-14 text-center text-slate-500">
                No announcements in this category yet. Check back soon.
              </p>
            )}

            {groups.map(([month, items]) => (
              <div key={month} className="mt-8">
                <h3 className="text-sm font-semibold text-slate-500">{month}</h3>
                <ol className="mt-3 border-l-2 border-[#EEF1F5]">
                  {items.map((a) => (
                    <li key={a.id} className="relative pb-8 pl-7 last:pb-0">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#F2A93B] ring-2 ring-[#F2A93B]/30"
                      />
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className={`rounded-full px-2.5 py-1 font-semibold ${TYPE_STYLES[a.type]}`}>
                          {a.type}
                        </span>
                        <time dateTime={a.date}>{fmt(a.date, { day: "numeric", month: "short" })}</time>
                      </div>
                      <h4 className="mt-2 text-lg font-semibold text-[#0E2A4D]">{a.title}</h4>
                      <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-slate-600">{a.summary}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </section>

          {/* Subscribe */}
          <aside className="h-fit rounded-3xl border border-[#E4E9EF] bg-[#F6F8FB] p-6 lg:sticky lg:top-24">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#0E2A4D] text-[#F2A93B]">
              <FiBell />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-[#0E2A4D]">Get updates by email</h3>
            <p className="mt-1 text-sm text-slate-600">
              We send one short email when something important changes. No spam.
            </p>

            {subscribed ? (
              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-green-700">
                <FiCheck /> Subscribed with {email}
              </p>
            ) : (
              <form onSubmit={subscribe} className="mt-4 space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  aria-label="Email address"
                  className="w-full rounded-xl border border-[#DDE3EA] bg-white px-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F2A93B]/60 focus:border-[#F2A93B]"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#F2A93B] py-2.5 text-sm font-semibold text-[#16233A] transition hover:bg-[#E39C2E]"
                >
                  Subscribe
                </button>
              </form>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}