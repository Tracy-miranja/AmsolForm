const isExpired = (job) => {
  if (!job.deadline) return false;
  return new Date(job.deadline) < new Date();
};

const formatMoney = (value) => {
  if (value == null) return null;
  return Number(value).toLocaleString();
};

const formatDate = (value) => {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const SavedJobsPanel = ({ savedJobs, loading, onUnsave, onApply }) => {
  const activeJobs = savedJobs.filter((job) => !isExpired(job));
  const expiredJobs = savedJobs.filter((job) => isExpired(job));

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid gap-4">
          <div
            style={{
              height: 190,
              borderRadius: 24,
              background:
                "radial-gradient(circle at top right, rgba(59,130,246,0.14), transparent 28%), linear-gradient(135deg,#f8fbff,#eef4ff)",
              border: "1px solid rgba(59,130,246,0.14)",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div className="grid lg:grid-cols-2 gap-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                style={{
                  height: 170,
                  borderRadius: 20,
                  background: "#f8fafc",
                  border: "1px solid rgba(0,0,0,0.06)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>
      </div>
    );
  }

  if (!savedJobs.length) {
    return (
      <div className="p-8">
        <div
          style={{
            background:
              "radial-gradient(circle at top right, rgba(245,158,11,0.18), transparent 28%), linear-gradient(135deg,#fffdf8,#fff7e8)",
            border: "1px solid rgba(245,158,11,0.18)",
            borderRadius: 24,
            padding: 32,
            textAlign: "center",
          }}
        >
          <div className="w-16 h-16 rounded-[18px] bg-white mx-auto flex items-center justify-center shadow-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.6">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, color: "#1a1a2e", marginTop: 18 }}>
            Your saved roles will show up here
          </h2>
          <p className="text-[#6b7280] text-sm max-w-[460px] mx-auto mt-3 leading-7">
            Bookmark interesting openings while browsing jobs. This space stays calm and easy to scan so you can return later without losing track.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <div
        style={{
          borderRadius: 24,
          padding: 24,
          background:
            "radial-gradient(circle at top right, rgba(245,158,11,0.18), transparent 30%), linear-gradient(135deg,#0f172a 0%, #334155 56%, #1f2937 100%)",
          color: "#fff",
          boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
        }}
      >
        <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/70">Saved jobs</div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, lineHeight: 1.15, marginTop: 10 }}>
          Keep strong opportunities in one focused space
        </h2>
        <p className="text-sm text-white/80 leading-7 mt-3 max-w-[680px]">
          Active roles stay front and center, while expired ones move into a lighter archive so the page feels modern, breathable, and easy to use.
        </p>

        <div className="flex flex-wrap gap-3 mt-5">
          <span className="px-3 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-semibold">
            {savedJobs.length} saved total
          </span>
          <span className="px-3 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-semibold">
            {activeJobs.length} active
          </span>
          <span className="px-3 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-semibold">
            {expiredJobs.length} expired
          </span>
        </div>
      </div>

      {activeJobs.length > 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#9090a8]">Ready to act</div>
            <h3 className="text-[#1a1a2e] font-semibold text-[22px] mt-1">Active saved jobs</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {activeJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-[22px] p-5 border border-[rgba(0,0,0,0.07)] shadow-sm flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#1a1a2e] text-[16px] leading-6">{job.title}</h3>
                    {job.category_id && (
                      <p className="text-[#9090a8] text-sm mt-1">{job.category_id.category_name}</p>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-[#166534] bg-[#ecfdf3] px-3 py-1 rounded-full whitespace-nowrap">
                    Open
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.salary_range && (
                    <span className="px-3 py-1.5 rounded-full bg-[#e8f1fd] text-[#1a6edb] text-xs font-semibold">
                      KES {formatMoney(job.salary_range.min)} - {formatMoney(job.salary_range.max)}
                    </span>
                  )}
                  {job.deadline && (
                    <span className="px-3 py-1.5 rounded-full bg-[#f8fafc] text-[#64748b] text-xs font-semibold">
                      Deadline {formatDate(job.deadline)}
                    </span>
                  )}
                </div>

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => onApply(job)}
                    className="flex-1 py-2.5 rounded-xl bg-[#1a6edb] text-white text-sm font-semibold hover:bg-[#0d4fa3] transition"
                  >
                    Quick Apply
                  </button>
                  <button
                    onClick={() => onUnsave(job)}
                    className="py-2.5 px-4 rounded-xl border border-[rgba(0,0,0,0.1)] text-sm font-semibold text-[#64748b] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {expiredJobs.length > 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#9090a8]">Archive</div>
            <h3 className="text-[#1a1a2e] font-semibold text-[20px] mt-1">Expired saved jobs</h3>
          </div>

          <div className="grid gap-3">
            {expiredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl p-4 border border-red-100 opacity-75 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e] text-sm">{job.title}</h3>
                    {job.category_id && (
                      <p className="text-[#9090a8] text-xs mt-0.5">{job.category_id.category_name}</p>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-red-400 bg-red-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                    Expired
                  </span>
                </div>

                {job.deadline && (
                  <p className="text-xs text-red-400">Closed: {formatDate(job.deadline)}</p>
                )}

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => onUnsave(job)}
                    className="py-1.5 px-3 rounded-lg border text-xs font-medium transition border-[rgba(0,0,0,0.1)] text-[#9090a8] hover:bg-[#f4f6fb]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
