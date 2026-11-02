// CareerServices.jsx — drop next to DashboardHome.jsx
// Optional image overrides (real photos/illustrations):
//   <CareerServices images={{ hero: "/img/coach.png", linkedin: "/img/li.png", cv: "/img/cv.png", psychometric: "/img/test.png", advisor: "/img/advisor.png" }} />

const BLUE = "#1a6edb", NAVY = "#0f2f6b", ORANGE = "#f26722", INK = "#1a1a2e", MUTED = "#6b6b82", LINE = "rgba(0,0,0,0.08)";

const css = `
.cs-grid { display:grid; grid-template-columns:1.25fr 1fr 1fr; grid-template-rows:1fr 1fr; gap:16px; }
.cs-hero { grid-row:1 / span 2; background:${NAVY}; border-radius:22px; position:relative; overflow:hidden; color:#fff; padding:28px 28px 0; display:flex; flex-direction:column; min-height:440px; }
.cs-art { position:relative; flex:1 1 0; min-height:190px; margin:8px -28px 0; }
.cs-art > svg, .cs-art > img { position:absolute; inset:0; width:100%; height:100%; }
.cs-card { background:#fff; border:1px solid ${LINE}; border-radius:22px; padding:12px 12px 20px; display:flex; flex-direction:column; transition:border-color .18s; min-width:0; }
.cs-card:hover { border-color:rgba(26,110,219,.4); }
.cs-band { border-radius:14px; height:118px; position:relative; flex-shrink:0; }
.cs-band > svg, .cs-band > img { position:absolute; inset:0; width:100%; height:100%; }
.cs-body { padding:0 10px; display:flex; flex-direction:column; flex:1; }
.cs-ghost { margin-top:auto; align-self:flex-start; display:inline-flex; align-items:center; gap:8px; padding:10px 18px; border-radius:999px; border:1px solid ${LINE}; background:#fff; color:${INK}; font-size:13px; font-weight:600; cursor:pointer; }
.cs-ghost:hover { border-color:${ORANGE}; }
.cs-ghost:focus-visible, .cs-book:focus-visible { outline:3px solid #9cc2ff; outline-offset:2px; }
.cs-book { align-self:flex-start; display:inline-flex; align-items:center; gap:8px; padding:13px 22px; border-radius:999px; border:none; background:${ORANGE}; color:#fff; font-size:14px; font-weight:700; cursor:pointer; }
.cs-book:hover { background:#dd5815; }
@media (min-width:1700px){ .cs-hero{min-height:520px} }
@media (max-width:1100px){ .cs-grid{grid-template-columns:1fr 1fr} .cs-hero{grid-column:1 / span 2; grid-row:auto} .cs-art{min-height:240px} }
@media (max-width:640px){ .cs-grid{grid-template-columns:1fr} .cs-hero{grid-column:auto; padding:22px 22px 0} .cs-art{margin:8px -22px 0} }
`;

const Arrow = () => (
  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12M11 5l5 5-5 5" /></svg>
);

/* ---------- Hero illustration: coach + candidate, scales to the card ---------- */
const InterviewArt = () => (
  <svg viewBox="0 0 440 240" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <circle cx="70" cy="70" r="6" fill="#4f8df0" opacity=".5" />
    <circle cx="392" cy="150" r="9" fill="#4f8df0" opacity=".35" />
    <rect x="18" y="60" width="44" height="60" rx="6" fill="#1a4a9e" />
    <path d="M40 60v60M18 90h44" stroke="#0f2f6b" strokeWidth="3" />
    <g transform="translate(70 0)">
      <circle cx="165" cy="136" r="104" fill="#1a4a9e" />
      <circle cx="250" cy="58" r="22" fill="#f26722" />
      {/* coach */}
      <rect x="48" y="110" width="64" height="70" rx="26" fill="#f26722" />
      <circle cx="80" cy="84" r="20" fill="#f1c4a0" />
      <path d="M60 82a20 20 0 0 1 40 0q-20-10-40 0z" fill="#2a1a14" />
      {/* candidate */}
      <rect x="186" y="116" width="62" height="64" rx="26" fill="#e8f1fd" />
      <circle cx="217" cy="92" r="19" fill="#b97d55" />
      <path d="M198 90a19 19 0 0 1 38 0q-19 8-38 0z" fill="#1c1210" />
      {/* bubbles */}
      <rect x="34" y="28" width="84" height="38" rx="12" fill="#fff" />
      <path d="M62 66l8 12 8-12z" fill="#fff" />
      <rect x="46" y="39" width="46" height="5" rx="2.5" fill="#c9d4e8" />
      <rect x="46" y="50" width="32" height="5" rx="2.5" fill="#c9d4e8" />
      <rect x="168" y="36" width="70" height="34" rx="12" fill="#4f8df0" />
      <path d="M196 70l6 11 6-11z" fill="#4f8df0" />
      <path d="M190 53l7 7 14-15" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* table */}
      <rect x="22" y="176" width="256" height="12" rx="4" fill="#f3e3c8" />
      <rect x="52" y="188" width="8" height="52" fill="#d9c6a4" />
      <rect x="240" y="188" width="8" height="52" fill="#d9c6a4" />
      <rect x="130" y="152" width="34" height="26" rx="4" fill="#fff" />
      <rect x="137" y="159" width="20" height="3" rx="1.5" fill="#c9d4e8" />
      <rect x="137" y="166" width="14" height="3" rx="1.5" fill="#c9d4e8" />
    </g>
  </svg>
);

