import { useCallback, useEffect, useState } from "react";

// Stores completed lessons per user in this browser: { [courseId]: [lessonId, ...] }
export default function useLearnProgress(userId) {
  const key = `amsol_learn_${userId || "guest"}`;
  const [done, setDone] = useState({});

  useEffect(() => {
    try { setDone(JSON.parse(localStorage.getItem(key)) || {}); } catch { setDone({}); }
  }, [key]);

  const toggle = useCallback((courseId, lessonId) => {
    setDone((prev) => {
      const list = prev[courseId] || [];
      const next = { ...prev, [courseId]: list.includes(lessonId) ? list.filter((x) => x !== lessonId) : [...list, lessonId] };
      try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* storage may be unavailable */ }
      return next;
    });
  }, [key]);

  const progress = (course) => {
    const total = course.lessons.length;
    const n = total ? (done[course.id] || []).filter((id) => course.lessons.some((l) => l.id === id)).length : 0;
    return { done: n, total, pct: total ? Math.round((n / total) * 100) : 0 };
  };

  return { done, toggle, progress };
}
