import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronDown, FaRegCommentDots, FaHome, FaRegQuestionCircle, FaTimes, FaPaperPlane,
  FaWhatsapp, FaArrowLeft, FaChevronRight, FaUserTie, FaTag, FaBookOpen, FaGraduationCap,
} from "react-icons/fa";

/* Front-end chat widget. Replies are canned (see answer()), so messages are NOT delivered
   to anyone yet. To receive real messages, connect it to your backend or swap in a provider
   (Intercom, Tawk.to, Crisp), or rely on the WhatsApp button below.
   Replace WHATSAPP_NUMBER (international format, no +) with your real number. */
const WHATSAPP_NUMBER = "254700000000";

const RESOURCES = [
  [FaTag, "See pricing plans", "/pricing", "#E6EFFC", "#1F5BFF"],
  [FaBookOpen, "Career guide", "/blog", "#FDF0D9", "#C98418"],
  [FaGraduationCap, "Learn new skills", "/courses", "#E7F8EE", "#16A34A"],
];
const FAQ = [
  ["How do I unlock a candidate?", "Add your job description, review the AI-matched candidates who are already qualified, and unlock the ones you want."],
  ["Can your team recruit for me?", "Yes. Choose our recruitment team and we run the search, shortlist and interviews for you."],
  ["Where can I see pricing?", "All plans are on the pricing page, linked from the Home tab."],
];
const QUICK = ["Hire with AI", "Use your recruitment team", "Pricing"];

