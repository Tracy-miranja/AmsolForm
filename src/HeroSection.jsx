import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STEPS = [
  "Upload & update your CV",
  "Search & apply in one tap",
  "Track every application",
];

// Phase schedule (ms) inside each screen. Each screen lasts STEP_MS.
const PHASE_AT = [900, 1500, 3700, 5000, 6200];
const STEP_MS = 7800;

// Cursor position (left %, top %) per phase, per screen.
const CURSOR = [
  [[78, 78], [46, 50], [46, 50], [88, 66], [88, 66]],
  [[62, 18], [62, 18], [88, 40], [88, 40], [88, 40]],
  [[70, 78], [50, 58], [50, 36], [50, 36], [50, 36]],
];

const Cursor = ({ step, p }) => {
  const [x, y] = CURSOR[step][Math.min(p, 4)];
  return (
    <svg
      className="hf-cursor"
      style={{ left: `${x}%`, top: `${y}%`, transform: p === 4 && step !== 2 ? "scale(.85)" : "scale(1)" }}
      width="18" height="22" viewBox="0 0 18 22"
    >
      <path d="M2 1l13 10-6 1.3L12 19l-2.6 1.2L6.6 13.6 2 17z" fill="#0F1B33" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
};

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="7" fill="#16A34A" />
    <path d="M4 7.2l2 2L10 5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- Screen 1: profile + CV upload ---------- */
const ProfileScreen = ({ p }) => (
  <div className="hf-body">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="hf-avatar" />
        <div>
          <p className="hf-name">Amara Otieno</p>
          <p className="hf-sub">Product Designer · Nairobi</p>
        </div>
      </div>
      <span className="hf-pill-blue">Profile {p >= 4 ? "100%" : "70%"}</span>
    </div>

    <div className="flex flex-wrap gap-2 mt-4">
      {["Figma", "UX Research", "Prototyping", "Design Systems"].map((s) => (
        <span key={s} className="hf-skill">{s}</span>
      ))}
    </div>

    <div className="hf-drop mt-5">
      {p < 1 && <p className="hf-drop-t">Drop your CV here</p>}
      {p === 1 && <p className="hf-drop-t">Uploading Amara_CV_2026.pdf...</p>}
      {p >= 2 && (
        <p className="hf-drop-t flex items-center justify-center gap-2">
          <Check /> Saved <span className="font-medium text-slate-500">Amara_CV_2026.pdf</span>
        </p>
      )}
      <div className="hf-bar">
        <div
          className="hf-bar-fill"
          style={{ width: p >= 2 ? "100%" : p === 1 ? "100%" : "0%", transitionDuration: p === 1 ? "2.1s" : ".3s" }}
        />
      </div>
    </div>

    <div className="flex justify-end gap-2.5 mt-4">
      <button className="hf-btn-white" tabIndex={-1}>Replace CV</button>
      <button className="hf-btn-blue" tabIndex={-1} style={p === 4 ? { transform: "scale(.94)" } : null}>
        {p >= 4 ? "Profile updated" : "Update profile"}
      </button>
    </div>
  </div>
);

/* ---------- Screen 2: search & apply ---------- */
const JOBS = [
  { t: "Product Designer", c: "Lumen Pay", l: "Nairobi · Hybrid", m: "96%" },
  { t: "UX Researcher", c: "Surge", l: "Kampala · Remote", m: "91%" },
  { t: "Design Systems Lead", c: "Navitas", l: "Accra · On-site", m: "88%" },
];
const SearchScreen = ({ p }) => (
  <div className="hf-body">
    <div className="hf-search">
      <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="#6B7C93" strokeWidth="2" /><path d="M14 14l4 4" stroke="#6B7C93" strokeWidth="2" strokeLinecap="round" /></svg>
      <span className={p >= 1 ? "text-slate-900 font-semibold" : "text-slate-400"}>
        {p >= 1 ? "Product Designer" : "Job title or skill"}
      </span>
      <span className="hf-pill-blue ml-auto">Nairobi</span>
    </div>
    <div className="mt-3 space-y-2.5">
      {JOBS.map((j, i) => (
        <div key={j.t} className="hf-job" style={{ opacity: p >= 1 ? 1 : 0, transform: p >= 1 ? "none" : "translateY(8px)", transitionDelay: `${i * 120}ms` }}>
          <div className="hf-logo">{j.c[0]}</div>
          <div className="min-w-0">
            <p className="hf-name">{j.t}</p>
            <p className="hf-sub">{j.c} · {j.l}</p>
          </div>
          <span className="hf-fit">{j.m} fit</span>
          {i === 0 ? (
            <button className={p >= 3 ? "hf-btn-done" : "hf-btn-blue"} tabIndex={-1}>
              {p >= 3 ? "Applied ✓" : "Apply"}
            </button>
          ) : (
            <button className="hf-btn-white" tabIndex={-1}>Apply</button>
          )}
        </div>
      ))}
    </div>
  </div>
);

/* ---------- Screen 3: dashboard ---------- */
const STAGES = ["Submitted", "In review", "Interview", "Offer"];
const TrackScreen = ({ p }) => (
  <div className="hf-body">
    <div className="grid grid-cols-3 gap-2.5">
      {[["1", "Submitted"], ["0", "In review"], ["0", "Interviews"]].map(([n, l], i) => (
        <div key={l} className="hf-stat" style={i === 0 && p >= 1 ? { borderColor: "#1F5BFF", background: "#F1F6FF" } : null}>
          <p className="text-xl font-bold text-slate-900">{i === 0 ? (p >= 1 ? n : "0") : n}</p>
          <p className="hf-sub">{l}</p>
        </div>
      ))}
    </div>
    <div className="hf-job mt-3" style={{ opacity: p >= 1 ? 1 : 0, transition: "opacity .5s" }}>
      <div className="hf-logo">L</div>
      <div className="min-w-0">
        <p className="hf-name">Product Designer</p>
        <p className="hf-sub">Lumen Pay · Applied just now</p>
      </div>
      <span className="hf-status">Submitted</span>
    </div>
    <div className="hf-track mt-5">
      {STAGES.map((s, i) => (
        <div key={s} className="hf-stage">
          <span className={`hf-dot ${i === 0 && p >= 1 ? "on" : ""} ${i === 1 && p >= 3 ? "pulse" : ""}`} />
          <span className="hf-stage-l">{s}</span>
        </div>
      ))}
      <div className="hf-track-line"><div style={{ width: p >= 1 ? "0%" : "0%" }} /></div>
    </div>
    <p className="hf-sub mt-4">We'll notify you the moment the employer opens your application.</p>
  </div>
);

const SCREENS = [ProfileScreen, SearchScreen, TrackScreen];
const CHIPS = [
  { tl: ["New match", "Product Designer · 96% fit"], br: ["Offer accepted 🎉", "Backend Engineer · Lumen Pay"] },
  { tl: ["Saved search", "12 new roles in Nairobi"], br: ["Applied in one tap", "Product Designer · Lumen Pay"] },
  { tl: ["Application sent", "Product Designer · Lumen Pay"], br: ["Interview invite 📅", "Thursday · 10:00 AM"] },
];

const HeroSection = () => {
  const [step, setStep] = useState(0);
  const [p, setP] = useState(0);

  useEffect(() => {
    setP(0);
    const timers = PHASE_AT.map((ms, i) => setTimeout(() => setP(i + 1 > 4 ? 4 : i + 1), ms));
    timers.push(setTimeout(() => setStep((s) => (s + 1) % 3), STEP_MS));
    return () => timers.forEach(clearTimeout);
  }, [step]);

  const Screen = SCREENS[step];

  return (
    <div className="amsol-container mt-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        .hf-hero{position:relative;font-family:'Inter',sans-serif;color:#0F1B33;background:transparent}
        .hf-badge{display:inline-flex;align-items:center;gap:8px;background:#D3E2FA;color:#1F5BFF;font-weight:700;font-size:11.5px;letter-spacing:.14em;padding:10px 16px;border-radius:999px;text-transform:uppercase}
        .hf-badge i{width:5px;height:5px;border-radius:50%;background:#1F5BFF}
        .hf-h1{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(40px,5.2vw,68px);line-height:1.06;letter-spacing:-.025em;color:#0F1B33}
        .hf-fits{position:relative;color:#1F5BFF;display:inline-block}
        .hf-fits svg{position:absolute;left:0;bottom:-6px;width:100%;height:10px}
        .hf-lead{color:#6B7C93;font-size:19px;line-height:1.55;max-width:440px}
        .hf-cta{background:#1F5BFF;color:#fff;font-weight:600;font-size:15px;padding:16px 28px;border-radius:999px;transition:background .2s}
        .hf-cta:hover{background:#1749D1}
        .hf-cta2{background:#fff;color:#0F1B33;font-weight:600;font-size:15px;padding:16px 28px;border-radius:999px;border:1px solid #E1E8F2}
        .hf-statpill{background:#fff;border-radius:999px;padding:14px 24px;box-shadow:0 6px 18px -10px rgba(31,91,255,.25)}
        .hf-statpill b{display:block;font-size:17px;font-weight:700}
        .hf-statpill span{font-size:12px;color:#6B7C93}

        .hf-label{display:flex;align-items:center;gap:12px;font-weight:600;font-size:17px}
        .hf-num{width:36px;height:36px;border-radius:50%;background:#1F5BFF;color:#fff;font-size:13px;font-weight:700;display:grid;place-items:center}
        .hf-label-t{animation:hfFade .5s ease both}
        .hf-dots{display:flex;gap:6px;align-items:center}
        .hf-dots button{width:8px;height:8px;border-radius:99px;background:#B7CBF3;transition:all .3s}
        .hf-dots button.on{width:24px;background:#1F5BFF}

        .hf-stage-wrap{position:relative;perspective:1400px;height:440px}
        .hf-under{position:absolute;left:0;right:0;top:0;height:100%;border-radius:28px;background:#fff}
        .hf-under.u1{transform:translateY(14px) scale(.975);opacity:.75;box-shadow:0 10px 24px -14px rgba(15,27,51,.25)}
        .hf-under.u2{transform:translateY(26px) scale(.95);opacity:.5}
        .hf-card{position:absolute;inset:0;background:#fff;border-radius:28px;box-shadow:0 30px 60px -28px rgba(15,27,51,.35);overflow:hidden;
          transform-origin:50% 0;animation:hfFlip .85s cubic-bezier(.2,.8,.2,1) both}
        .hf-chrome{display:flex;align-items:center;gap:7px;padding:14px 18px;background:#F1F5FA;border-bottom:1px solid #E7EDF5}
        .hf-chrome i{width:11px;height:11px;border-radius:50%}
        .hf-url{margin-left:14px;background:#fff;border-radius:99px;padding:3px 14px;font-size:11px;color:#6B7C93}
        .hf-body{padding:26px 26px 20px;height:calc(100% - 46px);position:relative}
        .hf-avatar{width:48px;height:48px;border-radius:50%;background:#DDE9FB}
        .hf-name{font-weight:700;font-size:14.5px;color:#0F1B33;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .hf-sub{font-size:12.5px;color:#6B7C93}
        .hf-pill-blue{background:#DDE9FB;color:#1F5BFF;font-weight:600;font-size:12px;padding:6px 14px;border-radius:999px;transition:all .3s}
        .hf-skill{background:#E6EFFC;color:#2A3B55;font-size:12px;font-weight:500;padding:7px 14px;border-radius:999px}
        .hf-drop{border:2px dashed #1F5BFF;border-radius:20px;background:#F4F8FF;padding:30px 24px;text-align:center}
        .hf-drop-t{font-weight:700;font-size:14.5px}
        .hf-bar{height:5px;border-radius:99px;background:#DCE6F5;width:56%;margin:14px auto 0;overflow:hidden}
        .hf-bar-fill{height:100%;background:#1F5BFF;border-radius:99px;transition-property:width;transition-timing-function:linear}
        .hf-btn-white,.hf-btn-blue,.hf-btn-done{font-weight:600;font-size:12.5px;padding:9px 18px;border-radius:999px;transition:all .25s;white-space:nowrap}
        .hf-btn-white{background:#fff;border:1px solid #DDE5F0;color:#0F1B33}
        .hf-btn-blue{background:#1F5BFF;color:#fff}
        .hf-btn-done{background:#DCFCE7;color:#166534}
        .hf-search{display:flex;align-items:center;gap:10px;border:1px solid #DDE5F0;background:#F7FAFE;border-radius:999px;padding:12px 16px;font-size:13.5px}
        .hf-job{display:flex;align-items:center;gap:12px;border:1px solid #E7EDF5;border-radius:16px;padding:12px 14px;transition:all .5s ease}
        .hf-job>div:nth-child(2){flex:1}
        .hf-logo{width:38px;height:38px;border-radius:12px;background:#DDE9FB;color:#1F5BFF;font-weight:700;display:grid;place-items:center;flex-shrink:0}
        .hf-fit{font-size:11.5px;font-weight:600;color:#1F5BFF;background:#E6EFFC;padding:4px 10px;border-radius:99px;white-space:nowrap}
        .hf-stat{border:1px solid #E7EDF5;border-radius:16px;padding:14px;transition:all .4s}
        .hf-status{font-size:12px;font-weight:600;color:#1F5BFF;background:#DDE9FB;padding:6px 12px;border-radius:99px}
        .hf-track{position:relative;display:flex;justify-content:space-between}
        .hf-stage{display:flex;flex-direction:column;align-items:center;gap:8px;z-index:1;flex:1}
        .hf-stage-l{font-size:11.5px;color:#6B7C93;font-weight:500}
        .hf-dot{width:14px;height:14px;border-radius:50%;background:#fff;border:3px solid #CBD8EC;transition:all .4s}
        .hf-dot.on{background:#1F5BFF;border-color:#1F5BFF}
        .hf-dot.pulse{border-color:#1F5BFF;animation:hfPulse 1.4s infinite}
        .hf-track-line{position:absolute;left:12.5%;right:12.5%;top:6px;height:2px;background:#DCE6F5}
        .hf-cursor{position:absolute;z-index:5;transition:left .9s cubic-bezier(.4,.1,.2,1),top .9s cubic-bezier(.4,.1,.2,1),transform .2s;filter:drop-shadow(0 2px 3px rgba(0,0,0,.2));pointer-events:none}
        .hf-chip{position:absolute;z-index:6;background:#fff;border:1px solid #E7EDF5;border-radius:22px;padding:12px 20px;box-shadow:0 14px 30px -14px rgba(15,27,51,.3);animation:hfFade .6s .5s ease both}
        .hf-chip small{display:block;font-size:12px;color:#6B7C93}
        .hf-chip b{font-size:14px;font-weight:700}

        @keyframes hfFlip{0%{transform:rotateX(-88deg) translateY(-14px);opacity:0}35%{opacity:1}100%{transform:rotateX(0) translateY(0);opacity:1}}
        @keyframes hfFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes hfPulse{0%,100%{box-shadow:0 0 0 0 rgba(31,91,255,.35)}50%{box-shadow:0 0 0 6px rgba(31,91,255,0)}}
        @media (max-width:767px){
          .hf-hero{border-radius:28px}
          .hf-lead{font-size:16px}
          .hf-stage-wrap{height:420px}
          .hf-chip{padding:9px 14px}
        }
        @media (prefers-reduced-motion:reduce){.hf-card,.hf-chip,.hf-label-t{animation:none}.hf-cursor{transition:none}}
      `}</style>

      <div className="hf-hero">
        <div className="grid lg:grid-cols-2 gap-14 items-center px-6 md:px-12 py-12 md:py-14">
          {/* LEFT */}
          <div>
            <span className="hf-badge"><i /> Now matching 40k+ roles</span>
            <h1 className="hf-h1 mt-7">
              Find the work that{" "}
              <span className="hf-fits">
                fits
                <svg viewBox="0 0 120 10" preserveAspectRatio="none" fill="none">
                  <path d="M2 7 Q 30 0 60 5 T 118 4" stroke="#F59E0B" strokeWidth="2.6" strokeLinecap="round" />
                </svg>
              </span>
              , at the pace that works.
            </h1>
            <p className="hf-lead mt-6">
              One place where ambitious candidates and thoughtful companies meet — matched by skill, not just keywords.
            </p>
            <div className="flex flex-wrap gap-3 mt-9">
              <Link to="/register?as=jobseeker" className="hf-cta">Sign up as a candidate</Link>
              <Link to="/auth" className="hf-cta2">I'm hiring →</Link>
            </div>
            <div className="flex flex-wrap gap-3 mt-10">
              {[["40k+", "Open roles matched"], ["92%", "Response rate"], ["6 days", "Median time to hire"]].map(([a, b]) => (
                <div key={b} className="hf-statpill"><b>{a}</b><span>{b}</span></div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="hf-label" key={step}>
                <span className="hf-num">0{step + 1}</span>
                <span className="hf-label-t">{STEPS[step]}</span>
              </div>
              <div className="hf-dots">
                {STEPS.map((s, i) => (
                  <button key={s} aria-label={s} className={i === step ? "on" : ""} onClick={() => setStep(i)} />
                ))}
              </div>
            </div>

            <div className="hf-stage-wrap">
              <div className="hf-under u2" />
              <div className="hf-under u1" />
              <div className="hf-card" key={step}>
                <div className="hf-chrome">
                  <i style={{ background: "#EF4444" }} />
                  <i style={{ background: "#F59E0B" }} />
                  <i style={{ background: "#7FA3F5" }} />
                  <span className="hf-url">hirefield.app/{["profile", "jobs", "applications"][step]}</span>
                </div>
                <Screen p={p} />
                <Cursor step={step} p={p} />
              </div>
              <div className="hf-chip" key={`tl${step}`} style={{ top: 46, left: -32 }}>
                <small>{CHIPS[step].tl[0]}</small><b>{CHIPS[step].tl[1]}</b>
              </div>
              <div className="hf-chip" key={`br${step}`} style={{ bottom: -6, right: 14 }}>
                <small>{CHIPS[step].br[0]}</small><b>{CHIPS[step].br[1]}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;