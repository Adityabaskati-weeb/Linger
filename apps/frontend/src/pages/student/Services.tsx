import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { StudentPortalData } from "@campusiq/shared";
import {
  BadgeIndianRupee,
  Bus,
  Download,
  ExternalLink,
  FileUp,
  GraduationCap,
  HeartPulse,
  IdCard,
  Link as LinkIcon,
  PlayCircle,
  ShieldCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { api } from "../../lib/axios";

export function StudentServices() {
  const [data, setData] = useState<StudentPortalData | null>(null);
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [projectType, setProjectType] = useState("Management USB");
  const [nocType, setNocType] = useState<StudentPortalData["nocApplications"][number]["type"]>("Campus Placed");
  const [leaveFile, setLeaveFile] = useState<File | null>(null);
  const [leaveForm, setLeaveForm] = useState({ fromDate: "", toDate: "", reason: "" });

  function load() {
    api.get<{ success: true; data: StudentPortalData }>("/student/services").then((response) => {
      setData(response.data.data);
    });
  }

  useEffect(load, []);

  const qrSrc = useMemo(
    () =>
      data
        ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(data.examination.examFee.qrPayload)}`
        : "",
    [data]
  );

  if (!data) {
    return <Card className="animate-pulse text-sm text-slate-400">Loading student services...</Card>;
  }

  const portal = data;

  function downloadIdCard() {
    const svg = buildIdCardSvg(portal);
    downloadBlob("campusiq-virtual-id-card.svg", svg, "image/svg+xml");
  }

  async function uploadProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!projectFile) return;

    const form = new FormData();
    form.append("file", projectFile);
    form.append("title", projectFile.name);
    form.append("type", projectType);
    await api.post("/student/project/upload", form);
    setProjectFile(null);
    load();
  }

  async function applyNoc(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await api.post("/student/noc", { type: nocType });
    load();
  }

  async function applyLeave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData();
    form.append("fromDate", leaveForm.fromDate);
    form.append("toDate", leaveForm.toDate);
    form.append("reason", leaveForm.reason);
    if (leaveFile) form.append("document", leaveFile);
    await api.post("/student/leave", form);
    setLeaveForm({ fromDate: "", toDate: "", reason: "" });
    setLeaveFile(null);
    load();
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="rounded-[28px] bg-[#f6f6fb] p-4 text-[#26344d] shadow-elevated">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <ServiceCard title="Virtual ID Card" subtitle="Download official digital ID" icon={<IdCard className="h-5 w-5" />} action="Download" onClick={downloadIdCard} />
        <ServiceCard title="Project Upload" subtitle="Submit project file only" icon={<FileUp className="h-5 w-5" />} />
        <ServiceCard title="Apply for NOC" subtitle="Placement and internship clearance" icon={<ShieldCheck className="h-5 w-5" />} />
        <ServiceCard title="CU LMS" subtitle="Class resources and study links" icon={<GraduationCap className="h-5 w-5" />} />
        <ServiceCard title="Important Links" subtitle="Scholarship, forms, and anti-ragging" icon={<LinkIcon className="h-5 w-5" />} />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl bg-[#245b86] p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.18em]">CampusIQ Weather</p>
          <p className="mt-2 text-3xl font-bold">31°C</p>
          <p className="text-sm text-blue-100">Clear sky near campus</p>
        </div>
        <button type="button" onClick={downloadIdCard} className="rounded-2xl bg-white p-5 text-left font-bold text-[#26344d] shadow-sm transition hover:bg-blue-50">
          Download Virtual ID Card <span className="float-right rounded-xl bg-blue-50 px-4 py-2 text-sm text-[#245b86]">Download Now</span>
        </button>
      </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-white text-[#26344d]">
          <h2 className="font-display text-2xl font-semibold">Important Message</h2>
          <div className="mt-5 space-y-3">
            {data.onlineTests.slice(0, 5).map((test, index) => (
              <div key={test.id} className="rounded-xl bg-slate-100 px-4 py-3 text-sm">
                {index + 1}. <span className="font-bold text-green-600">Eligible</span> to appear in {test.subjectCode}: {test.title}.
              </div>
            ))}
          </div>
        </Card>
        <Card className="bg-white text-[#26344d]">
          <h2 className="font-display text-2xl font-semibold">Announcements (ALL)</h2>
          <div className="mt-5 space-y-3">
            {data.announcements.map((announcement) => (
              <div key={announcement.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold uppercase text-[#26344d]">{announcement.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{announcement.body}</p>
                <p className="mt-3 font-mono text-xs text-[#245b86]">{announcement.publishedAt} - {announcement.author}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-white text-[#26344d]">
          <h2 className="font-display text-2xl font-semibold">Project File Upload</h2>
          <p className="mt-1 text-sm text-slate-500">Team status has been removed; this area is only for project file submission.</p>
          <form onSubmit={uploadProject} className="mt-5 space-y-4">
            <select
              value={projectType}
              onChange={(event) => setProjectType(event.target.value)}
              className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-[#26344d]"
            >
              <option>Management USB</option>
              <option>Research Report</option>
              <option>Source Code ZIP</option>
            </select>
            <input
              type="file"
              onChange={(event: ChangeEvent<HTMLInputElement>) => setProjectFile(event.target.files?.[0] ?? null)}
              className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
            />
            <Button type="submit" disabled={!projectFile}>
              <FileUp className="h-4 w-4" />
              Upload Project File
            </Button>
          </form>
          <div className="mt-5 space-y-3">
            {data.project.uploads.map((upload) => (
              <div key={upload.id} className="rounded-md border border-white/[0.07] bg-white/[0.035] p-3 text-sm">
                <p className="font-medium text-[#26344d]">{upload.title}</p>
                <p className="mt-1 text-slate-500">{upload.type} - {upload.uploadedAt}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="bg-white text-[#26344d]">
          <h2 className="font-display text-2xl font-semibold">CU LMS Class Resources</h2>
          <p className="mt-1 text-sm text-slate-500">Class resources and useful websites are linked here for quick study access.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {data.lmsResources.map((resource) => (
              <a key={resource.id} href={resource.href} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#245b86] hover:bg-blue-50">
                <p className="font-mono text-xs text-[#245b86]">{resource.subjectCode}</p>
                <p className="mt-2 font-semibold">{resource.title}</p>
                <p className="mt-1 text-xs text-slate-500">{resource.type}</p>
              </a>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
            <ShieldCheck className="h-5 w-5 text-cyan" />
            Apply for NOC
          </h2>
          <form onSubmit={applyNoc} className="mt-5 flex flex-col gap-3">
            <select
              value={nocType}
              onChange={(event) => setNocType(event.target.value as typeof nocType)}
              className="h-11 rounded-md border border-white/10 bg-overlay px-3 text-sm text-white"
            >
              <option>Campus Placed</option>
              <option>Direct-Placement</option>
              <option>Direct only Internship</option>
            </select>
            <Button>Apply</Button>
          </form>
          <StatusList rows={data.nocApplications.map((item) => ({ title: item.type, meta: item.appliedAt, status: item.status }))} />
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
            <HeartPulse className="h-5 w-5 text-cyan" />
            Medical Leave
          </h2>
          <form onSubmit={applyLeave} className="mt-5 space-y-3">
            <Input type="date" value={leaveForm.fromDate} onChange={(event) => setLeaveForm((current) => ({ ...current, fromDate: event.target.value }))} />
            <Input type="date" value={leaveForm.toDate} onChange={(event) => setLeaveForm((current) => ({ ...current, toDate: event.target.value }))} />
            <Input placeholder="Reason" value={leaveForm.reason} onChange={(event) => setLeaveForm((current) => ({ ...current, reason: event.target.value }))} />
            <input
              type="file"
              onChange={(event: ChangeEvent<HTMLInputElement>) => setLeaveFile(event.target.files?.[0] ?? null)}
              className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-md file:border-0 file:bg-white/[0.08] file:px-4 file:py-2 file:text-sm file:text-white"
            />
            <Button disabled={!leaveForm.fromDate || !leaveForm.toDate || leaveForm.reason.length < 8}>Proceed</Button>
          </form>
          <StatusList rows={data.leaveHistory.map((item) => ({ title: `${item.fromDate} to ${item.toDate}`, meta: item.reason, status: item.status }))} />
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
            <PlayCircle className="h-5 w-5 text-cyan" />
            Online Test
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Tests now run on a separate full page with 10 questions, a timer, and instant scoring.
          </p>
          <div className="mt-5 space-y-3">
            {data.onlineTests.map((test) => (
              <div key={test.id} className="rounded-md border border-white/[0.07] bg-white/[0.035] p-3">
                <p className="text-sm font-medium text-white">{test.title}</p>
                <p className="mt-1 text-xs text-slate-500">{test.subjectCode} - {test.startsAt} - {test.durationMinutes} min</p>
                {test.status === "OPEN" ? (
                  <Link to="/student/online-test" className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-white shadow-glow transition hover:bg-primary-hover">
                    Start Test
                  </Link>
                ) : (
                  <p className="mt-3 text-xs text-slate-400">{test.status}{test.score ? ` - Score ${test.score}/20` : ""}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
            <Bus className="h-5 w-5 text-cyan" />
            Transport Details
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Metric label="Route" value={data.transport.routeNo} />
            <Metric label="Pickup" value={data.transport.pickupPoint} />
            <Metric label="Bus No." value={data.transport.busNo} />
            <Metric label="Driver" value={data.transport.driver} />
          </div>
          <p className="mt-4 text-sm text-slate-400">Helpline: {data.transport.helpline}</p>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
            <GraduationCap className="h-5 w-5 text-cyan" />
            Examination
          </h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_170px]">
            <div className="space-y-3">
              <p className="rounded-md bg-white/[0.04] px-3 py-2 text-sm text-slate-300">Form status: {data.examination.formStatus}</p>
              {data.examination.dateSheet.map((item) => (
                <p key={item.code} className="rounded-md border border-white/[0.07] px-3 py-2 text-sm text-slate-400">
                  {item.code} {item.subject} - {item.date} at {item.time}
                </p>
              ))}
              {data.examination.result.map((item) => (
                <p key={item.code} className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
                  {item.code} result: {item.grade} ({item.marks})
                </p>
              ))}
            </div>
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.035] p-3 text-center">
              <img src={qrSrc} alt="UPI QR code" className="mx-auto h-32 w-32 rounded-md bg-white p-2" />
              <p className="mt-3 flex items-center justify-center gap-1 text-sm text-white">
                <BadgeIndianRupee className="h-4 w-4" />
                {data.examination.examFee.amount}
              </p>
              <p className="mt-1 text-xs text-slate-500">UPI: {data.examination.examFee.upiId}</p>
              <p className="mt-1 text-xs text-amber-200">Status: {data.examination.examFee.status}</p>
              <a
                href={data.examination.examFee.qrPayload}
                className="mt-3 inline-flex h-9 items-center justify-center rounded-md bg-[#ef0000] px-4 text-sm font-semibold text-white"
              >
                Pay Exam Fee
              </a>
              <button
                type="button"
                onClick={() => void navigator.clipboard?.writeText(data.examination.examFee.qrPayload)}
                className="mt-2 block w-full text-xs font-medium text-cyan"
              >
                Copy UPI payment link
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <h2 className="font-display text-2xl font-semibold">Important Links</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {data.importantLinks.map((link) => (
              <a key={link.id} href={link.href} target="_blank" rel="noreferrer" className="rounded-lg border border-white/[0.07] bg-white/[0.035] p-4 transition hover:border-cyan/40">
                <p className="flex items-center justify-between gap-3 font-medium text-white">
                  {link.title}
                  <ExternalLink className="h-4 w-4 text-cyan" />
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{link.description}</p>
              </a>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-2xl font-semibold">AI Materials Visible to Student</h2>
          <p className="mt-1 text-sm text-slate-500">Faculty and student uploads feed this list and the AI Agent context.</p>
          <div className="mt-5 space-y-3">
            {data.materials.map((material) => (
              <div key={material.id} className="rounded-md border border-white/[0.07] bg-white/[0.035] p-3">
                <p className="text-sm font-medium text-white">{material.title}</p>
                <p className="mt-1 text-xs text-slate-500">{material.subject} - {material.fileName} - {material.uploadedAt}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.section>
  );
}

function ServiceCard({
  title,
  subtitle,
  icon,
  action,
  onClick
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <Card className="min-h-36 bg-white text-[#26344d] shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-xl font-semibold">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-[#245b86]">{icon}</div>
      </div>
      {action ? (
        <button type="button" onClick={onClick} className="mt-4 flex items-center gap-2 text-sm font-medium text-cyan">
          <Download className="h-4 w-4" />
          {action}
        </button>
      ) : null}
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.035] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function StatusList({ rows }: { rows: Array<{ title: string; meta: string; status: string }> }) {
  return (
    <div className="mt-5 space-y-2">
      {rows.map((row) => (
        <div key={`${row.title}-${row.meta}`} className="rounded-md border border-white/[0.07] bg-white/[0.035] p-3">
          <p className="text-sm font-medium text-white">{row.title}</p>
          <p className="mt-1 text-xs text-slate-500">{row.meta}</p>
          <p className="mt-2 text-xs font-semibold text-cyan">{row.status}</p>
        </div>
      ))}
    </div>
  );
}

function downloadBlob(fileName: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function buildIdCardSvg(data: StudentPortalData) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="460" viewBox="0 0 760 460">
  <defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#6366F1"/><stop offset="1" stop-color="#06B6D4"/></linearGradient></defs>
  <rect width="760" height="460" rx="32" fill="#08080E"/>
  <rect x="24" y="24" width="712" height="412" rx="26" fill="#0F0F1A" stroke="rgba(255,255,255,0.16)"/>
  <rect x="24" y="24" width="712" height="96" rx="26" fill="url(#g)"/>
  <text x="56" y="82" fill="white" font-family="Arial" font-size="32" font-weight="700">CampusIQ Virtual ID</text>
  <circle cx="622" cy="226" r="62" fill="url(#g)"/>
  <text x="622" y="240" fill="white" text-anchor="middle" font-family="Arial" font-size="38" font-weight="700">${data.profile.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</text>
  <text x="56" y="172" fill="#06B6D4" font-family="Arial" font-size="20">${data.idCard.cardNo}</text>
  <text x="56" y="222" fill="white" font-family="Arial" font-size="34" font-weight="700">${data.profile.name}</text>
  <text x="56" y="266" fill="#B8B8D4" font-family="Arial" font-size="22">${data.profile.rollNumber} | ${data.profile.programCode}</text>
  <text x="56" y="308" fill="#B8B8D4" font-family="Arial" font-size="20">Semester ${data.profile.semester} | ${data.profile.section}</text>
  <text x="56" y="360" fill="#F1F1F8" font-family="Arial" font-size="20">Valid till ${data.idCard.validTill}</text>
  <text x="56" y="394" fill="#9898B4" font-family="Arial" font-size="17">Emergency: ${data.idCard.emergencyContact}</text>
  </svg>`;
}
