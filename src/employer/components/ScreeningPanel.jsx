import React from "react";

const ScreeningPanel = ({ screening, busy, onRun }) => (
  <section className="ep-card">
    <div className="ep-split">
      <h4 style={{ margin: 0 }}>AI screening</h4>
      <button className="ep-btn sm" disabled={busy} onClick={onRun}>{busy ? "Screening…" : screening ? "Re-run" : "Screen with AI"}</button>
    </div>

    {!screening && !busy && <p className="ep-sub">AI reads the candidate's profile and CV against the job and gives a score, strengths, gaps and tailored interview questions.</p>}

    {screening && (
      <>
        <div className="ep-split" style={{ marginTop: 12 }}>
          <div className="ep-bar" style={{ flex: 1 }}><i style={{ width: `${screening.score}%` }} /></div>
          <b>{screening.score}%</b>
          <span className={`ep-chip ${screening.verdict === "Strong match" ? "ok" : screening.verdict === "Weak match" ? "bad" : "warn"}`}>{screening.verdict}</span>
        </div>
        <p>{screening.summary}</p>
        {screening.strengths?.length > 0 && (<><h5>Strengths</h5><ul>{screening.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></>)}
        {screening.gaps?.length > 0 && (<><h5>Gaps to probe</h5><ul>{screening.gaps.map((s, i) => <li key={i}>{s}</li>)}</ul></>)}
        {screening.questions?.length > 0 && (<><h5>Suggested interview questions</h5><ol>{screening.questions.map((s, i) => <li key={i}>{s}</li>)}</ol></>)}
      </>
    )}
  </section>
);

export default ScreeningPanel;