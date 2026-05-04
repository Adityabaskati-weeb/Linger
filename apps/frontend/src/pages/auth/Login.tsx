import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, KeyRound, RefreshCcw, UserRound } from "lucide-react";
import type { Role } from "@campusiq/shared";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { roleToRoute } from "../../lib/utils";
import { useAuthStore } from "../../store/auth.store";

interface DemoAccount {
  role: Role;
  label: string;
  portalTitle: string;
  email: string;
  detail: string;
}

const password = "campusiq123";

const demoAccounts: DemoAccount[] = [
  {
    role: "STUDENT",
    label: "Student",
    portalTitle: "Student Portal Authentication",
    email: "student@campusiq.edu",
    detail: "Attendance risk, schedule, AI tutor"
  },
  {
    role: "FACULTY",
    label: "Faculty",
    portalTitle: "Faculty Portal Authentication",
    email: "faculty@campusiq.edu",
    detail: "Mark classes, leave, materials"
  },
  {
    role: "ADMIN",
    label: "Admin",
    portalTitle: "Admin Portal Authentication",
    email: "admin@campusiq.edu",
    detail: "Campus health and approvals"
  }
];

function normalizeRole(role: string | null): Role {
  if (role === "FACULTY" || role === "ADMIN" || role === "STUDENT") {
    return role;
  }

  return "STUDENT";
}

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const requestedRole = normalizeRole(searchParams.get("role"));
  const lockedAccount = demoAccounts.find((account) => account.role === requestedRole) ?? demoAccounts[0];
  const [email, setEmail] = useState(lockedAccount.email);
  const [formPassword, setFormPassword] = useState(password);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setEmail(lockedAccount.email);
    setFormPassword(password);
    setError("");
  }, [lockedAccount.email]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(email, formPassword);

      if (user.role !== lockedAccount.role) {
        await logout();
        setError(`This page only accepts ${lockedAccount.label.toLowerCase()} portal credentials.`);
        return;
      }

      navigate(roleToRoute(user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(90deg,rgba(15,23,42,0.86),rgba(15,23,42,0.22)),radial-gradient(circle_at_72%_42%,rgba(255,255,255,0.24),transparent_18rem),linear-gradient(135deg,#111827,#8b6f63_48%,#d6c1b3)] text-white">
      <section className="flex min-h-screen items-center px-5 py-10 lg:pl-[15%]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md rounded-3xl bg-black/55 p-8 shadow-[0_28px_80px_rgba(0,0,0,0.4)] backdrop-blur-md"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto flex w-fit items-end justify-center gap-1">
              <span className="text-6xl font-black tracking-tighter text-[#ef0000]">CU</span>
              <span className="text-5xl font-black tracking-tight text-white">IMS</span>
            </div>
            <h1 className="mt-5 text-3xl font-bold">Log in</h1>
            <p className="mt-4 text-sm leading-6 text-slate-200">
              Welcome to University Information
              <br />
              Management System - <span className="font-bold text-[#ef0000]">Virtual Campus</span>
            </p>
          </div>

          <div className={error ? "shake" : ""}>
            <div className="mb-5 rounded-2xl border border-[#ef0000]/70 bg-[#ef0000] px-5 py-4 text-white shadow-[0_18px_50px_rgba(239,0,0,0.24)]">
              <p className="text-sm font-black uppercase tracking-[0.18em]">{lockedAccount.label}</p>
              <h2 className="mt-2 text-xl font-black">{lockedAccount.portalTitle}</h2>
              <p className="mt-2 text-sm text-white/85">{lockedAccount.detail}</p>
              <Link to="/" className="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.16em] text-white underline underline-offset-4">
                Change portal
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  <UserRound className="h-4 w-4" />
                  UID / Email
                </span>
                <Input className="bg-white text-slate-900 placeholder:text-slate-400" value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  <KeyRound className="h-4 w-4" />
                  Password
                </span>
                <Input
                  className="bg-white text-slate-900 placeholder:text-slate-400"
                  value={formPassword}
                  onChange={(event) => setFormPassword(event.target.value)}
                  type="password"
                />
              </label>

              <div className="grid grid-cols-[1fr_1fr_44px] gap-2">
                <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 font-mono text-sm">nLYM</div>
                <div className="grid place-items-center rounded-xl bg-white font-serif text-2xl font-bold tracking-widest text-black">nLYM</div>
                <button type="button" className="grid place-items-center rounded-xl bg-white text-slate-700">
                  <RefreshCcw className="h-4 w-4" />
                </button>
              </div>

              {error ? (
                <p className="rounded-md border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </p>
              ) : null}

              <Button className="w-full rounded-full bg-[#ef0000] hover:bg-red-700" size="lg" loading={loading}>
                LOGIN
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-center text-sm text-slate-300">Forgot Password?</p>
            </form>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
