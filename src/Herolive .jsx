import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaLock, FaLockOpen, FaUserTie } from "react-icons/fa";
import portrait from "./assets/amsol-career-portrait.jpg";
import avatar3 from "./assets/avatar3.png";
import manPhoto from "./assets/cute-man.png";
import senegalPhoto from "./assets/jobsinsenegal.png";

/* Replace the hero content row (the <div className="el-wrap grid lg:grid-cols-2 ..."> block)
   inside <div className="el-frame"> with <HeroLive />.
   Names must match the people in the photos. */
const PEOPLE = [
  { src: portrait, name: "Amara", role: "Marketing manager", match: 96, bg: "#F2A93B" },
  { src: manPhoto, name: "Kwame", role: "Sales lead", match: 93, bg: "#8FB4F2" },
  { src: senegalPhoto, name: "Fatou", role: "Finance analyst", match: 91, bg: "#F2A93B" },
  { src: avatar3, name: "Zawadi", role: "HR business partner", match: 95, bg: "#8FB4F2" },
];

const JOBS = ["Marketing Manager", "Sales Lead", "Finance Analyst", "HR Business Partner"];

// One card slot: every few seconds a new qualified candidate arrives, starts locked
// (blurred), then unlocks.
const LiveCard = ({ slot, onSwap }) => {
  const [i, setI] = useState(slot);
  useEffect(() => {
    let t;
    const start = setTimeout(() => {
      t = setInterval(() => setI((v) => { const n = (v + 1) % PEOPLE.length; onSwap?.(n); return n; }), 5200);
    }, slot * 1100);
    return () => { clearTimeout(start); clearInterval(t); };
  }, [slot, onSwap]);
  const p = PEOPLE[i];
  return (
    <div className="hl-photo" style={{ background: p.bg }}>
      <div key={i} className="hl-swap">
        <img src={p.src} alt={`${p.name}, ${p.role}`} />
        <span className="hl-match">{p.match}% match</span>
        <span className="hl-lock hl-locked"><FaLock /> Locked</span>
        <span className="hl-lock hl-open"><FaLockOpen /> Unlocked</span>
        <div className="hl-tag"><b>{p.name}</b><span>{p.role}</span></div>
      </div>
    </div>
  );
};

