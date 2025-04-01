import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Briefcase,
  Building,
  Users,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Loader2,
  MapPin,
  Banknote,
  Calendar,
  FolderX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getDashboardStats } from "@/apiServices/dashboardApi";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalEmployers: 0,
      totalJobs: 0,
      userGrowth: 0,
      employerGrowth: 0,
      jobGrowth: 0,
    },
    topJobs: [],
    chartData: Array(12)
      .fill()
      .map((_, i) => ({
        name: [
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
        ][i],
        users: 0,
        employers: 0,
        jobs: 0,
      })),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats(timeRange);
        console.log(response, "eres");

        if (response.success && response.data) {
          setDashboardData({
            stats: response.data.stats || {
              totalUsers: 0,
              totalEmployers: 0,
              totalJobs: 0,
              userGrowth: 0,
              employerGrowth: 0,
              jobGrowth: 0,
            },
            topJobs: response.data.topJobs || [],
            chartData:
              response.data.chartData ||
              Array(12)
                .fill()
                .map((_, i) => ({
                  name: [
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
                  ][i],
                  users: 0,
                  employers: 0,
                  jobs: 0,
                })),
          });
        }
      } catch (error) {
        toast.error("Failed to load dashboard data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header and controls */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {/* <Button variant="outline">
            Export <ChevronDown className="ml-2 h-4 w-4" />
          </Button> */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value={dashboardData.stats.totalUsers}
          growth={dashboardData.stats.userGrowth}
          icon={<Users className="h-4 w-4" />}
          timeRange={timeRange}
        />
        <StatCard
          title="Total Employers"
          value={dashboardData.stats.totalEmployers}
          growth={dashboardData.stats.employerGrowth}
          icon={<Building className="h-4 w-4" />}
          timeRange={timeRange}
        />
        <StatCard
          title="Total Job Posts"
          value={dashboardData.stats.totalJobs}
          growth={dashboardData.stats.jobGrowth}
          icon={<Briefcase className="h-4 w-4" />}
          timeRange={timeRange}
        />
      </div>

      {/* Chart Section */}
      {/* Chart Section */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Platform Growth
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Comparison of users, employers, and job posts over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData.chartData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 10,
                }}
                barSize={20}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(label) => `Period: ${label}`}
                  labelStyle={{ fontWeight: "bold", color: "#1f2937" }}
                />
                <Legend />
                <Bar
                  dataKey="users"
                  name="Users"
                  fill="#1e40af"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="employers"
                  name="Employers"
                  fill="#000000"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="jobs"
                  name="Job Posts"
                  fill="#93c5fd"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Most Popular Job Posts</CardTitle>
          <CardDescription>
            {dashboardData.topJobs.length > 0
              ? "Top 5 jobs with most applications"
              : "No job applications yet"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData.topJobs.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.topJobs.map((job) => (
                <div
                  key={job._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{job.jobTitle}</h3>
                      {/* <p className="text-sm text-gray-600 line-clamp-2">
                        {job.description}
                      </p> */}
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {job.applicationCount} application
                      {job.applicationCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      <span>
                        {job.city}, {job.state}, {job.country}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Banknote className="h-4 w-4 mr-1 text-gray-500" />
                      <span>
                        {job.salaryRange[0] === 0 && job.salaryRange[1] === 0
                          ? "Salary not specified"
                          : `₹${job.salaryRange[0]} - ₹${job.salaryRange[1]}`}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
                      <span>
                        {job.experienceRequired.length === 2
                          ? `${job.experienceRequired[0]} - ${job.experienceRequired[1]} years`
                          : job.experienceRequired.join(", ")}{" "}
                        years
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      <span>
                        {new Date(job.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FolderX className="h-10 w-10 mx-auto mb-2" />
              <p>No job applications received yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value, growth, icon, timeRange }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      <div
        className={`flex items-center text-xs ${
          growth >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {growth >= 0 ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )}
        {Math.abs(growth).toFixed(1)}% from last {timeRange}
      </div>
    </CardContent>
  </Card>
);

export default Dashboard;
