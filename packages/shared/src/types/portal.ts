import type { CourseMaterialData, LeaveStatus } from "./faculty";

export interface AnnouncementData {
  id: string;
  title: string;
  body: string;
  audience: "STUDENT" | "FACULTY" | "ALL";
  author: string;
  category: "ACADEMIC" | "EXAM" | "EVENT" | "GENERAL";
  publishedAt: string;
  pinned?: boolean;
}

export interface StudentProfileData {
  uid: string;
  name: string;
  rollNumber: string;
  fatherName: string;
  motherName: string;
  religion: string;
  dob: string;
  bloodGroup: string;
  semester: number;
  section: string;
  programCode: string;
  status: string;
  category: string;
  address: string;
  admissionYear: number;
  university: string;
  department: string;
  email: string;
  mobile: string;
  avatarUrl?: string;
  qualifications: Array<{
    qualification: string;
    stream: string;
    institute: string;
    board: string;
    passingYear: number;
    percentMarks: number;
  }>;
  mentor: {
    name: string;
    employeeId: string;
    department: string;
    designation: string;
  };
}

export interface FacultyProfileData {
  employeeId: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  mobile: string;
  office: string;
  weeklyHours: number;
  subjects: Array<{ subject: string; code: string; enrolledStudents: number }>;
  qualifications: string[];
}

export interface StudentProjectData {
  title: string;
  skills: string[];
  vertical: string;
  projectType: string;
  complexity: string;
  objective: string;
  supervisor: string;
  panelists: string[];
  teamMembers: Array<{ name: string; rollNumber: string; role: string }>;
  uploads: Array<{ id: string; title: string; fileName: string; uploadedAt: string; type: string }>;
}

export interface NocApplicationData {
  id: string;
  type: "Campus Placed" | "Direct-Placement" | "Direct only Internship";
  status: LeaveStatus;
  appliedAt: string;
}

export interface StudentLeaveData {
  id: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatus;
  documentName?: string;
}

export interface OnlineTestData {
  id: string;
  title: string;
  subjectCode: string;
  startsAt: string;
  durationMinutes: number;
  status: "OPEN" | "UPCOMING" | "COMPLETED";
  score?: number;
}

export interface OnlineTestQuestionData {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
}

export interface OnlineTestSessionData {
  id: string;
  title: string;
  subjectCode: string;
  durationSeconds: number;
  instructions: string[];
  questions: OnlineTestQuestionData[];
}

export interface StudentPortalData {
  profile: StudentProfileData;
  idCard: {
    cardNo: string;
    validTill: string;
    emergencyContact: string;
  };
  project: StudentProjectData;
  nocApplications: NocApplicationData[];
  leaveHistory: StudentLeaveData[];
  onlineTests: OnlineTestData[];
  transport: {
    routeNo: string;
    pickupPoint: string;
    busNo: string;
    driver: string;
    helpline: string;
  };
  examination: {
    formStatus: string;
    dateSheet: Array<{ subject: string; code: string; date: string; time: string }>;
    result: Array<{ subject: string; code: string; grade: string; marks: number }>;
    examFee: {
      amount: number;
      dueDate: string;
      upiId: string;
      qrPayload: string;
      status: "PENDING" | "PAID";
    };
  };
  lmsResources: Array<{ id: string; title: string; subjectCode: string; type: string; href: string }>;
  importantLinks: Array<{ id: string; title: string; description: string; href: string }>;
  announcements: AnnouncementData[];
  materials: CourseMaterialData[];
}
