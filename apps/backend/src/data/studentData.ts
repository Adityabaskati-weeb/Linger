import type {
  AttendanceRecord,
  AttendanceStatus,
  DayOfWeek,
  StudentDashboardData,
  StudentScheduleItem,
  SubjectAttendanceSummary,
  TimetableSlot
} from "@campusiq/shared";

const subjects = [
  {
    subjectId: "sub-dsa",
    subject: "Data Structures",
    code: "CS301",
    faculty: "Dr. Nisha Rao",
    totalClasses: 42,
    attendedClasses: 33,
    remainingClasses: 16,
    trend: [74, 75, 76, 78, 77, 79],
    color: "#6366F1"
  },
  {
    subjectId: "sub-os",
    subject: "Operating Systems",
    code: "CS303",
    faculty: "Prof. Arjun Iyer",
    totalClasses: 38,
    attendedClasses: 27,
    remainingClasses: 18,
    trend: [69, 70, 71, 70, 72, 71],
    color: "#06B6D4"
  },
  {
    subjectId: "sub-dbms",
    subject: "Database Systems",
    code: "CS305",
    faculty: "Dr. Meera Shah",
    totalClasses: 36,
    attendedClasses: 31,
    remainingClasses: 15,
    trend: [82, 83, 84, 86, 85, 86],
    color: "#10B981"
  },
  {
    subjectId: "sub-cn",
    subject: "Computer Networks",
    code: "CS307",
    faculty: "Prof. Rohan Das",
    totalClasses: 34,
    attendedClasses: 24,
    remainingClasses: 18,
    trend: [68, 69, 70, 71, 70, 71],
    color: "#F59E0B"
  },
  {
    subjectId: "sub-ai",
    subject: "AI Fundamentals",
    code: "CS309",
    faculty: "Dr. Nisha Rao",
    totalClasses: 30,
    attendedClasses: 27,
    remainingClasses: 16,
    trend: [87, 88, 89, 90, 90, 90],
    color: "#3B82F6"
  }
];

const timetable: TimetableSlot[] = [
  slot("tt-1", "MONDAY", "09:00", "10:00", subjects[0], "Lab 201"),
  slot("tt-2", "MONDAY", "10:00", "11:00", subjects[1], "Room 305"),
  slot("tt-3", "MONDAY", "11:15", "12:15", subjects[2], "Room 204"),
  slot("tt-4", "MONDAY", "14:00", "15:00", subjects[4], "AI Lab"),
  slot("tt-5", "TUESDAY", "09:00", "10:00", subjects[3], "Room 306"),
  slot("tt-6", "TUESDAY", "10:00", "11:00", subjects[0], "Lab 201"),
  slot("tt-7", "TUESDAY", "13:00", "14:00", subjects[2], "Room 204"),
  slot("tt-8", "WEDNESDAY", "09:00", "10:00", subjects[1], "Room 305"),
  slot("tt-9", "WEDNESDAY", "11:15", "12:15", subjects[4], "AI Lab"),
  slot("tt-10", "WEDNESDAY", "14:00", "15:00", subjects[3], "Room 306"),
  slot("tt-11", "THURSDAY", "09:00", "10:00", subjects[2], "Room 204"),
  slot("tt-12", "THURSDAY", "10:00", "11:00", subjects[0], "Lab 201"),
  slot("tt-13", "FRIDAY", "09:00", "10:00", subjects[4], "AI Lab"),
  slot("tt-14", "FRIDAY", "11:15", "12:15", subjects[1], "Room 305"),
  slot("tt-15", "SATURDAY", "10:00", "11:00", subjects[3], "Room 306")
];

const attendanceRecords: AttendanceRecord[] = [
  record("a-1", "2026-05-04", subjects[0], "PRESENT"),
  record("a-2", "2026-05-04", subjects[1], "ABSENT"),
  record("a-3", "2026-05-04", subjects[2], "PRESENT"),
  record("a-4", "2026-05-04", subjects[4], "PRESENT"),
  record("a-5", "2026-05-03", subjects[3], "ABSENT"),
  record("a-6", "2026-05-03", subjects[0], "PRESENT"),
  record("a-7", "2026-05-02", subjects[2], "PRESENT"),
  record("a-8", "2026-05-02", subjects[1], "PRESENT"),
  record("a-9", "2026-05-01", subjects[4], "PRESENT"),
  record("a-10", "2026-05-01", subjects[3], "ABSENT"),
  record("a-11", "2026-04-30", subjects[0], "PRESENT"),
  record("a-12", "2026-04-30", subjects[2], "PRESENT")
];

