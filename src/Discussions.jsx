import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiMessageSquare, FiThumbsUp, FiPlus, FiX, FiChevronDown } from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "./Navbar"; // adjust path/name if yours differs
import Footer from "./Footer"; // adjust path/name if yours differs

const CATEGORIES = ["All", "CVs & applications", "Interviews", "Salary & offers", "Career growth", "Employers"];

const TAG_STYLES = {
  "CVs & applications": "bg-blue-50 text-blue-700",
  Interviews: "bg-amber-50 text-amber-700",
  "Salary & offers": "bg-green-50 text-green-700",
  "Career growth": "bg-purple-50 text-purple-700",
  Employers: "bg-slate-100 text-slate-700",
};

// Sample data. Replace with an API call (e.g. GET /api/forum/threads) when your backend is ready.
const SEED = [
  {
    id: 1,
    category: "Interviews",
    title: "How do you answer 'tell me about a time you made a mistake' as a nurse?",
    body: "I have a panel interview next week. I want to be honest without sounding careless. How have you handled this question?",
    author: "Grace W.",
    time: "2 hours ago",
    likes: 14,
    replies: [
      { id: 11, author: "Daniel O.", time: "1 hour ago", text: "Pick a small, real example, say what you changed afterwards, and keep patient safety at the centre of the story." },
      { id: 12, author: "Amina K.", time: "45 min ago", text: "Panels like seeing that you reported it quickly. Mention who you told and what the team learned." },
    ],
  },
  {
    id: 2,
    category: "Salary & offers",
    title: "Is it normal to negotiate when the first offer is within range?",
    body: "The offer is fair but at the lower end of the band. Would asking for more risk the offer?",
    author: "Peter M.",
    time: "Yesterday",
    likes: 9,
    replies: [
      { id: 21, author: "Lydia N.", time: "Yesterday", text: "A polite, specific ask is normal. Give your reason, such as certifications or years of experience." },
    ],
  },
  {
    id: 3,
    category: "CVs & applications",
    title: "One page or two pages for a CV with 10 years of experience?",
    body: "I keep cutting things out and it still runs onto a second page.",
    author: "Faith A.",
    time: "2 days ago",
    likes: 21,
    replies: [],
  },
  {
    id: 4,
    category: "Employers",
    title: "What do you look for first when you open an application?",
    body: "Hiring managers, what makes you keep reading and what makes you move on?",
    author: "Joseph T.",
    time: "3 days ago",
    likes: 31,
    replies: [
      { id: 41, author: "Mercy L.", time: "3 days ago", text: "Relevant licence and registration number near the top. It saves us a lot of back and forth." },
    ],
  },
];

