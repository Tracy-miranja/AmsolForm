import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { getSession } from "./employerAuth";

const TITLES = [
  ["/employer/dashboard", "Dashboard"], ["/employer/notifications", "Notifications"], ["/employer/chat", "Chat"],
  ["/employer/post-job", "Post a Job"], ["/employer/jobs", "My Job Posts"], ["/employer/find-talent", "Find Talent"],
  ["/employer/applicants", "Applicants"], ["/employer/interviews", "Interviews"],
  ["/employer/profile", "My Profile"], ["/employer/billing", "Billing"],
];

const EmployerNavbar = ({ onMenu }) => {
  const { pathname } = useLocation();
  const title = pathname.endsWith("/edit") ? "Edit Job" : TITLES.find(([p]) => pathname.startsWith(p))?.[1] || "Employer";
  const first = (getSession()?.name || "").split(" ")[0];

  return (
    <header className="ed-top">
      <div className="ed-top-l">
        <button className="ed-menu" onClick={onMenu} aria-label="Open menu"><FaBars /></button>
        <div>
          <h1 className="ed-h">{title}</h1>
          {pathname === "/employer/dashboard" && <p>Welcome back{first ? `, ${first}` : ""}.</p>}
        </div>
      </div>
      <Link to="/employer/post-job" className="ed-post">Post a Job</Link>
    </header>
  );
};

export default EmployerNavbar;