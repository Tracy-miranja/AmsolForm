import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCheck, FaMinus } from "react-icons/fa";
import HiringProblemSection from "./HiringProblemSection";
import HeroLive from "./Herolive ";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatWidget from "./Chatwidget";

const STAGES = ["Applied", "Shortlisted", "Interview", "Offer"];
const START = [
  { id: 1, name: "Grace Wanjiru", role: "Product Designer", score: 96, stage: 0, c: "#1F5BFF" },
  { id: 2, name: "Samuel Okello", role: "Backend Engineer", score: 92, stage: 0, c: "#F2A93B" },
  { id: 3, name: "Aisha Kamau", role: "Data Analyst", score: 89, stage: 1, c: "#16A34A" },
  { id: 4, name: "Peter Mwangi", role: "Sales Lead", score: 84, stage: 2, c: "#C77B6E" },
  { id: 5, name: "Lilian Achieng", role: "HR Officer", score: 81, stage: 0, c: "#7C5CD6" },
];

const AI = [
  ["AI job-post writer", "Describe the role in one line. Get a clear, bias-checked job ad ready to publish."],
  ["Match scoring", "Every applicant is ranked against your requirements by skills and experience, not keywords."],
  ["Smart screening", "Auto-generated questions filter out poor fits before they reach your inbox."],
  ["Talent search", "Search our vetted database in plain language and invite the right people to apply."],
];

const ROWS = [
  ["Post jobs to a large audience", true, true],
  ["Search a candidate database", true, true],
  ["Managed shortlist by recruiters", true, true],
  ["Built-in ATS pipeline (shortlist, interview, offer)", true, false],
  ["AI match scoring on every applicant", true, false],
  ["AI-written job ads and screening questions", true, false],
];

const Tick = ({ on }) =>
  on ? <FaCheck className="inline text-emerald-600" aria-label="Yes" /> : <FaMinus className="inline text-slate-300" aria-label="Not listed" />;

