import type { LeaveRequestData } from "./faculty";

export interface AdminKpis {
  totalStudents: number;
  totalFaculty: number;
  todayAvgAttendance: number;
  activeLeaveRequests: number;
  aiSessionsToday: number;
  classesConductedToday: number;
}

export interface AttendanceTrendPoint {
  date: string;
  overall: number;
  cs: number;
  electronics: number;
}

export interface DepartmentAttendancePoint {
  department: string;
  current: number;
  previous: number;
}

export interface FacultyProductivityRow {
  id: string;
  name: string;
  department: string;
  classesThisMonth: number;
  studentsTaught: number;
  leaveDaysUsed: number;
  materialUploads: number;
}

export interface AtRiskStudentRow {
  id: string;
  name: string;
  rollNumber: string;
  subject: string;
  attendancePercentage: number;
  classesNeededFor75: number;
}

export interface AdminDashboardData {
  campusHealthScore: number;
  kpis: AdminKpis;
  attendanceTrends: AttendanceTrendPoint[];
  departmentAttendance: DepartmentAttendancePoint[];
  facultyProductivity: FacultyProductivityRow[];
  aiHeatmap: number[][];
  pendingLeaves: LeaveRequestData[];
}

export interface AttendanceAnalyticsData {
  trends: AttendanceTrendPoint[];
  atRiskStudents: AtRiskStudentRow[];
}
