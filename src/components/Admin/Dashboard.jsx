import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Briefcase,
  Building2,
  Users,
  MapPin,
  Banknote,
  Calendar,
  FolderOpen,
  RefreshCw,
  Clock,
  GraduationCap,
  Globe,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { getDashboardStats } from "@/apiServices/dashboardApi";
import { getPlatformSettings, updatePlatformSettings } from "@/apiServices/adminApi";
import StatCard from "@/components/ui/StatCard";
import { ReportsSection } from "@/components/Admin/Reports";
import { ADMIN_PAGE, ADMIN_HEADER_TITLE } from "@/components/Admin/adminPageLayout";

import { displayValue } from "@/utils/tableValue";
import { formatExperience, isFresherJob } from "@/utils/formatExperience";

/* ─── helpers ─── */
const fmt = (n) =>
  Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n ?? 0);
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const TIME_OPTS = [
  { value: "weekly", label: "This Week" },
  { value: "monthly", label: "This Month" },
  { value: "yearly", label: "This Year" },
];

const formatDelaySummary = (minutes) => {
  const m = Number(minutes) || 0;
  if (m <= 0) return "Public users see jobs immediately";
  if (m < 60) return `Public users see jobs after ${m} minute${m === 1 ? "" : "s"}`;
  const hours = m / 60;
  const hoursLabel = Number.isInteger(hours) ? `${hours}` : hours.toFixed(1);
  return `Public users see jobs after ${hoursLabel} hour${hours === 1 ? "" : "s"}`;
};

const EMPTY_CHART = MONTHS.map((name) => ({
  name,
  users: 0,
  employers: 0,
  jobs: 0,
}));

/* ─── custom tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-sm min-w-[140px]">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            {p.name}
          </span>
          <span className="font-semibold text-slate-800">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── skeleton ─── */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
);

