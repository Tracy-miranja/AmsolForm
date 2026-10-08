import React, { useEffect, useRef, useState } from "react";
import { FaWhatsapp, FaFileExcel, FaRegEnvelope, FaRegCalendarAlt } from "react-icons/fa";

/* ------------------------------------------------------------------
   Hiring problem section
   Left: headline + pain points.  Right: a "scattered hiring tools" stage
   made of animated cards (emails, WhatsApp, Candidates.xlsx, pipeline,
   schedule-interview form) wired together by flowing dashed lines.
   Uses the page's existing .el-wrap / .el-sec / .el-h classes.
------------------------------------------------------------------- */

const useTick = (start, max, ms, step = 1) => {
  const [n, setN] = useState(start);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setN((v) => (v + step > max ? start : v + step)), ms);
    return () => clearInterval(t);
  }, [start, max, ms, step]);
  return n;
};

const TOASTS = [
  "Candidate accepted another offer",
  "Follow-up missed: no reply sent",
  "Duplicate CV found in 3 places",
  "Interview not scheduled yet",
];

const HiringProblemSection = () => {
  const stageRef = useRef(null);
  const [seen, setSeen] = useState(false);
  const [toast, setToast] = useState(0);
  const emails = useTick(23, 99, 2200);
  const chats = useTick(37, 120, 1500, 2);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setToast((i) => (i + 1) % TOASTS.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="problem" className="el-sec pb-sec">
      <style>{`
        .pb-sec{background:#F6F8FB;overflow:hidden}
        .pb-grid{display:grid;gap:56px;align-items:center}
        @media(min-width:1024px){.pb-grid{grid-template-columns:1fr 1.15fr}}
        .pb-h{font-size:clamp(36px,4.6vw,60px);line-height:1.04;font-weight:700}
        .pb-hl{color:#2E9FA6}
        .pb-p{color:#5F6F85;font-size:17px;line-height:1.7;max-width:480px;margin-top:24px}
        .pb-note{display:flex;gap:14px;align-items:center;background:#fff;border:1px solid #E4EAF2;border-radius:16px;padding:18px 20px;max-width:360px;margin-top:28px;box-shadow:0 8px 24px -16px rgba(15,27,51,.2)}
        .pb-note i{display:grid;place-items:center;width:38px;height:38px;border-radius:10px;background:#E3F3F4;color:#2E9FA6;flex-shrink:0}
        .pb-note b{font-size:15px;color:#0F1B33;line-height:1.35}
        .pb-stats{display:grid;grid-template-columns:1fr 1fr;max-width:380px;margin-top:24px;background:#fff;border:1px solid #E4EAF2;border-radius:16px;overflow:hidden}
        .pb-stats div{padding:20px}
        .pb-stats div+div{border-left:1px solid #E4EAF2}
        .pb-stats b{display:block;font-family:'Space Grotesk',sans-serif;font-size:26px;color:#0F1B33}
        .pb-stats span{display:block;margin-top:6px;font-size:13px;color:#7A8799;line-height:1.45}

        /* ---------- stage ---------- */
        .pb-stage{position:relative;height:540px;width:100%;max-width:640px;margin-inline:auto}
        .pb-wires{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
        .pb-wires path{fill:none;stroke:#9DB8D6;stroke-width:1.5;stroke-dasharray:5 7;animation:pb-flow 1.6s linear infinite;opacity:.8}
        .pb-wires path:nth-child(even){animation-direction:reverse}
        @keyframes pb-flow{to{stroke-dashoffset:-48}}

        .pb-card{position:absolute;background:#fff;border-radius:14px;box-shadow:0 14px 34px -14px rgba(15,27,51,.28),0 1px 0 #EEF2F7;padding:14px 16px;opacity:0;transform:translateY(26px) scale(.96)}
        .pb-stage.in .pb-card{animation:pb-in .7s cubic-bezier(.2,.8,.2,1) forwards,pb-float var(--d,6s) ease-in-out var(--delay,0s) infinite alternate}
        @keyframes pb-in{to{opacity:1;transform:none}}
        @keyframes pb-float{from{translate:0 -6px}to{translate:var(--dx,4px) 8px}}

        .pb-row{display:flex;align-items:center;gap:12px}
        .pb-ico{display:grid;place-items:center;width:34px;height:34px;border-radius:9px;flex-shrink:0;font-size:17px}
        .pb-t{font-size:13px;font-weight:700;color:#0F1B33;line-height:1.2}
        .pb-s{font-size:11.5px;color:#8A97A8;margin-top:3px}
        .pb-badge{margin-left:auto;min-width:28px;text-align:center;color:#fff;font-size:11px;font-weight:700;border-radius:999px;padding:4px 9px}
        .pb-ping{position:relative}
        .pb-ping::after{content:"";position:absolute;inset:0;border-radius:inherit;background:inherit;animation:pb-pulse 1.8s ease-out infinite;z-index:-1}
        @keyframes pb-pulse{from{transform:scale(1);opacity:.55}to{transform:scale(1.9);opacity:0}}

        /* positions */
        .c-mail{top:0;right:0;width:262px;--d:5.2s;--delay:.2s}
        .c-sched{top:64px;left:0;width:290px;--d:6.4s;--dx:-3px;--delay:.6s}
        .c-pipe{top:118px;right:0;width:300px;--d:7s;--delay:1s}
        .c-wa{top:352px;right:18px;width:290px;--d:5.6s;--dx:-5px;--delay:.4s}
        .c-xls{top:372px;left:10px;width:236px;--d:6.8s;--delay:.9s}
        .c-toast{top:470px;left:50%;margin-left:-130px;width:260px}

        /* mini schedule form */
        .pb-lab{font-size:10.5px;font-weight:600;color:#5F6F85;margin:12px 0 5px}
        .pb-inp{border:1px solid #E1E8F2;border-radius:8px;padding:8px 10px;font-size:12px;color:#8A97A8;display:flex;justify-content:space-between;align-items:center}
        .pb-caret{width:1.5px;height:13px;background:#5B4BF0;animation:pb-blink 1s steps(1) infinite}
        @keyframes pb-blink{50%{opacity:0}}
        .pb-sbtn{margin-top:14px;display:flex;align-items:center;justify-content:center;gap:7px;background:#5B4BF0;color:#fff;font-size:12px;font-weight:700;border-radius:8px;padding:9px;opacity:.55;animation:pb-wait 2.4s ease-in-out infinite}
        @keyframes pb-wait{50%{opacity:.9}}
        .pb-stuck{position:absolute;top:-12px;right:12px;background:#FDECEC;color:#C62828;font-size:10.5px;font-weight:700;border-radius:999px;padding:4px 10px;animation:pb-wobble 3s ease-in-out infinite}
        @keyframes pb-wobble{0%,100%{rotate:0deg}25%{rotate:-3deg}75%{rotate:3deg}}

        /* mini pipeline */
        .pb-cols{display:flex;gap:10px;margin-top:12px;position:relative}
        .pb-col{flex:1;background:#F6F8FB;border-radius:10px;padding:8px;min-height:104px}
        .pb-col h6{display:flex;justify-content:space-between;font-size:10.5px;font-weight:700;color:#0F1B33;margin-bottom:7px}
        .pb-chip{background:#fff;border:1px solid #E7EDF5;border-radius:8px;padding:6px 8px;font-size:10.5px;font-weight:700;color:#0F1B33;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .pb-chip small{display:block;font-weight:500;color:#8A97A8;font-size:9.5px}
        .pb-chip.go{animation:pb-slide 5s ease-in-out infinite}
        @keyframes pb-slide{0%,15%{transform:translateX(0);opacity:1}55%{transform:translateX(calc(100% + 10px));opacity:1}80%,100%{transform:translateX(calc(100% + 10px));opacity:0}}
        .pb-chip.buried{animation:pb-bury 5s ease-in-out infinite}
        @keyframes pb-bury{0%,50%{opacity:1}75%,100%{opacity:.35}}

        /* xlsx */
        .pb-xl{margin-top:11px;display:grid;gap:5px}
        .pb-xl span{display:block;height:6px;border-radius:3px;background:#E6ECF3}
        .pb-xl span:nth-child(2){width:78%}.pb-xl span:nth-child(3){width:55%}
        .pb-xl .hot{background:#F6D98F;animation:pb-cell 2.6s ease-in-out infinite}
        @keyframes pb-cell{50%{background:#F2A93B;width:90%}}
        .pb-editors{display:flex;margin-top:10px}
        .pb-editors b{width:20px;height:20px;border-radius:50%;border:2px solid #fff;margin-left:-6px;font-size:9px;color:#fff;display:grid;place-items:center}
        .pb-editors b:first-child{margin-left:0}
        .pb-editors em{margin-left:8px;font-style:normal;font-size:10.5px;color:#8A97A8;align-self:center}

        /* toast */
        .c-toast{opacity:0;background:#0E2A4D;color:#fff;border-radius:12px;padding:11px 14px;font-size:12.5px;font-weight:600;display:flex;gap:10px;align-items:center}
        .pb-stage.in .c-toast{animation:pb-in .7s .9s forwards}
        .c-toast span{animation:pb-toast 3.2s ease both;display:block}
        .c-toast i{width:8px;height:8px;border-radius:50%;background:#F2A93B;flex-shrink:0}
        @keyframes pb-toast{0%{opacity:0;transform:translateY(8px)}12%,85%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-6px)}}

        /* mobile: stack cards in a grid instead of absolute layout */
        @media(max-width:1023px){
          .pb-stage{height:auto;display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:none}
          .pb-wires{display:none}
          .pb-card{position:relative;inset:auto;width:auto!important;margin:0!important}
          .c-toast{grid-column:1/-1}
        }
        @media(max-width:600px){.pb-stage{grid-template-columns:1fr}}
        @media(prefers-reduced-motion:reduce){
          .pb-stage .pb-card,.pb-stage .c-toast{animation:none!important;opacity:1;transform:none}
          .pb-wires path,.pb-chip,.pb-sbtn,.pb-stuck,.pb-ping::after,.pb-caret,.pb-xl .hot,.c-toast span{animation:none!important}
        }
      `}</style>

      <div className="el-wrap pb-grid">
        {/* ---------- LEFT ---------- */}
        <div>
          <h2 className="el-h pb-h">
            Top candidates don't wait for <span className="pb-hl">slow hiring processes</span>
          </h2>
          <p className="pb-p">
            When hiring is spread across emails, spreadsheets and WhatsApp groups, follow-ups get missed, decisions take
            longer, and top candidates accept other offers before your team can respond.
          </p>

          <div className="pb-note">
            <i><FaRegEnvelope /></i>
            <b>Great candidates drop off while you're still searching your inbox.</b>
          </div>

          <div className="pb-stats">
            <div><b>3 weeks</b><span>Average time hiring teams spend screening CVs manually per role</span></div>
            <div><b>1 in 3</b><span>Hires go wrong because of a rushed decision under admin pressure</span></div>
          </div>
        </div>

        {/* ---------- RIGHT: animated cards ---------- */}
        <div ref={stageRef} className={`pb-stage ${seen ? "in" : ""}`} aria-hidden="true">
          <svg className="pb-wires" viewBox="0 0 640 540" preserveAspectRatio="none">
            <path d="M520 64 C 520 90, 500 100, 490 130" />
            <path d="M290 190 C 320 190, 330 200, 350 205" />
            <path d="M150 330 C 150 350, 140 360, 130 380" />
            <path d="M470 305 C 470 325, 480 335, 480 355" />
            <path d="M246 420 C 280 420, 300 400, 340 392" />
          </svg>

          {/* Recruitment emails */}
          <div className="pb-card c-mail">
            <div className="pb-row">
              <span className="pb-ico" style={{ background: "#FDECEA", color: "#D93025", fontWeight: 800, fontFamily: "Arial" }}>M</span>
              <div><p className="pb-t">Recruitment Emails</p><p className="pb-s">{emails} unread</p></div>
              <span className="pb-badge pb-ping" style={{ background: "#EF4444" }}>{emails}</span>
            </div>
          </div>

          {/* Schedule interview (not filled in) */}
          <div className="pb-card c-sched">
            <span className="pb-stuck">Still not scheduled</span>
            <p className="pb-t" style={{ fontSize: 14 }}>Schedule interview</p>
            <p className="pb-s">Francis Wasonga • BRANCH MANAGER</p>
            <p className="pb-lab">Date &amp; time</p>
            <div className="pb-inp"><span>dd/mm/yyyy --:--</span><i className="pb-caret" /></div>
            <p className="pb-lab">Interviewer</p>
            <div className="pb-inp"><span style={{ color: "#16233A" }}>Recruiter</span></div>
            <div className="pb-sbtn"><FaRegCalendarAlt /> Schedule &amp; invite</div>
          </div>

          {/* Pipeline */}
          <div className="pb-card c-pipe">
            <div className="pb-row" style={{ justifyContent: "space-between" }}>
              <p className="pb-t" style={{ fontSize: 14 }}>Recruitment Pipeline</p>
              <p className="pb-s" style={{ margin: 0 }}>34,472 candidates</p>
            </div>
            <div className="pb-cols">
              <div className="pb-col">
                <h6>Applied <span style={{ color: "#8A97A8" }}>34,121</span></h6>
                <div className="pb-chip buried">David Ngai<small>Spares Warehouse Coord.</small></div>
                <div className="pb-chip go">Josphine Maina<small>Operations Coord.</small></div>
              </div>
              <div className="pb-col">
                <h6>Under Review <span style={{ color: "#1F5BFF" }}>347</span></h6>
                <div className="pb-chip">Francis Wasonga<small>BRANCH MANAGER</small></div>
                <div className="pb-chip">Euster Anyula<small>BRANCH MANAGER</small></div>
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="pb-card c-wa">
            <div className="pb-row">
              <span className="pb-ico" style={{ background: "#E7F8EE", color: "#25D366", fontSize: 20 }}><FaWhatsapp /></span>
              <div><p className="pb-t">Hiring Team WhatsApp Group</p><p className="pb-s">{chats} unread</p></div>
              <span className="pb-badge pb-ping" style={{ background: "#25D366" }}>{chats}</span>
            </div>
          </div>

          {/* Candidates.xlsx */}
          <div className="pb-card c-xls">
            <div className="pb-row">
              <span className="pb-ico" style={{ background: "#E7F5EC", color: "#1E8E4E" }}><FaFileExcel /></span>
              <p className="pb-t">Candidates.xlsx</p>
            </div>
            <div className="pb-xl"><span /><span className="hot" /><span /></div>
            <div className="pb-editors">
              <b style={{ background: "#F2A93B" }}>A</b><b style={{ background: "#7C5CD6" }}>K</b><b style={{ background: "#1F5BFF" }}>F</b>
              <em>3 people editing</em>
            </div>
          </div>

          {/* Rotating missed-follow-up toast */}
          <div className="pb-card c-toast">
            <i />
            <span key={toast}>{TOASTS[toast]}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HiringProblemSection;