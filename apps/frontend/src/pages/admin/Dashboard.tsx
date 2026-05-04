import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, BrainCircuit, CalendarClock, GraduationCap, UserCheck, Users } from "lucide-react";
import type { AdminDashboardData } from "@campusiq/shared";
import {
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { AttendanceHeatmap } from "../../components/admin/AttendanceHeatmap";
import { HealthScore } from "../../components/admin/HealthScore";
import { LeaveApprovalFeed } from "../../components/admin/LeaveApprovalFeed";
import { StatCard } from "../../components/shared/StatCard";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/axios";

export function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);

  function load() {
    api.get<{ success: true; data: AdminDashboardData }>("/admin/dashboard").then((response) => {
      setData(response.data.data);
    });
  }

  useEffect(load, []);

  async function decideLeave(id: string, status: "APPROVED" | "REJECTED") {
    await api.patch(`/admin/leave/${id}`, {
      status,
      adminNote: status === "APPROVED" ? "Approved from command center." : "Rejected from command center."
    });
    load();
  }

  if (!data) {
    return <Card className="animate-pulse text-sm text-slate-400">Loading command center...</Card>;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <Card glow className="overflow-hidden">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan">Campus Health</p>
            <h2 className="mt-4 font-display text-5xl font-semibold">Principal Command Center</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Composite score from attendance, leave approvals, and AI engagement.
            </p>
          </div>
          <HealthScore score={data.campusHealthScore} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Students" value={data.kpis.totalStudents} subtext="Across departments" icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard label="Total Faculty" value={data.kpis.totalFaculty} subtext="Active teaching staff" icon={<Users className="h-5 w-5" />} />
        <StatCard label="Avg Attendance" value={data.kpis.todayAvgAttendance} suffix="%" subtext="Today across campus" icon={<Activity className="h-5 w-5" />} />
        <StatCard label="Pending Leaves" value={data.kpis.activeLeaveRequests} subtext="Need approval" tone="warning" icon={<UserCheck className="h-5 w-5" />} />
        <StatCard label="AI Sessions" value={data.kpis.aiSessionsToday} subtext="Today" icon={<BrainCircuit className="h-5 w-5" />} />
        <StatCard label="Classes Today" value={data.kpis.classesConductedToday} subtext="Conducted sessions" icon={<CalendarClock className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl font-semibold">Attendance Trends</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.attendanceTrends}>
                <XAxis dataKey="date" stroke="#9898B4" tickLine={false} axisLine={false} />
                <YAxis stroke="#9898B4" tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={{ background: "#16162A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="overall" stroke="#06B6D4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="cs" stroke="#6366F1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-2xl font-semibold">Department Attendance</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.departmentAttendance}>
                <PolarGrid stroke="rgba(255,255,255,0.10)" />
                <PolarAngleAxis dataKey="department" stroke="#9898B4" />
                <Radar dataKey="current" fill="#6366F1" fillOpacity={0.35} stroke="#6366F1" />
                <Radar dataKey="previous" fill="#06B6D4" fillOpacity={0.15} stroke="#06B6D4" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <h2 className="font-display text-2xl font-semibold">Pending Approvals</h2>
          <div className="mt-5">
            <LeaveApprovalFeed leaves={data.pendingLeaves} onDecision={decideLeave} />
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-2xl font-semibold">AI Engagement Heatmap</h2>
          <p className="mt-1 text-sm text-slate-500">Rows are days, columns are hours.</p>
          <div className="mt-5">
            <AttendanceHeatmap data={data.aiHeatmap} />
          </div>
        </Card>
      </div>
    </motion.section>
  );
}
