import type { ReactNode } from "react";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  PlaneTakeoff,
  ShieldCheck,
  Users
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import type { Role } from "@campusiq/shared";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/auth.store";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const roleMeta: Record<Role, { title: string; subtitle: string; nav: NavItem[] }> = {
  STUDENT: {
    title: "Student Console",
    subtitle: "Attendance, schedule, and AI learning",
    nav: [
      { label: "Dashboard", href: "/student/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: "Attendance", href: "/student/attendance", icon: <ShieldCheck className="h-4 w-4" /> },
      { label: "Schedule", href: "/student/schedule", icon: <CalendarDays className="h-4 w-4" /> },
      { label: "AI Agent", href: "/student/ai-agent", icon: <BookOpen className="h-4 w-4" /> }
    ]
  },
  FACULTY: {
    title: "Faculty Workspace",
    subtitle: "Classes, attendance, leave, and materials",
    nav: [
      { label: "Dashboard", href: "/faculty/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: "Attendance", href: "/faculty/attendance", icon: <ShieldCheck className="h-4 w-4" /> },
      { label: "Schedule", href: "/faculty/schedule", icon: <CalendarDays className="h-4 w-4" /> },
      { label: "Leave", href: "/faculty/leave", icon: <PlaneTakeoff className="h-4 w-4" /> },
      { label: "Materials", href: "/faculty/materials", icon: <BookOpen className="h-4 w-4" /> }
    ]
  },
  ADMIN: {
    title: "Command Center",
    subtitle: "Campus health, faculty, students, and approvals",
    nav: [
      { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: "Attendance", href: "/admin/attendance", icon: <ShieldCheck className="h-4 w-4" /> },
      { label: "Faculty", href: "/admin/faculty", icon: <Users className="h-4 w-4" /> },
      { label: "Students", href: "/admin/students", icon: <GraduationCap className="h-4 w-4" /> },
      { label: "Timetable", href: "/admin/timetable", icon: <CalendarDays className="h-4 w-4" /> }
    ]
  }
};

interface DashboardShellProps {
  role: Role;
}

export function DashboardShell({ role }: DashboardShellProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const meta = roleMeta[role];

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-base text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_42rem)]" />
      <div className="relative flex min-h-screen">
        <aside className="glass-border sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-y-0 border-l-0 p-5 lg:flex">
          <div className="mb-10 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-hero shadow-glow">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold">CampusIQ</p>
              <p className="text-xs text-slate-400">Think. Attend. Learn. Lead.</p>
            </div>
          </div>

          <nav className="space-y-2">
            {meta.nav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-white",
                    isActive && "border-l-2 border-primary bg-primary/10 text-white"
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
            <Button className="mt-4 w-full" variant="secondary" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="w-full px-5 py-6 lg:px-8">
          <header className="mb-8 flex flex-col gap-3 border-b border-white/[0.07] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.24em] text-cyan">CampusIQ</p>
              <h1 className="font-display text-4xl font-semibold">{meta.title}</h1>
              <p className="mt-2 text-sm text-slate-400">{meta.subtitle}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
              {user?.role}
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
