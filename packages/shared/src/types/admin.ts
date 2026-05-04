import type { LeaveRequestData } from "./faculty";
import type { AnnouncementData } from "./portal";

export interface AdminKpis {
  totalStudents: number;
  totalFaculty: number;
  todayAvgAttendance: number;
  avgStudentAttendance: number;
  avgFacultyAttendance: number;
  activeLeaveRequests: number;
  aiSessionsToday: number;
  classesConductedToday: number;
}

export interface FacultyAttendanceRow {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  presentDays: number;
  totalWorkingDays: number;
  attendancePercentage: number;
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
  employeeId: string;
  subjectCode: string;
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
  subjectCode: string;
  attendancePercentage: number;
  classesNeededFor75: number;
}

export interface StudentOverviewRow {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  semester: number;
  overall: number;
}

export interface DepartmentSubjectRoster {
  subject: string;
  code: string;
  faculty: string[];
  students: string[];
}

export interface DepartmentAcademicMap {
  id: string;
  name: string;
  code: string;
  courses: number;
  purpose: string;
  subjects: DepartmentSubjectRoster[];
}

export interface AdminDashboardData {
  campusHealthScore: number;
  kpis: AdminKpis;
  attendanceTrends: AttendanceTrendPoint[];
  departmentAttendance: DepartmentAttendancePoint[];
  facultyProductivity: FacultyProductivityRow[];
  facultyAttendance: FacultyAttendanceRow[];
  aiHeatmap: number[][];
  pendingLeaves: LeaveRequestData[];
  announcements: AnnouncementData[];
}

export interface AttendanceAnalyticsData {
  trends: AttendanceTrendPoint[];
  atRiskStudents: AtRiskStudentRow[];
}
