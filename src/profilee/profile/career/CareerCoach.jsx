import { useEffect, useRef, useState } from "react";
import { Icon } from "../shared/Icons";
import { askCoach, errMsg } from "./careerApi";

const STARTERS = [
  "Help me decide my next career move",
  "How do I prepare for an interview next week?",
  "I've been unemployed for a while. What should I do?",
  "How do I ask for a higher salary?",
];

export default function CareerCoach({ context }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text) => {
    const t = (text ?? input).trim();
    if (!t || loading) return;
    const next = [...messages, { role: "user", content: t }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);
    try {
      const reply = await askCoach(next, context);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 520 }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingRight: 4 }}>
        {messages.length === 0 && (
          <div>
            <p style={{ fontSize: 13.5, color: "#5a5a72", marginBottom: 12 }}>
              Hi! I'm your AI career coach. Ask me anything about jobs, CVs, interviews or career choices.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {STARTERS.map((s) => (
                <button key={s} onClick={() => send(s)}
                  style={{ fontSize: 12.5, padding: "7px 12px", borderRadius: 99, border: "1px solid rgba(26,110,219,0.3)", background: "#f0f5ff", color: "#1a6edb", cursor: "pointer" }}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%",
            background: m.role === "user" ? "#1a6edb" : "#f4f6fb", color: m.role === "user" ? "#fff" : "#1a1a2e",
            padding: "10px 14px", borderRadius: 14, fontSize: 13.5, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {m.content}
          </div>
        ))}
        {loading && <div style={{ alignSelf: "flex-start", color: "#9090a8", fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>{Icon.spin} Thinking…</div>}
        {error && <div style={{ color: "#dc2626", fontSize: 13 }}>{error}</div>}
        <div ref={endRef} />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input type="text" value={input} placeholder="Type your question…" maxLength={2000}
          onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
        <button onClick={() => send()} disabled={loading || !input.trim()}
          className="flex-shrink-0 px-5 py-2 bg-[#1a6edb] text-white rounded-lg text-sm font-medium hover:bg-[#0d4fa3] disabled:opacity-50 transition">Send</button>
      </div>
      <p style={{ fontSize: 11, color: "#9090a8", marginTop: 8 }}>AI advice is a guide, not a guarantee. Double-check important decisions.</p>
    </div>
  );
}
