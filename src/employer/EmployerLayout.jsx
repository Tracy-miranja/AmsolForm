import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import EmployerSidebar from "./EmployerSidebar";
import EmployerNavbar from "./EmployerNavbar";
import "./employer.css";
import "./employerPages.css";
import "./employerExtra.css";

const EmployerLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="ed">
      {menuOpen && <div className="ed-scrim" onClick={() => setMenuOpen(false)} />}
      <EmployerSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="ed-main">
        <EmployerNavbar onMenu={() => setMenuOpen(true)} />
        <Outlet />
      </main>
    </div>
  );
};

export default EmployerLayout;