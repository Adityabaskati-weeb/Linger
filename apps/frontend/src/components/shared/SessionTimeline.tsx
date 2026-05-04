import type { StudentScheduleItem } from "@campusiq/shared";
import { Badge } from "../ui/Badge";

interface SessionTimelineProps {
  items: StudentScheduleItem[];
}

export function SessionTimeline({ items }: SessionTimelineProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 rounded-md border border-white/[0.07] bg-white/[0.035] p-4">
          <div className="flex w-16 shrink-0 flex-col items-center">
            <span className="font-mono text-sm text-white">{item.startTime}</span>
            <span className="mt-1 h-full min-h-8 w-px bg-white/10" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-white">{item.subject}</p>
              <Badge tone={item.status === "current" ? "success" : "neutral"}>{item.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {item.faculty} - {item.room} - {item.endTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
