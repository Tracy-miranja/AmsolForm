import React, { useEffect, useState } from "react";

const KEY = "amsol_employer_tasks";
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };

const TasksPanel = () => {
  const [tasks, setTasks] = useState(load);
  const [tab, setTab] = useState("all");
  const [text, setText] = useState("");

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch {} }, [tasks]);

  const add = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setTasks((ts) => [{ id: Date.now(), text: t, done: false, snoozed: false }, ...ts]);
    setText("");
  };
  const patch = (id, p) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...p } : t)));

  const shown = tasks.filter((t) =>
    tab === "completed" ? t.done : tab === "snoozed" ? t.snoozed && !t.done : !t.snoozed || t.done
  );

  return (
    <section>
      <h2 className="ed-sec">Today&apos;s Tasks</h2>
      <div className="ed-card">
        <div className="ed-tabs">
          {[["all", "All Tasks"], ["completed", "Completed"], ["snoozed", "Snoozed"]].map(([k, l]) => (
            <button key={k} className={`ed-tab ${tab === k ? "on" : ""}`} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>

        <div className="ed-scroll">
          {shown.length === 0 ? (
            <div className="ed-empty">{tab === "all" ? "No tasks yet. Add your first one below." : "Nothing here yet."}</div>
          ) : shown.map((t) => (
            <label key={t.id} className={`ed-task ${t.done ? "done" : ""}`}>
              <input type="checkbox" checked={t.done} onChange={() => patch(t.id, { done: !t.done })} />
              <span>{t.text}</span>
              {!t.done && (
                <button type="button" className="ed-snooze"
                  onClick={(e) => { e.preventDefault(); patch(t.id, { snoozed: !t.snoozed }); }}>
                  {t.snoozed ? "Unsnooze" : "Snooze"}
                </button>
              )}
            </label>
          ))}
        </div>

        <form className="ed-add" onSubmit={add}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a task…" />
          <button type="submit">Add</button>
        </form>
      </div>
    </section>
  );
};

export default TasksPanel;