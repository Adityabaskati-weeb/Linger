import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { StudentProfileData } from "@campusiq/shared";
import { IdCard, Mail, MapPin, Phone, UserRoundCheck } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/axios";
import { useAuthStore } from "../../store/auth.store";

export function StudentProfile() {
  const [profile, setProfile] = useState<StudentProfileData | null>(null);

  useEffect(() => {
    api.get<{ success: true; data: StudentProfileData }>("/student/profile").then((response) => {
      const nextProfile = response.data.data;

      setProfile(nextProfile);
      useAuthStore.setState((state) =>
        state.user?.role === "STUDENT"
          ? {
              user: {
                ...state.user,
                name: nextProfile.name,
                email: nextProfile.email
              }
            }
          : {}
      );
    });
  }, []);

  if (!profile) {
    return <Card className="animate-pulse text-sm text-slate-400">Loading student profile...</Card>;
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
        <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan">Student Personal Information</p>
            <h2 className="mt-3 font-display text-4xl font-semibold">{profile.name}</h2>
            <div className="mt-5 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
              <Info label="UID" value={profile.uid} icon={<IdCard className="h-4 w-4" />} />
              <Info label="Roll No." value={profile.rollNumber} icon={<UserRoundCheck className="h-4 w-4" />} />
              <Info label="Email" value={profile.email} icon={<Mail className="h-4 w-4" />} />
              <Info label="Mobile" value={profile.mobile} icon={<Phone className="h-4 w-4" />} />
              <Info label="Father's Name" value={profile.fatherName} />
              <Info label="Mother's Name" value={profile.motherName} />
              <Info label="D.O.B." value={profile.dob} />
              <Info label="Religion" value={profile.religion} />
              <Info label="Program" value={profile.programCode} />
              <Info label="Current Semester" value={String(profile.semester)} />
              <Info label="Blood Group" value={profile.bloodGroup} />
              <Info label="Section" value={profile.section} />
              <Info label="Category" value={profile.category} />
              <Info label="Admission Year" value={String(profile.admissionYear)} />
              <Info label="University" value={profile.university} />
              <Info label="Status" value={profile.status} />
              <Info label="Address" value={profile.address} icon={<MapPin className="h-4 w-4" />} />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-card p-5 text-center">
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-2xl bg-gradient-hero font-display text-4xl font-semibold shadow-glow">
              {profile.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </div>
            <p className="mt-4 text-sm font-medium text-white">{profile.department}</p>
            <p className="mt-1 text-xs text-slate-500">Admission {profile.admissionYear}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="font-display text-2xl font-semibold">Qualification Details</h2>
          <div className="mt-5 overflow-hidden rounded-lg border border-white/[0.07]">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="p-4">Qualification</th>
                  <th className="p-4">Stream</th>
                  <th className="p-4">Institute</th>
                  <th className="p-4">Board</th>
                  <th className="p-4">Year</th>
                  <th className="p-4">Marks</th>
                </tr>
              </thead>
              <tbody>
                {profile.qualifications.map((item) => (
                  <tr key={item.qualification} className="border-t border-white/[0.06]">
                    <td className="p-4 text-white">{item.qualification}</td>
                    <td className="p-4 text-slate-400">{item.stream}</td>
                    <td className="p-4 text-slate-400">{item.institute}</td>
                    <td className="p-4 text-slate-400">{item.board}</td>
                    <td className="p-4">{item.passingYear}</td>
                    <td className="p-4 text-emerald-200">{item.percentMarks}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-2xl font-semibold">Mentor Details</h2>
          <div className="mt-5 rounded-lg border border-white/[0.07] bg-white/[0.035] p-5">
            <p className="text-xl font-semibold text-white">{profile.mentor.name}</p>
            <p className="mt-2 font-mono text-sm text-cyan">{profile.mentor.employeeId}</p>
            <p className="mt-4 text-sm leading-6 text-slate-400">{profile.mentor.department}</p>
            <p className="mt-1 text-sm text-slate-400">{profile.mentor.designation}</p>
          </div>
        </Card>
      </div>
    </motion.section>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
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
