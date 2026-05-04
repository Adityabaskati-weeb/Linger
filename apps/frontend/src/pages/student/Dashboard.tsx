import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Bot, CalendarDays, TrendingUp } from "lucide-react";
import type { StudentDashboardData } from "@campusiq/shared";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AttendanceBar } from "../../components/shared/AttendanceBar";
import { SessionTimeline } from "../../components/shared/SessionTimeline";
import { StatCard } from "../../components/shared/StatCard";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/axios";

export function StudentDashboard() {
  const [data, setData] = useState<StudentDashboardData | null>(null);

  useEffect(() => {
    api
      .get<{ success: true; data: StudentDashboardData }>("/student/dashboard")
      .then((response) => setData(response.data.data));
  }, []);

  if (!data) {
    return <Card className="animate-pulse text-sm text-slate-400">Loading student intelligence...</Card>;
  }

  const chartData = data.summaries.map((summary) => ({
    subject: summary.code,
    attendance: summary.attendancePercentage
  }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Overall Attendance"
          value={data.stats.overallAttendance}
          suffix="%"
          subtext="Minimum 75% required"
          tone={data.stats.overallAttendance < 75 ? "warning" : "success"}
          icon={<TrendingUp className="h-5 w-5" />}
          sparkline={data.summaries[0]?.trend}
        />
        <StatCard
          label="Classes Today"
          value={data.stats.classesToday}
          subtext={`Next: ${data.stats.nextClass}`}
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatCard
          label="AI Sessions"
          value={data.stats.aiSessionsThisWeek}
          subtext="Study streak is active"
          tone="info"
          icon={<Bot className="h-5 w-5" />}
        />
        <StatCard
          label="Pending Subjects"
          value={data.stats.pendingSubjects}
          subtext="Below the 75% threshold"
          tone={data.stats.pendingSubjects > 0 ? "danger" : "success"}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <div className="mb-5">
            <h2 className="font-display text-2xl font-semibold">Attendance by Subject</h2>
            <p className="mt-1 text-sm text-slate-500">Color-coded against the 75% threshold.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="subject" stroke="#9898B4" tickLine={false} axisLine={false} />
                <YAxis stroke="#9898B4" tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{
                    background: "#16162A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#F1F1F8"
                  }}
                />
                <Bar dataKey="attendance" fill="url(#attendanceGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-5">
            <h2 className="font-display text-2xl font-semibold">Today&apos;s Schedule</h2>
            <p className="mt-1 text-sm text-slate-500">Live class timeline for the student.</p>
          </div>
          <SessionTimeline items={data.todaySchedule} />
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {data.summaries.map((summary, index) => (
          <AttendanceBar key={summary.subjectId} summary={summary} index={index} />
        ))}
      </div>

      {data.atRiskSubjects.length ? (
        <Card className="border-danger/20 bg-danger/10">
          <p className="font-medium text-red-100">
            At risk in {data.atRiskSubjects.map((subject) => subject.subject).join(", ")}
          </p>
          <p className="mt-2 text-sm leading-6 text-red-100/75">
            Attend the next required classes shown above to climb back to 75% before internal review.
          </p>
        </Card>
      ) : null}
    </motion.section>
  );
}
