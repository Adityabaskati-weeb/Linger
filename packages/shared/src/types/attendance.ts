export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export interface SubjectAttendanceSummary {
  subjectId: string;
  subject: string;
  code: string;
  faculty: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
  classesNeededFor75: number;
  remainingClasses: number;
  projectedAttendance: number;
  thresholdProbability: number;
  trend: number[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  subjectId: string;
  subject: string;
  status: AttendanceStatus;
  faculty: string;
}

export interface StudentDashboardData {
  stats: {
    overallAttendance: number;
    classesToday: number;
    aiSessionsThisWeek: number;
    pendingSubjects: number;
    nextClass: string;
  };
  summaries: SubjectAttendanceSummary[];
  todaySchedule: StudentScheduleItem[];
  atRiskSubjects: SubjectAttendanceSummary[];
}

export interface StudentScheduleItem {
  id: string;
  subjectId: string;
  subject: string;
  code: string;
  faculty: string;
  room: string;
  startTime: string;
  endTime: string;
  status: "completed" | "current" | "upcoming";
}
