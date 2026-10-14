// Turns a job's HTML description into tidy sections, paragraphs and bullet lists.
// Used by the public job page (the Dashboard has its own copy of the same logic).

const decodeHtmlEntities = (str) => {
  if (!str) return "";
  const t = document.createElement("textarea");
  t.innerHTML = str;
  return t.value;
};

const htmlToPlain = (html) => {
  if (!html) return "";
  let s = decodeHtmlEntities(String(html));
  s = s
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|h[1-6]|blockquote|section|article)\s*>/gi, "\n\n")
    .replace(/<\s*li[^>]*>/gi, "\n- ")
    .replace(/<\/\s*li\s*>/gi, "\n")
    .replace(/<\/\s*tr\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  return s.replace(/[ \t\f\v]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
};

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const HEADINGS = [
  "Requirements & Responsibilities", "Requirements and Responsibilities", "Qualifications & Requirements",
  "Qualifications and Requirements", "Key Responsibilities", "Roles and Responsibilities", "Role Responsibilities",
  "Required Qualifications and Experience", "Required Qualifications & Experience", "Key Competencies",
  "Key Performance Indicators", "Application Process", "Application Details", "Position Overview", "About the Role",
  "Role Overview", "Job Purpose", "What You'll Do", "What You Will Do", "Education & Experience",
  "Education and Experience", "Required Skills", "Nice to Have", "Benefits & Perks", "Benefits", "Company Overview",
  "Who We Are", "How to Apply",
];

const parseSections = (html) => {
  const text = htmlToPlain(html);
  if (!text) return [];
  const re = new RegExp(`(?:^|\\n)\\s*(${HEADINGS.map(esc).join("|")})\\s*:?\\s*(?=\\n|$)`, "gi");
  const matches = [...text.matchAll(re)];
  if (!matches.length) return [{ title: null, body: text }];
  const out = [];
  const pre = text.slice(0, matches[0].index).trim();
  if (pre) out.push({ title: null, body: pre });
  matches.forEach((m, i) => {
    const start = m.index + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    out.push({ title: m[1].replace(/\s+/g, " ").trim(), body: text.slice(start, end).trim() });
  });
  return out;
};

const isBullet = (l) => /^\s*[-*•▪·]\s+/.test(l) || /^\s*\d+[.)]\s+/.test(l);

const chunk = (body) => {
  const lines = (body || "").split(/\n/);
  const chunks = [];
  let i = 0;
  while (i < lines.length) {
    while (i < lines.length && !lines[i].trim()) i++;
    if (i >= lines.length) break;
    if (isBullet(lines[i])) {
      const items = [];
      while (i < lines.length && lines[i].trim() && isBullet(lines[i])) {
        items.push(lines[i].replace(/^\s*(?:[-*•▪·]|\d+[.)])\s+/, "").trim());
        i++;
      }
      chunks.push({ type: "list", items });
    } else {
      const para = [];
      while (i < lines.length && lines[i].trim() && !isBullet(lines[i])) para.push(lines[i++].trim());
      chunks.push({ type: "text", text: para.join(" ") });
    }
  }
  return chunks;
};

const Chunks = ({ chunks }) => (
  <>
    {chunks.map((c, idx) =>
      c.type === "list" ? (
        <ul key={idx} style={{ margin: idx === 0 ? "6px 0 0" : "12px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {c.items.map((item, j) => (
            <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: "50%", background: "#e8f1fd", color: "#1a6edb", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, fontSize: 10 }}>›</span>
              <span style={{ fontSize: 13, color: "#3a3a52", lineHeight: 1.65 }}>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p key={idx} style={{ fontSize: 13.5, color: "#3a3a52", lineHeight: 1.75, margin: idx === 0 ? 0 : "12px 0 0" }}>{c.text}</p>
      )
    )}
  </>
);

export const renderJobDescription = (job) => {
  const secs = parseSections(job?.description || "");
  if (!secs.length) return <p style={{ fontSize: 13, color: "#9090a8" }}>No detailed description available for this role.</p>;
  return secs.map((sec, i) => {
    const chunks = chunk(sec.body);
    if (!chunks.length) return null;
    return (
      <div key={i} style={{ marginBottom: 22 }}>
        {sec.title && <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>{sec.title}</div>}
        <Chunks chunks={chunks} />
      </div>
    );
  });
};

export default renderJobDescription;