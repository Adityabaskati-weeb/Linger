import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { AttendanceMark, AttendanceStatus, FacultySubject, RosterStudent } from "@campusiq/shared";
import { CheckCircle2, Send } from "lucide-react";
import { AttendanceToggle } from "../../components/faculty/AttendanceToggle";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/axios";

export function FacultyAttendance() {
  const [subjects, setSubjects] = useState<FacultySubject[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [roster, setRoster] = useState<RosterStudent[]>([]);
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const [duration, setDuration] = useState(60);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<{ success: true; data: FacultySubject[] }>("/faculty/subjects").then((response) => {
      setSubjects(response.data.data);
      setSubjectId(response.data.data[0]?.subjectId ?? "");
    });
  }, []);

  useEffect(() => {
    if (!subjectId) return;

    api
      .get<{ success: true; data: RosterStudent[] }>(`/faculty/subjects/${subjectId}/roster`)
      .then((response) => {
        setRoster(response.data.data);
        setMarks(Object.fromEntries(response.data.data.map((student) => [student.id, "PRESENT"])));
      });
  }, [subjectId]);

  const summary = useMemo(() => {
    const values = Object.values(marks);
    return {
      present: values.filter((status) => status === "PRESENT").length,
      absent: values.filter((status) => status === "ABSENT").length,
      late: values.filter((status) => status === "LATE").length,
      excused: values.filter((status) => status === "EXCUSED").length
    };
  }, [marks]);

  function markAll(status: AttendanceStatus) {
    setMarks(Object.fromEntries(roster.map((student) => [student.id, status])));
  }

  async function submit() {
    const payload = {
      subjectId,
      date: new Date().toISOString().slice(0, 10),
      duration,
      marks: Object.entries(marks).map(([studentId, status]) => ({ studentId, status })) satisfies AttendanceMark[]
    };

    await api.post("/faculty/attendance/sessions", payload);
    setSaved(true);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Subject</span>
            <select
              value={subjectId}
              onChange={(event) => {
                setSubjectId(event.target.value);
                setSaved(false);
              }}
              className="h-11 w-full rounded-md border border-white/10 bg-overlay px-3 text-sm text-white"
            >
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subject}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Duration</span>
            <select
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
              className="h-11 w-full rounded-md border border-white/10 bg-overlay px-3 text-sm text-white"
            >
              <option value={30}>30 min</option>
              <option value={60}>60 min</option>
              <option value={90}>90 min</option>
            </select>
          </label>
          <div className="flex items-end gap-3">
            <Button variant="secondary" onClick={() => markAll("PRESENT")}>All Present</Button>
            <Button variant="secondary" onClick={() => markAll("ABSENT")}>All Absent</Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">Student Roster</h2>
            <p className="mt-1 text-sm text-slate-500">
              Present {summary.present}, absent {summary.absent}, late {summary.late}, excused {summary.excused}
            </p>
          </div>
          <Button onClick={submit}>
            <Send className="h-4 w-4" />
            Submit Session
          </Button>
        </div>

        <div className="space-y-3">
          {roster.map((student) => (
            <div
              key={student.id}
              className="grid gap-3 rounded-md border border-white/[0.07] bg-white/[0.035] p-4 md:grid-cols-[1fr_280px]"
            >
              <div>
                <p className="font-medium text-white">{student.name}</p>
                <p className="mt-1 font-mono text-xs text-slate-500">{student.rollNumber}</p>
              </div>
              <AttendanceToggle
                value={marks[student.id] ?? "PRESENT"}
                onChange={(value) => setMarks((current) => ({ ...current, [student.id]: value }))}
              />
            </div>
          ))}
        </div>
      </Card>

      {saved ? (
        <Card className="border-success/20 bg-success/10">
          <div className="flex items-center gap-3 text-emerald-100">
            <CheckCircle2 className="h-5 w-5" />
            Attendance session saved with {summary.present}/{roster.length} present.
          </div>
        </Card>
      ) : null}
    </motion.section>
  );
}
