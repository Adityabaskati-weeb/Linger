import type { AttendanceStatus } from "@campusiq/shared";
import { cn } from "../../lib/utils";

interface AttendanceToggleProps {
  value: AttendanceStatus;
  onChange: (value: AttendanceStatus) => void;
}

const statuses: AttendanceStatus[] = ["PRESENT", "ABSENT"];

export function AttendanceToggle({ value, onChange }: AttendanceToggleProps) {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-md border border-white/10 bg-white/[0.04]">
      {statuses.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => onChange(status)}
          className={cn(
            "px-2 py-2 text-xs font-medium transition hover:bg-white/[0.08]",
            value === status && "bg-primary text-white"
          )}
        >
          {status.charAt(0)}
        </button>
      ))}
    </div>
  );
}
