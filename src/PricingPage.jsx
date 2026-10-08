import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheck, FaMinus, FaChevronDown, FaArrowRight, FaLockOpen, FaUserTie } from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatWidget from "./Chatwidget";

/* ------------------------------------------------------------------
   PLACEHOLDER PRICES (KES per month). Replace with your real pricing.
   Yearly billing shows a 20% discount; change YEARLY_DISCOUNT if needed.
------------------------------------------------------------------- */
const YEARLY_DISCOUNT = 0.2;
const PLANS = [
  {
    id: "starter", name: "Starter", price: 4900, tag: "For occasional hiring",
    desc: "Unlock qualified candidates for a role and manage them yourself.",
    cta: "Start with Starter", to: "/register?as=employer",
    features: ["10 candidate unlocks / month", "1 active job", "AI job-post writer", "AI match score on every candidate", "Basic pipeline (ATS)"],
  },
  {
    id: "growth", name: "Growth", price: 14900, tag: "Most popular", popular: true,
    desc: "For teams hiring regularly who want AI to do the screening.",
    cta: "Choose Growth", to: "/register?as=employer",
    features: ["40 candidate unlocks / month", "5 active jobs", "AI job-post writer and screening questions", "Full ATS pipeline and interview scheduling", "Email invitations to candidates", "3 team seats"],
  },
  {
    id: "team", name: "Recruitment team", price: null, tag: "Done for you",
    desc: "Our recruiters run the search, shortlist and coordinate interviews for you.",
    cta: "Talk to our team", to: "/register?as=employer",
    features: ["Dedicated Amsol recruiter", "Candidates matched to your job description", "Vetting and shortlist delivered to you", "Interview coordination", "Everything in Growth included"],
  },
];

const ROWS = [
  ["Candidate unlocks per month", "10", "40", "As needed"],
  ["Active jobs", "1", "5", "Unlimited"],
  ["AI job-post writer", true, true, true],
  ["AI match scoring", true, true, true],
  ["AI screening questions", false, true, true],
  ["ATS pipeline (shortlist, interview, offer)", "Basic", true, true],
  ["Interview scheduling and email invites", false, true, true],
  ["Team seats", "1", "3", "Custom"],
  ["Dedicated recruiter", false, false, true],
  ["Vetted shortlist delivered to you", false, false, true],
];

const FAQ = [
  ["What does unlocking a candidate mean?",
    "Candidates on Amsol are already qualified. When the AI matches them to your job description, their profile is locked. Unlocking one uses a credit and reveals their full details so you can contact them."],
  ["How does AI matching work?",
    "Add your job description and the AI ranks candidates against your requirements by skills and experience. You choose which ones to unlock."],
  ["Can I use the recruitment team for some roles only?",
    "Yes. Run most roles yourself and hand the harder or more urgent ones to our recruiters whenever you like."],
  ["Can I change or cancel my plan?",
    "You can upgrade, downgrade or cancel at any time. Changes apply from your next billing period."],
];

const fmt = (n) => new Intl.NumberFormat("en-KE").format(n);
const Cell = ({ v }) =>
  v === true ? <FaCheck className="inline text-emerald-600" aria-label="Included" /> :
  v === false ? <FaMinus className="inline text-slate-300" aria-label="Not included" /> :
  <span className="font-semibold text-[#0E2A4D]">{v}</span>;

