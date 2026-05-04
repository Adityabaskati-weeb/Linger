import { differenceInCalendarDays } from "date-fns";
import type {
  AttendanceMark,
  AttendanceSessionSummary,
  CourseMaterialData,
  FacultyDashboardData,
  FacultySubject,
  LeaveRequestData,
  LeaveStatus,
  LeaveType,
  RosterStudent,
  TimetableSlot
} from "@campusiq/shared";

const subjectCatalog: FacultySubject[] = [
  { subjectId: "sub-dsa", subject: "Data Structures", code: "CS301", enrolledStudents: 42 },
  { subjectId: "sub-os", subject: "Operating Systems", code: "CS303", enrolledStudents: 40 },
  { subjectId: "sub-dbms", subject: "Database Systems", code: "CS305", enrolledStudents: 44 },
  { subjectId: "sub-cn", subject: "Computer Networks", code: "CS307", enrolledStudents: 39 },
  { subjectId: "sub-ai", subject: "AI Fundamentals", code: "CS309", enrolledStudents: 38 }
];

const facultySubjects: FacultySubject[] = [subjectCatalog[0], subjectCatalog[4]];

const rosterBySubject: Record<string, RosterStudent[]> = {
  "sub-dsa": [
    { id: "stu-1", name: "Telheiba", rollNumber: "CS26-112" },
    { id: "stu-2", name: "Isha Kapoor", rollNumber: "CS25-052" },
    { id: "stu-3", name: "Kabir Sethi", rollNumber: "CS25-058" },
    { id: "stu-4", name: "Naina Roy", rollNumber: "CS25-063" },
    { id: "stu-5", name: "Reyansh Nair", rollNumber: "CS25-069" },
    { id: "stu-6", name: "Tara Joshi", rollNumber: "CS25-074" }
  ],
  "sub-ai": [
    { id: "stu-1", name: "Telheiba", rollNumber: "CS26-112" },
    { id: "stu-6", name: "Tara Joshi", rollNumber: "CS25-074" },
    { id: "stu-7", name: "Vihaan Kulkarni", rollNumber: "CS25-081" },
    { id: "stu-8", name: "Zoya Fernandes", rollNumber: "CS25-088" }
  ],
  "sub-os": [
    { id: "stu-2", name: "Isha Kapoor", rollNumber: "CS25-052" },
    { id: "stu-3", name: "Kabir Sethi", rollNumber: "CS25-058" },
    { id: "stu-5", name: "Reyansh Nair", rollNumber: "CS25-069" }
  ]
};

const schedule: TimetableSlot[] = [
  slot("fac-tt-1", "MONDAY", "09:00", "10:00", facultySubjects[0], "Lab 201", "#6366F1"),
  slot("fac-tt-2", "MONDAY", "14:00", "15:00", facultySubjects[1], "AI Lab", "#3B82F6"),
  slot("fac-tt-3", "TUESDAY", "10:00", "11:00", facultySubjects[0], "Lab 201", "#6366F1"),
  slot("fac-tt-4", "WEDNESDAY", "11:15", "12:15", facultySubjects[1], "AI Lab", "#3B82F6"),
  slot("fac-tt-5", "THURSDAY", "10:00", "11:00", facultySubjects[0], "Lab 201", "#6366F1"),
  slot("fac-tt-6", "FRIDAY", "09:00", "10:00", facultySubjects[1], "AI Lab", "#3B82F6")
];

let attendanceSessions: AttendanceSessionSummary[] = [
  {
    id: "sess-1",
    subjectId: "sub-dsa",
    subject: "Data Structures",
    date: "2026-05-03",
    duration: 60,
    present: 36,
    absent: 6,
    late: 0,
    excused: 0,
    total: 42
  },
  {
    id: "sess-2",
    subjectId: "sub-ai",
    subject: "AI Fundamentals",
    date: "2026-05-02",
    duration: 60,
    present: 34,
    absent: 4,
    late: 0,
    excused: 0,
    total: 38
  }
];

let leaveRequests: LeaveRequestData[] = [
  {
    id: "leave-1",
    type: "CASUAL",
    fromDate: "2026-04-16",
    toDate: "2026-04-16",
    days: 1,
    reason: "Personal appointment",
    status: "APPROVED",
    adminNote: "Approved. Class swapped with Prof. Das.",
    createdAt: "2026-04-10"
  },
  {
    id: "leave-2",
    type: "SICK",
    fromDate: "2026-05-07",
    toDate: "2026-05-08",
    days: 2,
    reason: "Medical rest advised",
    status: "PENDING",
    createdAt: "2026-05-04"
  }
];

let materials: CourseMaterialData[] = [
  {
    id: "mat-1",
    subjectId: "sub-dsa",
    subject: "Data Structures",
    title: "Graph Algorithms Primer",
    fileName: "graph-algorithms.txt",
    fileSize: 1840,
    uploadedAt: "2026-05-01",
    contentPreview: "BFS explores neighbors level by level. DFS explores deeply before backtracking.",
    content:
      "Graph Algorithms Primer. Breadth-first search explores neighbors level by level and is used for shortest paths in unweighted graphs. Depth-first search explores deeply before backtracking and is useful for cycle detection, connected components, and topological sorting. Dijkstra's algorithm finds shortest paths in weighted graphs with non-negative edges. Minimum spanning tree algorithms such as Kruskal and Prim connect all vertices with minimum total edge weight."
  }
];

