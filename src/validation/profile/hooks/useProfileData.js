import { useCallback, useEffect, useRef, useState } from "react";
import api, { API } from "../shared/api";
import { computeAge, mapAcademicToEdu, toDateInput } from "../shared/utils";

/** Loads the applicant profile and owns every "save" action for the profile page. */
export default function useProfileData(token, { onNoProfile } = {}) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [applicationsCount, setApplicationsCount] = useState(0);

  const [cvFile, setCvFile] = useState(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvMsg, setCvMsg] = useState("");

  const noProfileRef = useRef(onNoProfile);
  noProfileRef.current = onNoProfile;

  const flashMsg = useCallback((msg) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(""), 3500);
  }, []);

  const changeForm = useCallback((k, v) => setForm((f) => ({ ...f, [k]: v })), []);

  // Apply a profile document coming back from the server to all local state
  const applyProfile = useCallback((p, { lists = true } = {}) => {
    setProfile(p);
    setForm(p);
    if (!lists) return;
    setSkills(Array.isArray(p.skills) ? p.skills : []);
    setWorkExperience(Array.isArray(p.workExperience) ? p.workExperience : []);
    setQualifications(p.professionalQualifications || []);
    setMemberships(p.professionalMemberships || []);
    setEducation(mapAcademicToEdu(p.academicLevel));
    if (p.profilePhotoUrl) setAvatarUrl(p.profilePhotoUrl);
  }, []);

  // ── initial load ──
  useEffect(() => {
    if (!token) return;
    api
      .get(`${API}/profile`)
      .then(({ data }) => {
        if (data.dob) {
          data.dateOfBirth = toDateInput(data.dob);
          data.age = computeAge(data.dob);
        }
        applyProfile(data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setProfile({});
          setForm({});
          noProfileRef.current?.();
        }
      })
      .finally(() => setLoading(false));
  }, [token, applyProfile]);

  useEffect(() => {
    if (!token) { setApplicationsCount(0); return; }
    let cancelled = false;
    api
      .get(`${API}/my-applications`)
      .then(({ data }) => !cancelled && setApplicationsCount((data.applications || []).length))
      .catch(() => !cancelled && setApplicationsCount(0));
    return () => { cancelled = true; };
  }, [token]);

  // ── generic save: merge a patch into the profile and POST it ──
  const saveProfile = useCallback(
    async (patch, { onSuccess, successMsg, errorMsg = "Error saving.", after } = {}) => {
      setSaving(true);
      try {
        const { data } = await api.post(`${API}/profile`, { ...form, ...patch });
        const p = data.profile || data;
        applyProfile(p, { lists: false });
        after?.(p);
        onSuccess?.();
        if (successMsg) flashMsg(successMsg);
        return true;
      } catch (err) {
        setSaveMsg(err.response?.data?.message || errorMsg);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [form, applyProfile, flashMsg],
  );

  const savePersonal = (onSuccess) =>
    saveProfile({}, {
      errorMsg: "Error saving profile.",
      successMsg: "Personal details saved successfully!",
      after: (p) => applyProfile(p), // personal modal refreshes every list too
      onSuccess,
    });

  const saveSummary = (local, onSuccess) =>
    saveProfile(local, { successMsg: "Qualifications saved successfully!", onSuccess });

  const saveSkills = (newSkills, onSuccess) =>
    saveProfile({ skills: newSkills }, {
      errorMsg: "Error saving skills.", successMsg: "Skills saved!",
      after: () => setSkills(newSkills), onSuccess,
    });

  const saveWorkExpList = (updated, { successMsg, errorMsg }, onSuccess) =>
    saveProfile({ workExperience: updated }, {
      errorMsg, successMsg, after: () => setWorkExperience(updated), onSuccess,
    });

  const saveWorkExp = (entry, { isNew, index }, onSuccess) => {
    const updated = isNew ? [...workExperience, entry] : workExperience.map((w, i) => (i === index ? entry : w));
    return saveWorkExpList(updated, {
      errorMsg: "Error saving work experience.",
      successMsg: isNew ? "Work experience added!" : "Work experience updated!",
    }, onSuccess);
  };

  const deleteWorkExp = (index, onSuccess) =>
    saveWorkExpList(workExperience.filter((_, i) => i !== index), {
      errorMsg: "Error deleting.", successMsg: "Work experience removed.",
    }, onSuccess);

  const importWorkExp = (entries) =>
    saveWorkExpList([...workExperience, ...entries], {
      errorMsg: "Error importing work experience.",
      successMsg: `${entries.length} job${entries.length === 1 ? "" : "s"} imported from your CV!`,
    });

  const saveEducation = (newEdu, onSuccess) => {
    const academicLevel = newEdu.map((e) => ({
      level: e.academicLevel || "",
      courseName: e.courseName || e.degree || "",
      institution: e.institution || "",
      startDate: e.dateStart ? new Date(e.dateStart) : null,
      endDate: e.currentlyStudying ? null : e.dateEnd ? new Date(e.dateEnd) : null,
      certificateFileId: e.certificateFileId || null,
    }));
    return saveProfile({ academicLevel }, {
      errorMsg: "Error saving education.", successMsg: "Education saved!",
      after: () => setEducation(newEdu), onSuccess,
    });
  };

  const saveProfessional = ({ qualifications: q, memberships: m }, onSuccess) =>
    saveProfile({
      professionalQualifications: q.filter((x) => x.name || x.institution),
      professionalMemberships: m.filter((x) => x.organization || x.membershipId),
    }, {
      successMsg: "Professional details saved!",
      after: (p) => {
        setQualifications(p.professionalQualifications || []);
        setMemberships(p.professionalMemberships || []);
      },
      onSuccess,
    });

  const saveAvatar = async (file, onSuccess) => {
    if (!file) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("profilePhoto", file);
      const { data } = await api.post(`${API}/profile/photo`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatarUrl(data.profilePhotoUrl);
      setProfile((p) => ({ ...p, profilePhotoUrl: data.profilePhotoUrl }));
      onSuccess?.();
      flashMsg("Profile photo updated!");
    } catch (err) {
      setSaveMsg(err.response?.data?.message || "Error uploading photo.");
    } finally {
      setSaving(false);
    }
  };

  const uploadCv = async () => {
    if (!cvFile) return;
    setCvUploading(true);
    setCvMsg("");
    try {
      const fd = new FormData();
      fd.append("cv", cvFile);
      const { data } = await api.post(`${API}/profile/cv`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile((p) => ({ ...p, savedCvFileId: data.cvFileId, savedCvName: data.cvName, savedCvUrl: data.cvUrl }));
      setCvMsg(`CV "${data.cvName}" saved to your profile.`);
      setCvFile(null);
    } catch (err) {
      setCvMsg(err.response?.data?.message || "Error uploading CV.");
    } finally {
      setCvUploading(false);
    }
  };

  return {
    profile, form, setForm, changeForm, loading, saving, saveMsg, setSaveMsg, flashMsg,
    skills, education, workExperience, qualifications, memberships, avatarUrl, applicationsCount,
    cvFile, setCvFile, cvUploading, cvMsg, uploadCv,
    savePersonal, saveSummary, saveSkills, saveWorkExp, deleteWorkExp, importWorkExp,
    saveEducation, saveProfessional, saveAvatar,
  };
}
