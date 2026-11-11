import { useState } from "react";

export default function CopyButton({ text, label = "Copy" }) {
  const [ok, setOk] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1800); } catch { /* clipboard blocked */ }
  };
  return (
    <button type="button" onClick={copy}
      style={{ fontSize: 11.5, padding: "3px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,0.13)", background: "#fff", color: ok ? "#16a34a" : "#5a5a72", cursor: "pointer" }}>
      {ok ? "Copied ✓" : label}
    </button>
  );
}
