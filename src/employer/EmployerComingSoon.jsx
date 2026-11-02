import React from "react";
import { Link } from "react-router-dom";

const EmployerComingSoon = ({ title = "This page" }) => (
  <div className="ed-job ed-job-empty">
    <div>
      <h2 className="ed-sec">{title}</h2>
      <p>This section is coming soon.</p>
      <Link to="/employer/dashboard" className="ed-post">Back to dashboard</Link>
    </div>
  </div>
);

export default EmployerComingSoon;