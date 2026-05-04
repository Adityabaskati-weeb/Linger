import { motion } from "framer-motion";
import type { SubjectAttendanceSummary } from "@campusiq/shared";

interface AttendanceBarProps {
  summary: SubjectAttendanceSummary;
  index?: number;
}

function tone(percentage: number) {
  if (percentage < 75) return "from-danger to-warning";
  if (percentage < 85) return "from-warning to-primary";
  return "from-success to-cyan";
}

export function AttendanceBar({ summary, index = 0 }: AttendanceBarProps) {
  return (
    <div className="rounded-md border border-white/[0.07] bg-white/[0.035] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">{summary.subject}</p>
          <p className="mt-1 text-xs text-slate-500">{summary.code}</p>
        </div>
        <p className="font-mono text-sm text-slate-200">{summary.attendancePercentage}%</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${summary.attendancePercentage}%` }}
          transition={{ duration: 0.8, delay: index * 0.08, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${tone(summary.attendancePercentage)}`}
        />
      </div>
      <p className="mt-3 text-xs text-slate-500">
        {summary.attendedClasses}/{summary.totalClasses} classes attended
        {summary.classesNeededFor75 > 0
          ? `, ${summary.classesNeededFor75} more needed for 75%`
          : ", safely above threshold"}
      </p>
    </div>
  );
}
