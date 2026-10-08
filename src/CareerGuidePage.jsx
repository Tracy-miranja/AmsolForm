import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaArrowRight, FaRegClock } from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";

const CATEGORIES = ["All", "CVs & applications", "Interviews", "Salary & offers", "Career growth", "Remote work"];
const COLORS = {
  "CVs & applications": ["#E6EFFC", "#1F5BFF"],
  "Interviews": ["#FDF0D9", "#C98418"],
  "Salary & offers": ["#E7F8EE", "#16A34A"],
  "Career growth": ["#F1EAFB", "#7C5CD6"],
  "Remote work": ["#E3F3F4", "#2E9FA6"],
};
const ARTICLES = [
  {
    slug: "cv-that-passes-screening", cat: "CVs & applications", min: 6, title: "How to write a CV that gets past screening",
    desc: "Structure, keywords and the small details that make recruiters and AI screening tools keep reading.",
    // Featured media. Use ONE of the two shapes below, or remove `media` to fall back to the gradient.
    // Image: { type: "image", src: "/images/cv-guide.jpg", alt: "Person reviewing a CV on a laptop" }
    // Video: { type: "video", src: "/videos/cv-guide.mp4", poster: "/images/cv-guide.jpg" }
    // Photo by Resume Genius on Unsplash (free under the Unsplash License)
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1698047681432-006d2449c631?auto=format&fit=crop&w=1200&q=70",
      alt: "Hiring manager reading a job applicant's CV at a table",
    },
  },
  { slug: "interview-questions", cat: "Interviews", min: 8, title: "10 common interview questions and how to answer them",
    desc: "Clear, honest ways to talk about your experience, your strengths and your gaps." },
  { slug: "negotiate-salary", cat: "Salary & offers", min: 7, title: "How to negotiate your salary offer with confidence",
    desc: "Know your market, choose your moment and respond to the first number without losing the offer." },
  { slug: "cover-letters", cat: "CVs & applications", min: 5, title: "Cover letters that actually get read",
    desc: "A simple three-paragraph approach that connects your experience to the role." },
  { slug: "phone-screen", cat: "Interviews", min: 5, title: "Preparing for a phone screen",
    desc: "What recruiters check in the first call, and how to prepare in 30 minutes." },
  { slug: "career-change", cat: "Career growth", min: 9, title: "Changing careers: a practical guide",
    desc: "Turn the skills you already have into a credible story for a new field." },
  { slug: "linkedin-profile", cat: "Career growth", min: 6, title: "Building a profile employers want to find",
    desc: "Headline, summary and skills: make your profile work while you sleep." },
  { slug: "remote-work-global", cat: "Remote work", min: 8, title: "Working remotely for companies around the world",
    desc: "Where to find remote roles, how to stand out and how to handle time zones and payments." },
  { slug: "ai-screening", cat: "CVs & applications", min: 4, title: "How AI screening reads your CV",
    desc: "What match scores look at, and how to make your real skills easy to see." },
];

// Renders the left panel of the featured card: image, video, or gradient fallback.
const FeaturedMedia = ({ media }) => {
  if (!media) {
    return <div className="cg-feat-art" aria-hidden="true" />;
  }
  if (media.type === "video") {
    return (
      <div className="cg-feat-art" aria-hidden="true">
        <video
          src={media.src}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    );
  }
  return (
    <div className="cg-feat-art">
      <img src={media.src} alt={media.alt || ""} loading="lazy" />
    </div>
  );
};