const PricingPage = () => {
  const [yearly, setYearly] = useState(false);
  const [open, setOpen] = useState(0);
  const price = (p) => Math.round(yearly ? p * (1 - YEARLY_DISCOUNT) : p);

  return (
    <div className="pr-page w-full bg-white text-slate-900 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
        .pr-page{font-family:'Inter',sans-serif}
        .pr-wrap{width:min(1200px,calc(100% - 40px));margin-inline:auto}
        .pr-h{font-family:'Space Grotesk',sans-serif;letter-spacing:-.025em;color:#0F1B33}
        .pr-hero{background:radial-gradient(520px 340px at 66% 0%,#BFD5FF 0%,rgba(191,213,255,0) 70%),radial-gradient(420px 380px at 0% 74%,#F3E8D4 0%,rgba(243,232,212,0) 70%),linear-gradient(135deg,#E8F2FF,#DCEBFF);border-radius:0 0 64px 64px;padding-bottom:150px}
        @media(max-width:767px){.pr-hero{border-radius:0 0 32px 32px;padding-bottom:120px}}
        .pr-badge{display:inline-flex;gap:8px;align-items:center;background:#D3E2FA;color:#1F5BFF;font-weight:700;font-size:11.5px;letter-spacing:.14em;padding:10px 16px;border-radius:999px;text-transform:uppercase}
        .pr-toggle{display:inline-flex;background:#fff;border:1px solid #E1E8F2;border-radius:999px;padding:5px;margin-top:32px}
        .pr-toggle button{font-size:14px;font-weight:600;padding:10px 22px;border-radius:999px;color:#5F6F85;transition:all .2s}
        .pr-toggle button.on{background:#0E2A4D;color:#fff}
        .pr-toggle small{margin-left:6px;font-size:11px;color:#16A34A;font-weight:700}
        .pr-toggle button.on small{color:#9BE7B5}
        .pr-plans{margin-top:-110px;display:grid;gap:20px;position:relative}
        @media(min-width:900px){.pr-plans{grid-template-columns:repeat(3,1fr);align-items:stretch}}
        .pr-card{background:#fff;border:1px solid #E7EDF5;border-radius:24px;padding:30px;display:flex;flex-direction:column;box-shadow:0 18px 40px -26px rgba(15,27,51,.3);transition:transform .25s,box-shadow .25s}
        .pr-card:hover{transform:translateY(-4px);box-shadow:0 26px 50px -24px rgba(15,27,51,.35)}
        .pr-card.pop{background:#0E2A4D;border-color:#0E2A4D;color:#fff}
        .pr-tag{display:inline-block;align-self:flex-start;font-size:11.5px;font-weight:700;border-radius:999px;padding:6px 12px;background:#E6EFFC;color:#1F5BFF}
        .pop .pr-tag{background:#F2A93B;color:#16233A}
        .pr-price{font-family:'Space Grotesk',sans-serif;font-size:42px;font-weight:700;line-height:1;margin-top:20px}
        .pr-price small{font-family:'Inter',sans-serif;font-size:14px;font-weight:500;color:#7A8799;margin-left:4px}
        .pop .pr-price small,.pop .pr-d{color:#B8C8DE}
        .pr-d{font-size:14px;color:#5F6F85;line-height:1.55;margin-top:12px;min-height:66px}
        .pr-list{margin:22px 0 28px;display:grid;gap:12px;flex:1}
        .pr-list li{display:flex;gap:10px;font-size:14px;line-height:1.4}
        .pr-list svg{color:#16A34A;margin-top:3px;flex-shrink:0}
        .pop .pr-list svg{color:#F2A93B}
        .pr-btn{display:block;text-align:center;font-weight:600;font-size:15px;padding:15px 24px;border-radius:999px;background:#0E2A4D;color:#fff;transition:background .2s}
        .pr-btn:hover{background:#0B233F}
        .pop .pr-btn{background:#F2A93B;color:#16233A}.pop .pr-btn:hover{background:#E39C2E}
        .pr-note{text-align:center;font-size:13px;color:#7A8799;margin-top:20px}
        .pr-sec{padding:72px 0}
        @media(max-width:767px){.pr-sec{padding:48px 0}}
        .pr-faq{border:1px solid #E7EDF5;border-radius:16px;background:#fff;overflow:hidden}
        .pr-faq+.pr-faq{margin-top:12px}
        .pr-faq button{width:100%;display:flex;justify-content:space-between;align-items:center;gap:16px;text-align:left;font-weight:600;font-size:15.5px;color:#0F1B33;padding:20px 22px}
        .pr-faq p{padding:0 22px 20px;font-size:14.5px;line-height:1.65;color:#5F6F85}
      `}</style>

      {/* HERO */}
      <div className="pr-hero">
        <Navbar />

        <div className="pr-wrap text-center pt-14 md:pt-20">
          <span className="pr-badge">Pricing</span>
          <h1 className="pr-h mt-6 font-bold mx-auto max-w-3xl" style={{ fontSize: "clamp(36px,5vw,60px)", lineHeight: 1.06 }}>
            Pay for qualified candidates, not for searching.
          </h1>
          <p className="mt-5 text-lg text-[#6B7C93] max-w-xl mx-auto leading-relaxed">
            Unlock the candidates the AI matches to your job description, or let our recruitment team do the hiring for you.
          </p>
          <div className="pr-toggle" role="group" aria-label="Billing period">
            <button className={!yearly ? "on" : ""} onClick={() => setYearly(false)}>Monthly</button>
            <button className={yearly ? "on" : ""} onClick={() => setYearly(true)}>
              Yearly<small>Save {YEARLY_DISCOUNT * 100}%</small>
            </button>
          </div>
        </div>
      </div>

      {/* PLANS */}
      <div className="pr-wrap">
        <div className="pr-plans">
          {PLANS.map((p) => (
            <div key={p.id} className={`pr-card ${p.popular ? "pop" : ""}`}>
              <span className="pr-tag">{p.tag}</span>
              <h2 className="pr-h mt-5 text-2xl font-bold" style={p.popular ? { color: "#fff" } : {}}>{p.name}</h2>
              {p.price ? (
                <p className="pr-price">KES {fmt(price(p.price))}<small>/ month{yearly ? ", billed yearly" : ""}</small></p>
              ) : (
                <p className="pr-price">Custom<small>quote per role</small></p>
              )}
              <p className="pr-d">{p.desc}</p>
              <ul className="pr-list">
                {p.features.map((f) => <li key={f}><FaCheck />{f}</li>)}
              </ul>
              <Link to={p.to} className="pr-btn">{p.cta}</Link>
            </div>
          ))}
        </div>
        <p className="pr-note">Prices in Kenyan shillings. Taxes may apply.</p>
      </div>

      {/* HOW IT WORKS */}
      <section className="pr-sec">
        <div className="pr-wrap grid md:grid-cols-2 gap-5">
          <div className="rounded-3xl bg-[#F6F8FB] p-8">
            <span className="grid place-items-center w-11 h-11 rounded-xl bg-[#E6EFFC] text-[#1F5BFF] mb-4"><FaLockOpen /></span>
            <h3 className="pr-h text-xl font-bold mb-2">Unlock with AI</h3>
            <p className="text-slate-600 text-[15px] leading-relaxed">Add your job description, review AI-matched candidates who are already qualified, and unlock the ones you choose.</p>
          </div>
          <div className="rounded-3xl bg-[#F6F8FB] p-8">
            <span className="grid place-items-center w-11 h-11 rounded-xl bg-[#FDF0D9] text-[#C98418] mb-4"><FaUserTie /></span>
            <h3 className="pr-h text-xl font-bold mb-2">Or hire with our recruiters</h3>
            <p className="text-slate-600 text-[15px] leading-relaxed">Prefer to stay hands-off? Opt in to our recruitment team and receive a vetted shortlist for your role.</p>
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section className="pr-sec pt-0">
        <div className="pr-wrap">
          <h2 className="pr-h text-3xl md:text-4xl font-bold mb-8">Compare plans</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-sm min-w-[620px]">
              <thead>
                <tr className="bg-[#0E2A4D] text-white text-left">
                  <th className="p-4 font-semibold">Feature</th>
                  {PLANS.map((p) => <th key={p.id} className="p-4 font-semibold text-center">{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, ...vals], i) => (
                  <tr key={label} className={i % 2 ? "bg-[#F6F8FB]" : "bg-white"}>
                    <td className="p-4 font-medium">{label}</td>
                    {vals.map((v, j) => <td key={j} className="p-4 text-center"><Cell v={v} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pr-sec pt-0">
        <div className="pr-wrap" style={{ maxWidth: 780 }}>
          <h2 className="pr-h text-3xl md:text-4xl font-bold mb-8 text-center">Questions, answered</h2>
          {FAQ.map(([q, a], i) => (
            <div key={q} className="pr-faq">
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                {q}
                <FaChevronDown className={`text-xs shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p>{a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pr-sec pt-0">
        <div className="pr-wrap">
          <div className="bg-[#0E2A4D] rounded-3xl text-center px-6 py-16">
            <h2 className="pr-h text-3xl md:text-4xl font-bold max-w-2xl mx-auto" style={{ color: "#fff" }}>Ready to meet your next hire?</h2>
            <p className="text-[#C7D7EA] mt-4 max-w-lg mx-auto">Post a role, see your AI matches, and unlock the candidates you want today.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register?as=employer" className="bg-[#F2A93B] hover:bg-[#E39C2E] text-[#16233A] font-semibold px-7 py-4 rounded-full">Post a role</Link>
              <Link to="/" className="border border-white text-white font-semibold px-7 py-4 rounded-full hover:bg-white/10 inline-flex items-center gap-2">
                Back to home <FaArrowRight className="text-sm" />
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

export default PricingPage;