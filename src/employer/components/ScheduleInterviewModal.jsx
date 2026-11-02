import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../../api/axiosInstance";

const pad = (n) => String(n).padStart(2, "0");
const toInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

// Next three working days, 10:00 and 14:00
const suggestSlots = () => {
  const out = [];
  const d = new Date();
  while (out.length < 6) {
    d.setDate(d.getDate() + 1);
    if ([0, 6].includes(d.getDay())) continue;
    [10, 14].forEach((h) => { const s = new Date(d); s.setHours(h, 0, 0, 0); out.push(s); });
  }
  return out;
};

const agendaFrom = (screening) => {
  const q = screening?.questions || [], gaps = screening?.gaps || [];
  return [
    "1. Welcome and introductions (5 min)",
    "2. Role overview and expectations (5 min)",
    "3. Experience and skills questions:",
    ...q.map((x) => `   - ${x}`),
    gaps.length ? "4. Areas to explore:" : null,
    ...gaps.map((x) => `   - ${x}`),
    "5. Candidate questions and next steps (5 min)",
  ].filter(Boolean).join("\n");
};

const ScheduleInterviewModal = ({ item, onItem, onClose }) => {
  const slots = useMemo(suggestSlots, []);
  const [f, setF] = useState({
    type: "Video call", title: `Interview: ${item.jobTitle}`, dateTime: "", duration: 30,
    location: "", meetingUrl: "", notes: "", sendInvite: true,
  });
  const [busy, setBusy] = useState("");
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const draftAgenda = async () => {
    setBusy("agenda");
    try {
      let current = item;
      if (!item.screening) {
        const { data } = await api.post(`/api/employer/applicants/${item.id}/screen`);
        onItem(data); current = data;
      }
      setF((s) => ({ ...s, notes: agendaFrom(current.screening) }));
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not draft the agenda.");
    } finally { setBusy(""); }
  };

  const submit = async () => {
    if (!f.dateTime) return toast.error("Choose a date and time.");
    setBusy("send");
    try {
      const { data } = await api.post(`/api/employer/applicants/${item.id}/interview`, { ...f, dateTime: new Date(f.dateTime).toISOString() });
      onItem(data);
      toast.success(f.sendInvite ? "Interview scheduled and invite sent." : "Interview scheduled.");
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not schedule the interview.");
    } finally { setBusy(""); }
  };

  return (
    <>
      <div className="ep-over z2" onClick={onClose} />
      <div className="ep-modal" role="dialog" aria-label="Schedule interview">
        <h3>Schedule interview with {item.candidate.name}</h3>

        <div className="ep-grid2">
          <label className="ep-field">Format
            <select className="ep-in" value={f.type} onChange={set("type")}><option>Video call</option><option>Phone call</option><option>On-site</option></select>
          </label>
          <label className="ep-field">Duration
            <select className="ep-in" value={f.duration} onChange={set("duration")}>{[15, 30, 45, 60, 90].map((m) => <option key={m} value={m}>{m} minutes</option>)}</select>
          </label>
        </div>

        <label className="ep-field">Title<input className="ep-in" value={f.title} onChange={set("title")} /></label>

        <label className="ep-field">Date and time
          <input className="ep-in" type="datetime-local" value={f.dateTime} onChange={set("dateTime")} />
        </label>
        <div className="ep-chips">
          {slots.map((s) => (
            <button key={s.toISOString()} type="button" className="ep-chip info ep-pick" onClick={() => setF((x) => ({ ...x, dateTime: toInput(s) }))}>
              {s.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} {pad(s.getHours())}:00
            </button>
          ))}
        </div>

        {f.type === "On-site"
          ? <label className="ep-field">Location<input className="ep-in" value={f.location} onChange={set("location")} placeholder="Office address" /></label>
          : <label className="ep-field">Meeting link<input className="ep-in" value={f.meetingUrl} onChange={set("meetingUrl")} placeholder="https://meet.google.com/…" /></label>}

        <label className="ep-field">
          <span className="ep-split">Agenda / notes <button type="button" className="ep-btn sm ghost" disabled={!!busy} onClick={draftAgenda}>{busy === "agenda" ? "Drafting…" : "Draft with AI"}</button></span>
          <textarea className="ep-in" rows={7} value={f.notes} onChange={set("notes")} />
        </label>

        <label className="ep-check"><input type="checkbox" checked={f.sendInvite} onChange={set("sendInvite")} /> Email the invitation to the candidate</label>

        <div className="ep-actions">
          <button className="ep-btn amber" disabled={!!busy} onClick={submit}>{busy === "send" ? "Scheduling…" : "Schedule"}</button>
          <button className="ep-btn ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </>
  );
};

export default ScheduleInterviewModal;