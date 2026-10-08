import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch, FaArrowRight, FaRegClock, FaLayerGroup, FaFileExcel, FaChartPie, FaBullhorn,
  FaHandshake, FaFileInvoiceDollar, FaPiggyBank, FaUsers, FaMicrophone, FaEnvelopeOpenText,
  FaVideo, FaTasks, FaChalkboardTeacher,
} from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";

/* To use a real photo or logo for a course, import it at the top (import excelImg from "./assets/excel.png")
   and add img: excelImg to that course. Without img, its specific icon is shown.
   PLACEHOLDER CONTENT: replace the courses, durations, lessons and "Free"/"Premium"
   labels with your real catalogue. Each card links to /courses/<id>; create that route
   (or load courses from your API) when course pages are ready. */
const CATEGORIES = {
  "Technology": ["#E6EFFC", "#1F5BFF"],
  "Business": ["#FDF0D9", "#C98418"],
  "Finance": ["#E7F8EE", "#16A34A"],
  "HR & People": ["#F1EAFB", "#7C5CD6"],
  "Soft skills": ["#FDECEA", "#D93025"],
  "Remote work": ["#E3F3F4", "#2E9FA6"],
};
const LEVELS = ["All levels", "Beginner", "Intermediate", "Advanced"];
const COURSES = [
  { id: "excel-for-work", icon: FaFileExcel, cat: "Technology", level: "Beginner", hrs: 4, lessons: 18, free: true, title: "Excel for the workplace", desc: "Formulas, tables and charts you will use every day." },
  { id: "data-analysis-basics", icon: FaChartPie, cat: "Technology", level: "Intermediate", hrs: 8, lessons: 30, free: false, title: "Data analysis basics", desc: "Clean, explore and present data to support decisions." },
  { id: "digital-marketing", icon: FaBullhorn, cat: "Business", level: "Beginner", hrs: 6, lessons: 24, free: true, title: "Digital marketing fundamentals", desc: "Social, search and email marketing for small teams." },
  { id: "sales-skills", icon: FaHandshake, cat: "Business", level: "Intermediate", hrs: 5, lessons: 20, free: false, title: "Modern sales skills", desc: "Prospecting, discovery calls and closing with confidence." },
  { id: "financial-reporting", icon: FaFileInvoiceDollar, cat: "Finance", level: "Intermediate", hrs: 7, lessons: 26, free: false, title: "Financial reporting essentials", desc: "Read statements and build clear management reports." },
  { id: "budgeting", icon: FaPiggyBank, cat: "Finance", level: "Beginner", hrs: 3, lessons: 12, free: true, title: "Budgeting and forecasting", desc: "Plan, track and explain a budget in simple steps." },
  { id: "hr-fundamentals", icon: FaUsers, cat: "HR & People", level: "Beginner", hrs: 5, lessons: 20, free: false, title: "HR fundamentals", desc: "Recruitment, onboarding, performance and employee relations." },
  { id: "interview-skills", icon: FaMicrophone, cat: "Soft skills", level: "Beginner", hrs: 2, lessons: 9, free: true, title: "Interview skills", desc: "Prepare, practise and answer with confidence." },
  { id: "communication", icon: FaEnvelopeOpenText, cat: "Soft skills", level: "Intermediate", hrs: 4, lessons: 15, free: false, title: "Professional communication", desc: "Write clear emails and run effective meetings." },
  { id: "remote-collaboration", icon: FaVideo, cat: "Remote work", level: "Beginner", hrs: 3, lessons: 11, free: true, title: "Working remotely with global teams", desc: "Tools, time zones and habits that make remote work succeed." },
  { id: "project-management", icon: FaTasks, cat: "Business", level: "Advanced", hrs: 9, lessons: 34, free: false, title: "Project management in practice", desc: "Plan scope, manage risk and keep stakeholders aligned." },
  { id: "leadership", icon: FaChalkboardTeacher, cat: "HR & People", level: "Advanced", hrs: 6, lessons: 22, free: false, title: "Leading and developing teams", desc: "Coaching, feedback and building a high-trust team." },
];
const PATHS = [
  { title: "Marketing professional", steps: ["Digital marketing fundamentals", "Data analysis basics", "Professional communication"] },
  { title: "Finance analyst", steps: ["Excel for the workplace", "Budgeting and forecasting", "Financial reporting essentials"] },
  { title: "HR business partner", steps: ["HR fundamentals", "Professional communication", "Leading and developing teams"] },
];

