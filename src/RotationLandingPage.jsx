import React, { useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes, FaSearch, FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import candidateImage from "./assets/candidate.jpg";
import employerImage from "./assets/employer.jpg";
import { JobContext } from "./JobContext";
import Cookies from "js-cookie";
import HeroSection from "./HeroSection";
import Navbar from "./navbar";
import Footer from "./Footer";
import ChatWidget from "./Chatwidget";

const TRUSTED_BY = ["kholer", "Navitas", "Shofco", "Surge", "Nutanix", "Arbor"];

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia",
  "Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium",
  "Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei",
  "Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde",
  "Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Brazzaville)",
  "Congo (DRC)","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti",
  "Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea",
  "Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany",
  "Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras",
  "Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica",
  "Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia",
  "Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar",
  "Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius",
  "Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique",
  "Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria",
  "North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea",
  "Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino",
  "Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone",
  "Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea",
  "South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan",
  "Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia",
  "Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom",
  "United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen",
  "Zambia","Zimbabwe",
];

const CITY_TO_COUNTRY = {
  "nairobi": "Kenya", "mombasa": "Kenya", "kisumu": "Kenya", "nakuru": "Kenya",
  "eldoret": "Kenya", "thika": "Kenya", "machakos": "Kenya", "nyeri": "Kenya",
  "kampala": "Uganda", "entebbe": "Uganda", "jinja": "Uganda", "mbarara": "Uganda", "gulu": "Uganda",
  "dar es salaam": "Tanzania", "dodoma": "Tanzania", "arusha": "Tanzania", "mwanza": "Tanzania", "zanzibar": "Tanzania",
  "kigali": "Rwanda", "bujumbura": "Burundi", "juba": "South Sudan", "addis ababa": "Ethiopia",
  "mogadishu": "Somalia", "hargeisa": "Somalia",
  "kinshasa": "Congo (DRC)", "goma": "Congo (DRC)", "lubumbashi": "Congo (DRC)",
  "lagos": "Nigeria", "abuja": "Nigeria", "kano": "Nigeria",
  "accra": "Ghana", "kumasi": "Ghana",
  "johannesburg": "South Africa", "cape town": "South Africa", "pretoria": "South Africa", "durban": "South Africa",
  "lusaka": "Zambia", "lilongwe": "Malawi", "blantyre": "Malawi", "maputo": "Mozambique",
  "harare": "Zimbabwe", "bulawayo": "Zimbabwe", "cairo": "Egypt", "alexandria": "Egypt",
  "london": "United Kingdom", "new york": "United States",
};

const normalizeLocationToCountry = (text) => {
  if (!text) return null;
  const s = String(text).toLowerCase().trim();
  for (const [city, country] of Object.entries(CITY_TO_COUNTRY)) {
    if (s.includes(city)) return country;
  }
  return null;
};

const DASHBOARD_ROUTE = "/profile";
const isLoggedIn = () => !!Cookies.get("token");

const stripHtml = (html) => {
  if (!html) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return txt.value;
};

