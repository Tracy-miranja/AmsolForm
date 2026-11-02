import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../../../api/axiosInstance";
import { fmtDate, fmtTime } from "../employerUtils";

const ChatThread = ({ conv, onSent, onBack }) => {
  const [msgs, setMsgs] = useState(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef(null);

  const load = useCallback(() => api.get(`/api/employer/chat/${conv.profileId}/messages`)
    .then(({ data }) => setMsgs(data)).catch(() => setMsgs((m) => m || [])), [conv.profileId]);

  useEffect(() => {
    load();
    const t = setInterval(load, 6000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [msgs?.length]);

  const send = async () => {
    const body = text.trim();
    if (!body || busy) return;
    setBusy(true);
    try {
      const { data } = await api.post(`/api/employer/chat/${conv.profileId}/messages`, { text: body });
      setMsgs((m) => [...(m || []), data]);
      setText("");
      onSent();
    } catch (e) { toast.error(e.response?.data?.message || "Could not send the message."); }
    finally { setBusy(false); }
  };

  return (
    <section className="ep-thread">
      <header>
        <button className="ep-x ep-back" onClick={onBack} aria-label="Back"><FaArrowLeft /></button>
        <div><b>{conv.name}</b><small>{conv.headline}</small></div>
      </header>

      <div className="ep-msgs">
        {msgs === null && <div className="ed-empty">Loading…</div>}
        {msgs?.length === 0 && <div className="ed-empty">Say hello to {conv.name.split(" ")[0]}. They'll get your message by email.</div>}
        {msgs?.map((m) => (
          <div key={m.id} className={`ep-msg ${m.sender}`}>
            <p>{m.text}</p><small>{fmtDate(m.at)}, {fmtTime(m.at)}</small>
          </div>
        ))}
        <div ref={end} />
      </div>

      <div className="ep-compose">
        <textarea className="ep-in" rows={2} value={text} maxLength={2000} placeholder="Write a message…"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button className="ep-btn amber" disabled={busy || !text.trim()} onClick={send}>Send</button>
      </div>
    </section>
  );
};

export default ChatThread;