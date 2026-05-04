import { Fragment } from "react";

interface AttendanceHeatmapProps {
  data: number[][];
}

export function AttendanceHeatmap({ data }: AttendanceHeatmapProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = [0, 4, 8, 12, 16, 20, 23];

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[760px] gap-1" style={{ gridTemplateColumns: "3rem repeat(24, minmax(0, 1fr))" }}>
        <div />
        {Array.from({ length: 24 }, (_, hour) => (
          <div key={hour} className="text-center text-[10px] text-slate-500">
            {hours.includes(hour) ? `${hour}:00` : ""}
          </div>
        ))}
      {data.map((row, rowIndex) => (
          <Fragment key={rowIndex}>
            <div key={`${rowIndex}-label`} className="pr-2 text-right text-xs font-medium text-slate-400">
              {days[rowIndex] ?? `D${rowIndex + 1}`}
            </div>
          {row.map((value, hour) => (
            <div
              key={`${rowIndex}-${hour}`}
                title={`${days[rowIndex] ?? `Day ${rowIndex + 1}`} ${hour}:00 - ${value} AI sessions`}
                className="h-4 rounded-sm bg-cyan"
              style={{ opacity: Math.max(0.12, value / 20) }}
            />
          ))}
          </Fragment>
      ))}
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">X-axis: hour of day. Y-axis: day of week.</p>
    </div>
  );
}