const EmployerLandingPage = () => {
  const [cands, setCands] = useState(START);
  const move = (id, d) =>
    setCands((cs) => cs.map((c) => (c.id === id ? { ...c, stage: Math.max(0, Math.min(3, c.stage + d)) } : c)));

  return (
    <div className="el-page w-full bg-white text-slate-900 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
        .el-page{font-family:'Inter',sans-serif}
        .el-wrap{width:min(1400px,calc(100% - 40px));margin-inline:auto}
        .el-sec{padding:72px 0}
        @media(max-width:767px){.el-sec{padding:48px 0}}
        .el-frame{background:radial-gradient(520px 340px at 66% 0%,#BFD5FF 0%,rgba(191,213,255,0) 70%),radial-gradient(420px 380px at 0% 74%,#F3E8D4 0%,rgba(243,232,212,0) 70%),linear-gradient(135deg,#E8F2FF,#DCEBFF);border-radius:0 0 64px 64px;padding-bottom:64px}
        @media(max-width:767px){.el-frame{border-radius:0 0 32px 32px;padding-bottom:40px}}
        .el-h{font-family:'Space Grotesk',sans-serif;letter-spacing:-.025em;color:#0F1B33}
        .el-h1{font-size:clamp(38px,5vw,66px);line-height:1.06;font-weight:700}
        .el-badge{display:inline-flex;gap:8px;align-items:center;background:#D3E2FA;color:#1F5BFF;font-weight:700;font-size:11.5px;letter-spacing:.14em;padding:10px 16px;border-radius:999px;text-transform:uppercase}
        .el-badge i{width:5px;height:5px;border-radius:50%;background:#1F5BFF}
        .el-btn{background:#0E2A4D;color:#fff;font-weight:600;font-size:15px;padding:16px 28px;border-radius:999px;transition:background .2s}
        .el-btn:hover{background:#0B233F}
        .el-btn2{background:#F2A93B;color:#16233A;font-weight:600;font-size:15px;padding:16px 28px;border-radius:999px}
        .el-btn2:hover{background:#E39C2E}
        .el-btn3{background:#fff;color:#0F1B33;font-weight:600;font-size:15px;padding:16px 28px;border-radius:999px;border:1px solid #E1E8F2}
        .el-pill{background:#fff;border-radius:999px;padding:14px 24px;box-shadow:0 6px 18px -10px rgba(31,91,255,.25)}
        .el-pill b{display:block;font-size:17px}.el-pill span{font-size:12px;color:#6B7C93}
        .el-grid-off{margin-top:36px}
        @media(min-width:1024px){.el-grid-off{margin-top:56px}}
        .amsol-nav-pill{background:#fff;border:1px solid #E4E9EF;border-radius:999px}
        .amsol-nav-link{color:#1F2A38;font-weight:600}
        .amsol-nav-link.is-active{color:#F2A93B}
        .amsol-dropdown{border-radius:14px;box-shadow:0 18px 36px -14px rgba(10,20,35,.35)}
        .amsol-btn-solid{background:#F2A93B;color:#16233A}.amsol-btn-solid:hover{background:#E39C2E}
        .amsol-btn-outline{background:#fff;color:#16233A;border:1.5px solid #E4E9EF}.amsol-btn-outline:hover{background:#F6F8FB}
        .amsol-megamenu{border-radius:18px;background:#fff;box-shadow:0 22px 44px -16px rgba(10,20,35,.35);border:1px solid #EEF1F5;padding:10px}
        .amsol-megamenu-item{display:block;border-radius:12px;padding:12px 14px;transition:background .15s}
        .amsol-megamenu-item:hover{background:#F6F8FB}
        .amsol-megamenu-title{font-weight:700;font-size:14.5px;color:#0E2A4D;margin-bottom:2px}
        .amsol-megamenu-desc{font-size:13px;color:#6B7686;line-height:1.4}
        .el-col{background:#F6F8FB;border-radius:20px;padding:14px;min-height:260px}
        .el-card{background:#fff;border:1px solid #E7EDF5;border-radius:16px;padding:12px;margin-top:10px}
        .el-av{width:34px;height:34px;border-radius:50%;color:#fff;font-weight:700;font-size:13px;display:grid;place-items:center;flex-shrink:0}
        .el-mv{font-size:12px;font-weight:600;border-radius:999px;padding:5px 12px}
        .el-ai{background:#fff;border:1px solid #E7EDF5;border-radius:20px;padding:24px}
        .el-ai i{display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:#E6EFFC;color:#1F5BFF;font-style:normal;font-weight:700;margin-bottom:14px}
      `}</style>

      {/* HERO */}
      <div className="el-frame">
        <Navbar />

        <HeroLive />
      </div>

      {/* PROBLEM */}
      <HiringProblemSection />

      {/* ATS */}
      <section id="ats" className="el-sec">
        <div className="el-wrap">
          <p className="text-sm font-semibold text-[#0E2A4D] mb-1">Applicant tracking</p>
          <h2 className="el-h text-3xl md:text-4xl font-bold mb-2">Select candidates right inside your ATS</h2>
          <p className="text-slate-600 mb-8 max-w-xl">Try it: move candidates between stages. Every applicant arrives scored by AI, so the best fits sit at the top.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STAGES.map((s, si) => (
              <div key={s} className="el-col">
                <p className="text-sm font-bold text-[#0E2A4D]">
                  {s} <span className="text-slate-400 font-semibold">{cands.filter((c) => c.stage === si).length}</span>
                </p>
                {cands.filter((c) => c.stage === si).sort((a, b) => b.score - a.score).map((c) => (
                  <div key={c.id} className="el-card">
                    <div className="flex items-center gap-3">
                      <span className="el-av" style={{ background: c.c }}>{c.name.split(" ").map((w) => w[0]).join("")}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold truncate">{c.name}</p>
                        <p className="text-xs text-slate-500 truncate">{c.role}</p>
                      </div>
                      <span className="text-xs font-bold text-[#1F5BFF] bg-[#E6EFFC] px-2 py-1 rounded-full">{c.score}%</span>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      {si > 0 && <button onClick={() => move(c.id, -1)} className="el-mv border border-slate-200 text-slate-600">Back</button>}
                      {si < 3 && <button onClick={() => move(c.id, 1)} className="el-mv bg-[#0E2A4D] text-white">{si === 2 ? "Make offer" : si === 0 ? "Shortlist" : "Interview"}</button>}
                      {si === 3 && <span className="el-mv bg-emerald-100 text-emerald-800">Offer sent ✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI */}
      <section id="ai" className="el-sec bg-[#F6F8FB]">
        <div className="el-wrap">
          <p className="text-sm font-semibold text-[#0E2A4D] mb-1">AI-powered recruiting</p>
          <h2 className="el-h text-3xl md:text-4xl font-bold mb-8">Less screening. More interviewing.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {AI.map(([t, d], i) => (
              <div key={t} className="el-ai">
                <i>{i + 1}</i>
                <h3 className="font-bold mb-2">{t}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENCHMARK */}
      <section id="compare" className="el-sec">
        <div className="el-wrap">
          <p className="text-sm font-semibold text-[#0E2A4D] mb-1">How we compare</p>
          <h2 className="el-h text-3xl md:text-4xl font-bold mb-8">Amsol vs. a traditional job board</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-[#0E2A4D] text-white text-left">
                  <th className="p-4 font-semibold">Capability</th>
                  <th className="p-4 font-semibold text-center">Amsol</th>
                  <th className="p-4 font-semibold text-center">Traditional</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, a, m], i) => (
                  <tr key={label} className={i % 2 ? "bg-[#F6F8FB]" : "bg-white"}>
                    <td className="p-4 font-medium">{label}</td>
                    <td className="p-4 text-center"><Tick on={a} /></td>
                    <td className="p-4 text-center"><Tick on={m} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-3 max-w-2xl">
            Traditional job-board column based on the features listed on a typical public employer page (job posting, candidate database search and managed shortlisting). A dash means the feature isn't listed there. Check the latest details before publishing.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="el-sec pt-0">
        <div className="el-wrap">
          <div className="bg-[#0E2A4D] rounded-3xl text-center px-6 py-16">
            <h2 className="el-h text-3xl md:text-4xl font-bold !text-white max-w-2xl mx-auto">Fill your next role with Amsol.</h2>
            <p className="text-[#C7D7EA] mt-4 max-w-lg mx-auto">Post in minutes, review AI-ranked applicants, and hire with your whole team in one ATS.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register?as=employer" className="el-btn2">Post a role</Link>
              <Link to="/pricing" className="border border-white text-white font-semibold px-7 py-4 rounded-full hover:bg-white/10 inline-flex items-center gap-2">
                See pricing <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default EmployerLandingPage;