/* ─── job card ─── */
const JobCard = ({ job, rank }) => (
  <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group">
    {/* rank badge */}
    <div className="w-8 h-8 flex-shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
      #{rank}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-slate-800 text-sm leading-tight truncate">{job.jobTitle}</p>
        <span className="flex-shrink-0 inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          <Users className="w-3 h-3" />
          {job.applicationCount}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="w-3 h-3" /> {displayValue(job.city)}, {displayValue(job.state)}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Banknote className="w-3 h-3" />
          {job.salaryRange?.[0] === 0 && job.salaryRange?.[1] === 0
            ? "Not disclosed"
            : `₹${fmt(job.salaryRange?.[0])} – ₹${fmt(job.salaryRange?.[1])}`}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Briefcase className="w-3 h-3" />
          {formatExperience(job) || "—"}
          {isFresherJob(job) ? " · Fresher" : ""}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Calendar className="w-3 h-3" />
          {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </div>
    </div>
  </div>
);

/* ─── main ─── */
const Dashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    stats: { totalUsers: 0, totalEmployers: 0, totalJobs: 0, userGrowth: 0, employerGrowth: 0, jobGrowth: 0 },
    topJobs: [],
    chartData: EMPTY_CHART,
  });
  const [publicDelayHours, setPublicDelayHours] = useState("1");
  const [savedDelayMinutes, setSavedDelayMinutes] = useState(60);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await getPlatformSettings();
      const minutes = res?.data?.settings?.publicJobDelayMinutes ?? 60;
      setSavedDelayMinutes(minutes);
      setPublicDelayHours(String(minutes / 60));
    } catch {
      toast.error("Failed to load job visibility settings");
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    const hours = Number(publicDelayHours);
    if (Number.isNaN(hours) || hours < 0 || hours > 168) {
      toast.error("Enter a delay between 0 and 168 hours");
      return;
    }

    setSavingSettings(true);
    try {
      const publicJobDelayMinutes = Math.round(hours * 60);
      const res = await updatePlatformSettings({ publicJobDelayMinutes });
      const minutes = res?.data?.settings?.publicJobDelayMinutes ?? publicJobDelayMinutes;
      setSavedDelayMinutes(minutes);
      setPublicDelayHours(String(minutes / 60));
      toast.success("Job visibility settings saved");
    } catch {
      toast.error("Failed to save job visibility settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const res = await getDashboardStats(timeRange);
      if (res?.success && res?.data) {
        setData({
          stats: res.data.stats ?? data.stats,
          topJobs: res.data.topJobs ?? [],
          chartData: res.data.chartData ?? EMPTY_CHART,
        });
      }
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, [timeRange]);
  useEffect(() => { fetchSettings(); }, []);
  useEffect(() => {
    if (window.location.hash === "#reports") {
      const el = document.getElementById("reports");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading]);

  const BAR_SERIES = [
    { key: "users", name: "Users", fill: "#3b82f6" },
    { key: "employers", name: "Employers", fill: "#8b5cf6" },
    { key: "jobs", name: "Job Posts", fill: "#10b981" },
  ];

  return (
    <div className={ADMIN_PAGE}>
        {/* ── header ── */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className={ADMIN_HEADER_TITLE}>Admin Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">Platform overview and analytics</p>
          </div>
          <div className="flex items-center gap-2">
            {/* time range pills */}
            <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              {TIME_OPTS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTimeRange(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    timeRange === opt.value
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* ── stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {loading ? (
            <>
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </>
          ) : (
            <>
              <StatCard
                icon={<Users size={20} color="#fff" />}
                value={fmt(data.stats.totalUsers)}
                label="Total Users"
                gradient="linear-gradient(135deg,#4f46e5 0%,#6366f1 55%,#818cf8 100%)"
                shadow="0 8px 24px rgba(99,102,241,.35)"
                onClick={() => navigate("/admin/users")}
              />
              <StatCard
                icon={<Building2 size={20} color="#fff" />}
                value={fmt(data.stats.totalEmployers)}
                label="Total Employers"
                gradient="linear-gradient(135deg,#059669 0%,#10b981 55%,#34d399 100%)"
                shadow="0 8px 24px rgba(16,185,129,.32)"
                onClick={() => navigate("/admin/employers")}
              />
              <StatCard
                icon={<Briefcase size={20} color="#fff" />}
                value={fmt(data.stats.totalJobs)}
                label="Job Posts"
                gradient="linear-gradient(135deg,#0369a1 0%,#0ea5e9 55%,#38bdf8 100%)"
                shadow="0 8px 24px rgba(14,165,233,.3)"
                onClick={() => navigate("/admin/jobs")}
              />
            </>
          )}
        </div>

        {/* ── reports & downloads ── */}
        <ReportsSection />

        {/* ── job visibility settings ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-semibold text-slate-900">Job Visibility Settings</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Control when newly posted jobs become visible to public users
            </p>
          </div>

          <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-indigo-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Students</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Institute students with the <strong>student</strong> role see new jobs immediately when employers post them.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">Public users</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Public users and guests see jobs only after the delay below. Set to <strong>0</strong> to show jobs to everyone immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            {settingsLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 rounded-xl border border-slate-200 p-4">
                <div className="flex-1">
                  <label htmlFor="publicDelayHours" className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                    Public visibility delay (hours)
                  </label>
                  <input
                    id="publicDelayHours"
                    type="number"
                    min="0"
                    max="168"
                    step="0.5"
                    value={publicDelayHours}
                    onChange={(e) => setPublicDelayHours(e.target.value)}
                    className="w-full sm:max-w-xs px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Current: {formatDelaySummary(savedDelayMinutes)}. Applies to new jobs posted after saving.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingSettings ? "Saving..." : "Save Settings"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── chart ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Platform Growth</h2>
              <p className="text-xs text-slate-500 mt-0.5">Users, employers and job posts over time</p>
            </div>
            {/* legend */}
            <div className="hidden sm:flex items-center gap-4">
              {BAR_SERIES.map((s) => (
                <div key={s.key} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.fill }} />
                  {s.name}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4">
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.chartData} barSize={10} barGap={3}
                    margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      tickFormatter={(v) => fmt(v)} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc", radius: 4 }} />
                    {BAR_SERIES.map((s) => (
                      <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.fill} radius={[4, 4, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* ── top jobs ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Most Popular Job Posts</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {data.topJobs.length > 0 ? "Top jobs by application count" : "No applications yet"}
              </p>
            </div>
            {data.topJobs.length > 0 && (
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                Top {data.topJobs.length}
              </span>
            )}
          </div>

          <div className="p-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : data.topJobs.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {data.topJobs.map((job, i) => (
                  <JobCard key={job._id} job={job} rank={i + 1} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-500">No job applications received yet</p>
                <p className="text-xs text-slate-400 mt-1">Applications will appear here once employers start posting jobs</p>
              </div>
            )}
          </div>
        </div>

    </div>
  );
};

export default Dashboard;