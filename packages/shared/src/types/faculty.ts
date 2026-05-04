import type { AttendanceStatus } from "./attendance";
import type { TimetableSlot } from "./timetable";

export interface FacultySubject {
  subjectId: string;
  subject: string;
  code: string;
  enrolledStudents: number;
}

export interface RosterStudent {
  id: string;
  name: string;
  rollNumber: string;
  avatarUrl?: string;
}

export interface AttendanceMark {
  studentId: string;
  status: AttendanceStatus;
}

export interface AttendanceSessionSummary {
  id: string;
  subjectId: string;
  subject: string;
  date: string;
  duration: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
}

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";
export type LeaveType = "SICK" | "CASUAL" | "EARNED" | "EMERGENCY";

export interface LeaveRequestData {
  id: string;
  type: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  adminNote?: string;
  createdAt: string;
}

export interface CourseMaterialData {
  id: string;
  subjectId: string;
  subject: string;
  title: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  contentPreview: string;
}

export interface FacultyDashboardData {
  stats: {
    classesToday: number;
    studentsTaught: number;
    leaveBalance: number;
    pendingLeaveRequests: number;
  };
  todayClasses: TimetableSlot[];
  weeklyLoad: Array<{ day: string; classes: number }>;
  recentSessions: AttendanceSessionSummary[];
  leaveRequests: LeaveRequestData[];
}
