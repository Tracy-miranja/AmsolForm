import React from "react";
import { FaBriefcase, FaUserPlus, FaUserCheck, FaClipboardCheck } from "react-icons/fa";

const StatsOverview = ({ stats = {}, loading }) => {
  const items = [
    { label: "Active Jobs", value: stats.activeJobs, icon: FaBriefcase, tone: "#1F5BFF", bg: "#E6EFFC" },
    { label: "New Applicants", value: stats.newApplicants, icon: FaUserPlus, tone: "#7C5CD6", bg: "#EEE9FB" },
    { label: "Shortlisted Reviewed", value: stats.shortlistedReviewed, icon: FaClipboardCheck, tone: "#16A34A", bg: "#DDF4E6" },
    { label: "Candidates Shortlisted", value: stats.candidatesShortlisted, icon: FaUserCheck, tone: "#F2A93B", bg: "#FDF0DA" },
  ];

  return (
    <section>
      <h2 className="ed-sec">Overview</h2>
      <div className="ed-stats">
        {items.map(({ label, value, icon: Icon, tone, bg }) => (
          <div key={label} className="ed-stat">
            <i style={{ background: bg, color: tone }}><Icon /></i>
            <div><b>{loading ? "—" : value ?? 0}</b><span>{label}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsOverview;