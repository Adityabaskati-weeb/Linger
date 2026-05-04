import type { AnnouncementData } from "@campusiq/shared";

let announcements: AnnouncementData[] = [
  {
    id: "ann-1",
    title: "Boost your self-esteem and confidence during exams",
    body: "Student Wellbeing Cell is running an exam confidence session on 01 May 2026 at 12:23 PM.",
    audience: "STUDENT",
    author: "Admin Office",
    category: "EVENT",
    publishedAt: "2026-05-01 12:23",
    pinned: true
  },
  {
    id: "ann-2",
    title: "CS309 full-stack development lab resources uploaded",
    body: "New lecture slides, lab checklist, and practice problems are available in CU LMS resources.",
    audience: "STUDENT",
    author: "Dr. Nisha Rao",
    category: "ACADEMIC",
    publishedAt: "2026-05-03 09:15"
  },
  {
    id: "ann-3",
    title: "Faculty attendance review this Friday",
    body: "Department coordinators should verify faculty attendance and class conduction logs before 4 PM.",
    audience: "FACULTY",
    author: "Principal Office",
    category: "GENERAL",
    publishedAt: "2026-05-04 08:30"
  }
];

export function getAnnouncements(audience?: AnnouncementData["audience"]) {
  return announcements.filter((announcement) => {
    if (!audience) return true;
    return announcement.audience === audience || announcement.audience === "ALL";
  });
}

export function createAnnouncement(input: {
  title: string;
  body: string;
  audience: AnnouncementData["audience"];
  author: string;
  category: AnnouncementData["category"];
}) {
  const announcement: AnnouncementData = {
    id: `ann-${Date.now()}`,
    title: input.title,
    body: input.body,
    audience: input.audience,
    author: input.author,
    category: input.category,
    publishedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    pinned: input.category === "EXAM"
  };

  announcements = [announcement, ...announcements];
  return announcement;
}