function slot(
  id: string,
  day: DayOfWeek,
  startTime: string,
  endTime: string,
  subject: (typeof subjects)[number],
  room: string
): TimetableSlot {
  return {
    id,
    day,
    startTime,
    endTime,
    subjectId: subject.subjectId,
    subject: subject.subject,
    code: subject.code,
    faculty: subject.faculty,
    room,
    color: subject.color
  };
}

function record(
  id: string,
  date: string,
  subject: (typeof subjects)[number],
  status: AttendanceStatus
): AttendanceRecord {
  return {
    id,
    date,
    subjectId: subject.subjectId,
    subject: subject.subject,
    faculty: subject.faculty,
    status
  };
}

export function classesNeededFor75(attended: number, total: number) {
  return Math.max(0, Math.ceil((0.75 * total - attended) / 0.25));
}

export function getStudentAttendanceSummary(): SubjectAttendanceSummary[] {
  return subjects.map((subject) => {
    const attendancePercentage = Math.round((subject.attendedClasses / subject.totalClasses) * 100);
    const needed = classesNeededFor75(subject.attendedClasses, subject.totalClasses);
    const projectedAttended = subject.attendedClasses + Math.round(subject.remainingClasses * 0.82);
    const projectedTotal = subject.totalClasses + subject.remainingClasses;
    const thresholdProbability =
      needed === 0
        ? 98
        : Math.max(
            8,
            Math.min(95, Math.round(((subject.remainingClasses - needed + 1) / subject.remainingClasses) * 100))
          );

    return {
      subjectId: subject.subjectId,
      subject: subject.subject,
      code: subject.code,
      faculty: subject.faculty,
      totalClasses: subject.totalClasses,
      attendedClasses: subject.attendedClasses,
      attendancePercentage,
      classesNeededFor75: needed,
      remainingClasses: subject.remainingClasses,
      projectedAttendance: Math.round((projectedAttended / projectedTotal) * 100),
      thresholdProbability,
      trend: subject.trend
    };
  });
}

export function getStudentAttendanceRecords(subjectId?: string) {
  return subjectId
    ? attendanceRecords.filter((recordItem) => recordItem.subjectId === subjectId)
    : attendanceRecords;
}

export function getStudentSchedule() {
  return timetable;
}

export function getTodaySchedule(): StudentScheduleItem[] {
  return timetable
    .filter((item) => item.day === "MONDAY")
    .map((item, index) => ({
      id: item.id,
      subjectId: item.subjectId,
      subject: item.subject,
      code: item.code,
      faculty: item.faculty,
      room: item.room,
      startTime: item.startTime,
      endTime: item.endTime,
      status: index === 0 ? "completed" : index === 1 ? "current" : "upcoming"
    }));
}

export function getStudentDashboard(): StudentDashboardData {
  const summaries = getStudentAttendanceSummary();
  const totalAttended = subjects.reduce((sum, subject) => sum + subject.attendedClasses, 0);
  const totalClasses = subjects.reduce((sum, subject) => sum + subject.totalClasses, 0);
  const atRiskSubjects = summaries.filter((summary) => summary.attendancePercentage < 75);
  const todaySchedule = getTodaySchedule();

  return {
    stats: {
      overallAttendance: Math.round((totalAttended / totalClasses) * 100),
      classesToday: todaySchedule.length,
      aiSessionsThisWeek: 6,
      pendingSubjects: atRiskSubjects.length,
      nextClass: `${todaySchedule[1]?.subject ?? "Data Structures"} ${todaySchedule[1]?.startTime ?? "10:00"}`
    },
    summaries,
    todaySchedule,
    atRiskSubjects
  };
}
