import { useState } from "react";
import { Icon } from "../shared/Icons";
import { Modal, Inp } from "../shared/ui";
import CvAutofillBanner from "../cv/CvAutofillBanner";

export default function SkillsModal({ skills, onClose, onSave, saving }) {
  const [list, setList] = useState(skills.length ? [...skills] : []);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    const t = newSkill.trim();
    if (t && !list.includes(t)) setList((l) => [...l, t]);
    setNewSkill("");
  };
  const removeSkill = (i) => setList((l) => l.filter((_, idx) => idx !== i));

  const applyFromCv = (cv) => {
    const have = new Set(list.map((s) => s.toLowerCase()));
    const fresh = (cv.skills || []).filter((s) => !have.has(s.toLowerCase()));
    if (fresh.length) setList((l) => [...l, ...fresh]);
    return fresh.length;
  };

  return (
    <Modal title="Edit Skills" subtitle="Add or remove your professional skills"
      onClose={onClose} onSave={() => onSave(list)} saving={saving}>
      <CvAutofillBanner section="skills" unit="skill" onAutofill={applyFromCv} />

      <div className="flex gap-2">
        <Inp type="text" placeholder="Type a skill and press Add…" value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
        <button onClick={addSkill}
          className="flex-shrink-0 flex items-center gap-1 px-4 py-2 bg-[#1a6edb] text-white rounded-lg text-sm font-medium hover:bg-[#0d4fa3] transition">
          {Icon.plus} Add
        </button>
      </div>

      {list.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {list.map((s, i) => (
            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4f6fb] border border-[rgba(0,0,0,0.1)] text-[#5a5a72] text-[12.5px]">
              {s}
              <button onClick={() => removeSkill(i)} className="text-[#9090a8] hover:text-red-500 transition ml-1">{Icon.trash}</button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#9090a8] italic pt-1">No skills added yet. Type above and click Add.</p>
      )}
    </Modal>
  );
}
