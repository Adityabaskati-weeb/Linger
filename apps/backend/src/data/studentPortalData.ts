import type {
  NocApplicationData,
  OnlineTestSessionData,
  StudentLeaveData,
  StudentPortalData,
  StudentProfileData
} from "@campusiq/shared";
import { getAnnouncements } from "./announcementData";
import { getMaterials } from "./facultyData";

const profile: StudentProfileData = {
  uid: "23BCS14721",
  name: "Telheiba",
  rollNumber: "CS26-112",
  fatherName: "L. Robindro Singh",
  motherName: "N. Ibemhal Devi",
  religion: "Hinduism",
  dob: "17 Aug 2005",
  bloodGroup: "O+",
  semester: 6,
  section: "23BCS_FS-612",
  programCode: "CS201::B.E. (CSE)",
  status: "Active",
  category: "OBC",
  address: "Kakwa Naorem Leikai, Imphal, Manipur",
  admissionYear: 2023,
  university: "CampusIQ University",
  department: "Computer Science Engineering",
  email: "student@campusiq.edu",
  mobile: "9876432105",
  qualifications: [
    {
      qualification: "10th",
      stream: "General",
      institute: "Little Flower School",
      board: "Board of Secondary Education Manipur",
      passingYear: 2020,
      percentMarks: 86
    },
    {
      qualification: "10+2",
      stream: "Non-Medical",
      institute: "Comet School",
      board: "Council of Higher Secondary Education Manipur",
      passingYear: 2022,
      percentMarks: 81
    }
  ],
  mentor: {
    name: "Amandeep Kaur",
    employeeId: "E9596",
    department: "Computer Science Engineering",
    designation: "Assistant Professor"
  }
};

let projectUploads: StudentPortalData["project"]["uploads"] = [
  {
    id: "proj-up-1",
    title: "Sprint 1 Proposal",
    fileName: "livestock-health-proposal.pdf",
    uploadedAt: "2026-04-29",
    type: "Project Proposal"
  }
];

let nocApplications: NocApplicationData[] = [
  { id: "noc-1", type: "Direct only Internship", status: "APPROVED", appliedAt: "2026-04-18" }
];

let leaveHistory: StudentLeaveData[] = [
  {
    id: "med-1",
    fromDate: "2026-04-12",
    toDate: "2026-04-14",
    reason: "Medical rest advised after fever",
    status: "APPROVED",
    documentName: "medical-certificate.pdf"
  },
  {
    id: "med-2",
    fromDate: "2026-05-08",
    toDate: "2026-05-08",
    reason: "Diagnostic appointment",
    status: "PENDING"
  }
];

export function getStudentProfile() {
  return profile;
}

export function getStudentPortal(): StudentPortalData {
  return {
    profile,
    idCard: {
      cardNo: "CIQ-23BCS14721",
      validTill: "2027-06-30",
      emergencyContact: "1800 257 1800"
    },
    project: {
      title: "Predictive Modeling of Livestock Health Using Wearable Sensors",
      skills: ["AI", "ML", "Python"],
      vertical: "Agriculture",
      projectType: "Research",
      complexity: "Intermediate",
      objective: "Detect signs of illness or stress in livestock from biosensor data.",
      supervisor: "Neeraj Kumar (E16783)",
      panelists: ["Isha Sharma (E17920)", "Geet Kiran Kaur (E4856)"],
      teamMembers: [
        { name: "Telheiba", rollNumber: "CS26-112", role: "Team Lead" },
        { name: "Aarav Mehta", rollNumber: "CS25-047", role: "Modeling" },
        { name: "Isha Kapoor", rollNumber: "CS25-052", role: "Frontend" }
      ],
      uploads: projectUploads
    },
    nocApplications,
    leaveHistory,
    onlineTests: [
      {
        id: "test-1",
        title: "Graph Algorithms Quick Test",
        subjectCode: "CS301",
        startsAt: "2026-05-06 10:00",
        durationMinutes: 25,
        status: "OPEN"
      },
      {
        id: "test-2",
        title: "AI Search Strategies",
        subjectCode: "CS309",
        startsAt: "2026-05-09 14:00",
        durationMinutes: 30,
        status: "UPCOMING"
      },
      {
        id: "test-3",
        title: "DBMS Normalization",
        subjectCode: "CS305",
        startsAt: "2026-04-26 09:30",
        durationMinutes: 20,
        status: "COMPLETED",
        score: 18
      }
    ],
    transport: {
      routeNo: "R-17",
      pickupPoint: "Mohali Phase 7",
      busNo: "PB65-CIQ-2211",
      driver: "Harjit Singh",
      helpline: "1800 257 1800"
    },
    examination: {
      formStatus: "Submitted",
      dateSheet: [
        { subject: "Data Structures", code: "CS301", date: "2026-05-18", time: "09:30 AM" },
        { subject: "Operating Systems", code: "CS303", date: "2026-05-21", time: "09:30 AM" },
        { subject: "AI Fundamentals", code: "CS309", date: "2026-05-26", time: "01:30 PM" }
      ],
      result: [
        { subject: "Database Systems", code: "CS305", grade: "A", marks: 86 },
        { subject: "Computer Networks", code: "CS307", grade: "B+", marks: 78 }
      ],
      examFee: {
        amount: 2500,
        dueDate: "2026-05-12",
        upiId: "campusiq@upi",
        qrPayload: "upi://pay?pa=campusiq@upi&pn=CampusIQ%20University&am=2500&cu=INR&tn=Exam%20Fee",
        status: "PENDING"
      }
    },
    lmsResources: [
      {
        id: "lms-1",
        title: "CS301 Graph Algorithms Slides",
        subjectCode: "CS301",
        type: "Lecture PDF",
        href: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/"
      },
      {
        id: "lms-2",
        title: "CS309 AI Search Visual Notes",
        subjectCode: "CS309",
        type: "Class Resource",
        href: "https://ai.google.dev/"
      },
      {
        id: "lms-3",
        title: "Full Stack Development Practice Lab",
        subjectCode: "23CSH-309",
        type: "Lab Website",
        href: "https://developer.mozilla.org/"
      }
    ],
    importantLinks: [
      {
        id: "link-scholarship",
        title: "Scholarship Forms",
        description: "Apply for merit, state, and category scholarship schemes.",
        href: "https://scholarships.gov.in/"
      },
      {
        id: "link-forms",
        title: "Forms and Formats",
        description: "NOC, bonafide, migration, and anti-ragging forms.",
        href: "https://www.antiragging.in/"
      },
      {
        id: "link-lms",
        title: "CU LMS",
        description: "Learning portal and uploaded class resources.",
        href: "https://lms.example.edu/"
      }
    ],
    announcements: getAnnouncements("STUDENT"),
    materials: getMaterials()
  };
}

