import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, KeyRound, Sparkles, UserRound } from "lucide-react";
import type { Role } from "@campusiq/shared";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { roleToRoute } from "../../lib/utils";
import { useAuthStore } from "../../store/auth.store";

interface DemoAccount {
  role: Role;
  label: string;
  email: string;
  detail: string;
}

const password = "campusiq123";

const demoAccounts: DemoAccount[] = [
  {
    role: "STUDENT",
    label: "Student",
    email: "student@campusiq.edu",
    detail: "Attendance risk, schedule, AI tutor"
  },
  {
    role: "FACULTY",
    label: "Faculty",
    email: "faculty@campusiq.edu",
    detail: "Mark classes, leave, materials"
  },
  {
    role: "ADMIN",
    label: "Admin",
    email: "admin@campusiq.edu",
    detail: "Campus health and approvals"
  }
];

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState(demoAccounts[0].email);
  const [formPassword, setFormPassword] = useState(password);
  const [selectedRole, setSelectedRole] = useState<Role>("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function selectAccount(account: DemoAccount) {
    setSelectedRole(account.role);
    setEmail(account.email);
    setFormPassword(password);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(email, formPassword);
      navigate(roleToRoute(user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-base text-white lg:grid-cols-[1.08fr_0.92fr]">
      <section className="auth-mesh dot-grid relative hidden overflow-hidden border-r border-white/[0.07] p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/20 [animation:pulse-ring_3.4s_ease-out_infinite]" />

        <div className="relative flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-hero shadow-glow">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-display text-2xl font-semibold">CampusIQ</p>
            <p className="text-sm text-slate-300">Intelligent Campus Operating System</p>
          </div>
        </div>

        <div className="relative max-w-2xl">
          <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-cyan-100">
            Hackathon-ready role intelligence
          </p>
          <h1 className="font-display text-7xl font-semibold leading-[0.95]">
            Think.
            <br />
            Attend.
            <br />
            Learn.
            <br />
            Lead.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
            A precision dark command layer for student attendance, faculty workflows,
            administrative insight, and AI-native learning.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-3">
          {["JWT Auth", "Voice AI", "Timetable Logic"].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
              <Sparkles className="mb-3 h-4 w-4 text-cyan" />
              <p className="text-sm font-medium">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-gradient-hero shadow-glow">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h1 className="font-display text-4xl font-semibold">CampusIQ</h1>
          </div>

          <Card className={error ? "shake" : ""} glow>
            <div className="mb-7">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan">Secure Login</p>
              <h2 className="mt-3 font-display text-4xl font-semibold">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-400">
                Select a demo role or enter campus credentials.
              </p>
            </div>

            <div className="mb-6 grid gap-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => selectAccount(account)}
                  className={`rounded-md border p-4 text-left transition ${
                    selectedRole === account.role
                      ? "border-primary/70 bg-primary/15"
                      : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{account.label}</p>
                      <p className="mt-1 text-xs text-slate-400">{account.detail}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  <UserRound className="h-4 w-4" />
                  Email
                </span>
                <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  <KeyRound className="h-4 w-4" />
                  Password
                </span>
                <Input
                  value={formPassword}
                  onChange={(event) => setFormPassword(event.target.value)}
                  type="password"
                />
              </label>

              {error ? (
                <p className="rounded-md border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </p>
              ) : null}

              <Button className="w-full" size="lg" loading={loading}>
                Enter CampusIQ
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        </motion.div>
      </section>
    </main>
  );
}
