import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:5001/api";

// ─── Icons (self-contained, matches your existing Icon style) ─────────────────
const MsgIcon = {
  send: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  reply: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  chevronLeft: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  spin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ animation: "spin 1s linear infinite" }}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0110 10" />
    </svg>
  ),
  inbox: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2.101a2 2 0 00-1.899 1.316L10.5 14.5h-1l-.5-1.184A2 2 0 007.1 12H5V5z" clipRule="evenodd" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  ),
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function getInitials(participant) {
  if (!participant) return "?";
  const name = participant.username || participant.email || "";
  return name.slice(0, 2).toUpperCase() || "?";
}

function getCategoryColor(category) {
  const map = {
    interview: { bg: "#e8f1fd", text: "#1a6edb" },
    alert: { bg: "#fef0e8", text: "#f26722" },
    job: { bg: "#f0fdf4", text: "#16a34a" },
    status_update: { bg: "#f0f0ff", text: "#6366f1" },
    reminder: { bg: "#fef9c3", text: "#854d0e" },
    system_notice: { bg: "#f4f6fb", text: "#5a5a72" },
    general: { bg: "#f4f6fb", text: "#5a5a72" },
  };
  return map[category] || map.general;
}

// ─── ConversationList ─────────────────────────────────────────────────────────
const ConversationList = ({ conversations, selectedId, onSelect, loading, onDelete }) => {
  if (loading) {
    return (
      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ height: 72, borderRadius: 12, background: "#f4f6fb", animation: "pulse 1.5s ease-in-out infinite" }} />
        ))}
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
        <div style={{ fontSize: 13, color: "#9090a8", fontWeight: 500 }}>No conversations yet</div>
        <div style={{ fontSize: 12, color: "#9090a8", marginTop: 4 }}>Messages from recruiters will appear here</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "8px 8px" }}>
      {conversations.map((conv) => {
        const isSelected = conv._id === selectedId;
        const hasUnread = conv.unreadCount > 0;
        const msg = conv.latestMessage;
        const other = conv.otherParticipant;
        const cat = getCategoryColor(msg?.category);

        return (
          <div
            key={conv._id}
            onClick={() => onSelect(conv)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "12px 10px",
              borderRadius: 12,
              cursor: "pointer",
              background: isSelected ? "#e8f1fd" : "transparent",
              border: isSelected ? "1px solid rgba(26,110,219,0.15)" : "1px solid transparent",
              transition: "all 0.15s",
              position: "relative",
            }}
            onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f4f6fb"; }}
            onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
          >
            {/* Avatar */}
            <div style={{
              width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg,#1a6edb,#6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600, color: "white",
            }}>
              {getInitials(other)}
            </div>

            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: hasUnread ? 600 : 500, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
                  {other?.username || other?.email || "Recruiter"}
                </span>
                <span style={{ fontSize: 11, color: "#9090a8", flexShrink: 0 }}>{timeAgo(conv.lastMessageAt)}</span>
              </div>

              {msg?.subject && (
                <div style={{ fontSize: 12, color: hasUnread ? "#1a1a2e" : "#5a5a72", fontWeight: hasUnread ? 500 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>
                  {msg.subject}
                </div>
              )}

              <div style={{ fontSize: 12, color: "#9090a8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {msg?.body || "No messages"}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                {msg?.category && msg.category !== "general" && (
                  <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: cat.bg, color: cat.text, fontWeight: 500 }}>
                    {msg.category.replace("_", " ")}
                  </span>
                )}
                {hasUnread && (
                  <span style={{ marginLeft: "auto", background: "#1a6edb", color: "#fff", fontSize: 10, padding: "2px 7px", borderRadius: 99, fontWeight: 600 }}>
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(conv._id); }}
              title="Delete conversation"
              style={{ position: "absolute", top: 8, right: 8, opacity: 0, background: "none", border: "none", cursor: "pointer", color: "#9090a8", padding: 2, borderRadius: 4, transition: "opacity 0.15s" }}
              className="conv-delete-btn"
            >
              {MsgIcon.trash}
            </button>
          </div>
        );
      })}
    </div>
  );
};

