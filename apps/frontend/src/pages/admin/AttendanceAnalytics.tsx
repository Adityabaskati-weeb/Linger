import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { AttendanceAnalyticsData } from "@campusiq/shared";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/axios";

export function AdminAttendanceAnalytics() {
  const [data, setData] = useState<AttendanceAnalyticsData | null>(null);

  useEffect(() => {
    api
      .get<{ success: true; data: AttendanceAnalyticsData }>("/admin/attendance/analytics")
      .then((response) => setData(response.data.data));
  }, []);

  if (!data) return <Card className="animate-pulse text-sm text-slate-400">Loading analytics...</Card>;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <Card>
        <h2 className="font-display text-2xl font-semibold">Campus Attendance Over Time</h2>
        <div className="mt-5 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.trends}>
              <XAxis dataKey="date" stroke="#9898B4" tickLine={false} axisLine={false} />
              <YAxis stroke="#9898B4" tickLine={false} axisLine={false} domain={[60, 100]} />
              <Tooltip contentStyle={{ background: "#16162A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
              <Area dataKey="overall" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.18} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-2xl font-semibold">Below 75% Students</h2>
        <div className="mt-5 overflow-hidden rounded-lg border border-white/[0.07]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Roll No</th>
                <th className="p-4">Sub Code</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Current</th>
                <th className="p-4">Needed</th>
              </tr>
            </thead>
            <tbody>
              {data.atRiskStudents.map((student) => (
                <tr key={student.id} className="border-t border-white/[0.06]">
                  <td className="p-4 text-white">{student.name}</td>
                  <td className="p-4 font-mono text-slate-400">{student.rollNumber}</td>
                  <td className="p-4 font-mono text-cyan">{student.subjectCode}</td>
                  <td className="p-4 text-slate-300">{student.subject}</td>
                  <td className="p-4 text-red-200">{student.attendancePercentage}%</td>
                  <td className="p-4 text-amber-200">{student.classesNeededFor75}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.section>
  );
}
