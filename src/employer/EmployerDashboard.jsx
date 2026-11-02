import useEmployerDashboard from "./useEmployerDashboard";
import StatsOverview from "./components/StatsOverview";
import TasksPanel from "./components/TasksPanel";
import InterviewsPanel from "./components/InterviewsPanel";
import RecentJobs from "./components/RecentJobs";

const EmployerDashboard = () => {
  const { stats, jobs, interviews, loading, error } = useEmployerDashboard();

  return (
    <>
      {error && <div className="ed-err">{error}</div>}

      <div className="ed-grid">
        <StatsOverview stats={stats} loading={loading} />
        <TasksPanel />
        <InterviewsPanel interviews={interviews} />
      </div>

      <RecentJobs jobs={jobs} loading={loading} />
    </>
  );
};

export default EmployerDashboard;