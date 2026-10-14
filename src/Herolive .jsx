import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaLock, FaLockOpen, FaUserTie, FaArrowRight } from "react-icons/fa";
import portrait from "./assets/amsol-career-portrait.jpg";
import avatar3 from "./assets/avatar3.png";
import manPhoto from "./assets/cute-man.png";
import senegalPhoto from "./assets/jobsinsenegal.png";

const PEOPLE = [
  { src: portrait, name: "Amara", role: "Marketing manager", match: 96, bg: "#F6D9A8" },
  { src: manPhoto, name: "Kwame", role: "Sales lead", match: 93, bg: "#C9DBF7" },
  { src: senegalPhoto, name: "Fatou", role: "Finance analyst", match: 91, bg: "#F6D9A8" },
  { src: avatar3, name: "Zawadi", role: "HR business partner", match: 95, bg: "#C9DBF7" },
];

const JOBS = ["Marketing Manager", "Sales Lead", "Finance Analyst", "HR Business Partner"];

const FADE_MS = 1000;

// Keeps the previous value around briefly so the old and new can crossfade.
const useSwap = (value) => {
  const [state, setState] = useState({ cur: value, prev: null });
  useEffect(() => {
    if (value === state.cur) return;
    setState({ cur: value, prev: state.cur });
    const t = setTimeout(() => setState((s) => ({ ...s, prev: null })), FADE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return state;
};

const Face = ({ p, out }) => (
  <div className={`hx-face ${out ? "out" : "in"}`} style={{ background: p.bg }}>
    <img className="hx-img" src={p.src} alt={out ? "" : `${p.name}, ${p.role}`} />
    {!out && (
      <>
        {/* three blur layers fade out in sequence = gradual focus pull */}
        <img className="hx-img hx-b3" src={p.src} alt="" aria-hidden="true" />
        <img className="hx-img hx-b2" src={p.src} alt="" aria-hidden="true" />
        <img className="hx-img hx-b1" src={p.src} alt="" aria-hidden="true" />
      </>
    )}
    <span className="hx-glass hx-match"><i /> {p.match}% match</span>
    {!out && (
      <>
        <span className="hx-glass hx-lock hx-locked"><FaLock /> Locked</span>
        <span className="hx-glass hx-lock hx-open"><FaLockOpen /> Unlocked</span>
      </>
    )}
    <div className="hx-info"><b>{p.name}</b><span>{p.role}</span></div>
  </div>
);

// One card slot: every few seconds a new qualified candidate arrives, starts locked
// (blurred), then gently comes into focus and unlocks.
const LiveCard = ({ slot }) => {
  const [i, setI] = useState(slot);
  useEffect(() => {
    let t;
    const start = setTimeout(() => {
      t = setInterval(() => setI((v) => (v + 1) % PEOPLE.length), 5600);
    }, slot * 1100);
    return () => { clearTimeout(start); clearInterval(t); };
  }, [slot]);

  const { cur, prev } = useSwap(i);
  return (
    <div className="hx-card">
      {prev !== null && <Face key={`out-${prev}`} p={PEOPLE[prev]} out />}
      <Face key={`in-${cur}`} p={PEOPLE[cur]} />
    </div>
  );
};

const JobLabel = ({ index }) => {
  const { cur, prev } = useSwap(index);
  return (
    <span className="hx-jobs">
      {prev !== null && <span key={`o-${prev}`} className="hx-job out">{JOBS[prev]} · 4 qualified found</span>}
      <span key={`i-${cur}`} className="hx-job in">{JOBS[cur]} · 4 qualified found</span>
    </span>
  );
};

const HeroLive = () => {
  const [job, setJob] = useState(0);
  const [mode, setMode] = useState(0); // 0 = AI + self, 1 = our team
  useEffect(() => {
    const a = setInterval(() => setJob((j) => (j + 1) % JOBS.length), 5600);
    const b = setInterval(() => setMode((m) => 1 - m), 4000);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

  return (
    <section className="hx">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&display=swap');
        .hx{--navy:#0E2A4D;--ink:#16233A;--amber:#F2A93B;--amber-dk:#C98614;--blue:#1F5BFF;--blue-dk:#1648D6;--muted:#5F6F86;--line:#E4E9EF;
            --ease:cubic-bezier(.22,1,.36,1);--ease-io:cubic-bezier(.45,0,.25,1);
            position:relative;overflow:hidden;background:transparent;font-family:'Inter',system-ui,sans-serif;color:var(--ink)}
        .hx-wrap{position:relative;width:min(1240px,calc(100% - 48px));margin-inline:auto;display:grid;gap:64px;align-items:center;padding:72px 0 32px}
        @media(min-width:1024px){.hx-wrap{grid-template-columns:1.05fr .95fr;padding:96px 0 48px}}

        /* ── copy ── */
        .hx-badge{display:inline-flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--line);border-radius:999px;padding:7px 16px 7px 12px;
            font-size:12.5px;font-weight:600;letter-spacing:.04em;color:var(--navy);box-shadow:0 6px 18px -12px rgba(14,42,77,.35)}
        .hx-badge i{width:7px;height:7px;border-radius:50%;background:#16A34A;animation:hx-ping 1.8s ease-out infinite}
        @keyframes hx-ping{0%{box-shadow:0 0 0 0 rgba(22,163,74,.55)}100%{box-shadow:0 0 0 9px rgba(22,163,74,0)}}
        .hx-h1{font-family:'Fraunces',Georgia,serif;font-weight:500;font-size:clamp(36px,5.2vw,62px);line-height:1.06;letter-spacing:-.02em;color:var(--navy);margin:26px 0 0}
        .hx-h1 em{font-style:italic;font-weight:500;color:var(--amber-dk);position:relative;white-space:nowrap}
        .hx-h1 em::after{content:"";position:absolute;left:0;right:0;bottom:.04em;height:.12em;background:var(--amber);opacity:.35;border-radius:99px}
        .hx-lead{margin:26px 0 0;max-width:520px;font-size:17.5px;line-height:1.7;color:var(--muted)}
        .hx-cta{display:flex;flex-wrap:wrap;gap:14px;margin-top:38px}
        .hx-btn,.hx-btn2{display:inline-flex;align-items:center;gap:10px;padding:15px 28px;border-radius:999px;font-size:14.5px;font-weight:700;
            transition:transform .45s var(--ease),box-shadow .45s var(--ease),background-color .3s ease,color .3s ease,border-color .3s ease}
        .hx-btn{background:var(--blue);color:#fff;box-shadow:0 14px 28px -14px rgba(31,91,255,.75)}
        .hx-btn:hover{background:var(--blue-dk);color:#fff;transform:translateY(-2px);box-shadow:0 18px 32px -14px rgba(31,91,255,.85)}
        .hx-btn svg{font-size:11px;color:#fff;transition:transform .45s var(--ease)}.hx-btn:hover svg{transform:translateX(3px)}
        .hx-btn2{background:transparent;color:var(--navy);border:1.5px solid rgba(14,42,77,.25)}
        .hx-btn2:hover{background:var(--navy);color:#fff;border-color:var(--navy);transform:translateY(-2px)}
        .hx-stats{display:grid;grid-template-columns:repeat(3,auto);justify-content:start;margin-top:52px;padding-top:28px;border-top:1px solid rgba(14,42,77,.12)}
        .hx-stat{padding:0 30px}.hx-stat:first-child{padding-left:0}.hx-stat+.hx-stat{border-left:1px solid rgba(14,42,77,.12)}
        .hx-stat b{display:block;font-family:'Fraunces',Georgia,serif;font-size:30px;font-weight:600;color:var(--navy);letter-spacing:-.01em}
        .hx-stat span{display:block;margin-top:4px;font-size:12.5px;color:var(--muted)}

        /* ── stage ── */
        .hx-stage{position:relative;padding:30px 0;max-width:560px;width:100%;margin-inline:auto}
        .hx-grid{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:18px}
        .hx-col{display:grid;gap:18px;align-content:start}
        .hx-col.off{margin-top:38px}
        .hx-float{will-change:transform;animation:hx-bob var(--d,6s) cubic-bezier(.45,0,.55,1) var(--dl,0s) infinite alternate}
        @keyframes hx-bob{from{transform:translate3d(0,-5px,0)}to{transform:translate3d(0,7px,0)}}

        .hx-card{position:relative;border-radius:24px;overflow:hidden;aspect-ratio:4/5;border:1px solid rgba(255,255,255,.7);background:#E8EEF7;
            box-shadow:0 30px 50px -28px rgba(14,42,77,.55),0 2px 6px rgba(14,42,77,.08);transform:translateZ(0);isolation:isolate}
        .hx-face{position:absolute;inset:0;will-change:opacity;backface-visibility:hidden}
        .hx-face.in{animation:hx-face-in 1.1s var(--ease-io) both}
        .hx-face.out{animation:hx-face-out 1.1s var(--ease-io) both;pointer-events:none}
        @keyframes hx-face-in{from{opacity:0}to{opacity:1}}
        @keyframes hx-face-out{from{opacity:1}to{opacity:0}}
        .hx-face::after{content:"";position:absolute;inset:auto 0 0 0;height:52%;background:linear-gradient(to top,rgba(14,42,77,.82),rgba(14,42,77,0));pointer-events:none}
        .hx-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}

        /* Focus pull: heavy -> medium -> light blur layers fade out in sequence.
           Same size on every layer, so nothing zooms or pops. Opacity only. */
        .hx-b1,.hx-b2,.hx-b3{will-change:opacity}
        .hx-b3{filter:blur(3px) saturate(.92);animation:hx-focus 1.2s var(--ease-io) 2.1s both}
        .hx-b2{filter:blur(8px) saturate(.88);animation:hx-focus 1.2s var(--ease-io) 1.5s both}
        .hx-b1{filter:blur(16px) saturate(.85);animation:hx-focus 1.2s var(--ease-io) .9s both}
        @keyframes hx-focus{from{opacity:1}to{opacity:0}}

        .hx-info{position:absolute;z-index:2;left:16px;right:16px;bottom:14px;color:#fff}
        .hx-info b{display:block;font-size:18px;font-weight:600;letter-spacing:-.01em}
        .hx-info span{display:block;margin-top:2px;font-size:13px;color:rgba(255,255,255,.78)}
        .hx-glass{position:absolute;z-index:2;top:12px;display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;border-radius:999px;padding:6px 11px;
            background:rgba(255,255,255,.82);color:var(--navy);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:0 6px 14px -8px rgba(14,42,77,.5)}
        .hx-match{left:12px;animation:hx-pop .8s var(--ease) .5s both}
        .hx-match i{width:7px;height:7px;border-radius:50%;background:var(--amber)}
        .hx-lock{right:12px;transform-origin:right center}
        .hx-locked{animation:hx-pop .7s var(--ease) .5s both,hx-gone .7s var(--ease-io) 2s forwards}
        .hx-open{background:#16A34A;color:#fff;opacity:0;animation:hx-pop .9s var(--ease) 2.3s both}
        @keyframes hx-pop{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
        @keyframes hx-gone{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.9)}}

        .hx-ai{position:absolute;z-index:3;left:50%;top:0;transform:translateX(-50%);display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.92);backdrop-filter:blur(10px);
            border:1px solid var(--line);border-radius:999px;padding:10px 18px;box-shadow:0 16px 32px -16px rgba(14,42,77,.4);font-size:13px;white-space:nowrap}
        .hx-ai i{width:8px;height:8px;border-radius:50%;background:#16A34A;animation:hx-ping 1.8s ease-out infinite}
        .hx-ai b{color:var(--navy)}
        .hx-jobs{display:inline-grid;color:var(--muted)}
        .hx-job{grid-area:1/1;will-change:opacity,transform}
        .hx-job.in{animation:hx-job-in .8s var(--ease) both}
        .hx-job.out{animation:hx-job-out .6s ease both}
        @keyframes hx-job-in{from{opacity:0;transform:translate3d(0,8px,0)}to{opacity:1;transform:none}}
        @keyframes hx-job-out{from{opacity:1;transform:none}to{opacity:0;transform:translate3d(0,-8px,0)}}

        /* sliding toggle */
        .hx-team{position:absolute;z-index:3;left:50%;bottom:0;transform:translateX(-50%);background:var(--navy);border-radius:999px;padding:5px;
            display:grid;grid-template-columns:1fr 1fr;font-size:12.5px;font-weight:700;box-shadow:0 18px 34px -14px rgba(14,42,77,.6)}
        .hx-thumb{position:absolute;top:5px;bottom:5px;left:5px;width:calc((100% - 10px)/2);border-radius:999px;background:var(--amber);
            transition:transform .7s var(--ease);will-change:transform}
        .hx-team span.hx-opt{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:9px 16px;white-space:nowrap;color:#9FB4D0;transition:color .5s ease}
        .hx-team span.hx-opt.on{color:var(--ink)}

        @media(max-width:640px){.hx-stat{padding:0 16px}.hx-stat b{font-size:24px}.hx-lead{font-size:16px}}
        @media(max-width:480px){.hx-ai{font-size:11.5px;padding:8px 12px}.hx-team span.hx-opt{padding:8px 11px;font-size:11.5px}}
        @media(prefers-reduced-motion:reduce){
          .hx-float,.hx-face,.hx-match,.hx-open,.hx-ai i,.hx-badge i,.hx-job{animation:none!important}
          .hx-b1,.hx-b2,.hx-b3{display:none}.hx-open{opacity:1}.hx-locked{display:none}
          .hx-thumb{transition:none}
        }
      `}</style>

      <div className="hx-wrap">
        <div>
          <span className="hx-badge"><i /> Instant recruitment</span>
          <h1 className="hx-h1">Hire qualified candidates <em>the moment</em> you post.</h1>
          <p className="hx-lead">
            Add your job description and our AI matches it to candidates who are already qualified. You choose who to unlock and
            start talking to them today. Prefer a hands-off search? Our recruitment team can run the whole process for you.
          </p>
          <div className="hx-cta">
            <Link to="/register?as=employer" className="hx-btn">Unlock candidates <FaArrowRight /></Link>
            <Link to="/register?as=employer" className="hx-btn2">Hire with our team</Link>
          </div>
          <div className="hx-stats">
            {[["34,250", "Qualified candidates"], ["340+", "Hiring companies"], ["6 days", "Median time to hire"]].map(([a, b]) => (
              <div key={b} className="hx-stat"><b>{a}</b><span>{b}</span></div>
            ))}
          </div>
        </div>

        <div className="hx-stage">
          <div className="hx-ai" aria-live="off">
            <i />
            <b>AI matching</b>
            <JobLabel index={job} />
          </div>

          <div className="hx-grid" style={{ paddingTop: 34, paddingBottom: 34 }}>
            <div className="hx-col">
              <div className="hx-float" style={{ "--d": "6s" }}><LiveCard slot={0} /></div>
              <div className="hx-float" style={{ "--d": "7s", "--dl": ".4s" }}><LiveCard slot={2} /></div>
            </div>
            <div className="hx-col off">
              <div className="hx-float" style={{ "--d": "6.6s", "--dl": ".2s" }}><LiveCard slot={1} /></div>
              <div className="hx-float" style={{ "--d": "5.8s", "--dl": ".6s" }}><LiveCard slot={3} /></div>
            </div>
          </div>

          <div className="hx-team" aria-hidden="true">
            <i className="hx-thumb" style={{ transform: `translateX(${mode * 100}%)` }} />
            <span className={`hx-opt ${mode === 0 ? "on" : ""}`}><FaLockOpen /> Unlock with AI</span>
            <span className={`hx-opt ${mode === 1 ? "on" : ""}`}><FaUserTie /> Our recruiters</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroLive;