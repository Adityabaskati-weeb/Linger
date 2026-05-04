import type {
  AdminDashboardData,
  AttendanceAnalyticsData,
  AttendanceTrendPoint,
  AtRiskStudentRow,
  DepartmentAcademicMap,
  DepartmentAttendancePoint,
  FacultyAttendanceRow,
  FacultyProductivityRow,
  StudentOverviewRow
} from "@campusiq/shared";
import { getAnnouncements } from "./announcementData";
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

let facultyProductivity: FacultyProductivityRow[] = [
  {
    id: "fac-1",
    name: "Dr. Nisha Rao",
    department: "Computer Science",
    employeeId: "E16783",
    subjectCode: "CS301 / CS309",
    classesThisMonth: 34,
    studentsTaught: 80,
    leaveDaysUsed: 1,
    materialUploads: 5
  },
  {
    id: "fac-2",
    name: "Prof. Arjun Iyer",
    department: "Computer Science",
    employeeId: "E17420",
    subjectCode: "CS303",
    classesThisMonth: 29,
    studentsTaught: 72,
    leaveDaysUsed: 2,
    materialUploads: 3
  },
  {
    id: "fac-3",
    name: "Dr. Meera Shah",
    department: "Computer Science",
    employeeId: "E18116",
    subjectCode: "CS305",
    classesThisMonth: 31,
    studentsTaught: 76,
    leaveDaysUsed: 0,
    materialUploads: 4
  }
];

let studentOverview: StudentOverviewRow[] = [
  { id: "stu-1", name: "Telheiba", rollNumber: "CS26-112", department: "CS", semester: 6, overall: 79 },
  { id: "stu-2", name: "Isha Kapoor", rollNumber: "CS25-052", department: "CS", semester: 5, overall: 88 },
  { id: "stu-3", name: "Kabir Sethi", rollNumber: "CS25-058", department: "CS", semester: 5, overall: 73 },
  { id: "stu-4", name: "Naina Roy", rollNumber: "CS25-063", department: "CS", semester: 5, overall: 91 },
  { id: "stu-5", name: "Tara Joshi", rollNumber: "CS25-074", department: "CS", semester: 5, overall: 84 }
];

const atRiskStudents: AtRiskStudentRow[] = getStudentAttendanceSummary()
  .filter((summary) => summary.attendancePercentage < 75)
  .map((summary, index) => ({
    id: `risk-${summary.subjectId}`,
    name: index === 0 ? "Telheiba" : "Kabir Sethi",
    rollNumber: index === 0 ? "CS26-112" : "CS25-058",
    subject: summary.subject,
    subjectCode: summary.code,
    attendancePercentage: summary.attendancePercentage,
    classesNeededFor75: summary.classesNeededFor75
  }));

const departments: DepartmentAcademicMap[] = [
  {
    id: "dept-cs",
    name: "Computer Science",
    code: "CS",
    courses: 4,
    purpose: "Used to compare attendance health, elective enrollment, faculty load, and timetable coverage.",
    subjects: [
      {
        subject: "Data Structures",
        code: "CS301",
        faculty: ["Dr. Nisha Rao"],
        students: ["Telheiba", "Isha Kapoor", "Kabir Sethi", "Naina Roy", "Reyansh Nair"]
      },
      {
        subject: "AI Fundamentals",
        code: "CS309",
        faculty: ["Dr. Nisha Rao"],
        students: ["Telheiba", "Tara Joshi", "Vihaan Kulkarni", "Zoya Fernandes"]
      },
      {
        subject: "Operating Systems",
        code: "CS303",
        faculty: ["Prof. Arjun Iyer"],
        students: ["Isha Kapoor", "Kabir Sethi", "Reyansh Nair"]
      }
    ]
  },
  {
    id: "dept-ece",
    name: "Electronics",
    code: "ECE",
    courses: 3,
    purpose: "Tracks circuit lab attendance, faculty workload, and cross-department electives.",
    subjects: [
      { subject: "Digital Electronics", code: "EC201", faculty: ["Prof. Kavya Menon"], students: ["Anaya Rao", "Dev Patel"] }
    ]
  },
  {
    id: "dept-me",
    name: "Mechanical",
    code: "ME",
    courses: 3,
    purpose: "Summarizes workshop attendance and room/lab utilization for timetable planning.",
    subjects: [
      { subject: "Thermodynamics", code: "ME204", faculty: ["Dr. Viren Sood"], students: ["Raghav Jain", "Sahil Khan"] }
    ]
  },
  {
    id: "dept-ce",
    name: "Civil",
    code: "CE",
    courses: 3,
    purpose: "Supports construction lab scheduling and student risk reporting.",
    subjects: [
      { subject: "Surveying", code: "CE210", faculty: ["Prof. Leena Dutta"], students: ["Mehak Gill", "Aditi Sinha"] }
    ]
  }
];

