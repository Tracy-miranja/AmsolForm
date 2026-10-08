import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedinIn, FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa";
import logo from "./assets/amsolJobVacancies.png";

/* Replace the "#" social links and the placeholder routes (/about, /contact,
   /privacy, /terms) with your real ones. */
const COLUMNS = [
  { title: "For job seekers", links: [
    ["Find jobs", "/profile"], ["Career guide", "/blog"], ["Learn new skills", "/courses"], ["Remote work", "/remote"] ] },
  { title: "For employers", links: [
    ["Hire with Amsol", "/auth"], ["Pricing", "/pricing"], ["Discover talent", "/candidates"], ["Post a role", "/register?as=employer"] ] },
  { title: "Company", links: [
    ["Forum", "/forum"], ["Announcements", "/forum/announcements"] ] },
    // ["About us", "/about"], ["Contact us", "/contact"] 
];
const SOCIALS = [
  [FaLinkedinIn, "LinkedIn", "#"], [FaFacebookF, "Facebook", "#"], [FaTwitter, "Twitter", "#"],
  [FaInstagram, "Instagram", "#"], [FaWhatsapp, "WhatsApp", "#"],
];

const Footer = () => (
  <footer className="ft">
    <style>{`
      .ft{background:#0E2A4D;color:#C7D7EA;font-family:'Inter',sans-serif}
      .ft-wrap{width:min(1200px,calc(100% - 40px));margin-inline:auto}
      .ft-grid{display:grid;gap:40px;padding:64px 0 40px}
      @media(min-width:900px){.ft-grid{grid-template-columns:1.5fr repeat(3,1fr)}}
      @media(min-width:520px) and (max-width:899px){.ft-grid{grid-template-columns:1fr 1fr}.ft-brand{grid-column:1/-1}}
      .ft-logo{display:inline-block;background:#fff;border-radius:12px;padding:8px 14px}
      .ft-logo img{width:96px;display:block}
      .ft-blurb{margin-top:18px;max-width:300px;font-size:14px;line-height:1.65;color:#9FB4D0}
      .ft-soc{display:flex;gap:10px;margin-top:22px}
      .ft-soc a{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.08);color:#fff;font-size:14px;transition:background .2s,transform .2s}
      .ft-soc a:hover{background:#F2A93B;color:#16233A;transform:translateY(-2px)}
      .ft h4{color:#fff;font-weight:700;font-size:14px;margin-bottom:16px}
      .ft li+li{margin-top:11px}
      .ft li a{font-size:14px;color:#9FB4D0;transition:color .15s}
      .ft li a:hover{color:#F2A93B}
      .ft-bar{border-top:1px solid rgba(255,255,255,.1);padding:22px 0;display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center;font-size:13px;color:#8199B8}
      .ft-bar nav{display:flex;gap:20px}
      .ft-bar a:hover{color:#fff}
    `}</style>
    <div className="ft-wrap">
      <div className="ft-grid">
        <div className="ft-brand">
          <Link to="/" className="ft-logo"><img src={logo} alt="Amsol" /></Link>
          <p className="ft-blurb">Staffing and HR solutions built for the next generation of work. Hire qualified candidates with AI, or let our recruitment team do it for you.</p>
          <div className="ft-soc">
            {SOCIALS.map(([Icon, label, href]) => (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer"><Icon /></a>
            ))}
          </div>
        </div>
        {COLUMNS.map((c) => (
          <div key={c.title}>
            <h4>{c.title}</h4>
            <ul>{c.links.map(([label, to]) => <li key={label}><Link to={to}>{label}</Link></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="ft-bar">
        <p>© {new Date().getFullYear()} Amsol. All rights reserved.</p>
        <nav><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></nav>
      </div>
    </div>
  </footer>
);

export default Footer;