import { Icon } from "../shared/Icons";
import { GhostBtn, PrimaryBtn } from "../shared/ui";

const Step = ({ n, children }) => (
  <li style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "#4a5068", lineHeight: 1.55 }}>
    <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: "#e8f1fd", color: "#1a6edb", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>{n}</span>
    <span>{children}</span>
  </li>
);

const Feature = ({ accent, title, children, action }) => (
  <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderLeft: `4px solid ${accent}`, borderRadius: 12, padding: "14px 16px", background: "#fff" }}>
    <div style={{ fontSize: 14.5, fontWeight: 600, color: "#1a1a2e", marginBottom: 8 }}>{title}</div>
    {children}
    <div style={{ marginTop: 12 }}>{action}</div>
  </div>
);

export default function WhatsNewModal({ hasCv, onNav, onClose }) {
  const go = (page) => { onClose(); onNav(page); };

  return (
    <div className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="modal-sheet bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div style={{ background: "linear-gradient(135deg,#0F1523,#1a3a6e)", padding: "20px 24px", color: "#fff", position: "relative", flexShrink: 0 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", background: "#f26722", padding: "3px 9px", borderRadius: 99 }}>NEW</span>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 21, fontWeight: 600, marginTop: 10 }}>Get hired faster with your CV</div>
          <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>Two new tools to save you time and make your CV stronger.</div>
          <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 14, right: 14, color: "#fff", opacity: 0.7, cursor: "pointer" }}>{Icon.x}</button>
        </div>

        <div className="p-5 overflow-y-auto flex-1" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Feature accent="#1a6edb" title="Fill your profile from your CV"
            action={hasCv
              ? <PrimaryBtn onClick={() => go("profile")}>{Icon.sparkle} Auto-fill my profile</PrimaryBtn>
              : <PrimaryBtn onClick={() => go("cv")}>{Icon.upload} Upload my CV first</PrimaryBtn>}>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, padding: 0 }}>
              <Step n="1"><strong>Upload your CV</strong> on the Uploaded CV page{hasCv ? " (you've already done this)" : ""}.</Step>
              <Step n="2">We <strong>read it straight away</strong> and show everything we found: personal details, skills, work experience, education and qualifications.</Step>
              <Step n="3">Review, then press <strong>Apply to my profile</strong> once. Prefer typing? You can still <strong>fill manually</strong> any time.</Step>
            </ul>
          </Feature>

          <Feature accent="#7c3aed" title="Career Services: revamp your CV with AI"
            action={<PrimaryBtn onClick={() => go("career")}>{Icon.sparkle} Try Career Services</PrimaryBtn>}>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, padding: 0 }}>
              <Step n="1">Our AI reviews your <strong>uploaded CV</strong>: you get a score, what to fix and a stronger rewrite.</Step>
              <Step n="2">Choose from <strong>11 CV templates</strong>, edit the text, then download as <strong>PDF or Word</strong>.</Step>
              <Step n="3">Also try the <strong>AI career coach</strong> and quick tools: cover letter, interview prep and more. New <strong>Learn</strong> courses are there too.</Step>
            </ul>
          </Feature>
        </div>

        <div className="px-5 py-3 border-t border-[rgba(0,0,0,0.06)] flex justify-end flex-shrink-0">
          <GhostBtn onClick={onClose}>Maybe later</GhostBtn>
        </div>
      </div>
    </div>
  );
}