export function getOnlineTestSession(): OnlineTestSessionData {
  return {
    id: "test-graph-ai-10",
    title: "CampusIQ 10 Question Online Test",
    subjectCode: "CS301",
    durationSeconds: 600,
    instructions: [
      "Timer starts as soon as the test screen opens.",
      "Choose one answer per question.",
      "Use Submit Test to calculate your score instantly."
    ],
    questions: [
      q(1, "Which structure is commonly used by BFS?", ["Stack", "Queue", "Heap", "Hash map"], 1),
      q(2, "DFS is especially useful for", ["Cycle detection", "Payment processing", "Image resizing", "Sorting marks only"], 0),
      q(3, "Dijkstra's algorithm requires", ["Negative weights", "Non-negative edge weights", "No graph edges", "Only trees"], 1),
      q(4, "A hash table is designed for", ["Fast key-value lookup", "Drawing charts", "Speech synthesis", "Room booking"], 0),
      q(5, "A stack follows", ["FIFO", "LIFO", "Random access only", "Round robin"], 1),
      q(6, "A queue follows", ["LIFO", "FIFO", "Binary search", "Depth order"], 1),
      q(7, "Topological sorting applies to", ["DAGs", "Undirected cyclic graphs only", "Audio files", "Tables only"], 0),
      q(8, "A minimum spanning tree connects", ["All vertices with minimum edge cost", "Only two nodes", "Only isolated vertices", "Only directed cycles"], 0),
      q(9, "Binary search needs", ["Sorted data", "Unsorted data only", "A graph", "A microphone"], 0),
      q(10, "The AI tutor should answer using", ["Uploaded course context", "Random internet facts", "Only jokes", "Hidden answers"], 0)
    ]
  };
}

function q(index: number, question: string, options: string[], answerIndex: number) {
  return {
    id: `q-${index}`,
    question,
    options,
    answerIndex
  };
}

export function createProjectUpload(input: { title: string; fileName: string; type: string }) {
  const upload = {
    id: `proj-up-${Date.now()}`,
    title: input.title,
    fileName: input.fileName,
    type: input.type,
    uploadedAt: new Date().toISOString().slice(0, 10)
  };

  projectUploads = [upload, ...projectUploads];
  return upload;
}

export function createNocApplication(input: { type: NocApplicationData["type"] }) {
  const application: NocApplicationData = {
    id: `noc-${Date.now()}`,
    type: input.type,
    status: "PENDING",
    appliedAt: new Date().toISOString().slice(0, 10)
  };

  nocApplications = [application, ...nocApplications];
  return application;
}

export function createStudentLeave(input: {
  fromDate: string;
  toDate: string;
  reason: string;
  documentName?: string;
}) {
  const leave: StudentLeaveData = {
    id: `med-${Date.now()}`,
    fromDate: input.fromDate,
    toDate: input.toDate,
    reason: input.reason,
    documentName: input.documentName,
    status: "PENDING"
  };

  leaveHistory = [leave, ...leaveHistory];
  return leave;
}
