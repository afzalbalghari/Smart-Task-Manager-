import { useEffect, useState } from "react";
import Navbar from "../components/UI/Navbar";
import StatsWidget from "../components/Dashboard/StatsWidget";
import ProductivityChart from "../components/Analytics/ProductivityChart";
import TaskStatusPie from "../components/Analytics/TaskStatusPie";
import Loader from "../components/UI/Loader";
import { analyticsService } from "../services/analyticsService";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getSummary()
      .then(setSummary)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        <div>
          <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track your productivity over time</p>
        </div>

        {loading ? (
          <div className="flex justify-center pt-20"><Loader /></div>
        ) : (
          <>
            {/* Stats cards */}
            <StatsWidget summary={summary} />

            {/* Completion rate banner */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-100">Overall Completion Rate</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {summary?.completed} of {summary?.total_tasks} tasks completed
                  </p>
                </div>
                <span className="text-3xl font-bold text-primary-400">
                  {summary?.completion_rate ?? 0}%
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-700"
                  style={{ width: `${summary?.completion_rate ?? 0}%` }}
                />
              </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <ProductivityChart data={summary?.weekly_productivity || []} />
              </div>
              <div>
                <TaskStatusPie summary={summary} />
              </div>
            </div>

            {/* Priority breakdown */}
            <div className="card p-5">
              <h3 className="font-semibold text-slate-200 mb-4">Pending by Priority</h3>
              <div className="space-y-3">
                {[
                  { label: "High",   key: "high",   color: "bg-red-500",     count: summary?.priority_breakdown?.high   || 0 },
                  { label: "Medium", key: "medium",  color: "bg-amber-500",   count: summary?.priority_breakdown?.medium || 0 },
                  { label: "Low",    key: "low",    color: "bg-emerald-500",  count: summary?.priority_breakdown?.low    || 0 },
                ].map(p => {
                  const total = (summary?.priority_breakdown?.high || 0) +
                                (summary?.priority_breakdown?.medium || 0) +
                                (summary?.priority_breakdown?.low || 0);
                  const pct = total ? Math.round((p.count / total) * 100) : 0;
                  return (
                    <div key={p.key}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-400">{p.label}</span>
                        <span className="text-slate-300 font-medium">{p.count} tasks</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${p.color} rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