const CoursesPage = () => {
  const [cat, setCat] = useState("All");
  const [level, setLevel] = useState("All levels");
  const [q, setQ] = useState("");
  const list = COURSES.filter((c) =>
    (cat === "All" || c.cat === cat) &&
    (level === "All levels" || c.level === level) &&
    (!q.trim() || (c.title + " " + c.desc).toLowerCase().includes(q.trim().toLowerCase()))
  );

  return (
    <div className="co-page w-full bg-white text-slate-900 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
        .co-page{font-family:'Inter',sans-serif}
        .co-wrap{width:min(1200px,calc(100% - 40px));margin-inline:auto}
        .co-h{font-family:'Space Grotesk',sans-serif;letter-spacing:-.025em;color:#0F1B33}
        .co-hero{background:radial-gradient(520px 340px at 66% 0%,#BFD5FF 0%,rgba(191,213,255,0) 70%),radial-gradient(420px 380px at 0% 74%,#F3E8D4 0%,rgba(243,232,212,0) 70%),linear-gradient(135deg,#E8F2FF,#DCEBFF);border-radius:0 0 64px 64px;padding-bottom:64px}
        @media(max-width:767px){.co-hero{border-radius:0 0 32px 32px;padding-bottom:40px}}
        .co-badge{display:inline-flex;background:#D3E2FA;color:#1F5BFF;font-weight:700;font-size:11.5px;letter-spacing:.14em;padding:10px 16px;border-radius:999px;text-transform:uppercase}
        .co-search{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #E1E8F2;border-radius:999px;padding:6px 8px 6px 20px;max-width:520px;margin:30px auto 0;box-shadow:0 10px 26px -16px rgba(31,91,255,.35)}
        .co-search input{flex:1;min-width:0;outline:none;font-size:15px;padding:10px 0;background:transparent}
        .co-search span{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:#F2A93B;color:#16233A}
        .co-bar{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin:40px 0 28px}
        .co-chips{display:flex;flex-wrap:wrap;gap:10px}
        .co-chips button{font-size:14px;font-weight:600;border:1px solid #E1E8F2;border-radius:999px;padding:9px 18px;color:#5F6F85;background:#fff;transition:all .15s}
        .co-chips button:hover{border-color:#0E2A4D;color:#0E2A4D}
        .co-chips button.on{background:#0E2A4D;border-color:#0E2A4D;color:#fff}
        .co-sel{border:1px solid #E1E8F2;border-radius:999px;padding:9px 16px;font-size:14px;font-weight:600;color:#0E2A4D;background:#fff;outline:none}
        .co-grid{display:grid;gap:22px}
        @media(min-width:640px){.co-grid{grid-template-columns:repeat(2,1fr)}}
        @media(min-width:980px){.co-grid{grid-template-columns:repeat(3,1fr)}}
        .co-card{display:flex;flex-direction:column;background:#fff;border:1px solid #E7EDF5;border-radius:22px;padding:24px;transition:transform .25s,box-shadow .25s}
        .co-card:hover{transform:translateY(-4px);box-shadow:0 22px 44px -26px rgba(15,27,51,.4)}
        .co-thumb{position:relative;display:grid;place-items:center;height:130px;border-radius:16px;font-size:54px;overflow:hidden}
        .co-thumb::before{content:"";position:absolute;width:150px;height:150px;border-radius:50%;background:currentColor;opacity:.08;right:-30px;bottom:-60px}
        .co-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .co-thumb .co-pill{position:absolute;top:12px;right:12px;z-index:1;box-shadow:0 4px 12px -6px rgba(15,27,51,.4)}
        .co-pill{font-size:11.5px;font-weight:700;border-radius:999px;padding:5px 12px}
        .co-card h3{font-weight:700;font-size:18px;line-height:1.3;margin-top:18px;color:#0F1B33}
        .co-card p{font-size:14px;line-height:1.6;color:#5F6F85;margin-top:8px;flex:1}
        .co-meta{display:flex;gap:16px;margin-top:18px;font-size:13px;color:#8A97A8}
        .co-meta span{display:inline-flex;align-items:center;gap:6px}
        .co-foot{display:flex;align-items:center;justify-content:space-between;margin-top:18px;padding-top:16px;border-top:1px solid #EEF2F7;font-size:13px}
        .co-foot b{color:#F2A93B;font-weight:700;display:inline-flex;gap:6px;align-items:center}
        .co-path{background:#F6F8FB;border-radius:22px;padding:26px}
        .co-path ol{margin-top:18px;display:grid;gap:12px;counter-reset:s}
        .co-path li{counter-increment:s;display:flex;gap:12px;align-items:center;font-size:14px;font-weight:600;color:#0F1B33}
        .co-path li::before{content:counter(s);display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#0E2A4D;color:#fff;font-size:12px;flex-shrink:0}
        @media(prefers-reduced-motion:reduce){.co-card{transition:none}}
      `}</style>

      <div className="co-hero">
        <Navbar activeIndex={0} />
        <div className="co-wrap text-center pt-12 md:pt-16">
          <span className="co-badge">Learn new skills</span>
          <h1 className="co-h mt-6 font-bold mx-auto max-w-3xl" style={{ fontSize: "clamp(36px,5vw,60px)", lineHeight: 1.06 }}>
            Build the skills employers are hiring for.
          </h1>
          <p className="mt-5 text-lg text-[#6B7C93] max-w-xl mx-auto leading-relaxed">
            Short, practical courses to help you stand out, switch careers or move up.
          </p>
          <label className="co-search">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses..." aria-label="Search courses" />
            <span><FaSearch /></span>
          </label>
        </div>
      </div>

      <div className="co-wrap" style={{ paddingBottom: 72 }}>
        <div className="co-bar">
          <div className="co-chips">
            {["All", ...Object.keys(CATEGORIES)].map((c) => (
              <button key={c} className={cat === c ? "on" : ""} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <select className="co-sel" value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Level">
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>

        {list.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg font-semibold text-slate-700">No courses found</p>
            <p className="text-sm mt-1">Try another keyword, category or level.</p>
          </div>
        ) : (
          <div className="co-grid">
            {list.map((c) => {
              const [bg, fg] = CATEGORIES[c.cat];
              const Icon = c.icon;
              return (
                <Link key={c.id} to={`/courses/${c.id}`} className="co-card">
                  <div className="co-thumb" style={{ background: bg, color: fg }}>
                    {c.img ? <img src={c.img} alt="" /> : <Icon />}
                    <span className="co-pill" style={c.free ? { background: "#fff", color: "#15803D" } : { background: "#fff", color: "#B7770F" }}>
                      {c.free ? "Free" : "Premium"}
                    </span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <div className="co-meta">
                    <span><FaRegClock /> {c.hrs} hrs</span>
                    <span><FaLayerGroup /> {c.lessons} lessons</span>
                  </div>
                  <div className="co-foot">
                    <span style={{ color: "#5F6F85", fontWeight: 600 }}>{c.level}</span>
                    <b>Start course <FaArrowRight className="text-xs" /></b>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-20">
          <p className="text-sm font-semibold text-[#0E2A4D] mb-1">Learning paths</p>
          <h2 className="co-h text-3xl md:text-4xl font-bold mb-8">Not sure where to start?</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {PATHS.map((p) => (
              <div key={p.title} className="co-path">
                <h3 className="co-h text-xl font-bold">{p.title}</h3>
                <ol>{p.steps.map((s) => <li key={s}>{s}</li>)}</ol>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-[#0E2A4D] rounded-3xl text-center px-6 py-14">
          <h2 className="co-h text-3xl md:text-4xl font-bold max-w-2xl mx-auto" style={{ color: "#fff" }}>Learn it. Then get hired for it.</h2>
          <p className="mt-4 max-w-lg mx-auto" style={{ color: "#C7D7EA" }}>Add your new skills to your profile and get matched to roles that need them.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register?as=jobseeker" className="bg-[#F2A93B] hover:bg-[#E39C2E] text-[#16233A] font-semibold px-7 py-4 rounded-full">Create my profile</Link>
            <Link to="/blog" className="border border-white text-white font-semibold px-7 py-4 rounded-full hover:bg-white/10 inline-flex items-center gap-2">
              Read the career guide <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default CoursesPage;