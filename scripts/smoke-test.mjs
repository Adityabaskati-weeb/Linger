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
const aiSubjects = await request("/ai/subjects", { headers: studentHeaders });

const facultyDashboard = await request("/faculty/dashboard", { headers: facultyHeaders });
const facultySubjects = await request("/faculty/subjects", { headers: facultyHeaders });
const roster = await request(`/faculty/subjects/${facultySubjects[0].subjectId}/roster`, { headers: facultyHeaders });
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
if (aiSubjects.length < 1) throw new Error("AI subjects are empty");
if (facultyDashboard.stats.classesToday < 1) throw new Error("faculty dashboard did not load stats");
if (session.present !== roster.length) throw new Error("attendance marking did not save all present");
if (adminDashboard.campusHealthScore < 1) throw new Error("admin dashboard did not load health score");
if (departments.length < 1) throw new Error("departments are empty");
if (timetable.conflicts.length !== 0) throw new Error("timetable generated conflicts");

console.log(
  JSON.stringify(
    {
      studentOverall: studentDashboard.stats.overallAttendance,
      aiSubjects: aiSubjects.length,
      facultyClassesToday: facultyDashboard.stats.classesToday,
      roster: roster.length,
      adminHealth: adminDashboard.campusHealthScore,
      departments: departments.length,
      timetableSlots: timetable.slots.length
    },
    null,
    2
  )
);