const CareerGuidePage = () => {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const list = ARTICLES.filter((a) =>
    (cat === "All" || a.cat === cat) &&
    (!q.trim() || (a.title + " " + a.desc).toLowerCase().includes(q.trim().toLowerCase()))
  );
  const featured = cat === "All" && !q.trim() ? ARTICLES[0] : null;
  const rest = featured ? list.filter((a) => a.slug !== featured.slug) : list;

  return (
    <div className="cg-page w-full bg-white text-slate-900 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
        .cg-page{font-family:'Inter',sans-serif}
        .cg-wrap{width:min(1200px,calc(100% - 40px));margin-inline:auto}
        .cg-h{font-family:'Space Grotesk',sans-serif;letter-spacing:-.025em;color:#0F1B33}
        .cg-hero{background:radial-gradient(520px 340px at 66% 0%,#BFD5FF 0%,rgba(191,213,255,0) 70%),radial-gradient(420px 380px at 0% 74%,#F3E8D4 0%,rgba(243,232,212,0) 70%),linear-gradient(135deg,#E8F2FF,#DCEBFF);border-radius:0 0 64px 64px;padding-bottom:64px}
        @media(max-width:767px){.cg-hero{border-radius:0 0 32px 32px;padding-bottom:40px}}
        .cg-badge{display:inline-flex;background:#D3E2FA;color:#1F5BFF;font-weight:700;font-size:11.5px;letter-spacing:.14em;padding:10px 16px;border-radius:999px;text-transform:uppercase}
        .cg-search{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #E1E8F2;border-radius:999px;padding:6px 8px 6px 20px;max-width:520px;margin:30px auto 0;box-shadow:0 10px 26px -16px rgba(31,91,255,.35)}
        .cg-search input{flex:1;min-width:0;outline:none;font-size:15px;padding:10px 0;background:transparent}
        .cg-search span{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:#F2A93B;color:#16233A}
        .cg-chips{display:flex;flex-wrap:wrap;gap:10px;margin:40px 0 28px}
        .cg-chips button{font-size:14px;font-weight:600;border:1px solid #E1E8F2;border-radius:999px;padding:9px 18px;color:#5F6F85;background:#fff;transition:all .15s}
        .cg-chips button:hover{border-color:#0E2A4D;color:#0E2A4D}
        .cg-chips button.on{background:#0E2A4D;border-color:#0E2A4D;color:#fff}
        .cg-feat{display:grid;gap:0;background:#0E2A4D;border-radius:28px;overflow:hidden;margin-bottom:28px;color:#fff}
        @media(min-width:860px){.cg-feat{grid-template-columns:1.1fr 1fr}}
        .cg-feat-art{position:relative;min-height:240px;overflow:hidden;background:radial-gradient(300px 220px at 70% 20%,rgba(242,169,59,.55),transparent 70%),linear-gradient(135deg,#1F5BFF,#0E2A4D)}
        .cg-feat-art img,.cg-feat-art video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
        .cg-feat-body{padding:36px}
        .cg-tag{display:inline-block;font-size:11.5px;font-weight:700;border-radius:999px;padding:5px 12px}
        .cg-grid{display:grid;gap:22px}
        @media(min-width:640px){.cg-grid{grid-template-columns:repeat(2,1fr)}}
        @media(min-width:980px){.cg-grid{grid-template-columns:repeat(3,1fr)}}
        .cg-card{display:flex;flex-direction:column;background:#fff;border:1px solid #E7EDF5;border-radius:22px;padding:26px;transition:transform .25s,box-shadow .25s}
        .cg-card:hover{transform:translateY(-4px);box-shadow:0 22px 44px -26px rgba(15,27,51,.4)}
        .cg-card h3{font-weight:700;font-size:18px;line-height:1.3;margin-top:16px;color:#0F1B33}
        .cg-card p{font-size:14px;line-height:1.6;color:#5F6F85;margin-top:10px;flex:1}
        .cg-meta{display:flex;align-items:center;justify-content:space-between;margin-top:20px;font-size:13px;color:#8A97A8}
        .cg-meta b{color:#F2A93B;font-weight:700;display:inline-flex;gap:6px;align-items:center}
        @media(prefers-reduced-motion:reduce){.cg-card{transition:none}}
      `}</style>

      <div className="cg-hero">
        <Navbar activeIndex={0} />
        <div className="cg-wrap text-center pt-12 md:pt-16">
          <span className="cg-badge">Career guide</span>
          <h1 className="cg-h mt-6 font-bold mx-auto max-w-3xl" style={{ fontSize: "clamp(36px,5vw,60px)", lineHeight: 1.06 }}>
            Guides to help you land the job and grow in it.
          </h1>
          <p className="mt-5 text-lg text-[#6B7C93] max-w-xl mx-auto leading-relaxed">
            Practical advice on CVs, interviews, salary and your next career move.
          </p>
          <label className="cg-search">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides..." aria-label="Search guides" />
            <span><FaSearch /></span>
          </label>
        </div>
      </div>

      <div className="cg-wrap" style={{ paddingBottom: 72 }}>
        <div className="cg-chips" role="tablist" aria-label="Categories">
          {CATEGORIES.map((c) => (
            <button key={c} className={cat === c ? "on" : ""} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>

        {featured && (
          <Link to={`/blog/${featured.slug}`} className="cg-feat">
            <FeaturedMedia media={featured.media} />
            <div className="cg-feat-body">
              <span className="cg-tag" style={{ background: "#F2A93B", color: "#16233A" }}>Featured</span>
              <h2 className="cg-h mt-5 text-2xl md:text-3xl font-bold" style={{ color: "#fff" }}>{featured.title}</h2>
              <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "#B8C8DE" }}>{featured.desc}</p>
              <p className="mt-6 inline-flex items-center gap-2 font-semibold" style={{ color: "#F2A93B" }}>
                Read the guide <FaArrowRight className="text-sm" />
              </p>
            </div>
          </Link>
        )}

        {rest.length === 0 && !featured ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg font-semibold text-slate-700">No guides found</p>
            <p className="text-sm mt-1">Try another keyword or category.</p>
          </div>
        ) : (
          <div className="cg-grid">
            {rest.map((a) => {
              const [bg, fg] = COLORS[a.cat];
              return (
                <Link key={a.slug} to={`/blog/${a.slug}`} className="cg-card">
                  <span className="cg-tag self-start" style={{ background: bg, color: fg }}>{a.cat}</span>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                  <div className="cg-meta">
                    <span className="inline-flex items-center gap-1.5"><FaRegClock /> {a.min} min read</span>
                    <b>Read <FaArrowRight className="text-xs" /></b>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-16 bg-[#0E2A4D] rounded-3xl text-center px-6 py-14">
          <h2 className="cg-h text-3xl md:text-4xl font-bold max-w-2xl mx-auto" style={{ color: "#fff" }}>Ready to put it into practice?</h2>
          <p className="mt-4 max-w-lg mx-auto" style={{ color: "#C7D7EA" }}>Create your profile and get matched to roles that fit your skills.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register?as=jobseeker" className="bg-[#F2A93B] hover:bg-[#E39C2E] text-[#16233A] font-semibold px-7 py-4 rounded-full">Create my profile</Link>
            <Link to="/courses" className="border border-white text-white font-semibold px-7 py-4 rounded-full hover:bg-white/10 inline-flex items-center gap-2">
              Learn new skills <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default CareerGuidePage;