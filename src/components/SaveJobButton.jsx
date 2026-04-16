// components/SaveJobButton.jsx
export const SaveJobButton = ({ job, savedJobIds, onToggle }) => {
  const isSaved = savedJobIds.has(job._id);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // prevent card click
        onToggle(job);
      }}
      title={isSaved ? "Unsave job" : "Save job"}
      className={`p-2 rounded-lg transition-all duration-200 ${
        isSaved
          ? "text-[#1a6edb] bg-[#e8f0fb] hover:bg-[#d0e2f8]"
          : "text-[#9090a8] hover:text-[#1a6edb] hover:bg-[#f4f6fb]"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24"
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="2"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
};