import type { DayOfWeek, GeneratedTimetable, TimetableGenerationConfig, TimetableSlot } from "@campusiq/shared";

const subjects = [
  { subjectId: "sub-dsa", subject: "Data Structures", code: "CS301", faculty: "Dr. Nisha Rao", color: "#6366F1" },
  { subjectId: "sub-os", subject: "Operating Systems", code: "CS303", faculty: "Prof. Arjun Iyer", color: "#06B6D4" },
  { subjectId: "sub-dbms", subject: "Database Systems", code: "CS305", faculty: "Dr. Meera Shah", color: "#10B981" },
  { subjectId: "sub-cn", subject: "Computer Networks", code: "CS307", faculty: "Prof. Rohan Das", color: "#F59E0B" },
  { subjectId: "sub-ai", subject: "AI Fundamentals", code: "CS309", faculty: "Dr. Nisha Rao", color: "#3B82F6" }
];

const rooms = ["Room 101", "Room 102", "Lab 201", "Lab 202", "AI Lab"];
let timetables: GeneratedTimetable[] = [];

export function generateTimetable(config: TimetableGenerationConfig): GeneratedTimetable {
  const timeSlots = buildTimeSlots(config);
  const slots: TimetableSlot[] = [];
  const facultyBusy = new Set<string>();
  const roomBusy = new Set<string>();
  const subjectPerDay = new Set<string>();
  let cursor = 0;

  for (const subject of subjects) {
    let required = subject.subjectId === "sub-dsa" ? 4 : 3;

    for (const day of config.days) {
      if (required === 0) break;

      for (const time of timeSlots) {
        if (required === 0) break;

        const facultyKey = `${day}:${time.start}:${subject.faculty}`;
        const daySubjectKey = `${day}:${subject.subjectId}`;
        const room = rooms[cursor % rooms.length];
        const roomKey = `${day}:${time.start}:${room}`;

        if (
          facultyBusy.has(facultyKey) ||
          roomBusy.has(roomKey) ||
          subjectPerDay.has(daySubjectKey) ||
          exceedsConsecutive(slots, subject.faculty, day, time.start, config.maxConsecutive)
        ) {
          cursor += 1;
          continue;
        }

        slots.push({
          id: `gen-${subject.subjectId}-${day}-${time.start}`,
          day,
          startTime: time.start,
          endTime: time.end,
          subjectId: subject.subjectId,
          subject: subject.subject,
          code: subject.code,
          faculty: subject.faculty,
          room,
          color: subject.color
        });
        facultyBusy.add(facultyKey);
        roomBusy.add(roomKey);
        subjectPerDay.add(daySubjectKey);
        required -= 1;
        cursor += 1;
      }
    }
  }

  const conflicts = detectConflicts(slots);

  return {
    name: `Semester ${config.semester} Generated Timetable`,
    semester: config.semester,
    isActive: false,
    slots,
    conflicts
  };
}

export function saveTimetable(timetable: GeneratedTimetable) {
  const saved = {
    ...timetable,
    id: timetable.id ?? `tt-${Date.now()}`
  };
  timetables = [saved, ...timetables];
  return saved;
}

export function activateTimetable(id: string) {
  let active: GeneratedTimetable | null = null;
  timetables = timetables.map((timetable) => {
    const next = { ...timetable, isActive: timetable.id === id };
    if (next.isActive) active = next;
    return next;
  });
  return active;
}

export function getTimetables() {
  return timetables;
}

export function getActiveTimetable() {
  return timetables.find((timetable) => timetable.isActive) ?? null;
}

function buildTimeSlots(config: TimetableGenerationConfig) {
  const slots: Array<{ start: string; end: string }> = [];
  let cursor = minutes(config.startTime);
  const end = minutes(config.endTime);
  const breakStart = minutes(config.breakStart);
  const breakEnd = breakStart + config.breakDuration;

  while (cursor + config.slotDuration <= end) {
    if (cursor >= breakStart && cursor < breakEnd) {
      cursor = breakEnd;
      continue;
    }

    slots.push({ start: format(cursor), end: format(cursor + config.slotDuration) });
    cursor += config.slotDuration;
  }

  return slots;
}

function exceedsConsecutive(
  slots: TimetableSlot[],
  faculty: string,
  day: DayOfWeek,
  startTime: string,
  maxConsecutive: number
) {
  const sameDay = slots
    .filter((slot) => slot.faculty === faculty && slot.day === day)
    .map((slot) => minutes(slot.startTime))
    .sort((a, b) => a - b);
  const start = minutes(startTime);
  let streak = 1;
  let previous = start;

  for (const slotStart of [...sameDay].reverse()) {
    if (previous - slotStart === 60) {
      streak += 1;
      previous = slotStart;
    }
  }

  return streak > maxConsecutive;
}

function detectConflicts(slots: TimetableSlot[]) {
  const conflicts: string[] = [];
  const faculty = new Set<string>();
  const room = new Set<string>();

  for (const slot of slots) {
    const facultyKey = `${slot.day}:${slot.startTime}:${slot.faculty}`;
    const roomKey = `${slot.day}:${slot.startTime}:${slot.room}`;

    if (faculty.has(facultyKey)) conflicts.push(`Faculty clash: ${facultyKey}`);
    if (room.has(roomKey)) conflicts.push(`Room clash: ${roomKey}`);
    faculty.add(facultyKey);
    room.add(roomKey);
  }

  return conflicts;
}

function minutes(value: string) {
  const [hours, mins] = value.split(":").map(Number);
  return hours * 60 + mins;
}

function format(value: number) {
  const hours = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const mins = (value % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
}
