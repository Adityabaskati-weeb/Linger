import { FormEvent, useEffect, useState } from "react";
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
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { api } from "../../lib/axios";

export function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    body: "",
    audience: "ALL",
    category: "GENERAL"
  });

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

  async function publishAnnouncement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await api.post("/admin/announcements", announcementForm);
    setAnnouncementForm({ title: "", body: "", audience: "ALL", category: "GENERAL" });
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
            <h2 className="mt-4 font-display text-5xl font-semibold">Campus Command Center</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Composite score from attendance, leave approvals, and AI engagement.
            </p>
          </div>
          <HealthScore score={data.campusHealthScore} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value={data.kpis.totalStudents} subtext="Across departments" icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard label="Total Faculty" value={data.kpis.totalFaculty} subtext="Active teaching staff" icon={<Users className="h-5 w-5" />} />
        <StatCard label="Avg Attendance" value={data.kpis.todayAvgAttendance} suffix="%" subtext="Today across campus" icon={<Activity className="h-5 w-5" />} />
        <StatCard label="Student Avg" value={data.kpis.avgStudentAttendance} suffix="%" subtext="Current enrolled sample" icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard label="Faculty Avg" value={data.kpis.avgFacultyAttendance} suffix="%" subtext="Classes conducted index" icon={<UserCheck className="h-5 w-5" />} />
        <StatCard label="Pending Leaves" value={data.kpis.activeLeaveRequests} subtext="Need approval" tone="warning" icon={<UserCheck className="h-5 w-5" />} />
        <StatCard label="AI Sessions" value={data.kpis.aiSessionsToday} subtext="Student study-agent interactions today" icon={<BrainCircuit className="h-5 w-5" />} />
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
          <p className="mt-1 text-sm text-slate-500">
            Purpose: compare department health month-over-month and identify where mentors should intervene.
          </p>
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

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <h2 className="font-display text-2xl font-semibold">Add Announcement</h2>
          <p className="mt-1 text-sm text-slate-500">Publish notices to students, faculty, or everyone.</p>
          <form onSubmit={publishAnnouncement} className="mt-5 space-y-3">
            <Input placeholder="Announcement title" value={announcementForm.title} onChange={(event) => setAnnouncementForm((current) => ({ ...current, title: event.target.value }))} />
            <Input placeholder="Announcement message" value={announcementForm.body} onChange={(event) => setAnnouncementForm((current) => ({ ...current, body: event.target.value }))} />
            <div className="grid gap-3 md:grid-cols-2">
              <select
                value={announcementForm.audience}
                onChange={(event) => setAnnouncementForm((current) => ({ ...current, audience: event.target.value }))}
                className="h-11 rounded-md border border-white/10 bg-overlay px-3 text-sm text-white"
              >
                <option>ALL</option>
                <option>STUDENT</option>
                <option>FACULTY</option>
              </select>
              <select
                value={announcementForm.category}
                onChange={(event) => setAnnouncementForm((current) => ({ ...current, category: event.target.value }))}
                className="h-11 rounded-md border border-white/10 bg-overlay px-3 text-sm text-white"
              >
                <option>GENERAL</option>
                <option>ACADEMIC</option>
                <option>EXAM</option>
                <option>EVENT</option>
              </select>
            </div>
            <Button disabled={announcementForm.title.length < 4 || announcementForm.body.length < 8}>
              Publish Announcement
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="font-display text-2xl font-semibold">Faculty Attendance</h2>
          <p className="mt-1 text-sm text-slate-500">Attendance is now visible as working-days present versus total days.</p>
          <div className="mt-5 overflow-hidden rounded-lg border border-white/[0.07]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="p-4">Faculty</th>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Present</th>
                  <th className="p-4">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {data.facultyAttendance.map((row) => (
                  <tr key={row.id} className="border-t border-white/[0.06]">
                    <td className="p-4 text-white">{row.name}</td>
                    <td className="p-4 font-mono text-cyan">{row.employeeId}</td>
                    <td className="p-4 text-slate-400">{row.department}</td>
                    <td className="p-4">{row.presentDays}/{row.totalWorkingDays}</td>
                    <td className={row.attendancePercentage < 85 ? "p-4 text-amber-200" : "p-4 text-emerald-200"}>
                      {row.attendancePercentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </motion.section>
  );
}
