import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { FacultyProfileData } from "@campusiq/shared";
import { BookOpen, BriefcaseBusiness, Mail, Phone } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/axios";

export function FacultyProfile() {
  const [profile, setProfile] = useState<FacultyProfileData | null>(null);

  useEffect(() => {
    api.get<{ success: true; data: FacultyProfileData }>("/faculty/profile").then((response) => {
      setProfile(response.data.data);
    });
  }, []);

  if (!profile) {
    return <Card className="animate-pulse text-sm text-slate-400">Loading faculty profile...</Card>;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <Card glow>
        <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan">Faculty Profile</p>
            <h2 className="mt-3 font-display text-4xl font-semibold">{profile.name}</h2>
            <p className="mt-2 text-slate-400">{profile.designation}, {profile.department}</p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <Tile label="Employee ID" value={profile.employeeId} icon={<BriefcaseBusiness className="h-4 w-4" />} />
              <Tile label="Weekly Load" value={`${profile.weeklyHours} hours`} icon={<BookOpen className="h-4 w-4" />} />
              <Tile label="Email" value={profile.email} icon={<Mail className="h-4 w-4" />} />
              <Tile label="Mobile" value={profile.mobile} icon={<Phone className="h-4 w-4" />} />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-card p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Office</p>
            <p className="mt-3 text-lg font-semibold text-white">{profile.office}</p>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-slate-500">Qualifications</p>
            <div className="mt-3 space-y-2">
              {profile.qualifications.map((item) => (
                <p key={item} className="rounded-md bg-white/[0.045] px-3 py-2 text-sm text-slate-300">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-2xl font-semibold">Subjects Taking</h2>
        <p className="mt-1 text-sm text-slate-500">Subject codes are kept separate so elective rosters load correctly.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {profile.subjects.map((subject) => (
            <div key={subject.code} className="rounded-lg border border-white/[0.07] bg-white/[0.035] p-4">
              <p className="font-mono text-sm text-cyan">{subject.code}</p>
              <p className="mt-2 text-lg font-semibold text-white">{subject.subject}</p>
              <p className="mt-2 text-sm text-slate-400">{subject.enrolledStudents} enrolled student(s)</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.section>
  );
}

function Tile({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.035] p-4">
      <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">
        {icon}
        {label}
      </p>
      <p className="text-white">{value}</p>
    </div>
  );
}
