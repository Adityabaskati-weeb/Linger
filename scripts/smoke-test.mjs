const baseUrl = process.env.API_URL ?? "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    }
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : null;

  if (!response.ok || json?.success === false) {
    throw new Error(`${options.method ?? "GET"} ${path} failed: ${text}`);
  }

  return json?.data;
}

async function login(email) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password: "campusiq123" })
  });
}

function auth(token) {
  return { Authorization: `Bearer ${token}` };
}

const student = await login("student@campusiq.edu");
const faculty = await login("faculty@campusiq.edu");
const admin = await login("admin@campusiq.edu");

const studentHeaders = auth(student.accessToken);
const facultyHeaders = auth(faculty.accessToken);
const adminHeaders = auth(admin.accessToken);

const studentDashboard = await request("/student/dashboard", { headers: studentHeaders });
const attendance = await request("/student/attendance/summary", { headers: studentHeaders });
const studentProfile = await request("/student/profile", { headers: studentHeaders });
const studentServices = await request("/student/services", { headers: studentHeaders });
const onlineTest = await request("/student/online-test", { headers: studentHeaders });
const aiSubjects = await request("/ai/subjects", { headers: studentHeaders });

const facultyDashboard = await request("/faculty/dashboard", { headers: facultyHeaders });
const facultyProfile = await request("/faculty/profile", { headers: facultyHeaders });
const facultyAnnouncements = await request("/faculty/announcements", { headers: facultyHeaders });
const facultySubjects = await request("/faculty/subjects", { headers: facultyHeaders });
const roster = await request(`/faculty/subjects/${facultySubjects[0].subjectId}/roster`, { headers: facultyHeaders });
const electiveRoster = await request(`/faculty/subjects/${facultySubjects[1].subjectId}/roster`, { headers: facultyHeaders });
const session = await request("/faculty/attendance/sessions", {
  method: "POST",
  headers: facultyHeaders,
  body: JSON.stringify({
    subjectId: facultySubjects[0].subjectId,
    date: "2026-05-04",
    duration: 60,
    marks: roster.map((studentRecord) => ({ studentId: studentRecord.id, status: "PRESENT" }))
  })
});

const adminDashboard = await request("/admin/dashboard", { headers: adminHeaders });
const adminAnalytics = await request("/admin/attendance/analytics", { headers: adminHeaders });
const adminAnnouncements = await request("/admin/announcements", { headers: adminHeaders });
const createdFaculty = await request("/admin/faculty", {
  method: "POST",
  headers: adminHeaders,
  body: JSON.stringify({
    name: "Smoke Test Faculty",
    employeeId: `SMK-${Date.now()}`,
    department: "Computer Science",
    subjectCode: "CS399"
  })
});
const createdStudent = await request("/admin/students", {
  method: "POST",
  headers: adminHeaders,
  body: JSON.stringify({
    name: "Smoke Test Student",
    rollNumber: `SMK-${Date.now()}`,
    department: "CS",
    semester: 5,
    overall: 77
  })
});
const departments = await request("/admin/departments", { headers: adminHeaders });
const timetable = await request("/timetable/generate", {
  method: "POST",
  headers: adminHeaders,
  body: JSON.stringify({
    semester: 5,
    days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: 60,
    breakStart: "12:00",
    breakDuration: 60,
    maxConsecutive: 2
  })
});

if (studentDashboard.stats.overallAttendance < 1) throw new Error("student dashboard did not load stats");
if (attendance.length < 1) throw new Error("student attendance summary is empty");
if (typeof attendance[0].thresholdProbability !== "number") throw new Error("attendance forecast missing");
if (!studentProfile.uid) throw new Error("student profile did not load");
if (!studentServices.project?.teamMembers?.length) throw new Error("student services project module missing");
if (!studentServices.lmsResources?.length) throw new Error("CU LMS resources missing");
if (!studentServices.announcements?.length) throw new Error("student announcements missing");
if (studentServices.examination.examFee.status !== "PENDING") throw new Error("exam fee status missing");
if (onlineTest.questions.length !== 10) throw new Error("online test should contain 10 questions");
if (onlineTest.durationSeconds < 60) throw new Error("online test timer missing");
if (aiSubjects.length < 1) throw new Error("AI subjects are empty");
if (facultyDashboard.stats.classesToday < 1) throw new Error("faculty dashboard did not load stats");
if (!facultyProfile.employeeId) throw new Error("faculty profile did not load");
if (!facultyAnnouncements.length) throw new Error("faculty announcements did not load");
if (JSON.stringify(roster) === JSON.stringify(electiveRoster)) throw new Error("subject-specific roster did not change");
if (session.present !== roster.length) throw new Error("attendance marking did not save all present");
if (adminDashboard.campusHealthScore < 1) throw new Error("admin dashboard did not load health score");
if (!adminDashboard.facultyAttendance?.length) throw new Error("faculty attendance missing from admin dashboard");
if (!adminAnnouncements.length) throw new Error("admin announcements did not load");
if (!adminAnalytics.atRiskStudents[0]?.subjectCode) throw new Error("below-75 subject code missing");
if (!createdFaculty.id || !createdStudent.id) throw new Error("admin create controls failed");
if (departments.length < 1 || !departments[0].subjects?.length) throw new Error("departments are missing subject maps");
if (timetable.conflicts.length !== 0) throw new Error("timetable generated conflicts");

await request(`/admin/faculty/${createdFaculty.id}`, {
  method: "DELETE",
  headers: adminHeaders
});
await request(`/admin/students/${createdStudent.id}`, {
  method: "DELETE",
  headers: adminHeaders
});

console.log(
  JSON.stringify(
    {
      studentOverall: studentDashboard.stats.overallAttendance,
      forecastProbability: attendance[0].thresholdProbability,
      profileUid: studentProfile.uid,
      onlineTestQuestions: onlineTest.questions.length,
      aiSubjects: aiSubjects.length,
      facultyClassesToday: facultyDashboard.stats.classesToday,
      roster: roster.length,
      electiveRoster: electiveRoster.length,
      adminHealth: adminDashboard.campusHealthScore,
      departments: departments.length,
      timetableSlots: timetable.slots.length
    },
    null,
    2
  )
);
