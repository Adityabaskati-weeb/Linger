import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { AttendanceRecord, SubjectAttendanceSummary } from "@campusiq/shared";
import { Download } from "lucide-react";
import { AttendanceBar } from "../../components/shared/AttendanceBar";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/axios";

export function StudentAttendance() {
  const [summaries, setSummaries] = useState<SubjectAttendanceSummary[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [subjectId, setSubjectId] = useState("all");

  useEffect(() => {
    api
      .get<{ success: true; data: SubjectAttendanceSummary[] }>("/student/attendance/summary")
      .then((response) => setSummaries(response.data.data));
  }, []);

  useEffect(() => {
    api
      .get<{ success: true; data: AttendanceRecord[] }>("/student/attendance", {
        params: subjectId === "all" ? undefined : { subjectId }
      })
      .then((response) => setRecords(response.data.data));
  }, [subjectId]);

  const csv = useMemo(() => {
    const rows = [["Date", "Subject", "Status", "Faculty"]];
    records.forEach((record) => rows.push([record.date, record.subject, record.status, record.faculty]));
    return rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  }, [records]);

  function downloadCsv() {
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "campusiq-attendance.csv";
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
      <div className="grid gap-4 xl:grid-cols-2">
        {summaries.map((summary, index) => (
          <AttendanceBar key={summary.subjectId} summary={summary} index={index} />
        ))}
      </div>

      <Card>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">Attendance Records</h2>
            <p className="mt-1 text-sm text-slate-500">Filter by subject and export for review.</p>
          </div>
          <div className="flex gap-3">
            <select
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              className="h-11 rounded-md border border-white/10 bg-overlay px-3 text-sm text-white outline-none"
            >
              <option value="all">All subjects</option>
              {summaries.map((summary) => (
                <option key={summary.subjectId} value={summary.subjectId}>
                  {summary.subject}
                </option>
              ))}
            </select>
            <Button variant="secondary" onClick={downloadCsv}>
              <Download className="h-4 w-4" />
              CSV
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/[0.07]">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Status</th>
                <th className="p-4">Faculty</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-t border-white/[0.06]">
                  <td className="p-4 font-mono text-slate-400">{record.date}</td>
                  <td className="p-4 text-white">{record.subject}</td>
                  <td className="p-4 text-slate-300">{record.status}</td>
                  <td className="p-4 text-slate-400">{record.faculty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.section>
  );
}