const HeroLive = () => {
  const [job, setJob] = useState(0);
  const [mode, setMode] = useState(0); // 0 = AI + self, 1 = our team
  useEffect(() => {
    const a = setInterval(() => setJob((j) => (j + 1) % JOBS.length), 5200);
    const b = setInterval(() => setMode((m) => 1 - m), 4000);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

  return (
    <div className="el-wrap grid lg:grid-cols-2 gap-12 items-center pt-12 md:pt-16">
      <style>{`
        .hl-photo{position:relative;border-radius:28px;overflow:hidden;aspect-ratio:1/1.05;animation:hl-bob var(--d,6s) ease-in-out var(--dl,0s) infinite alternate}
        @keyframes hl-bob{from{translate:0 -5px}to{translate:0 7px}}
        .hl-swap{position:absolute;inset:0;animation:hl-in .8s cubic-bezier(.2,.8,.2,1) both}
        @keyframes hl-in{from{opacity:0;transform:translateY(22px) scale(1.06)}to{opacity:1;transform:none}}
        .hl-swap img{width:100%;height:100%;object-fit:cover;display:block;filter:blur(11px) saturate(.8);animation:hl-unblur .9s ease 1.7s forwards}
        @keyframes hl-unblur{to{filter:blur(0) saturate(1)}}
        .hl-tag{position:absolute;left:12px;bottom:12px;max-width:calc(100% - 24px);background:#FFFDF6;border:1.5px solid #1A1A1A;border-radius:16px;padding:10px 18px}
        .hl-tag b{display:block;font-size:19px;font-weight:700;color:#111}
        .hl-tag span{font-size:14px;color:#5B6472}
        .hl-match{position:absolute;top:12px;left:12px;background:#0E2A4D;color:#fff;font-size:12px;font-weight:700;border-radius:999px;padding:6px 12px;animation:hl-pop .5s cubic-bezier(.3,1.6,.5,1) .5s both}
        @keyframes hl-pop{from{opacity:0;scale:.5}to{opacity:1;scale:1}}
        .hl-lock{position:absolute;top:12px;right:12px;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;border-radius:999px;padding:6px 12px}
        .hl-locked{background:#fff;color:#0E2A4D;animation:hl-gone .3s ease 1.6s forwards}
        .hl-open{background:#16A34A;color:#fff;opacity:0;animation:hl-pop .45s cubic-bezier(.3,1.6,.5,1) 1.7s both}
        @keyframes hl-gone{to{opacity:0;scale:.6}}

        .hl-ai{position:absolute;z-index:3;left:50%;top:-18px;translate:-50% 0;display:flex;align-items:center;gap:10px;background:#fff;border-radius:999px;padding:10px 18px;box-shadow:0 12px 28px -12px rgba(15,27,51,.35);font-size:13px;white-space:nowrap}
        .hl-ai i{width:8px;height:8px;border-radius:50%;background:#16A34A;animation:hl-ping 1.6s ease-out infinite}
        @keyframes hl-ping{0%{box-shadow:0 0 0 0 rgba(22,163,74,.6)}100%{box-shadow:0 0 0 9px rgba(22,163,74,0)}}
        .hl-ai b{color:#0F1B33}.hl-ai span{color:#6B7C93}
        .hl-job{display:inline-block;animation:hl-in .5s ease both}

        .hl-team{position:absolute;z-index:3;left:50%;bottom:-20px;translate:-50% 0;background:#0E2A4D;color:#fff;border-radius:999px;padding:6px;display:flex;font-size:12.5px;font-weight:700;box-shadow:0 14px 30px -12px rgba(15,27,51,.5)}
        .hl-team span{display:flex;align-items:center;gap:7px;padding:9px 16px;border-radius:999px;transition:background .4s,color .4s;color:#9FB4D0}
        .hl-team span.on{background:#F2A93B;color:#16233A}

        .hl-stage{position:relative;padding:22px 0}
        .hl-live{display:inline-flex;align-items:center;gap:8px}
        .hl-live i{width:6px;height:6px;border-radius:50%;background:#16A34A;animation:hl-ping 1.6s ease-out infinite}
        @media(max-width:480px){.hl-ai{font-size:11.5px;padding:8px 12px}.hl-team span{padding:8px 11px;font-size:11.5px}}
        @media(prefers-reduced-motion:reduce){.hl-photo,.hl-swap,.hl-match,.hl-open,.hl-ai i,.hl-live i{animation:none!important}.hl-swap img{filter:none;animation:none}.hl-open{opacity:1}.hl-locked{display:none}}
      `}</style>

      <div>
        <span className="el-badge"><span className="hl-live"><i /> Instant recruitment</span></span>
        <h1 className="el-h el-h1 mt-7">Hire qualified candidates the moment you post.</h1>
        <p className="mt-6 text-lg text-[#6B7C93] max-w-lg leading-relaxed">
          Add your job description and our AI matches it to candidates who are already qualified. You choose who to unlock and
          start talking to them today. Prefer a hands-off search? Our recruitment team can run the whole process for you.
        </p>
        <div className="flex flex-wrap gap-3 mt-9">
          <Link to="/register?as=employer" className="el-btn">Unlock candidates</Link>
          <Link to="/register?as=employer" className="el-btn3">Hire with our team</Link>
        </div>
        <div className="flex flex-wrap gap-3 mt-10">
          {[["34,250", "Qualified candidates"], ["340+", "Hiring companies"], ["6 days", "Median time to hire"]].map(([a, b]) => (
            <div key={b} className="el-pill"><b>{a}</b><span>{b}</span></div>
          ))}
        </div>
      </div>

      <div className="hl-stage">
        <div className="hl-ai" aria-live="off">
          <i />
          <b>AI matching</b>
          <span key={job} className="hl-job">{JOBS[job]} · 4 qualified found</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div style={{ "--d": "6s" }}><LiveCard slot={0} /></div>
            <div style={{ "--d": "7s", "--dl": ".4s" }}><LiveCard slot={2} /></div>
          </div>
          <div className="space-y-4 el-grid-off">
            <div style={{ "--d": "6.6s", "--dl": ".2s" }}><LiveCard slot={1} /></div>
            <div style={{ "--d": "5.8s", "--dl": ".6s" }}><LiveCard slot={3} /></div>
          </div>
        </div>

        <div className="hl-team" aria-hidden="true">
          <span className={mode === 0 ? "on" : ""}><FaLockOpen /> Unlock with AI</span>
          <span className={mode === 1 ? "on" : ""}><FaUserTie /> Our recruiters</span>
        </div>
      </div>
    </div>
  );
};

export default HeroLive;