function slot(
  id: string,
  day: TimetableSlot["day"],
  startTime: string,
  endTime: string,
  subject: FacultySubject,
  room: string,
  color: string
): TimetableSlot {
  return {
    id,
    day,
    startTime,
    endTime,
    subjectId: subject.subjectId,
    subject: subject.subject,
    code: subject.code,
    faculty: "Dr. Nisha Rao",
    room,
    color
  };
}

function leaveDays(fromDate: string, toDate: string) {
  return differenceInCalendarDays(new Date(toDate), new Date(fromDate)) + 1;
}

export function getFacultyDashboard(): FacultyDashboardData {
  const todayClasses = schedule.filter((item) => item.day === "MONDAY");
  const studentsTaught = facultySubjects.reduce((sum, subject) => sum + subject.enrolledStudents, 0);

  return {
    stats: {
      classesToday: todayClasses.length,
      studentsTaught,
      leaveBalance: 18,
      pendingLeaveRequests: leaveRequests.filter((request) => request.status === "PENDING").length
    },
    todayClasses,
    weeklyLoad: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => ({
      day,
      classes: schedule.filter((item) => item.day === day).length
    })),
    recentSessions: attendanceSessions.slice(0, 10),
    leaveRequests: leaveRequests.slice(0, 3)
  };
}

export function getFacultySubjects() {
  return facultySubjects;
}

export function getFacultyRoster(subjectId: string) {
  return rosterBySubject[subjectId] ?? [];
}

export function getFacultyProfile() {
  return {
    employeeId: "E16783",
    name: "Dr. Nisha Rao",
    department: "Computer Science Engineering",
    designation: "Associate Professor",
    email: "nisha.rao@campusiq.edu",
    mobile: "9876543210",
    office: "Block B, Faculty Room 204",
    weeklyHours: 18,
    subjects: facultySubjects.map(({ subject, code, enrolledStudents }) => ({ subject, code, enrolledStudents })),
    qualifications: ["Ph.D. Computer Science", "M.Tech Artificial Intelligence", "B.Tech CSE"]
  };
}

export function getFacultySchedule() {
  return schedule;
}

export function getAttendanceSessions() {
  return attendanceSessions;
}

export function createAttendanceSession(input: {
  subjectId: string;
  date: string;
  duration: number;
  marks: AttendanceMark[];
}) {
  const subject = facultySubjects.find((item) => item.subjectId === input.subjectId) ?? facultySubjects[0];
  const count = (status: AttendanceMark["status"]) =>
    input.marks.filter((mark) => mark.status === status).length;
  const present = count("PRESENT");
  const session: AttendanceSessionSummary = {
    id: `sess-${Date.now()}`,
    subjectId: subject.subjectId,
    subject: subject.subject,
    date: input.date,
    duration: input.duration,
    present,
    absent: input.marks.length - present,
    late: 0,
    excused: 0,
    total: input.marks.length
  };

  attendanceSessions = [session, ...attendanceSessions];
  return session;
}

export function getLeaveRequests() {
  return leaveRequests;
}

export function createLeaveRequest(input: {
  type: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string;
}) {
  const request: LeaveRequestData = {
    id: `leave-${Date.now()}`,
    type: input.type,
    fromDate: input.fromDate,
    toDate: input.toDate,
    days: leaveDays(input.fromDate, input.toDate),
    reason: input.reason,
    status: "PENDING",
    createdAt: new Date().toISOString().slice(0, 10)
  };

  leaveRequests = [request, ...leaveRequests];
  return request;
}

export function cancelLeaveRequest(id: string) {
  const request = leaveRequests.find((item) => item.id === id);

  if (!request || request.status !== "PENDING") {
    return false;
  }

  leaveRequests = leaveRequests.filter((item) => item.id !== id);
  return true;
}

export function updateLeaveRequest(id: string, status: Exclude<LeaveStatus, "PENDING">, adminNote?: string) {
  const request = leaveRequests.find((item) => item.id === id);

  if (!request) {
    return null;
  }

  request.status = status;
  request.adminNote = adminNote;
  return request;
}

export function getMaterials() {
  return materials;
}

export function deleteMaterial(id: string) {
  const exists = materials.some((material) => material.id === id);

  if (!exists) {
    return false;
  }

  materials = materials.filter((material) => material.id !== id);
  return true;
}

export function createMaterial(input: {
  subjectId: string;
  title: string;
  fileName: string;
  fileSize: number;
  content: string;
}) {
  const subject = subjectCatalog.find((item) => item.subjectId === input.subjectId) ?? subjectCatalog[0];
  const material: CourseMaterialData = {
    id: `mat-${Date.now()}`,
    subjectId: subject.subjectId,
    subject: subject.subject,
    title: input.title,
    fileName: input.fileName,
    fileSize: input.fileSize,
    uploadedAt: new Date().toISOString().slice(0, 10),
    contentPreview: input.content.slice(0, 220),
    content: input.content
  };

  materials = [material, ...materials];
  return material;
}
