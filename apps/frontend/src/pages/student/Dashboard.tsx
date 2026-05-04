import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Bot, CalendarDays, Download, TrendingUp } from "lucide-react";
import type { StudentDashboardData } from "@campusiq/shared";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { AttendanceBar } from "../../components/shared/AttendanceBar";
import { SessionTimeline } from "../../components/shared/SessionTimeline";
import { StatCard } from "../../components/shared/StatCard";
import { Button } from "../../components/ui/Button";
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

  const dashboard = data;
  const chartData = dashboard.summaries.map((summary) => ({
    subject: summary.code,
    attendance: summary.attendancePercentage,
    forecast: summary.projectedAttendance,
    probability: summary.thresholdProbability
  }));

  function exportDashboardCsv() {
    const generatedDate = new Date().toISOString().slice(0, 10);
    const rows = [
      ["Export Date", "Subject Code", "Subject", "Current %", "Projected %", "Probability To Reach 75", "Classes Needed"],
      ...dashboard.summaries.map((summary) => [
        generatedDate,
        summary.code,
        summary.subject,
        String(summary.attendancePercentage),
        String(summary.projectedAttendance),
        `${summary.thresholdProbability}%`,
        String(summary.classesNeededFor75)
      ])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `campusiq-student-dashboard-${generatedDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {data.atRiskSubjects.length ? (
        <Card className="border-danger/20 bg-danger/10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium text-red-100">
                Low attendance notification: {data.atRiskSubjects.map((subject) => `${subject.code} ${subject.subject}`).join(", ")}
              </p>
              <p className="mt-2 text-sm leading-6 text-red-100/75">
                CampusIQ predicts recovery odds and required classes so you can act before the 75% review.
              </p>
            </div>
            <Button variant="danger" onClick={exportDashboardCsv}>
              <Download className="h-4 w-4" />
              Export With Date
            </Button>
          </div>
        </Card>
      ) : null}

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
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">Attendance by Subject</h2>
              <p className="mt-1 text-sm text-slate-500">Current bars with forecast line against the 75% threshold.</p>
            </div>
            <Button variant="secondary" onClick={exportDashboardCsv}>
              <Download className="h-4 w-4" />
              CSV
            </Button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
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
                <Line type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                <ReferenceLine y={75} stroke="#F59E0B" strokeDasharray="4 4" />
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </ComposedChart>
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

      <Card>
        <div className="mb-5">
          <h2 className="font-display text-2xl font-semibold">AI Attendance Forecast</h2>
          <p className="mt-1 text-sm text-slate-500">
            Forecast probability estimates whether each subject can still reach 75% through remaining classes.
          </p>
        </div>
        <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-3">
            {data.summaries.map((summary) => (
              <div key={summary.subjectId} className="rounded-lg border border-white/[0.07] bg-white/[0.035] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-cyan">{summary.code}</p>
                    <p className="mt-1 font-medium text-white">{summary.subject}</p>
                  </div>
                  <p className={summary.thresholdProbability < 50 ? "font-display text-2xl text-red-200" : "font-display text-2xl text-emerald-200"}>
                    {summary.thresholdProbability}%
                  </p>
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  Needs {summary.classesNeededFor75} class(es); {summary.remainingClasses} class(es) remain. Projected final: {summary.projectedAttendance}%.
                </p>
              </div>
            ))}
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="subject" stroke="#9898B4" tickLine={false} axisLine={false} />
                <YAxis stroke="#9898B4" tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "#16162A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#F1F1F8"
                  }}
                />
                <Area type="monotone" dataKey="probability" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.18} />
                <Line type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={2} />
                <ReferenceLine y={75} stroke="#F59E0B" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {data.summaries.map((summary, index) => (
          <AttendanceBar key={summary.subjectId} summary={summary} index={index} />
        ))}
      </div>

    </motion.section>
  );
}
