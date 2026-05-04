import type {
  AdminDashboardData,
  AttendanceAnalyticsData,
  AttendanceTrendPoint,
  AtRiskStudentRow,
  DepartmentAttendancePoint,
  FacultyProductivityRow
} from "@campusiq/shared";
import { getLeaveRequests } from "./facultyData";
import { getStudentAttendanceSummary } from "./studentData";

const trends: AttendanceTrendPoint[] = [
  { date: "Apr 25", overall: 78, cs: 81, electronics: 76 },
  { date: "Apr 26", overall: 79, cs: 82, electronics: 76 },
  { date: "Apr 27", overall: 80, cs: 83, electronics: 77 },
  { date: "Apr 28", overall: 79, cs: 82, electronics: 78 },
  { date: "Apr 29", overall: 81, cs: 84, electronics: 79 },
  { date: "Apr 30", overall: 82, cs: 85, electronics: 80 },
  { date: "May 01", overall: 80, cs: 83, electronics: 79 },
  { date: "May 02", overall: 81, cs: 84, electronics: 80 },
  { date: "May 03", overall: 83, cs: 86, electronics: 81 },
  { date: "May 04", overall: 82, cs: 85, electronics: 80 }
];

const departmentAttendance: DepartmentAttendancePoint[] = [
  { department: "CS", current: 85, previous: 81 },
  { department: "ECE", current: 80, previous: 78 },
  { department: "ME", current: 77, previous: 76 },
  { department: "CE", current: 83, previous: 80 }
];

const facultyProductivity: FacultyProductivityRow[] = [
  {
    id: "fac-1",
    name: "Dr. Nisha Rao",
    department: "Computer Science",
    classesThisMonth: 34,
    studentsTaught: 80,
    leaveDaysUsed: 1,
    materialUploads: 5
  },
  {
    id: "fac-2",
    name: "Prof. Arjun Iyer",
    department: "Computer Science",
    classesThisMonth: 29,
    studentsTaught: 72,
    leaveDaysUsed: 2,
    materialUploads: 3
  },
  {
    id: "fac-3",
    name: "Dr. Meera Shah",
    department: "Computer Science",
    classesThisMonth: 31,
    studentsTaught: 76,
    leaveDaysUsed: 0,
    materialUploads: 4
  }
];

const atRiskStudents: AtRiskStudentRow[] = getStudentAttendanceSummary()
  .filter((summary) => summary.attendancePercentage < 75)
  .map((summary, index) => ({
    id: `risk-${summary.subjectId}`,
    name: index === 0 ? "Aarav Mehta" : "Kabir Sethi",
    rollNumber: index === 0 ? "CS25-047" : "CS25-058",
    subject: summary.subject,
    attendancePercentage: summary.attendancePercentage,
    classesNeededFor75: summary.classesNeededFor75
  }));

const aiHeatmap = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const eveningBoost = hour >= 19 && hour <= 23 ? 12 : 0;
    const morningBoost = hour >= 8 && hour <= 10 ? 5 : 0;
    return Math.min(20, ((day + 1) * (hour + 3)) % 11 + eveningBoost + morningBoost);
  })
);

export function getAdminDashboard(): AdminDashboardData {
  const leaves = getLeaveRequests();
  const pendingLeaves = leaves.filter((request) => request.status === "PENDING");
  const decidedLeaves = leaves.filter((request) => request.status !== "PENDING");
  const avgAttendance = Math.round(
    trends.reduce((sum, point) => sum + point.overall, 0) / trends.length
  );
  const leaveApprovalRate =
    decidedLeaves.length > 0
      ? (decidedLeaves.filter((request) => request.status === "APPROVED").length / decidedLeaves.length) * 100
      : 100;
  const aiEngagement = Math.min(1, 48 / 60);
  const campusHealthScore = Math.min(
    100,
    Math.round(avgAttendance * 0.5 + leaveApprovalRate * 0.3 + aiEngagement * 100 * 0.2)
  );

  return {
    campusHealthScore,
    kpis: {
      totalStudents: 80,
      totalFaculty: 16,
      todayAvgAttendance: avgAttendance,
      activeLeaveRequests: pendingLeaves.length,
      aiSessionsToday: 48,
      classesConductedToday: 36
    },
    attendanceTrends: trends,
    departmentAttendance,
    facultyProductivity,
    aiHeatmap,
    pendingLeaves
  };
}

export function getAttendanceAnalytics(): AttendanceAnalyticsData {
  return {
    trends,
    atRiskStudents
  };
}

export function getFacultyProductivity() {
  return facultyProductivity;
}

export function getStudentOverview() {
  return [
    { id: "stu-1", name: "Aarav Mehta", rollNumber: "CS25-047", department: "CS", semester: 5, overall: 79 },
    { id: "stu-2", name: "Isha Kapoor", rollNumber: "CS25-052", department: "CS", semester: 5, overall: 88 },
    { id: "stu-3", name: "Kabir Sethi", rollNumber: "CS25-058", department: "CS", semester: 5, overall: 73 },
    { id: "stu-4", name: "Naina Roy", rollNumber: "CS25-063", department: "CS", semester: 5, overall: 91 }
  ];
}
