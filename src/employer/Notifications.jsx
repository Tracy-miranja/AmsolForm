import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserPlus, FaCalendarAlt, FaWallet } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../../api/axiosInstance";

const ICON = { applicant: FaUserPlus, interview: FaCalendarAlt, wallet: FaWallet, payment: FaWallet };

const ago = (d) => {
  const s = Math.max(1, Math.round((Date.now() - new Date(d).getTime()) / 1000));
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)} d ago`;
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const Notifications = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(null);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    api.get("/api/employer/notifications").then(({ data }) => setItems(data))
      .catch(() => { setItems([]); toast.error("Could not load notifications."); });
  }, []);

  const mark = async (body) => {
    try { await api.post("/api/employer/notifications/read", body); } catch { /* badge will resync */ }
    window.dispatchEvent(new Event("employer:badges"));
  };
  const open = async (n) => {
    if (!n.read) { setItems((l) => l.map((x) => (x.id === n.id ? { ...x, read: true } : x))); mark({ ids: [n.id] }); }
    if (n.link) navigate(n.link);
  };
  const markAll = () => { setItems((l) => l.map((x) => ({ ...x, read: true }))); mark({ all: true }); };

  const unread = (items || []).filter((n) => !n.read).length;
  const shown = (items || []).filter((n) => tab === "all" || !n.read);

  return (
    <>
      <div className="ep-head">
        <div><h2>Notifications</h2><p>New applicants, upcoming interviews, payments and wallet alerts.</p></div>
        {unread > 0 && <button className="ep-btn sm ghost" onClick={markAll}>Mark all as read</button>}
      </div>

      <div className="ep-tabs">
        <button className={`ed-tab ${tab === "all" ? "on" : ""}`} onClick={() => setTab("all")}>All</button>
        <button className={`ed-tab ${tab === "unread" ? "on" : ""}`} onClick={() => setTab("unread")}>Unread {unread || ""}</button>
      </div>

      {items === null && <div className="ed-empty">Loading…</div>}
      {items && shown.length === 0 && <div className="ep-card ep-center"><FaBell size={22} /><p className="ep-sub">{tab === "unread" ? "You're all caught up." : "No notifications yet."}</p></div>}

      {shown.map((n) => {
        const Icon = ICON[n.type] || FaBell;
        return (
          <article key={n.id} className={`ep-notif ${n.read ? "" : "unread"}`} onClick={() => open(n)}>
            <span className="ep-notif-i"><Icon /></span>
            <div><b>{n.title}</b>{n.body && <p>{n.body}</p>}</div>
            <small>{ago(n.at)}</small>
          </article>
        );
      })}
    </>
  );s
};

export default Notifications;