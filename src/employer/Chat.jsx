import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosInstance";
import ConversationList from "./components/ConversationList";
import ChatThread from "./components/ChatThread";

const Chat = () => {
  const [convs, setConvs] = useState(null);
  const [active, setActive] = useState(null);

  const load = useCallback(() => api.get("/api/employer/chat/conversations")
    .then(({ data }) => setConvs(data)).catch(() => setConvs((c) => c || [])), []);

  useEffect(() => {
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [load]);

  const current = convs?.find((c) => c.profileId === active);

  return (
    <>
      <div className="ep-head"><div><h2>Chat</h2><p>Message candidates you've unlocked. They get your message by email and can reply to you directly.</p></div></div>

      {convs && convs.length === 0 ? (
        <div className="ep-card ep-center">
          <p className="ep-sub">You can message candidates once you unlock them.</p>
          <Link to="/employer/find-talent" className="ep-btn amber">Find talent</Link>
        </div>
      ) : (
        <div className={`ep-chat ${active ? "open" : ""}`}>
          <ConversationList convs={convs} active={active} onPick={setActive} />
          {current
            ? <ChatThread key={current.profileId} conv={current} onSent={load} onBack={() => setActive(null)} />
            : <div className="ep-thread ep-thread-empty"><p className="ep-sub">Select a candidate to start a conversation.</p></div>}
        </div>
      )}
    </>
  );
};

export default Chat;