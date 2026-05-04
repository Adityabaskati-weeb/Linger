import type { DayOfWeek, TimetableSlot } from "@campusiq/shared";

interface TimetableGridProps {
  slots: TimetableSlot[];
}

const days: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

function label(day: DayOfWeek) {
  return day.charAt(0) + day.slice(1).toLowerCase();
}

export function TimetableGrid({ slots }: TimetableGridProps) {
  const times = Array.from(new Set(slots.map((slot) => `${slot.startTime}-${slot.endTime}`))).sort();

  return (
    <div className="overflow-x-auto rounded-lg border border-white/[0.07]">
      <div
        className="grid min-w-[900px]"
        style={{ gridTemplateColumns: `110px repeat(${days.length}, minmax(130px, 1fr))` }}
      >
        <div className="border-b border-r border-white/[0.07] bg-white/[0.04] p-3 text-xs uppercase tracking-[0.18em] text-slate-500">
          Time
        </div>
        {days.map((day) => (
          <div
            key={day}
            className="border-b border-r border-white/[0.07] bg-white/[0.04] p-3 text-sm font-medium text-white"
          >
            {label(day)}
          </div>
        ))}

        {times.map((time) => {
          const [startTime, endTime] = time.split("-");

          return [
            <div
              key={`${time}-label`}
              className="border-b border-r border-white/[0.07] p-3 font-mono text-xs text-slate-400"
            >
              {startTime}
              <br />
              {endTime}
            </div>,
            ...days.map((day) => {
              const slot = slots.find(
                (candidate) => candidate.day === day && candidate.startTime === startTime
              );

              return (
                <div key={`${day}-${time}`} className="min-h-28 border-b border-r border-white/[0.07] p-2">
                  {slot ? (
                    <div
                      className="h-full rounded-md border p-3"
                      style={{
                        borderColor: `${slot.color}55`,
                        background: `linear-gradient(145deg, ${slot.color}22, rgba(255,255,255,0.035))`
                      }}
                    >
                      <p className="text-sm font-semibold text-white">{slot.subject}</p>
                      <p className="mt-1 text-xs text-slate-400">{slot.code}</p>
                      <p className="mt-3 text-xs text-slate-300">{slot.faculty}</p>
                      <p className="mt-1 font-mono text-xs text-slate-500">{slot.room}</p>
                    </div>
                  ) : null}
                </div>
              );
            })
          ];
        })}
      </div>
    </div>
  );
}