// ─── MessageBubble ─────────────────────────────────────────────────────────────
const MessageBubble = ({ msg, currentUserId, onDelete }) => {
  const isMine = String(msg.senderId?._id || msg.senderId) === String(currentUserId);
  const cat = getCategoryColor(msg.category);

  return (
    <div style={{ display: "flex", flexDirection: isMine ? "row-reverse" : "row", gap: 8, marginBottom: 16, alignItems: "flex-end" }}>
      {!isMine && (
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#1a6edb,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "white", flexShrink: 0 }}>
          {getInitials(msg.senderId)}
        </div>
      )}

     <div style={{ maxWidth: "85%", display: "flex", flexDirection: "column", gap: 3, alignItems: isMine ? "flex-end" : "flex-start" }}>
        {msg.subject && (
          <div style={{ fontSize: 11, fontWeight: 600, color: "#5a5a72", paddingLeft: isMine ? 0 : 4, paddingRight: isMine ? 4 : 0 }}>
            {msg.subject}
          </div>
        )}

        <div style={{
          padding: "10px 14px", borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isMine ? "#1a6edb" : "#fff",
          border: isMine ? "none" : "1px solid rgba(0,0,0,0.08)",
          fontSize: 13.5, lineHeight: 1.55,
          color: isMine ? "#fff" : "#1a1a2e",
          wordBreak: "break-word",
        }}>
          {msg.body}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: isMine ? 0 : 4 }}>
          {msg.category && msg.category !== "general" && (
            <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 99, background: cat.bg, color: cat.text, fontWeight: 500 }}>
              {msg.category.replace("_", " ")}
            </span>
          )}
          <span style={{ fontSize: 11, color: "#9090a8" }}>{timeAgo(msg.createdAt)}</span>

          <button
            onClick={() => onDelete(msg._id)}
            title="Delete message"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9090a8", padding: 2, borderRadius: 4, display: "flex", alignItems: "center", opacity: 0.6 }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
          >
            {MsgIcon.trash}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── ReplyBox ─────────────────────────────────────────────────────────────────