const RotationLandingPage = () => {
  const navigate = useNavigate();
  const { jobs = [], loading: jobsLoading } = useContext(JobContext);
  const [loginPrompt, setLoginPrompt] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const openRolesRef = useRef(null);

  const matchedJobs = jobs.filter((job) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesQuery =
      !q ||
      job.title?.toLowerCase().includes(q) ||
      stripHtml(job.description).toLowerCase().includes(q);

    let matchesLocation = true;
    if (locationFilter) {
      const jobLocation = (job.location || "").toLowerCase();
      const selected = locationFilter.toLowerCase();
      const jobCountry = normalizeLocationToCountry(job.location);
      matchesLocation =
        jobLocation.includes(selected) ||
        selected.includes(jobLocation) ||
        (jobCountry && jobCountry.toLowerCase() === selected);
    }

    return matchesQuery && matchesLocation;
  });
  const featuredJobs = jobs.slice(0, 6);
  const jobsToShow = hasSearched ? matchedJobs : featuredJobs;

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setLocationFilter("");
    setHasSearched(false);
  };

  const handleApply = (job) => {
    sessionStorage.setItem("pendingJobId", String(job.id));
    if (isLoggedIn()) {
      navigate(DASHBOARD_ROUTE);
    } else {
      setLoginPrompt({ job });
    }
  };

  const handleBrowseMore = (e) => {
    e.preventDefault();
    navigate(isLoggedIn() ? DASHBOARD_ROUTE : "/auth?as=jobseeker");
  };

  return (
    <div className="amsol-page w-full bg-white text-slate-900 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap');

        .amsol-page { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

        .amsol-container { width: min(1400px, calc(100% - 40px)); margin-inline: auto; }

        .amsol-section { padding-top: 72px; padding-bottom: 72px; }
        @media (max-width: 767px) {
          .amsol-section { padding-top: 48px; padding-bottom: 48px; }
        }

        .amsol-frame {
          background:
            radial-gradient(520px 340px at 66% 0%, #BFD5FF 0%, rgba(191,213,255,0) 70%),
            radial-gradient(420px 380px at 0% 74%, #F3E8D4 0%, rgba(243,232,212,0) 70%),
            linear-gradient(135deg, #E8F2FF 0%, #DCEBFF 100%);
          border-radius: 0 0 64px 64px;
          padding-bottom: 56px;
        }
        @media (max-width: 767px) {
          .amsol-frame { border-radius: 0 0 32px 32px; padding-bottom: 32px; }
        }

        .amsol-btn-solid { background: #F2A93B; color: #16233A; }
        .amsol-btn-solid:hover { background: #E39C2E; }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track { animation: marquee 28s linear infinite; }
        .marquee-row:hover .marquee-track { animation-play-state: paused; }

        .amsol-role-card {
          border-radius: 24px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #EEF1F5;
          box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .amsol-role-card:hover { box-shadow: 0 20px 40px -18px rgba(14, 42, 77, 0.28); transform: translateY(-4px); }
        .amsol-role-photo { position: relative; height: 300px; overflow: hidden; }
        .amsol-role-photo img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .amsol-role-card:hover .amsol-role-photo img { transform: scale(1.04); }
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
        .amsol-role-body { padding: 24px 24px 28px; }

        .amsol-roles-search { background: #F6F8FB; border: 1px solid #E4E9EF; border-radius: 999px; }
        .amsol-roles-search input, .amsol-roles-search select { background: transparent; outline: none; color: #1F2A38; }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
          .amsol-role-card, .amsol-role-photo img { transition: none; }
        }
      `}</style>

      {/* Frame: sticky navbar + hero */}
      <div className="amsol-frame relative">
        <Navbar activeIndex={0} />

        {/* HERO */}
        <HeroSection />
      </div>

      {/* Trusted-by sliding carousel */}
      <section className="marquee-row py-8 border-b border-slate-100 overflow-hidden">
        <div className="marquee-track flex items-center gap-16 w-max">
          {[...TRUSTED_BY, ...TRUSTED_BY].map((name, i) => (
            <span key={`${name}-${i}`} className="text-slate-400 font-semibold text-base whitespace-nowrap">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Open roles */}
      <section ref={openRolesRef} className="amsol-section bg-white">
        <div className="amsol-container">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">
                {hasSearched ? "Search results" : "Live this week"}
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900">Open roles worth your time</h2>
              {hasSearched && (
                <p className="text-sm text-slate-500 mt-1">
                  {matchedJobs.length} role{matchedJobs.length !== 1 ? "s" : ""} match your search
                  {locationFilter ? ` in ${locationFilter}` : ""}.{" "}
                  <button onClick={clearSearch} className="text-[#1a6edb] font-semibold underline">
                    Clear
                  </button>
                </p>
              )}
            </div>
            <button
              onClick={handleBrowseMore}
              className="hidden md:flex items-center gap-2 text-[#0E2A4D] font-semibold hover:text-[#0B233F]"
            >
              Browse all roles <FaArrowRight className="text-sm" />
            </button>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="amsol-roles-search flex flex-col sm:flex-row items-stretch sm:items-center gap-1 px-2 py-2 mb-8 max-w-3xl"
          >
            <input
              type="text"
              placeholder="Job title or keyword"
              className="flex-1 min-w-0 px-4 py-2.5 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2.5 text-sm shrink-0 w-full sm:w-44"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All locations</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            <button
              type="submit"
              className="amsol-btn-solid font-bold px-6 py-2.5 rounded-full text-sm flex items-center justify-center gap-2 shrink-0 transition-colors"
            >
              <FaSearch className="text-xs" /> Search jobs
            </button>
          </form>

          {jobsLoading ? (
            <div className="grid md:grid-cols-3 gap-6 bg-slate-500 p-6 rounded-2xl">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-slate-50 rounded-2xl h-48 animate-pulse" />
              ))}
            </div>
          ) : jobsToShow.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p className="text-lg font-semibold text-slate-700">No roles match your search</p>
              <p className="text-sm mt-1">Try a different keyword or location.</p>
              <button onClick={clearSearch} className="mt-4 text-[#1a6edb] font-semibold">
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {jobsToShow.map((job) => {
                const plain = stripHtml(job.description);
                const preview = plain.length > 110 ? plain.slice(0, 110) + "…" : plain;
                return (
                  <div key={job.id} className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-slate-400">AMSOL Careers</span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Open
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900">{job.title}</h3>
                    {job.location && (
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-xs" /> {job.location}
                      </p>
                    )}
                    <p className="text-sm text-slate-600 mt-3 flex-1">{preview}</p>
                    <div className="flex items-center justify-end mt-5">
                      <button
                        onClick={() => handleApply(job)}
                        className="text-[#F2A93B] font-semibold text-sm flex items-center gap-1"
                      >
                        Apply <FaArrowRight className="text-xs" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={handleBrowseMore}
            className="md:hidden mt-6 flex items-center gap-2 text-[#0E2A4D] font-semibold"
          >
            Browse all roles <FaArrowRight className="text-sm" />
          </button>
        </div>
      </section>

      {/* Who are you looking for */}
      <section className="amsol-section bg-white">
        <div className="amsol-container">
          <p className="text-sm font-semibold text-[#0E2A4D] mb-1">Step one</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Who are you looking for?</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="amsol-role-card">
              <div className="amsol-role-photo">
                <span className="amsol-role-tag">For jobseekers</span>
                <img src={candidateImage} alt="Candidate smiling" />
              </div>
              <div className="amsol-role-body">
                <h3 className="text-xl font-bold text-slate-900">I'm a candidate</h3>
                <p className="text-slate-600 mt-2 mb-5">
                  Browse open roles, get matched, and apply in one tap. Your next move starts here.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-[#0E2A4D] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0B233F] w-fit"
                >
                  Create my profile <FaArrowRight className="text-sm" />
                </Link>
              </div>
            </div>

            <div className="amsol-role-card">
              <div className="amsol-role-photo">
                <span className="amsol-role-tag">For employers</span>
                <img src={employerImage} alt="Hiring team reviewing candidates" />
              </div>
              <div className="amsol-role-body">
                <h3 className="text-xl font-bold text-slate-900">I'm hiring</h3>
                <p className="text-slate-600 mt-2 mb-5">
                  Post a role and reach vetted talent fast, with Amsol's HR team behind every shortlist.
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
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Three steps to the right fit</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", title: "Tell us who you are", body: "A two-minute profile — skills, pace, salary band, deal-breakers. No endless forms." },
              { n: "02", title: "Get matched, not listed", body: "Our matching reads intent on both sides, so every intro is worth replying to." },
              { n: "03", title: "Say yes to the right one", body: "Interview with employers that already fit your criteria, and get an offer faster." },
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

      {/* CTA banner */}
      <section className="amsol-section">
        <div className="amsol-container">
          <div className="bg-[#0E2A4D] rounded-3xl text-center px-6 py-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white max-w-2xl mx-auto">
              Your next chapter is one signup away.
            </h2>
            <p className="text-[#C7D7EA] mt-4 max-w-lg mx-auto">
              Join thousands of candidates and the employers across East and West Africa competing to meet them.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="bg-[#F2A93B] text-[#16233A] font-semibold px-6 py-3 rounded-lg hover:bg-[#E39C2E]">
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

      <Footer />
      <ChatWidget />

      {loginPrompt && (
        <div
          className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setLoginPrompt(null); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Log in to apply</h3>
                <p className="text-sm text-slate-600 mt-2">
                  {loginPrompt.job
                    ? <>You need an account to apply for <strong>{loginPrompt.job.title}</strong>. Log in or create a free profile — it takes two minutes.</>
                    : "Log in to browse more jobs."}
                </p>
              </div>
              <button onClick={() => setLoginPrompt(null)} className="text-slate-400 hover:text-slate-700" aria-label="Close">
                <FaTimes />
              </button>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/auth?as=jobseeker"
                className="flex-1 text-center bg-[#0E2A4D] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0B233F]"
              >
                Log in
              </Link>
              <Link
                to="/register?as=jobseeker"
                className="flex-1 text-center border border-[#0E2A4D] text-[#0E2A4D] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#EEF3F9]"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RotationLandingPage;