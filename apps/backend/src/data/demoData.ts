import bcrypt from "bcryptjs";
import type { Role, User } from "@campusiq/shared";

export interface DemoUserRecord extends User {
  passwordHash: string;
  department: string;
  title: string;
}

const passwordHash = bcrypt.hashSync("campusiq123", 10);

export const demoUsers: DemoUserRecord[] = [
  {
    id: "student-demo-1",
    name: "Telheiba",
    email: "student@campusiq.edu",
    role: "STUDENT",
    avatarUrl: "",
    department: "Computer Science",
    title: "Semester 6 Student",
    passwordHash
  },
  {
    id: "faculty-demo-1",
    name: "Dr. Nisha Rao",
    email: "faculty@campusiq.edu",
    role: "FACULTY",
    avatarUrl: "",
    department: "Computer Science",
    title: "Assistant Professor",
    passwordHash
  },
  {
    id: "admin-demo-1",
    name: "Principal Kavita Menon",
    email: "admin@campusiq.edu",
    role: "ADMIN",
    avatarUrl: "",
    department: "Campus Administration",
    title: "Principal",
    passwordHash
  }
];

export function publicUser(record: DemoUserRecord): User {
  return {
    id: record.id,
    email: record.email,
    role: record.role as Role,
    name: record.name,
    avatarUrl: record.avatarUrl
  };
}
