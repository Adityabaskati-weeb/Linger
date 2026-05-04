import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { FacultyDashboardData } from "@campusiq/shared";
import { BookOpenCheck, CalendarCheck, ClipboardList, PlaneTakeoff } from "lucide-react";
import { SessionTimeline } from "../../components/shared/SessionTimeline";
import { StatCard } from "../../components/shared/StatCard";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/axios";

export function FacultyDashboard() {
  const [data, setData] = useState<FacultyDashboardData | null>(null);

  useEffect(() => {
    api
      .get<{ success: true; data: FacultyDashboardData }>("/faculty/dashboard")
      .then((response) => setData(response.data.data));
  }, []);

  if (!data) {
    return <Card className="animate-pulse text-sm text-slate-400">Loading faculty workspace...</Card>;
  }

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
          label="Classes Today"
          value={data.stats.classesToday}
          subtext="Scheduled for today"
          icon={<CalendarCheck className="h-5 w-5" />}
        />
        <StatCard
          label="Students Taught"
          value={data.stats.studentsTaught}
          subtext="Across assigned subjects"
          icon={<BookOpenCheck className="h-5 w-5" />}
        />
        <StatCard
          label="Leave Balance"
          value={data.stats.leaveBalance}
          subtext="Available days"
          tone="success"
          icon={<PlaneTakeoff className="h-5 w-5" />}
        />
        <StatCard
          label="Pending Requests"
          value={data.stats.pendingLeaveRequests}
          subtext="Awaiting admin action"
          tone={data.stats.pendingLeaveRequests ? "warning" : "success"}
          icon={<ClipboardList className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <h2 className="font-display text-2xl font-semibold">Today&apos;s Classes</h2>
          <p className="mt-1 text-sm text-slate-500">Quick view before marking attendance.</p>
          <div className="mt-5">
            <SessionTimeline
              items={data.todayClasses.map((item, index) => ({
                id: item.id,
                subjectId: item.subjectId,
                subject: item.subject,
                code: item.code,
                faculty: item.faculty,
                room: item.room,
                startTime: item.startTime,
                endTime: item.endTime,
                status: index === 0 ? "current" : "upcoming"
              }))}
            />
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-2xl font-semibold">Weekly Load</h2>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyLoad}>
                <XAxis dataKey="day" stroke="#9898B4" tickLine={false} axisLine={false} />
                <YAxis stroke="#9898B4" tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{
                    background: "#16162A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#F1F1F8"
                  }}
                />
                <Bar dataKey="classes" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-display text-2xl font-semibold">Recent Attendance Sessions</h2>
        <div className="mt-5 overflow-hidden rounded-lg border border-white/[0.07]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="p-4">Subject</th>
                <th className="p-4">Date</th>
                <th className="p-4">Present</th>
                <th className="p-4">Absent</th>
                <th className="p-4">Late</th>
              </tr>
            </thead>
            <tbody>
              {data.recentSessions.map((session) => (
                <tr key={session.id} className="border-t border-white/[0.06]">
                  <td className="p-4 text-white">{session.subject}</td>
                  <td className="p-4 font-mono text-slate-400">{session.date}</td>
                  <td className="p-4 text-emerald-200">{session.present}/{session.total}</td>
                  <td className="p-4 text-red-200">{session.absent}</td>
                  <td className="p-4 text-amber-200">{session.late}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.section>
  );
}
