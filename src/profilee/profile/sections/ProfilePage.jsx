import CompletionCard from "./CompletionCard";
import PersonalInfoSection from "./PersonalInfoSection";
import SummarySection from "./SummarySection";
import SkillsSection from "./SkillsSection";
import WorkExperienceSection from "./WorkExperienceSection";
import EducationSection from "./EducationSection";
import QualificationsSection from "./QualificationsSection";
import CvSection from "./CvSection";

/** Composes the profile page. All state lives in the parent / hooks. */
export default function ProfilePage({ data, displayAvatar, token, saveMsg, modalOpen, openModal, cv, onPreviewCv, onImportWork }) {
  const { profile, skills, education, workExperience, qualifications, memberships } = data;
  const hasWork = workExperience.some((w) => w.company);
  const ok = saveMsg && (saveMsg.includes("success") || saveMsg.includes("saved") || saveMsg.includes("!"));

  return (
    <div className="page-padding" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {saveMsg && !modalOpen && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium fade-in ${ok ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
          {saveMsg}
        </div>
      )}

      <CompletionCard profile={profile} hasWorkExperience={hasWork} />

      <PersonalInfoSection profile={profile} displayAvatar={displayAvatar}
        onEdit={() => openModal("personal", { resetForm: true })} onChangePhoto={() => openModal("avatar")} />

      <div className="profile-grid-2col" style={{ gap: 20 }}>
        <SummarySection profile={profile} onEdit={() => openModal("summary")} />
        <SkillsSection skills={skills} onEdit={() => openModal("skills")} />
      </div>

      <WorkExperienceSection workExperience={workExperience}
        onAdd={() => openModal("workexp", { workExp: { entry: {}, index: -1, isNew: true } })}
        onEdit={(entry, index) => openModal("workexp", { workExp: { entry, index, isNew: false } })}
        onImportAll={onImportWork} />

      <EducationSection education={education} token={token} onEdit={() => openModal("education")} />
      <QualificationsSection qualifications={qualifications} memberships={memberships} token={token} onEdit={() => openModal("professional")} />

      <CvSection profile={profile} {...cv} onPreview={onPreviewCv} />
    </div>
  );
}
