import type { LeaveRequestData } from "@campusiq/shared";
import { Button } from "../ui/Button";

interface LeaveApprovalFeedProps {
  leaves: LeaveRequestData[];
  onDecision: (id: string, status: "APPROVED" | "REJECTED") => void;
}

export function LeaveApprovalFeed({ leaves, onDecision }: LeaveApprovalFeedProps) {
  if (!leaves.length) {
    return <p className="text-sm text-slate-500">No pending leave requests.</p>;
  }

  return (
    <div className="space-y-3">
      {leaves.map((leave) => (
        <div key={leave.id} className="rounded-md border border-white/[0.07] bg-white/[0.035] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-white">{leave.type} Leave</p>
              <p className="mt-1 text-xs text-slate-500">
                {leave.fromDate} to {leave.toDate} - {leave.days} day(s)
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => onDecision(leave.id, "APPROVED")}>
                Approve
              </Button>
              <Button size="sm" variant="danger" onClick={() => onDecision(leave.id, "REJECTED")}>
                Reject
              </Button>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-400">{leave.reason}</p>
        </div>
      ))}
    </div>
  );
}
