import { motion } from "framer-motion";
import { GraduationCap, UserRoundCog, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import type { Role } from "@campusiq/shared";
import type { ReactNode } from "react";

const roles: Array<{
  role: Role;
  title: string;
  subtitle: string;
  icon: ReactNode;
  href: string;
}> = [
  {
    role: "STUDENT",
    title: "Student Portal",
    subtitle: "Open the student portal for attendance, AI tutor, services, exams, CU LMS resources, and updates.",
    icon: <GraduationCap className="h-14 w-14" />,
    href: "/login?role=STUDENT"
  },
  {
    role: "FACULTY",
    title: "Faculty Portal",
    subtitle: "Open the faculty portal to manage classes, attendance, materials, leave, and announcements.",
    icon: <UsersRound className="h-14 w-14" />,
    href: "/login?role=FACULTY"
  },
  {
    role: "ADMIN",
    title: "Admin Portal",
    subtitle: "Open the admin portal for analytics, approvals, faculty attendance, departments, and notices.",
    icon: <UserRoundCog className="h-14 w-14" />,
    href: "/login?role=ADMIN"
  }
];

const weatherDays = [
  ["Monday", "32 deg C"],
  ["Tuesday", "28 deg C"],
  ["Wednesday", "24 deg C"],
  ["Thursday", "26 deg C"],
  ["Friday", "28 deg C"],
  ["Saturday", "29 deg C"]
];

export function RoleLanding() {
  return (
    <main className="min-h-screen bg-white text-[#1f2937]">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <div className="mx-auto flex w-fit items-end justify-center gap-1">
            <span className="text-7xl font-black tracking-tighter text-[#ef0000]">CU</span>
            <span className="text-6xl font-black tracking-tight text-black">IMS</span>
          </div>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
            CampusIQ University Information Management System
          </p>
        </motion.div>

        <div className="relative mt-16">
          <div className="absolute inset-x-0 top-1/2 h-44 -translate-y-1/2 bg-[#ef0000]" />
          <div className="relative mx-auto grid max-w-5xl gap-7 md:grid-cols-3">
            {roles.map((item, index) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <Link
                  to={item.href}
                  className="block min-h-[340px] rounded-2xl bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.16)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(239,0,0,0.18)]"
                >
                  <div className="text-black">{item.icon}</div>
                  <h2 className="mt-7 text-2xl font-black text-black">{item.title}</h2>
                  <p className="mt-4 min-h-28 text-base leading-7 text-slate-700">{item.subtitle}</p>
                  <span className="mt-7 inline-flex rounded-full border-2 border-black bg-[#ef0000] px-6 py-2 text-sm font-bold text-white">
                    Open Portal
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-t-[2rem] bg-[#ef0000] p-6 text-white md:flex md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase">Bangalore Weather</p>
            <p className="mt-1 text-3xl font-black">32 deg C</p>
            <p className="mt-1 text-sm text-white/80">Clouds with evening rain chances</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm md:mt-0 md:grid-cols-6">
            {weatherDays.map(([day, temperature]) => (
              <div key={day} className="text-center">
                <p className="font-semibold">{day}</p>
                <p className="mt-1 text-white/80">{temperature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