const answer = (t) => {
  const s = t.toLowerCase();
  if (s.includes("pric") || s.includes("cost") || s.includes("plan")) return { text: "You can compare all our plans on the pricing page.", to: "/pricing", cta: "View pricing" };
  if (s.includes("team") || s.includes("recruiter")) return { text: "Our recruitment team can run the search for you and deliver a vetted shortlist. Create an employer account and tell us about the role.", to: "/register?as=employer", cta: "Get started" };
  if (s.includes("ai") || s.includes("unlock") || s.includes("hire")) return { text: "Add your job description and our AI matches it to already-qualified candidates. You choose who to unlock.", to: "/register?as=employer", cta: "Post a role" };
  return { text: "Thanks for your message! Someone from our team will get back to you soon. For a faster reply, chat with us on WhatsApp." };
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("home");
  const [thread, setThread] = useState(false);
  const [unread, setUnread] = useState(1);
  const [faqOpen, setFaqOpen] = useState(-1);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState([{ from: "bot", text: "Welcome to Amsol! 👋 Is there anything we can help you with?" }]);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing, thread]);
  useEffect(() => { if (open) setUnread(0); }, [open]);

  const send = (text) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "me", text: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => { setMsgs((m) => [...m, { from: "bot", ...answer(t) }]); setTyping(false); }, 900);
  };
  const go = (t) => { setTab(t); setThread(false); };
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Amsol, I'd like some help.")}`;

  return (
    <>
      <style>{`
        .cw-btn{position:fixed;right:20px;bottom:20px;z-index:60;width:56px;height:56px;border-radius:50%;background:#0E2A4D;color:#fff;display:grid;place-items:center;font-size:22px;box-shadow:0 14px 30px -10px rgba(14,42,77,.7);transition:transform .2s,background .2s}
        .cw-btn:hover{transform:scale(1.07);background:#1b3d69}
        .cw-dot{position:absolute;top:-2px;right:-2px;min-width:20px;height:20px;border-radius:50%;background:#EF4444;font-size:11px;font-weight:700;display:grid;place-items:center;border:2px solid #fff}
        .cw-panel{position:fixed;right:20px;bottom:92px;z-index:60;width:min(390px,calc(100vw - 24px));height:min(640px,calc(100vh - 116px));background:#fff;border-radius:22px;box-shadow:0 28px 70px -20px rgba(10,20,35,.5);display:flex;flex-direction:column;overflow:hidden;font-family:'Inter',sans-serif;color:#0F1B33;transform-origin:bottom right;animation:cw-in .28s cubic-bezier(.2,.8,.2,1)}
        @keyframes cw-in{from{opacity:0;transform:translateY(16px) scale(.94)}to{opacity:1;transform:none}}
        .cw-body{flex:1;overflow-y:auto;background:#F6F8FB}
        .cw-top{background:linear-gradient(160deg,#0E2A4D,#27528f);color:#fff;padding:28px 24px 70px}
        .cw-top small{opacity:.75;font-size:14px}.cw-top h3{font-family:'Space Grotesk',sans-serif;font-size:30px;font-weight:700;margin-top:4px;letter-spacing:-.02em}
        .cw-x{position:absolute;top:14px;right:14px;color:#fff;opacity:.85;font-size:16px}
        .cw-card{background:#fff;border-radius:16px;box-shadow:0 8px 24px -16px rgba(15,27,51,.35);margin:0 16px 14px;overflow:hidden}
        .cw-pull{margin-top:-52px;position:relative}
        .cw-card h5{font-size:13px;font-weight:700;padding:15px 18px;border-bottom:1px solid #EEF2F7}
        .cw-row{display:flex;align-items:center;gap:12px;padding:14px 18px;font-size:14.5px;font-weight:600;width:100%;text-align:left;transition:background .15s}
        .cw-row:hover{background:#F6F8FB}
        .cw-row+.cw-row{border-top:1px solid #EEF2F7}
        .cw-ic{display:grid;place-items:center;width:38px;height:38px;border-radius:10px;flex-shrink:0}
        .cw-row p{font-weight:400;font-size:12.5px;color:#6B7686;margin-top:2px;line-height:1.4}
        .cw-chev{margin-left:auto;font-size:11px;color:#9AA7B8}
        .cw-tabs{display:flex;border-top:1px solid #E7EDF5;background:#fff}
        .cw-tabs button{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:11px 0 13px;font-size:12px;font-weight:600;color:#6B7686}
        .cw-tabs button svg{font-size:19px}.cw-tabs button.on{color:#0E2A4D}
        .cw-head{display:flex;align-items:center;gap:10px;padding:14px 16px;background:#fff;border-bottom:1px solid #E7EDF5;font-weight:700;font-size:15px}
        .cw-head small{display:block;font-weight:500;font-size:11.5px;color:#16A34A}
        .cw-av{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#F2A93B;color:#16233A;font-weight:800;font-size:14px;flex-shrink:0}
        .cw-msgs{padding:16px;display:flex;flex-direction:column;gap:10px}
        .cw-b{max-width:82%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.5;animation:cw-pop .25s ease}
        @keyframes cw-pop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        .cw-b.bot{background:#fff;border:1px solid #E7EDF5;border-bottom-left-radius:4px;align-self:flex-start}
        .cw-b.me{background:#0E2A4D;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}
        .cw-b a{display:inline-block;margin-top:8px;font-weight:700;font-size:13px;color:#1F5BFF}
        .cw-typing{display:flex;gap:4px;padding:12px 14px}
        .cw-typing i{width:6px;height:6px;border-radius:50%;background:#9AA7B8;animation:cw-bounce 1s infinite}
        .cw-typing i:nth-child(2){animation-delay:.15s}.cw-typing i:nth-child(3){animation-delay:.3s}
        @keyframes cw-bounce{50%{transform:translateY(-4px);opacity:.5}}
        .cw-quick{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 12px}
        .cw-quick button{font-size:12.5px;font-weight:600;color:#1F5BFF;border:1px solid #BFD5FF;background:#fff;border-radius:999px;padding:7px 13px}
        .cw-quick button:hover{background:#E6EFFC}
        .cw-in{display:flex;gap:8px;padding:12px;background:#fff;border-top:1px solid #E7EDF5}
        .cw-in input{flex:1;border:1px solid #E1E8F2;border-radius:999px;padding:11px 16px;font-size:14px;outline:none}
        .cw-in input:focus{border-color:#1F5BFF}
        .cw-in button{width:42px;height:42px;border-radius:50%;background:#F2A93B;color:#16233A;display:grid;place-items:center}
        .cw-wa{display:flex;align-items:center;justify-content:center;gap:8px;margin:0 16px 16px;background:#25D366;color:#fff;font-weight:700;font-size:14px;border-radius:999px;padding:12px}
        .cw-faq p{padding:0 18px 14px;font-size:13.5px;line-height:1.6;color:#5F6F85}
        @media(prefers-reduced-motion:reduce){.cw-panel,.cw-b,.cw-typing i{animation:none}}
      `}</style>

      {open && (
        <section className="cw-panel" role="dialog" aria-label="Amsol chat">
          {/* HOME */}
          {tab === "home" && !thread && (
            <div className="cw-body">
              <div className="cw-top" style={{ position: "relative" }}>
                <button className="cw-x" onClick={() => setOpen(false)} aria-label="Close"><FaTimes /></button>
                <small>Hi there 👋</small><h3>How can we help?</h3>
              </div>
              <div className="cw-card cw-pull">
                <h5>Hire with Amsol</h5>
                <Link to="/register?as=employer" className="cw-row" onClick={() => setOpen(false)} style={{ alignItems: "flex-start" }}>
                  <span className="cw-ic" style={{ background: "#0E2A4D", color: "#fff" }}><FaUserTie /></span>
                  <span>Hire qualified candidates instantly
                    <p>Add your job description, let AI match you with qualified candidates, or opt for our recruitment team.</p></span>
                </Link>
                <button className="cw-row" onClick={() => { setTab("messages"); setThread(true); }}>
                  <span className="cw-ic" style={{ background: "#FDF0D9", color: "#C98418" }}><FaRegCommentDots /></span>
                  Chat with us <FaChevronRight className="cw-chev" />
                </button>
              </div>
              <div className="cw-card">
                <h5>Resources for you</h5>
                {RESOURCES.map(([Icon, label, to, bg, fg]) => (
                  <Link key={label} to={to} className="cw-row" onClick={() => setOpen(false)}>
                    <span className="cw-ic" style={{ background: bg, color: fg }}><Icon /></span>{label}<FaChevronRight className="cw-chev" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGES LIST */}
          {tab === "messages" && !thread && (
            <>
              <div className="cw-head" style={{ justifyContent: "space-between" }}>
                <span style={{ margin: "0 auto" }}>Messages</span>
                <button onClick={() => setOpen(false)} aria-label="Close"><FaTimes /></button>
              </div>
              <div className="cw-body" style={{ background: "#fff" }}>
                <button className="cw-row" onClick={() => setThread(true)}>
                  <span className="cw-av">A</span>
                  <span style={{ flex: 1, minWidth: 0 }}>Amsol
                    <p style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{msgs[msgs.length - 1].text}</p></span>
                  <small style={{ color: "#8A97A8", fontSize: 12 }}>now</small>
                </button>
              </div>
            </>
          )}

          {/* THREAD */}
          {thread && (
            <>
              <div className="cw-head">
                <button onClick={() => setThread(false)} aria-label="Back"><FaArrowLeft /></button>
                <span className="cw-av">A</span>
                <span>Amsol team<small>● Typically replies in minutes</small></span>
                <button style={{ marginLeft: "auto" }} onClick={() => setOpen(false)} aria-label="Close"><FaTimes /></button>
              </div>
              <div className="cw-body">
                <div className="cw-msgs">
                  {msgs.map((m, i) => (
                    <div key={i} className={`cw-b ${m.from}`}>
                      {m.text}
                      {m.to && <><br /><Link to={m.to} onClick={() => setOpen(false)}>{m.cta} →</Link></>}
                    </div>
                  ))}
                  {typing && <div className="cw-b bot cw-typing"><i /><i /><i /></div>}
                  <div ref={endRef} />
                </div>
                {msgs.length < 3 && (
                  <div className="cw-quick">{QUICK.map((q) => <button key={q} onClick={() => send(q)}>{q}</button>)}</div>
                )}
              </div>
              <form className="cw-in" onSubmit={(e) => { e.preventDefault(); send(input); }}>
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Write a message..." aria-label="Message" />
                <button type="submit" aria-label="Send"><FaPaperPlane /></button>
              </form>
            </>
          )}

          {/* HELP */}
          {tab === "help" && !thread && (
            <>
              <div className="cw-head" style={{ justifyContent: "space-between" }}>
                <span style={{ margin: "0 auto" }}>Help</span>
                <button onClick={() => setOpen(false)} aria-label="Close"><FaTimes /></button>
              </div>
              <div className="cw-body">
                <div className="cw-card cw-faq" style={{ marginTop: 16 }}>
                  <h5>Common questions</h5>
                  {FAQ.map(([q, a], i) => (
                    <div key={q}>
                      <button className="cw-row" onClick={() => setFaqOpen(faqOpen === i ? -1 : i)} aria-expanded={faqOpen === i}>
                        {q}<FaChevronDown className="cw-chev" style={{ transform: faqOpen === i ? "rotate(180deg)" : "none" }} />
                      </button>
                      {faqOpen === i && <p>{a}</p>}
                    </div>
                  ))}
                </div>
                <a className="cw-wa" href={wa} target="_blank" rel="noreferrer"><FaWhatsapp /> Chat on WhatsApp</a>
              </div>
            </>
          )}

          {!thread && (
            <nav className="cw-tabs">
              <button className={tab === "home" ? "on" : ""} onClick={() => go("home")}><FaHome />Home</button>
              <button className={tab === "messages" ? "on" : ""} onClick={() => go("messages")}><FaRegCommentDots />Messages</button>
              <button className={tab === "help" ? "on" : ""} onClick={() => go("help")}><FaRegQuestionCircle />Help</button>
            </nav>
          )}
        </section>
      )}

      <button className="cw-btn" onClick={() => setOpen(!open)} aria-label={open ? "Close chat" : "Open chat"}>
        {open ? <FaChevronDown /> : <FaRegCommentDots />}
        {!open && unread > 0 && <span className="cw-dot">{unread}</span>}
      </button>
    </>
  );
};

export default ChatWidget;