export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  subjectId: string;
  subject: string;
  code: string;
  faculty: string;
  room: string;
  color: string;
}

export interface TimetableGenerationConfig {
  semester: number;
  days: DayOfWeek[];
  startTime: string;
  endTime: string;
  slotDuration: number;
  breakStart: string;
  breakDuration: number;
  maxConsecutive: number;
}

export interface GeneratedTimetable {
  id?: string;
  name: string;
  semester: number;
  isActive: boolean;
  slots: TimetableSlot[];
  conflicts: string[];
}