const ReplyBox = ({ onSend, sending }) => {
  const [body, setBody] = useState("");
  const textRef = useRef();

  const handleSend = () => {
    const trimmed = body.trim();
    if (!trimmed || sending) return;
    onSend(trimmed);
    setBody("");
  };

  return (
    <div style={{ padding: "10px 14px 14px", borderTop: "1px solid rgba(0,0,0,0.07)", background: "#fff" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
        <textarea
          ref={textRef}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Write a reply… (Enter to send, Shift+Enter for new line)"
          rows={1}
          style={{
            flex: 1, resize: "none", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 14,
            padding: "10px 14px", fontSize: 13.5, fontFamily: "inherit", color: "#1a1a2e",
            background: "#f8f9fc", outline: "none", lineHeight: 1.5, overflow: "hidden",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#1a6edb"}
          onBlur={(e) => e.target.style.borderColor = "rgba(0,0,0,0.12)"}
        />
        <button
          onClick={handleSend}
          disabled={!body.trim() || sending}
          style={{
            width: 40, height: 40, borderRadius: "50%", border: "none",
            background: body.trim() ? "#1a6edb" : "#e8edf5", color: body.trim() ? "#fff" : "#9090a8",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: body.trim() ? "pointer" : "not-allowed", flexShrink: 0,
            transition: "all 0.15s",
          }}
        >
          {sending ? MsgIcon.spin : MsgIcon.send}
        </button>
      </div>
    </div>
  );
};

// ─── ConversationView ──────────────────────────────────────────────────────────
const ConversationView = ({ conversationId, currentUserId, token, onBack, otherParticipant, onDeleteConversation }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const bottomRef = useRef();
  const containerRef = useRef();

  const fetchMessages = useCallback(async (p = 1, append = false) => {
    try {
      const { data } = await axios.get(
        `${API}/messages/conversations/${conversationId}?page=${p}&limit=30`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setTotal(data.total);
      setHasMore(data.total > p * 30);
      if (append) {
        setMessages((prev) => [...data.messages, ...prev]);
      } else {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, token]);

  // Mark as read
  const markRead = useCallback(async () => {
    try {
      await axios.put(
        `${API}/messages/conversations/${conversationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
    } catch (_) {}
  }, [conversationId, token]);

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    setPage(1);
    fetchMessages(1);
    markRead();
  }, [conversationId, fetchMessages, markRead]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (!loading && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async (body) => {
    setSending(true);
    try {
      await axios.post(
        `${API}/messages/conversations/${conversationId}/reply`,
        { body, channels: ["system"], category: "general" },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      await fetchMessages(1);
      await markRead();
    } catch (err) {
      console.error("Send failed:", err);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`${API}/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }, withCredentials: true
      });
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (err) {
      console.error("Delete message failed:", err);
    }
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchMessages(nextPage, true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
    <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(0,0,0,0.07)", background: "#fff", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
        <button
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#5a5a72", fontSize: 12.5, padding: "6px 8px", borderRadius: 8, fontFamily: "inherit" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#f4f6fb"}
          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
        >
          {MsgIcon.chevronLeft} Back
        </button>
        <div style={{ width: 1, height: 20, background: "rgba(0,0,0,0.1)" }} />
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1a6edb,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "white" }}>
          {getInitials(otherParticipant)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1a2e" }}>
            {otherParticipant?.username || otherParticipant?.email || "Recruiter"}
          </div>
          {otherParticipant?.role && (
            <div style={{ fontSize: 11, color: "#9090a8", textTransform: "capitalize" }}>{otherParticipant.role}</div>
          )}
        </div>
  <button
          onClick={() => onDeleteConversation(conversationId)}
          title="Delete conversation"
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)", background: "none", cursor: "pointer", color: "#ef4444", fontSize: 12, fontFamily: "inherit", flexShrink: 0 }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
        >
          {MsgIcon.trash} Delete
        </button>
      </div>

      {/* Messages */}
      <div ref={containerRef} style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 40, color: "#9090a8", fontSize: 13 }}>
            {MsgIcon.spin} &nbsp; Loading messages…
          </div>
        ) : (
          <>
            {hasMore && (
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <button
                  onClick={loadMore}
                  style={{ fontSize: 12, color: "#1a6edb", background: "none", border: "1px solid #1a6edb30", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Load earlier messages ({total - messages.length} more)
                </button>
              </div>
            )}

            {messages.length === 0 ? (
              <div style={{ textAlign: "center", paddingTop: 60, color: "#9090a8" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>💬</div>
                <div style={{ fontSize: 13 }}>No messages in this conversation yet.</div>
              </div>
            ) : (
              messages.map((msg) => (
                <MessageBubble
                  key={msg._id}
                  msg={msg}
                  currentUserId={currentUserId}
                  onDelete={handleDeleteMessage}
                />
              ))
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Reply box */}
      <ReplyBox onSend={handleSend} sending={sending} />
    </div>
  );
};

// ─── Main MessagesPage ────────────────────────────────────────────────────────
const MessagesPage = ({ token, userId, socket }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConv, setSelectedConv] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [totalUnread, setTotalUnread] = useState(0);

 const CATEGORIES = [
  { value: "", label: "All" },
  { value: "general", label: "General" },
  { value: "system_notice", label: "System Alert" },
];

  const fetchConversations = useCallback(async () => {
    if (!token) return;
    try {
      const params = categoryFilter ? `?category=${categoryFilter}` : "";
      const { data } = await axios.get(`${API}/messages/conversations${params}`, {
        headers: { Authorization: `Bearer ${token}` }, withCredentials: true
      });
      setConversations(data || []);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setLoading(false);
    }
  }, [token, categoryFilter]);

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${API}/messages/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }, withCredentials: true
      });
      setTotalUnread(data.count || 0);
    } catch (_) {}
  }, [token]);

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, [fetchConversations, fetchUnreadCount]);

  // Socket.io real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = () => {
      fetchConversations();
      fetchUnreadCount();
    };

    const handleUnreadCount = (data) => {
      setTotalUnread(data.count || 0);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_received", handleNewMessage);
    socket.on("unread_count", handleUnreadCount);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_received", handleNewMessage);
      socket.off("unread_count", handleUnreadCount);
    };
  }, [socket, fetchConversations, fetchUnreadCount]);

  const handleSelectConv = (conv) => {
    setSelectedConv(conv);
    // Optimistically clear unread badge
    setConversations((prev) =>
      prev.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c))
    );
    setTotalUnread((n) => Math.max(0, n - (conv.unreadCount || 0)));
  };

  const handleDeleteConversation = async (conversationId) => {
    if (!window.confirm("Delete this conversation?")) return;
    try {
      await axios.delete(`${API}/messages/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }, withCredentials: true
      });
      setConversations((prev) => prev.filter((c) => c._id !== conversationId));
      if (selectedConv?._id === conversationId) setSelectedConv(null);
    } catch (err) {
      console.error("Delete conversation failed:", err);
    }
  };

  return (
  <>
   <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      .conv-delete-btn { opacity: 0 !important; }
      div:hover > .conv-delete-btn { opacity: 1 !important; }

      .msg-outer { padding: 24px 28px; }
      .msg-hero { border-radius: 18px; padding: 28px 32px; margin-bottom: 20px; }
      .msg-hero h2 { font-size: 22px; }
      .msg-grid { display: grid; grid-template-columns: 260px 1fr; gap: 16px; }
      .msg-sidebar { background: #fff; border-radius: 16px; padding: 16px; border: 1px solid rgba(0,0,0,0.06); }
      .msg-panel { background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); padding: 20px; min-height: 400px; display: flex; flex-direction: column; }

      @media (max-width: 768px) {
        .msg-outer { padding: 16px; }
        .msg-hero { padding: 20px 18px; border-radius: 14px; }
        .msg-hero h2 { font-size: 17px; }
        .msg-hero p { font-size: 12px; }
        .msg-grid { grid-template-columns: 1fr; }
        .msg-sidebar { display: none; }
        .msg-sidebar.show { display: block; }
        .msg-panel { padding: 12px; min-height: 300px; }
        .conv-delete-btn { opacity: 0.4 !important; }
      }

      @media (max-width: 480px) {
        .msg-outer { padding: 12px; }
        .msg-hero { padding: 16px 14px; margin-bottom: 14px; }
      }
    `}</style>

    <div className="msg-outer">
      
      {/* ─── HERO BANNER ───────────────────────── */}
     <div
        className="msg-hero"
        style={{ background: "linear-gradient(135deg, #0f172a, #065f46)", color: "white" }}
      >
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>MESSAGES</div>
        <h2 style={{ margin: 0 }}>Recruiter conversations will feel cleaner here</h2>
        <p style={{ marginTop: 8, fontSize: 13, opacity: 0.8, maxWidth: 600 }}>
          This section is now designed as a quiet inbox area rather than a crowded placeholder.
          Once backend messaging is connected, conversations and updates will appear here naturally.
        </p>
      </div>

      {/* ─── MAIN CONTENT ───────────────────────── */}
     <div className="msg-grid">

        {/* ─── LEFT: INBOX CATEGORIES ───────── */}
        <div className="msg-sidebar">
          <div style={{ fontSize: 12, color: "#9090a8", marginBottom: 10 }}>INBOX</div>
          {CATEGORIES.slice(1).map((cat) => (
            <div
              key={cat.value}
              onClick={() => { setCategoryFilter(cat.value); setSelectedConv(null); }}
              style={{
                padding: "10px 12px", borderRadius: 10, marginBottom: 8,
                cursor: "pointer", fontSize: 13, fontWeight: 500,
                background: categoryFilter === cat.value ? "#101111" : "#f8fafc",
                color: categoryFilter === cat.value ? "#fff" : "#1a1a2e",
              }}
            >
              {cat.label}
            </div>
          ))}
        </div>

        {/* ─── RIGHT: CONTENT PANEL ───────── */}
      <div className="msg-panel">

          {/* IF NO CONVERSATION */}
        {!selectedConv ? (
  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    {/* Search */}
    <div style={{ padding: "0 0 12px", borderBottom: "1px solid rgba(0,0,0,0.07)", marginBottom: 8 }}>
      <input
        placeholder="Search messages…"
       style={{ width: "100%", padding: "9px 14px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", background: "#f8f9fc", display: "block" }}
      />
    </div>

    {/* Conversation list */}
    <div style={{ flex: 1, overflowY: "auto" }}>
      <ConversationList
        conversations={conversations}
        selectedId={selectedConv?._id}
        onSelect={handleSelectConv}
        loading={loading}
        onDelete={handleDeleteConversation}
      />
    </div>

  </div>
) : (
            <ConversationView
              key={selectedConv._id}
              conversationId={selectedConv._id}
              currentUserId={userId}
              token={token}
              onBack={() => setSelectedConv(null)}
              otherParticipant={selectedConv.otherParticipant}
              onDeleteConversation={handleDeleteConversation}
            />
          )}

        </div>
      </div>
    </div>
  </>
);
};

export default MessagesPage;