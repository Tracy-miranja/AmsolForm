import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  FaThLarge, FaBell, FaCommentDots, FaPlusCircle, FaListUl, FaUsers, FaCalendarAlt, FaSearch,
  FaUserCircle, FaCreditCard, FaSignOutAlt, FaRegBuilding,
} from "react-icons/fa";
import api from "../../api/axiosInstance";
import { clearSession, getSession } from "./employerAuth";
import logo from "../assets/Amsollogo.png";

const NAV = [
  { group: "Overview", items: [
    { to: "/employer/dashboard", label: "Dashboard", icon: FaThLarge, end: true },
    { to: "/employer/notifications", label: "Notifications", icon: FaBell, badge: "notifications" },
    { to: "/employer/chat", label: "Chat", icon: FaCommentDots, badge: "messages" },
  ]},
  { group: "Manage Hirings", items: [
    { to: "/employer/post-job", label: "Post a Job", icon: FaPlusCircle },
    { to: "/employer/jobs", label: "My Job Posts", icon: FaListUl },
    { to: "/employer/find-talent", label: "Find Talent", icon: FaSearch },
    { to: "/employer/applicants", label: "Applicants", icon: FaUsers },
    { to: "/employer/interviews", label: "Interviews", icon: FaCalendarAlt },
  ]},
  { group: "Settings", items: [
    { to: "/employer/profile", label: "My Profile", icon: FaUserCircle },
    { to: "/employer/billing", label: "Billing", icon: FaCreditCard },
  ]},
];

const EmployerSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(getSession()?.name || "Employer account");
  const [badges, setBadges] = useState({ notifications: 0, messages: 0 });

  useEffect(() => {
    let alive = true;
    const pull = () => api.get("/api/employer/notifications/summary").then(({ data }) => alive && setBadges(data)).catch(() => {});
    const rename = () => setName(getSession()?.name || "Employer account");
    pull();
    const t = setInterval(pull, 60000);
    window.addEventListener("employer:badges", pull);
    window.addEventListener("employer:session", rename);
    return () => { alive = false; clearInterval(t); window.removeEventListener("employer:badges", pull); window.removeEventListener("employer:session", rename); };
  }, []);

  const logout = async () => {
    try { await api.post("/api/auth/logout"); } catch { /* clear locally anyway */ }
    Cookies.remove("token");
    clearSession();
    localStorage.removeItem("accessToken");
    navigate("/auth", { replace: true });
  };

  return (
    <aside className={`ed-side ${open ? "open" : ""}`}>
      <Link to="/" className="ed-brand"><img src={logo} alt="Amsol" /></Link>
      <div className="ed-co"><FaRegBuilding /> <span>{name}</span></div>

      {NAV.map((g) => (
        <div key={g.group}>
          <p className="ed-grp">{g.group}</p>
          <nav className="ed-nav">
            {g.items.map(({ to, label, icon: Icon, end, badge }) => (
              <NavLink key={to} to={to} end={end} onClick={onClose}
                className={({ isActive }) => `ed-link ${isActive ? "active" : ""}`}>
                <Icon /> {label}
                {badge && badges[badge] > 0 && <span className="ed-badge">{badges[badge] > 99 ? "99+" : badges[badge]}</span>}
              </NavLink>
            ))}
            {g.group === "Settings" && (
              <button className="ed-link" onClick={logout}><FaSignOutAlt /> Logout</button>
            )}
          </nav>
        </div>
      ))}

      <div className="ed-side-foot"><Link to="/contact">Need help?</Link></div>
    </aside>
  );
};

export default EmployerSidebar;