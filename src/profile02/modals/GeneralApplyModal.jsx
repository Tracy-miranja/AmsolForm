import { useState } from "react";
import api, { API } from "../shared/api";
import { ApplyConfirmModal } from "../../Dashboard";

/** "Quick Apply" from the top bar: a general application using the saved profile + CV. */
export default function GeneralApplyModal({ profile, onClose }) {
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const confirm = async () => {
    setApplying(true);
    setError("");
    try {
      if (!profile?.savedCvFileId) {
        setError("No CV. Please upload a CV first.");
        return;
      }
      const fd = new FormData();
      fd.append("email", profile?.email || "");
      fd.append("jobId", "general");
      fd.append("jobTitle", "General Application");
      fd.append("firstName", profile?.firstName || "");
      fd.append("lastName", profile?.lastName || "");
      await api.post(`${API}/applications`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(true);
      setTimeout(onClose, 2800);
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <ApplyConfirmModal
      job={{ title: "General Application", location: "" }}
      profile={profile}
      onConfirm={confirm}
      onClose={onClose}
      loading={applying}
      error={error}
      success={success}
    />
  );
}
