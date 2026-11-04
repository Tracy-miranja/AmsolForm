import { useState } from "react";
import { Icon } from "../shared/Icons";
import { GhostBtn, PrimaryBtn } from "../shared/ui";

export default function CourseModal({ course, completed, onToggle, onClose }) {
  const firstOpen = course.lessons.findIndex((l) => !completed.includes(l.id));
  const [idx, setIdx] = useState(firstOpen === -1 ? 0 : firstOpen);
  const lesson = course.lessons[idx];
  const isDone = completed.includes(lesson.id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[85vh] overflow-hidden flex flex-col md:flex-row">
        {/* lesson list */}
        <div className="md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-[rgba(0,0,0,0.08)] overflow-y-auto bg-[#fafbfc]">
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.06)]">
            <div className="text-[13px] font-semibold text-[#1a1a2e]">{course.title}</div>
            <div className="text-[11px] text-[#9090a8] mt-0.5">{completed.length}/{course.lessons.length} lessons done</div>
          </div>
          {course.lessons.map((l, i) => (
            <button key={l.id} onClick={() => setIdx(i)}
              style={{ background: i === idx ? "#e8f1fd" : "transparent" }}
              className="w-full text-left px-4 py-2.5 flex items-start gap-2 text-[12.5px] text-[#1a1a2e] hover:bg-[#f0f2f8]">
              <span style={{ color: completed.includes(l.id) ? "#16a34a" : "#c4c8d8", marginTop: 1 }}>{Icon.check}</span>
              <span>{i + 1}. {l.title}<span className="block text-[11px] text-[#9090a8]">{l.minutes} min</span></span>
            </button>
          ))}
        </div>

        {/* lesson content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)]">
            <h2 className="font-semibold text-[#1a1a2e] text-[15px]">{lesson.title}</h2>
            <button onClick={onClose} className="text-[#9090a8] hover:text-[#1a1a2e] p-1 rounded-lg hover:bg-[#f4f6fb]">{Icon.x}</button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5" style={{ fontSize: 13.5, color: "#3a3a52", lineHeight: 1.7 }}>
            {lesson.content?.map((p, i) => <p key={i} style={{ marginBottom: 12 }}>{p}</p>)}
            {lesson.bullets && (
              <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {lesson.bullets.map((b, i) => (
                  <li key={i} style={{ display: "flex", gap: 8 }}><span style={{ color: "#1a6edb" }}>•</span><span>{b}</span></li>
                ))}
              </ul>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              {lesson.videoUrl && <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="text-[#1a6edb] text-[13px] underline">▶ Watch video</a>}
              {lesson.linkUrl && <a href={lesson.linkUrl} target="_blank" rel="noreferrer" className="text-[#1a6edb] text-[13px] underline">{Icon.externalLink} Open resource</a>}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between gap-3">
            <GhostBtn onClick={() => setIdx((i) => Math.max(0, i - 1))}>← Previous</GhostBtn>
            <PrimaryBtn onClick={() => { if (!isDone) onToggle(lesson.id); if (idx < course.lessons.length - 1) setIdx(idx + 1); }}>
              {isDone ? "Completed ✓ — next" : idx < course.lessons.length - 1 ? "Mark complete & next" : "Mark complete"}
            </PrimaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