const aiHeatmap = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const eveningBoost = hour >= 19 && hour <= 23 ? 12 : 0;
    const morningBoost = hour >= 8 && hour <= 10 ? 5 : 0;
    return Math.min(20, ((day + 1) * (hour + 3)) % 11 + eveningBoost + morningBoost);
  })
);

const facultyAttendance: FacultyAttendanceRow[] = [
  {
    id: "fac-att-1",
    name: "Dr. Nisha Rao",
    employeeId: "E16783",
    department: "Computer Science",
    presentDays: 22,
    totalWorkingDays: 24,
    attendancePercentage: 92
  },
  {
    id: "fac-att-2",
    name: "Prof. Arjun Iyer",
    employeeId: "E17420",
    department: "Computer Science",
    presentDays: 20,
    totalWorkingDays: 24,
    attendancePercentage: 83
  },
  {
    id: "fac-att-3",
    name: "Dr. Meera Shah",
    employeeId: "E18116",
    department: "Computer Science",
    presentDays: 24,
    totalWorkingDays: 24,
    attendancePercentage: 100
  }
];

export function getAdminDashboard(): AdminDashboardData {
  const leaves = getLeaveRequests();
  const pendingLeaves = leaves.filter((request) => request.status === "PENDING");
  const decidedLeaves = leaves.filter((request) => request.status !== "PENDING");
  const avgAttendance = Math.round(
    trends.reduce((sum, point) => sum + point.overall, 0) / trends.length
  );
  const avgStudentAttendance = Math.round(
    studentOverview.reduce((sum, student) => sum + student.overall, 0) / studentOverview.length
  );
  const avgFacultyAttendance = Math.round(
    facultyProductivity.reduce((sum, faculty) => sum + Math.min(98, 70 + faculty.classesThisMonth / 2), 0) /
      facultyProductivity.length
  );
  const leaveApprovalRate =
    decidedLeaves.length > 0
      ? (decidedLeaves.filter((request) => request.status === "APPROVED").length / decidedLeaves.length) * 100
      : 100;
  const aiEngagement = Math.min(1, 48 / Math.max(1, studentOverview.length * 12));
  const campusHealthScore = Math.min(
    100,
    Math.round(avgAttendance * 0.5 + leaveApprovalRate * 0.3 + aiEngagement * 100 * 0.2)
  );

  return {
    campusHealthScore,
    kpis: {
      totalStudents: Math.max(80, studentOverview.length),
      totalFaculty: Math.max(16, facultyProductivity.length),
      todayAvgAttendance: avgAttendance,
      avgStudentAttendance,
      avgFacultyAttendance,
      activeLeaveRequests: pendingLeaves.length,
      aiSessionsToday: 48,
      classesConductedToday: 36
    },
    attendanceTrends: trends,
    departmentAttendance,
    facultyProductivity,
    facultyAttendance,
    aiHeatmap,
    pendingLeaves,
    announcements: getAnnouncements()
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

export function getFacultyAttendance() {
  return facultyAttendance;
}

export function createFaculty(input: { name: string; department: string; employeeId: string; subjectCode: string }) {
  const faculty: FacultyProductivityRow = {
    id: `fac-${Date.now()}`,
    name: input.name,
    department: input.department,
    employeeId: input.employeeId,
    subjectCode: input.subjectCode,
    classesThisMonth: 0,
    studentsTaught: 0,
    leaveDaysUsed: 0,
    materialUploads: 0
  };

  facultyProductivity = [faculty, ...facultyProductivity];
  return faculty;
}

export function removeFaculty(id: string) {
  const exists = facultyProductivity.some((faculty) => faculty.id === id);
  facultyProductivity = facultyProductivity.filter((faculty) => faculty.id !== id);
  return exists;
}

export function getStudentOverview() {
  return studentOverview;
}

export function createStudent(input: {
  name: string;
  rollNumber: string;
  department: string;
  semester: number;
  overall?: number;
}) {
  const student: StudentOverviewRow = {
    id: `stu-${Date.now()}`,
    name: input.name,
    rollNumber: input.rollNumber,
    department: input.department,
    semester: input.semester,
    overall: input.overall ?? 75
  };

  studentOverview = [student, ...studentOverview];
  return student;
}

export function removeStudent(id: string) {
  const exists = studentOverview.some((student) => student.id === id);
  studentOverview = studentOverview.filter((student) => student.id !== id);
  return exists;
}

export function getDepartments() {
  return departments;
}