/* ---------- Card illustrations (viewBox 300x118, centred, bg set by band) ---------- */
const LinkedInArt = () => (
  <svg viewBox="0 0 300 118" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x="64" y="14" width="172" height="92" rx="10" fill="#fff" />
    <path d="M64 24a10 10 0 0 1 10-10h152a10 10 0 0 1 10 10v16H64z" fill={BLUE} />
    <circle cx="96" cy="46" r="17" fill="#f1c4a0" stroke="#fff" strokeWidth="4" />
    <path d="M80 42a16 16 0 0 1 32 0q-16-8-32 0z" fill="#2a1a14" />
    <rect x="120" y="50" width="70" height="7" rx="3.5" fill={INK} opacity=".85" />
    <rect x="120" y="62" width="96" height="5" rx="2.5" fill="#c9d4e8" />
    <rect x="78" y="80" width="40" height="13" rx="6.5" fill="#e8f1fd" />
    <rect x="124" y="80" width="48" height="13" rx="6.5" fill="#e8f1fd" />
    <rect x="178" y="80" width="40" height="13" rx="6.5" fill="#e8f1fd" />
    <circle cx="232" cy="22" r="14" fill="#fff" stroke={BLUE} strokeWidth="2" />
    <text x="232" y="27" textAnchor="middle" fontSize="13" fontWeight="700" fill={BLUE} fontFamily="DM Sans, sans-serif">in</text>
  </svg>
);

const CvArt = () => (
  <svg viewBox="0 0 300 118" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x="86" y="10" width="108" height="100" rx="8" fill="#fff" />
    <rect x="100" y="23" width="44" height="8" rx="4" fill={INK} opacity=".85" />
    <rect x="100" y="39" width="80" height="4" rx="2" fill="#c9d4e8" />
    <rect x="97" y="49" width="86" height="10" rx="3" fill="#ffd9c2" />
    <rect x="100" y="52" width="70" height="4" rx="2" fill={ORANGE} />
    <rect x="100" y="66" width="80" height="4" rx="2" fill="#c9d4e8" />
    <rect x="100" y="76" width="64" height="4" rx="2" fill="#c9d4e8" />
    <rect x="100" y="86" width="76" height="4" rx="2" fill="#c9d4e8" />
    <circle cx="228" cy="52" r="24" fill="#fff" />
    <circle cx="228" cy="52" r="18" fill="none" stroke="#ffe0cc" strokeWidth="6" />
    <circle cx="228" cy="52" r="18" fill="none" stroke={ORANGE} strokeWidth="6" strokeLinecap="round" strokeDasharray="104 113" transform="rotate(-90 228 52)" />
    <text x="228" y="57" textAnchor="middle" fontSize="14" fontWeight="700" fill={INK} fontFamily="DM Sans, sans-serif">92</text>
    <circle cx="192" cy="14" r="11" fill="#16a34a" />
    <path d="M186.5 14l4 4 7-8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TestArt = () => (
  <svg viewBox="0 0 300 118" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x="54" y="12" width="110" height="94" rx="8" fill="#fff" />
    {[32, 54, 76].map((y, i) => (
      <g key={y}>
        <circle cx="72" cy={y} r="6" fill={i === 1 ? NAVY : "#fff"} stroke={NAVY} strokeWidth="2" />
        <rect x="86" y={y - 3} width={[60, 48, 56][i]} height="6" rx="3" fill="#c9d4e8" />
      </g>
    ))}
    <rect x="94" y="88" width="52" height="10" rx="5" fill={ORANGE} />
    <rect x="178" y="22" width="76" height="76" rx="10" fill={NAVY} />
    <rect x="190" y="62" width="11" height="22" rx="2" fill="#4f8df0" />
    <rect x="207" y="48" width="11" height="36" rx="2" fill="#4f8df0" />
    <rect x="224" y="38" width="11" height="46" rx="2" fill={ORANGE} />
    <path d="M190 86h54" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />
  </svg>
);

