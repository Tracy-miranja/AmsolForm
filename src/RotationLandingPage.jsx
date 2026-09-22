import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "./assets/amsolJobVacancies.png";
import { FaBars, FaTimes, FaChevronDown, FaSearch, FaArrowRight } from "react-icons/fa";
import candidateImage from "./assets/candidate.jpg";
import employerImage from "./assets/employer.jpg";
import avatar2 from "./assets/avatar2.jfif";
import avatar3 from "./assets/avatar3.png";

const OPEN_ROLES = [
  {
    dept: "Engineering",
    tag: "Remote",
    title: "Backend Developer, Payments",
    company: "Krest Works",
    location: "Nairobi",
    salary: "KSh 180k–240k",
  },
  {
    dept: "HR & Payroll",
    tag: "Hybrid",
    title: "Payroll Administrator",
    company: "Client Company",
    location: "Kampala",
    salary: "USh 3.5M–5M",
  },
  {
    dept: "Operations",
    tag: "On-site",
    title: "Warehouse Supervisor",
    company: "Client Company",
    location: "Accra",
    salary: "GHS 6k–9k",
  },
];

const TRUSTED_BY = ["kholer", "Navitas", "Shofco", "Surge", "Nutanix", "Arbor"];

// Floating headshots around the hero — mixed African and white subjects.
// Swap these src values for your own real photos when ready.
const FLOAT_AVATARS = [
  { src: avatar2, pos: "top-10 left-[2%] md:left-[6%]", size: "w-20 h-20 md:w-28 md:h-28", ring: "bg-[#8FA9C7]" },
  { src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80", pos: "top-6 right-[2%] md:right-[6%]", size: "w-20 h-20 md:w-28 md:h-28", ring: "bg-[#F2A93B]" },
  { src: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=200&q=80", pos: "top-[42%] left-[1%] md:left-[3%]", size: "w-16 h-16 md:w-24 md:h-24", ring: "bg-[#C77B6E]" },
  { src: avatar3, pos: "top-[42%] right-[1%] md:right-[3%]", size: "w-16 h-16 md:w-24 md:h-24", ring: "bg-[#5B7A9D]" },
  { src: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=200&q=80", pos: "bottom-6 left-[16%] md:left-[22%]", size: "w-20 h-20 md:w-28 md:h-28", ring: "bg-[#9C86B4]" },
  { src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80", pos: "bottom-8 right-[10%] md:right-[16%]", size: "w-16 h-16 md:w-24 md:h-24", ring: "bg-[#2B3A4A]" },
];

const NAV_LINKS = [
  {
    label: "For job seekers",
    to: "/Jobs",
    items: [
      { title: "Find jobs", desc: "Explore local & global opportunities", to: "/Jobs" },
      { title: "Career guide", desc: "Guides & articles to advance your career", to: "/blog" },
      { title: "Learn new skills", desc: "Stay relevant by taking our courses", to: "/courses" },
      { title: "Remote work", desc: "Work with companies around the world", to: "/remote" },
    ],
  },
  {
    label: "For employers",
    to: "/auth",
    items: [
      { title: "Hire with Amsol", desc: "Recruit better talent, faster — on your own or with support", to: "/auth" },
      { title: "Pricing", desc: "Choose the plan that fits your needs", to: "/pricing" },
      { title: "Discover talent", desc: "Access a network of validated & vetted candidates", to: "/candidates" },
    ],
  },
  {
    label: "Forum",
    to: "/forum",
    items: [
      { title: "Discussions", desc: "Talk shop with jobseekers and employers", to: "/forum" },
      { title: "Announcements", desc: "Product news and platform updates", to: "/forum/announcements" },
    ],
  },
];

const ACCOUNT_TYPES = [
  { title: "Job seeker", desc: "Browse and apply for jobs and more" },
  { title: "Employer / Recruiter", desc: "Manage jobs, review applicants, headhunt talent" },
];

const RotationPandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const closeTimer = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleEnter = (label) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const toggleMobileDropdown = (label) => {
    setOpenMobileDropdown(openMobileDropdown === label ? null : label);
  };

  const accountLink = (action, type) =>
    action === "login" ? `/auth?as=${type}` : `/register?as=${type}`;

  return (
    <div className="amsol-page w-full bg-white text-slate-900 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .amsol-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .amsol-container {
          width: min(1400px, calc(100% - 40px));
          margin-inline: auto;
        }

        .amsol-section {
          padding-top: 72px;
          padding-bottom: 72px;
        }
        @media (max-width: 767px) {
          .amsol-section { padding-top: 48px; padding-bottom: 48px; }
        }

        /* Outer solid frame — dark blue, no gradient */
        .amsol-frame {
          background: #0E2A4D;
          border-radius: 0 0 64px 64px;
          padding-bottom: 56px;
        }
        @media (max-width: 767px) {
          .amsol-frame { border-radius: 0 0 32px 32px; padding-bottom: 32px; }
        }

        /* Pill nav */
        .amsol-nav-pill {
          background: #ffffff;
          border: 1px solid #E4E9EF;
          border-radius: 999px;
        }
        .amsol-nav-link { color: #1F2A38; font-weight: 600; }
        .amsol-nav-link.is-active { color: #F2A93B; }
        .amsol-dropdown {
          border-radius: 14px;
          box-shadow: 0 18px 36px -14px rgba(10, 20, 35, 0.35);
        }

        .amsol-btn-solid {
          background: #F2A93B;
          color: #16233A;
        }
        .amsol-btn-solid:hover { background: #E39C2E; }
         .amsol-btn-outline:hover { background: #F6F8FB; }

          /* Mega-menu style dropdown: title + description rows */
        .amsol-megamenu {
          border-radius: 18px;
          background: #ffffff;
          box-shadow: 0 22px 44px -16px rgba(10, 20, 35, 0.35);
          border: 1px solid #EEF1F5;
          padding: 10px;
        }
        .amsol-megamenu-item {
          display: block;
          border-radius: 12px;
          padding: 12px 14px;
          transition: background 0.15s ease;
        }
        .amsol-megamenu-item:hover {
          background: #F6F8FB;
        }
        .amsol-megamenu-title {
          font-weight: 700;
          font-size: 14.5px;
          color: #0E2A4D;
          margin-bottom: 2px;
        }
        .amsol-megamenu-desc {
          font-size: 13px;
          color: #6B7686;
          line-height: 1.4;
        }
         .amsol-btn-outline {
          background: #ffffff;
          color: #16233A;
          border: 1.5px solid #E4E9EF;
        }

        /* Hero panel — soft blue tint that blends with the dark-blue frame */
        .amsol-hero-card {
          background: #D9E7F8;
          border-radius: 44px;
        }
        @media (max-width: 767px) {
          .amsol-hero-card { border-radius: 28px; }
        }

        .amsol-hero-heading {
          font-size: 64px;
          line-height: 1.05;
          letter-spacing: -0.02em;
        }
        @media (max-width: 767px) {
          .amsol-hero-heading { font-size: 34px; }
        }

        .amsol-accent { color: #F2A93B; }

        /* Search bar */
        .amsol-search-bar {
          background: #0E2A4D;
          border-radius: 999px;
        }
        .amsol-search-field { color: #EAF0F8; }
        .amsol-search-field::placeholder { color: #A9BBD1; }
        .amsol-search-divider { background: rgba(255,255,255,0.25); }
        .amsol-search-btn { background: #F2A93B; color: #16233A; border-radius: 999px; }
        .amsol-search-btn:hover { background: #E39C2E; }

        .amsol-stat-icon {
          background: #F2A93B;
          border-radius: 999px;
        }

        .amsol-avatar-ring {
          border-radius: 999px;
          padding: 6px;
        }
        .amsol-avatar-img {
          border-radius: 999px;
          border: 3px solid #D9E7F8;
        }

        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .float-avatar { animation: floatY 5s ease-in-out infinite; }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track { animation: marquee 28s linear infinite; }
        .marquee-row:hover .marquee-track { animation-play-state: paused; }

        /* Modern "who are you looking for" cards — full, unfaded photo + solid content panel */
        .amsol-role-card {
          border-radius: 24px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #EEF1F5;
          box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .amsol-role-card:hover {
          box-shadow: 0 20px 40px -18px rgba(14, 42, 77, 0.28);
          transform: translateY(-4px);
        }
        .amsol-role-photo {
          position: relative;
          height: 300px;
          overflow: hidden;
        }
        .amsol-role-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .amsol-role-card:hover .amsol-role-photo img {
          transform: scale(1.04);
        }
        /* Only a thin bottom-edge shade for a clean seam into the panel below — photo stays vivid */
        .amsol-role-photo::after {
          content: "";
          position: absolute;
          inset: auto 0 0 0;
          height: 48px;
          background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.12));
        }
        .amsol-role-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(255,255,255,0.92);
          color: #0E2A4D;
          font-weight: 700;
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 999px;
        }
        .amsol-role-body {
          padding: 24px 24px 28px;
        }

        @media (prefers-reduced-motion: reduce) {
          .float-avatar, .marquee-track { animation: none; }
          .amsol-role-card, .amsol-role-photo img { transition: none; }
        }
      `}</style>

      {/* Frame: solid dark blue wrapping navbar + hero */}
      <div className="amsol-frame relative">
        {/* Navbar */}
        <div className="amsol-container pt-6">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="shrink-0 bg-white rounded-xl px-2.5 py-1.5">
              <img src={logo} alt="Amsol" className="w-[110px]" />
            </Link>

            <button
              onClick={toggleMenu}
              className="md:hidden text-2xl text-white focus:outline-none"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <nav className="amsol-nav-pill hidden md:flex items-center gap-1 px-3 py-2.5">
              {NAV_LINKS.map((item, i) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleEnter(item.label)}
                  onMouseLeave={handleLeave}
                >
                  <Link
                    to={item.to}
                    className={`amsol-nav-link flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-colors ${
                      i === 0 ? "is-active" : ""
                    }`}
                    onClick={(e) => {
                      if (item.items?.length) e.preventDefault();
                    }}
                  >
                    {item.label}
                    <FaChevronDown
                      className={`text-[10px] transition-transform ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </Link>

                  {item.items?.length > 0 && openDropdown === item.label && (
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
              <div
                className="relative"
                onMouseEnter={() => handleEnter("login")}
                onMouseLeave={handleLeave}
              >
                <button className="amsol-btn-outline font-bold px-5 py-2.5 rounded-full text-sm flex items-center gap-1.5 transition-colors">
                  Login
                  <FaChevronDown
                    className={`text-[10px] transition-transform ${
                      openDropdown === "login" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openDropdown === "login" && (
                  <div className="amsol-megamenu absolute right-0 top-[calc(100%+10px)] w-[280px] z-50">
                    {ACCOUNT_TYPES.map((acc) => (
                      <Link
                        key={acc.title}
                        to={accountLink("login", acc.title === "Job seeker" ? "jobseeker" : "employer")}
                        className="amsol-megamenu-item"
                      >
                        <p className="amsol-megamenu-title">{acc.title}</p>
                        <p className="amsol-megamenu-desc">{acc.desc}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
 
              <div
                className="relative"
                onMouseEnter={() => handleEnter("register")}
                onMouseLeave={handleLeave}
              >
                <button className="amsol-btn-solid font-bold px-6 py-2.5 rounded-full text-sm flex items-center gap-1.5 transition-colors">
                  Join now
                  <FaChevronDown
                    className={`text-[10px] transition-transform ${
                      openDropdown === "register" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openDropdown === "register" && (
                  <div className="amsol-megamenu absolute right-0 top-[calc(100%+10px)] w-[280px] z-50">
                    {ACCOUNT_TYPES.map((acc) => (
                      <Link
                        key={acc.title}
                        to={accountLink("register", acc.title === "Job seeker" ? "jobseeker" : "employer")}
                        className="amsol-megamenu-item"
                      >
                        <p className="amsol-megamenu-title">{acc.title}</p>
                        <p className="amsol-megamenu-desc">{acc.desc}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
         {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-50 p-6 space-y-2 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <img src={logo} alt="Amsol" className="w-[100px]" />
              <button onClick={toggleMenu} className="text-2xl">
                <FaTimes />
              </button>
            </div>
 
            {NAV_LINKS.map((item) => (
              <div key={item.label} className="border-b border-slate-100 pb-2">
                <button
                  onClick={() => toggleMobileDropdown(item.label)}
                  className="w-full flex items-center justify-between text-[#0E2A4D] font-semibold py-3"
                >
                  {item.label}
                  <FaChevronDown
                    className={`text-xs transition-transform ${
                      openMobileDropdown === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMobileDropdown === item.label && (
                  <div className="pl-1 pb-2 space-y-1">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.title}
                        to={sub.to}
                        onClick={toggleMenu}
                        className="block px-3 py-2 rounded-lg hover:bg-slate-50"
                      >
                        <p className="text-slate-900 font-semibold text-sm">{sub.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{sub.desc}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
 
            <div className="border-b border-slate-100 pb-2">
              <button
                onClick={() => toggleMobileDropdown("login")}
                className="w-full flex items-center justify-between text-[#0E2A4D] font-semibold py-3"
              >
                Login
                <FaChevronDown
                  className={`text-xs transition-transform ${
                    openMobileDropdown === "login" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openMobileDropdown === "login" && (
                <div className="pl-1 pb-2 space-y-1">
                  {ACCOUNT_TYPES.map((acc) => (
                    <Link
                      key={acc.title}
                      to={accountLink("login", acc.title === "Job seeker" ? "jobseeker" : "employer")}
                      onClick={toggleMenu}
                      className="block px-3 py-2 rounded-lg hover:bg-slate-50"
                    >
                      <p className="text-slate-900 font-semibold text-sm">{acc.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{acc.desc}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
 
            <div>
              <button
                onClick={() => toggleMobileDropdown("register")}
                className="w-full flex items-center justify-between text-[#0E2A4D] font-semibold py-3"
              >
                Join now
                <FaChevronDown
                  className={`text-xs transition-transform ${
                    openMobileDropdown === "register" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openMobileDropdown === "register" && (
                <div className="pl-1 pb-2 space-y-1">
                  {ACCOUNT_TYPES.map((acc) => (
                    <Link
                      key={acc.title}
                      to={accountLink("register", acc.title === "Job seeker" ? "jobseeker" : "employer")}
                      onClick={toggleMenu}
                      className="block px-3 py-2 rounded-lg hover:bg-slate-50"
                    >
                      <p className="text-slate-900 font-semibold text-sm">{acc.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{acc.desc}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* HERO — light-blue card floating inside the dark-blue frame, with orbiting avatars */}
        <div className="amsol-container mt-6">
          <div className="amsol-hero-card relative px-6 md:px-16 py-16 md:py-24 overflow-visible">
            {FLOAT_AVATARS.map((a, i) => (
              <div
                key={i}
                className={`float-avatar amsol-avatar-ring absolute hidden sm:block ${a.pos} ${a.ring}`}
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                <img
                  src={a.src}
                  alt=""
                  className={`amsol-avatar-img object-cover ${a.size}`}
                />
              </div>
            ))}

            <div className="relative max-w-2xl mx-auto text-center">
              <h1 className="amsol-hero-heading font-extrabold text-slate-900">
                Find Your Next <span className="amsol-accent">Role Today!</span>
              </h1>

              <p className="mt-6 text-slate-700 text-lg max-w-lg mx-auto">
                Explore open roles across Kenya, Uganda and Ghana that match your
                skills — from entry-level positions to leadership hires.
              </p>

              <div className="mt-10 amsol-search-bar flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 px-3 py-2 sm:px-2 sm:py-2 max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Job title or company"
                  className="amsol-search-field bg-transparent flex-1 px-4 py-3 text-sm outline-none"
                />
                <div className="amsol-search-divider hidden sm:block w-px h-6 self-center" />
                <select className="amsol-search-field bg-transparent px-4 py-3 text-sm outline-none">
                  <option className="text-slate-900">Select location</option>
                  <option className="text-slate-900">Nairobi</option>
                  <option className="text-slate-900">Kampala</option>
                  <option className="text-slate-900">Accra</option>
                </select>
                <Link
                  to="/Jobs"
                  className="amsol-search-btn font-bold px-6 py-3 text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <FaSearch className="text-xs" /> Search Job
                </Link>
              </div>

              <div className="mt-12 flex justify-center gap-12 md:gap-16">
                <div className="flex flex-col items-center">
                  <div className="amsol-stat-icon w-12 h-12 flex items-center justify-center text-white text-lg mb-3">
                    ⚡
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">2,500+</p>
                  <p className="text-sm text-slate-600">Roles matched</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="amsol-stat-icon w-12 h-12 flex items-center justify-center text-white text-lg mb-3">
                    ◎
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">10,250</p>
                  <p className="text-sm text-slate-600">Candidates</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="amsol-stat-icon w-12 h-12 flex items-center justify-center text-white text-lg mb-3">
                    ▣
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">340+</p>
                  <p className="text-sm text-slate-600">Companies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /amsol-frame */}

      {/* Trusted-by sliding carousel */}
      <section className="marquee-row py-8 border-b border-slate-100 overflow-hidden">
        <div className="marquee-track flex items-center gap-16 w-max">
          {[...TRUSTED_BY, ...TRUSTED_BY].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-slate-400 font-semibold text-base whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Who are you looking for — modern cards, photos left vivid, content in a solid panel below */}
      <section className="amsol-section bg-white">
        <div className="amsol-container">
          <p className="text-sm font-semibold text-[#0E2A4D] mb-1">Step one</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8">
            Who are you looking for?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* I'm a candidate */}
            <div className="amsol-role-card">
              <div className="amsol-role-photo">
                <span className="amsol-role-tag">For jobseekers</span>
               <img
  src={candidateImage}
  alt="Candidate smiling"
/>
              </div>
              <div className="amsol-role-body">
                <h3 className="text-xl font-bold text-slate-900">I'm a candidate</h3>
                <p className="text-slate-600 mt-2 mb-5">
                  Browse open roles, get matched, and apply in one tap. Your next
                  move starts here.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-[#0E2A4D] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0B233F] w-fit"
                >
                  Create my profile <FaArrowRight className="text-sm" />
                </Link>
              </div>
            </div>

            {/* I'm hiring */}
            <div className="amsol-role-card">
              <div className="amsol-role-photo">
                <span className="amsol-role-tag">For employers</span>
                <img
                  src={employerImage}
                  alt="Hiring team reviewing candidates"
                />
              </div>
              <div className="amsol-role-body">
                <h3 className="text-xl font-bold text-slate-900">I'm hiring</h3>
                <p className="text-slate-600 mt-2 mb-5">
                  Post a role and reach vetted talent fast, with Amsol's HR team
                  behind every shortlist.
                </p>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 border border-[#0E2A4D] text-[#0E2A4D] bg-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#EEF3F9] w-fit"
                >
                  Post a role <FaArrowRight className="text-sm" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="amsol-section bg-[#F6F8FB]">
        <div className="amsol-container">
          <p className="text-sm font-semibold text-[#0E2A4D] mb-1">How it works</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8">
            Three steps to the right fit
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                n: "01",
                title: "Tell us who you are",
                body: "A two-minute profile — skills, pace, salary band, deal-breakers. No endless forms.",
              },
              {
                n: "02",
                title: "Get matched, not listed",
                body: "Our matching reads intent on both sides, so every intro is worth replying to.",
              },
              {
                n: "03",
                title: "Say yes to the right one",
                body: "Interview with employers that already fit your criteria, and get an offer faster.",
              },
            ].map((step) => (
              <div key={step.n} className="bg-white rounded-2xl border border-slate-100 p-6">
                <p className="text-3xl font-extrabold text-[#C7D7EA] mb-3">{step.n}</p>
                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="amsol-section bg-white">
        <div className="amsol-container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm text-slate-500 mb-1">Live this week</p>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Open roles worth your time
              </h2>
            </div>
            <Link
              to="/Jobs"
              className="hidden md:flex items-center gap-2 text-[#0E2A4D] font-semibold hover:text-[#0B233F]"
            >
              Browse all roles <FaArrowRight className="text-sm" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {OPEN_ROLES.map((role) => (
              <div key={role.title} className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400">{role.dept}</span>
                  <span className="text-xs font-semibold text-[#0E2A4D] bg-[#EAF0F8] px-2.5 py-1 rounded-full">
                    {role.tag}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900">{role.title}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {role.company} · {role.location}
                </p>
                <div className="flex items-center justify-between mt-5">
                  <span className="text-sm font-semibold text-slate-700">{role.salary}</span>
                  <Link to="/Jobs" className="text-[#F2A93B] font-semibold text-sm flex items-center gap-1">
                    Apply <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner — solid dark blue, no gradient */}
      <section className="amsol-section">
        <div className="amsol-container">
          <div className="bg-[#0E2A4D] rounded-3xl text-center px-6 py-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white max-w-2xl mx-auto">
              Your next chapter is one signup away.
            </h2>
            <p className="text-[#C7D7EA] mt-4 max-w-lg mx-auto">
              Join thousands of candidates and the employers across East and West
              Africa competing to meet them.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className="bg-[#F2A93B] text-[#16233A] font-semibold px-6 py-3 rounded-lg hover:bg-[#E39C2E]"
              >
                Sign up as a candidate
              </Link>
              <Link
                to="/auth"
                className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 flex items-center gap-2"
              >
                I'm hiring <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="amsol-container flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={logo} alt="Amsol" className="w-[90px]" />
          <p className="text-sm text-slate-400 text-center">
            © {new Date().getFullYear()} Amsol · Staffing & HR solutions built for
            the next generation of work.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RotationPandingPage;