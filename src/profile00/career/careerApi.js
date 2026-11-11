import api, { API } from "../shared/api";

export const errMsg = (err) => err.response?.data?.message || "Something went wrong. Please try again.";

// Small, privacy-friendly summary of the profile sent to the AI (no name, phone, email or ID numbers)
export function buildCareerContext(profile, skills = [], workExperience = []) {
  const latest = workExperience.find((w) => w.company) || {};
  return {
    currentRole: profile?.positionApplied || latest.position || "",
    specialization: Array.isArray(profile?.specialization) ? profile.specialization.join(", ") : profile?.specialization || "",
    education: profile?.highestEducationLevel || "",
    skills: skills.slice(0, 20),
    experience: workExperience.filter((w) => w.company).slice(0, 3)
      .map((w) => ({ position: w.position, company: w.company, duration: (w.duration || "").split("|")[0].trim() })),
  };
}

export const askCoach = (messages, context) =>
  api.post(`${API}/career/coach`, { messages, context }).then((r) => r.data.reply);

export const runQuick = (type, input, context) =>
  api.post(`${API}/career/quick`, { type, input, context }).then((r) => r.data.text);

export const revampCv = (file, jobTitle, jobDescription) => {
  const fd = new FormData();
  fd.append("cv", file);
  if (jobTitle) fd.append("jobTitle", jobTitle);
  if (jobDescription) fd.append("jobDescription", jobDescription);
  return api.post(`${API}/career/cv-revamp`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data.data);
};

// Download the saved CV through the shared axios instance (auto token refresh)
export const downloadSavedCv = async (cvFileId, name) => {
  const res = await api.get(`${API}/profile/cv/${cvFileId}`, { responseType: "blob" });
  return new File([res.data], name || "cv.pdf", { type: res.data.type || "application/pdf" });
};