const AdvisorArt = () => (
  <svg viewBox="0 0 300 118" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <circle cx="48" cy="38" r="15" fill="#f1c4a0" />
    <path d="M33 35a15 15 0 0 1 30 0q-15-8-30 0z" fill="#2a1a14" />
    <rect x="70" y="16" width="136" height="40" rx="13" fill="#fff" />
    <rect x="84" y="28" width="86" height="6" rx="3" fill="#c9d4e8" />
    <rect x="84" y="40" width="56" height="6" rx="3" fill="#c9d4e8" />
    <rect x="94" y="66" width="136" height="38" rx="13" fill={BLUE} />
    <rect x="108" y="78" width="88" height="6" rx="3" fill="#fff" opacity=".9" />
    <rect x="108" y="90" width="52" height="6" rx="3" fill="#fff" opacity=".6" />
    <circle cx="254" cy="86" r="15" fill="#b97d55" />
    <path d="M239 83a15 15 0 0 1 30 0q-15 8-30 0z" fill="#1c1210" />
  </svg>
);

const SERVICES = [
  { id: "linkedin", key: "linkedin", title: "LinkedIn Profile Revamp", desc: "Keyword-optimised headline, about section and experience, built to attract recruiters.", cta: "Revamp my profile", bg: "#e8f1fd", Art: LinkedInArt },
  { id: "cv", key: "cv", title: "CV Revamp", desc: "An ATS-friendly rewrite of your CV that highlights impact, not just duties.", cta: "Revamp my CV", bg: "#fff0e6", Art: CvArt },
  { id: "psychometric", key: "psychometric", title: "Psychometric Test Practice", desc: "Aptitude and personality tests with a full scored report and improvement tips.", cta: "Start practice test", bg: "#e8edf7", Art: TestArt },
  { id: "advisor", key: "advisor", title: "Not sure where to start?", desc: "Chat with a career advisor and build your plan.", cta: "Talk to an advisor", bg: "#eaf1fb", Art: AdvisorArt, soft: true },
];

const Check = () => (
  <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,.14)", display: "grid", placeItems: "center", flexShrink: 0 }}>
    <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 10.5l3.2 3.2L15 6.8" /></svg>
  </span>
);

export default function CareerServices({ onSelect, onSeeAll, images = {} }) {
  const pick = id => onSelect && onSelect(id);
  return (
    <section style={{ marginTop: 40 }}>
      <style>{css}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16, gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 650, margin: 0, letterSpacing: "-0.01em" }}>Career Growth: get hired faster</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: MUTED }}>Expert help at every step of your job search, delivered by AMSOL career coaches.</p>
        </div>
        <button onClick={onSeeAll} style={{ background: "none", border: "none", color: BLUE, fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>Explore all services</button>
      </div>

      <div className="cs-grid">
        <div className="cs-hero">
          <span style={{ alignSelf: "flex-end", background: ORANGE, color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 999 }}>Most booked</span>
          <h3 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "6px 0 0", lineHeight: 1.15 }}>One-on-One Interview Coaching</h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.85, margin: "12px 0 0", maxWidth: 420 }}>
            Practice with a real coach before the real panel. Walk into your next interview prepared and ready to negotiate.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "18px 0 0", display: "grid", gap: 10, fontSize: 13.5 }}>
            {["Live mock interview with a real coach", "Instant feedback on answers and body language", "Recorded session and a personalised action plan"].map(t => (
              <li key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}><Check />{t}</li>
            ))}
          </ul>
          <button className="cs-book" style={{ marginTop: 24 }} onClick={() => pick("interview")}>Book a session <Arrow /></button>
          <div className="cs-art">
            {images.hero ? <img src={images.hero} alt="" style={{ objectFit: "contain", objectPosition: "center bottom" }} /> : <InterviewArt />}
          </div>
        </div>

        {SERVICES.map(({ id, key, title, desc, cta, bg, Art, soft }) => (
          <div className="cs-card" key={id}>
            <div className="cs-band" style={{ background: bg }}>
              {images[key] ? <img src={images[key]} alt="" style={{ objectFit: "cover", borderRadius: 14 }} /> : <Art />}
            </div>
            <div className="cs-body">
              <div style={{ fontSize: 15.5, fontWeight: 650, marginTop: 16 }}>{title}</div>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.55, margin: "8px 0 16px" }}>{desc}</p>
              <button className="cs-ghost" style={soft ? { background: "#e8edf7", border: "none" } : undefined} onClick={() => pick(id)}>
                {cta} <span style={{ color: soft ? INK : ORANGE, display: "flex" }}><Arrow /></span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}