const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function Discussions() {
  const [threads, setThreads] = useState(SEED);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [openId, setOpenId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "", category: "Interviews" });
  const [replyText, setReplyText] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = threads.filter(
      (t) =>
        (category === "All" || t.category === category) &&
        (!q || t.title.toLowerCase().includes(q) || t.body.toLowerCase().includes(q))
    );
    return sort === "popular"
      ? [...list].sort((a, b) => b.likes + b.replies.length - (a.likes + a.replies.length))
      : list;
  }, [threads, category, query, sort]);

  const createThread = (e) => {
    e.preventDefault();
    if (!draft.title.trim() || !draft.body.trim()) {
      return toast.error("Add a title and a few details first.");
    }
    setThreads([
      { id: Date.now(), ...draft, author: "You", time: "Just now", likes: 0, replies: [] },
      ...threads,
    ]);
    setDraft({ title: "", body: "", category: "Interviews" });
    setShowForm(false);
    toast.success("Discussion posted");
  };

  const like = (id) =>
    setThreads(threads.map((t) => (t.id === id ? { ...t, likes: t.likes + 1 } : t)));

  const addReply = (id) => {
    if (!replyText.trim()) return toast.error("Write a reply first.");
    setThreads(
      threads.map((t) =>
        t.id === id
          ? { ...t, replies: [...t.replies, { id: Date.now(), author: "You", time: "Just now", text: replyText.trim() }] }
          : t
      )
    );
    setReplyText("");
  };

  const inputCls =
    "w-full rounded-xl border border-[#DDE3EA] bg-white px-4 py-2.5 text-sm text-[#1F2A38] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F2A93B]/60 focus:border-[#F2A93B]";

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
            <Link to="/forum" className="hover:underline">Forum</Link> / Discussions
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0E2A4D] md:text-4xl">Discussions</h1>
              <p className="mt-2 max-w-xl text-[#0E2A4D]/75">
                Ask questions, share what worked, and learn from other job seekers and employers.
              </p>
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 rounded-full bg-[#F2A93B] px-5 py-2.5 text-sm font-semibold text-[#16233A] transition hover:bg-[#E39C2E] focus:outline-none focus:ring-2 focus:ring-[#0E2A4D]/40"
            >
              {showForm ? <FiX /> : <FiPlus />}
              {showForm ? "Cancel" : "Start a discussion"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-10">
        {/* New thread form */}
        {showForm && (
          <form
            onSubmit={createThread}
            className="mb-10 space-y-4 rounded-3xl border border-[#E4E9EF] bg-[#F6F8FB] p-6"
          >
            <h2 className="text-lg font-semibold text-[#0E2A4D]">New discussion</h2>
            <input
              className={inputCls}
              placeholder="What do you want to ask or share?"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              maxLength={140}
            />
            <textarea
              className={`${inputCls} resize-none`}
              rows={4}
              placeholder="Add details so people can give useful answers."
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            />
            <div className="flex flex-wrap items-center gap-3">
              <select
                className={`${inputCls} !w-auto`}
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              >
                {CATEGORIES.slice(1).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-full bg-[#0E2A4D] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0A2140]"
              >
                Post discussion
              </button>
            </div>
          </form>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  category === c
                    ? "border-[#0E2A4D] bg-[#0E2A4D] text-white"
                    : "border-[#E4E9EF] bg-white text-slate-600 hover:bg-[#F6F8FB]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-[#E4E9EF] bg-[#F6F8FB] px-4 py-2">
              <FiSearch className="text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search discussions"
                aria-label="Search discussions"
                className="w-44 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort discussions"
              className="rounded-full border border-[#E4E9EF] bg-white px-4 py-2 text-sm text-slate-600 focus:outline-none"
            >
              <option value="recent">Newest</option>
              <option value="popular">Most active</option>
            </select>
          </div>
        </div>

        {/* Thread list */}
        <ul className="mt-6 divide-y divide-[#EEF1F5] rounded-3xl border border-[#EEF1F5]">
          {visible.length === 0 && (
            <li className="px-6 py-14 text-center text-slate-500">
              No discussions match your search. Try another category, or start the conversation yourself.
            </li>
          )}

          {visible.map((t) => {
            const open = openId === t.id;
            return (
              <li key={t.id} className="px-5 py-5 md:px-7">
                <div className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0E2A4D] text-xs font-bold text-[#F2A93B]"
                  >
                    {initials(t.author)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className={`rounded-full px-2.5 py-1 font-semibold ${TAG_STYLES[t.category]}`}>
                        {t.category}
                      </span>
                      <span>{t.author} posted {t.time}</span>
                    </div>

                    <button
                      onClick={() => setOpenId(open ? null : t.id)}
                      aria-expanded={open}
                      className="mt-2 flex w-full items-start justify-between gap-3 text-left"
                    >
                      <span className="text-lg font-semibold leading-snug text-[#0E2A4D]">{t.title}</span>
                      <FiChevronDown className={`mt-1.5 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
                    </button>

                    <p className={`mt-1.5 text-[15px] leading-relaxed text-slate-600 ${open ? "" : "line-clamp-2"}`}>
                      {t.body}
                    </p>

                    <div className="mt-3 flex items-center gap-5 text-sm text-slate-500">
                      <button
                        onClick={() => like(t.id)}
                        className="flex items-center gap-1.5 hover:text-[#0E2A4D]"
                        aria-label={`Like discussion, ${t.likes} likes`}
                      >
                        <FiThumbsUp /> {t.likes}
                      </button>
                      <button
                        onClick={() => setOpenId(open ? null : t.id)}
                        className="flex items-center gap-1.5 hover:text-[#0E2A4D]"
                      >
                        <FiMessageSquare /> {t.replies.length} {t.replies.length === 1 ? "reply" : "replies"}
                      </button>
                    </div>

                    {open && (
                      <div className="mt-5 space-y-4 border-l-2 border-[#F2A93B]/60 pl-5">
                        {t.replies.length === 0 && (
                          <p className="text-sm text-slate-500">No replies yet. Be the first to help.</p>
                        )}
                        {t.replies.map((r) => (
                          <div key={r.id}>
                            <p className="text-sm font-semibold text-[#0E2A4D]">
                              {r.author} <span className="font-normal text-slate-400">{r.time}</span>
                            </p>
                            <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{r.text}</p>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-1">
                          <input
                            className={inputCls}
                            placeholder="Write a reply"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addReply(t.id)}
                          />
                          <button
                            onClick={() => addReply(t.id)}
                            className="shrink-0 rounded-full bg-[#0E2A4D] px-5 text-sm font-semibold text-white hover:bg-[#0A2140]"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
      <Footer />
    </div>
  );
}