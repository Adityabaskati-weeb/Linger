import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { LeaveRequestData, LeaveType } from "@campusiq/shared";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { api } from "../../lib/axios";

const leaveTypes: LeaveType[] = ["SICK", "CASUAL", "EARNED", "EMERGENCY"];

export function FacultyLeave() {
  const [requests, setRequests] = useState<LeaveRequestData[]>([]);
  const [type, setType] = useState<LeaveType>("CASUAL");
  const [fromDate, setFromDate] = useState("2026-05-09");
  const [toDate, setToDate] = useState("2026-05-09");
  const [reason, setReason] = useState("Department workshop preparation");

  function load() {
    api.get<{ success: true; data: LeaveRequestData[] }>("/faculty/leave").then((response) => {
      setRequests(response.data.data);
    });
  }

  useEffect(load, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    await api.post("/faculty/leave", { type, fromDate, toDate, reason });
    load();
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]"
    >
      <Card>
        <h2 className="font-display text-2xl font-semibold">Apply for Leave</h2>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Leave Type</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as LeaveType)}
              className="h-11 w-full rounded-md border border-white/10 bg-overlay px-3 text-sm text-white"
            >
              {leaveTypes.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">From</span>
              <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">To</span>
              <Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Reason</span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="min-h-28 w-full rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-white outline-none"
            />
          </label>
          <Button className="w-full">Submit Leave</Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-display text-2xl font-semibold">Leave History</h2>
        <div className="mt-5 space-y-3">
          {requests.map((request) => (
            <div key={request.id} className="rounded-md border border-white/[0.07] bg-white/[0.035] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-medium text-white">{request.type}</p>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                  {request.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {request.fromDate} to {request.toDate} - {request.days} day(s)
              </p>
              <p className="mt-2 text-sm text-slate-500">{request.reason}</p>
              {request.adminNote ? <p className="mt-2 text-xs text-cyan">{request.adminNote}</p> : null}
            </div>
          ))}
        </div>
      </Card>
    </motion.section>
  );
}
