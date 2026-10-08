import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import logo from "./assets/amsolJobVacancies.png";

const NAV_LINKS = [
  { label: "For job seekers", to: "/Jobs", items: [
    { title: "Find jobs", desc: "Explore local & global opportunities", to: "/auth" },
    { title: "Career guide", desc: "Guides & articles to advance your career", to: "/blog" },
    { title: "Learn new skills", desc: "Stay relevant by taking our courses", to: "/courses" },
    { title: "Remote work", desc: "Work with companies around the world", to: "/remote" } ] },
  { label: "For employers", to: "/auth", items: [
    { title: "Hire with Amsol", desc: "Recruit better talent, faster — on your own or with support", to: "/employerlandingpage" },
    { title: "Pricing", desc: "Choose the plan that fits your needs", to: "/pricing" },
    { title: "Discover talent", desc: "Access a network of validated & vetted candidates", to: "/candidates" } ] },
  { label: "Forum", to: "/forum", items: [
    { title: "Discussions", desc: "Talk shop with jobseekers and employers", to: "/forum" },
    { title: "Announcements", desc: "Product news and platform updates", to: "/forum/announcements" } ] },
];
const ACCOUNT_TYPES = [
  { title: "Job seeker", desc: "Browse and apply for jobs and more" },
  { title: "Employer / Recruiter", desc: "Manage jobs, review applicants, headhunt talent" },
];
const accountLink = (action, title) => {
  const type = title === "Job seeker" ? "jobseeker" : "employer";
  return action === "login" ? `/auth?as=${type}` : `/register?as=${type}`;
};

/* activeIndex: which top-level link is highlighted (1 = "For employers") */
const Navbar = ({ activeIndex = 1 }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobile, setOpenMobile] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const closeTimer = useRef(null);
  const enter = (k) => { clearTimeout(closeTimer.current); setOpenDropdown(k); };
  const leave = () => { closeTimer.current = setTimeout(() => setOpenDropdown(null), 150); };

  return (
    <>
      <style>{`
        .nb-wrap{width:min(1400px,calc(100% - 40px));margin-inline:auto}
        .nb-bar{position:fixed;top:0;left:0;right:0;z-index:40;transition:background .25s,box-shadow .25s}
        .nb-bar.is-scrolled{background:rgba(255,255,255,.85);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 8px 24px -18px rgba(10,20,35,.4)}
        .nb-spacer{height:76px}
        .amsol-nav-pill{background:#fff;border:1px solid #E4E9EF;border-radius:999px}
        .amsol-nav-link{color:#1F2A38;font-weight:600}
        .amsol-nav-link.is-active{color:#F2A93B}
        .amsol-dropdown{border-radius:14px;box-shadow:0 18px 36px -14px rgba(10,20,35,.35)}
        .amsol-btn-solid{background:#F2A93B;color:#16233A}.amsol-btn-solid:hover{background:#E39C2E}
        .amsol-btn-outline{background:#fff;color:#16233A;border:1.5px solid #E4E9EF}.amsol-btn-outline:hover{background:#F6F8FB}
        .amsol-megamenu{border-radius:18px;background:#fff;box-shadow:0 22px 44px -16px rgba(10,20,35,.35);border:1px solid #EEF1F5;padding:10px}
        .amsol-megamenu-item{display:block;border-radius:12px;padding:12px 14px;transition:background .15s}
        .amsol-megamenu-item:hover{background:#F6F8FB}
        .amsol-megamenu-title{font-weight:700;font-size:14.5px;color:#0E2A4D;margin-bottom:2px}
        .amsol-megamenu-desc{font-size:13px;color:#6B7686;line-height:1.4}
      `}</style>

      <header className={`nb-bar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nb-wrap flex items-center justify-between gap-4 py-3">
        <Link to="/" className="shrink-0 rounded-xl px-2.5 py-1.5"><img src={logo} alt="Amsol" className="w-[110px]" /></Link>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl text-[#0F1B33]" aria-label="Menu">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <nav className="amsol-nav-pill hidden md:flex items-center gap-1 px-3 py-2.5">
          {NAV_LINKS.map((item, i) => (
            <div key={item.label} className="relative" onMouseEnter={() => enter(item.label)} onMouseLeave={leave}>
              <Link to={item.to} onClick={(e) => e.preventDefault()}
                className={`amsol-nav-link flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-colors ${i === activeIndex ? "is-active" : ""}`}>
                {item.label}
                <FaChevronDown className={`text-[10px] transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`} />
              </Link>
              {openDropdown === item.label && (
                <div className="amsol-dropdown absolute left-0 top-[calc(100%+10px)] bg-white min-w-[200px] py-2 z-50">
                  {item.items.map((sub) => (
                    <Link key={sub.title} to={sub.to} className="amsol-megamenu-item">
                      <p className="amsol-megamenu-title">{sub.title}</p>
                      <p className="amsol-megamenu-desc">{sub.desc}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {[["login", "Login", "amsol-btn-outline px-5"], ["register", "Join now", "amsol-btn-solid px-6"]].map(([k, label, cls]) => (
            <div key={k} className="relative" onMouseEnter={() => enter(k)} onMouseLeave={leave}>
              <button className={`${cls} font-bold py-2.5 rounded-full text-sm flex items-center gap-1.5 transition-colors`}>
                {label}
                <FaChevronDown className={`text-[10px] transition-transform ${openDropdown === k ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === k && (
                <div className="amsol-megamenu absolute right-0 top-[calc(100%+10px)] w-[280px] z-50">
                  {ACCOUNT_TYPES.map((acc) => (
                    <Link key={acc.title} to={accountLink(k, acc.title)} className="amsol-megamenu-item">
                      <p className="amsol-megamenu-title">{acc.title}</p>
                      <p className="amsol-megamenu-desc">{acc.desc}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      </header>
      <div className="nb-spacer" />

      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 p-6 space-y-2 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <img src={logo} alt="Amsol" className="w-[100px]" />
            <button onClick={() => setMenuOpen(false)} className="text-2xl" aria-label="Close"><FaTimes /></button>
          </div>
          {[...NAV_LINKS.map((n) => ({ key: n.label, label: n.label, rows: n.items.map((r) => ({ ...r })) })),
            ...[["login", "Login"], ["register", "Join now"]].map(([k, label]) => ({
              key: k, label, rows: ACCOUNT_TYPES.map((a) => ({ title: a.title, desc: a.desc, to: accountLink(k, a.title) })),
            }))].map((g) => (
            <div key={g.key} className="border-b border-slate-100 pb-2">
              <button onClick={() => setOpenMobile(openMobile === g.key ? null : g.key)} className="w-full flex items-center justify-between text-[#0E2A4D] font-semibold py-3">
                {g.label}
                <FaChevronDown className={`text-xs transition-transform ${openMobile === g.key ? "rotate-180" : ""}`} />
              </button>
              {openMobile === g.key && (
                <div className="pl-1 pb-2 space-y-1">
                  {g.rows.map((r) => (
                    <Link key={r.title} to={r.to} onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50">
                      <p className="text-slate-900 font-semibold text-sm">{r.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{r.desc}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;