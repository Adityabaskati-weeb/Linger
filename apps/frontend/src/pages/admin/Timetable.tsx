import { useState } from "react";
import { motion } from "framer-motion";
import type { DayOfWeek, GeneratedTimetable, TimetableGenerationConfig } from "@campusiq/shared";
import { WandSparkles } from "lucide-react";
import { TimetableGrid } from "../../components/shared/TimetableGrid";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/axios";

const days: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

export function AdminTimetable() {
  const [config, setConfig] = useState<TimetableGenerationConfig>({
    semester: 5,
    days,
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: 60,
    breakStart: "12:00",
    breakDuration: 60,
    maxConsecutive: 2
  });
  const [generated, setGenerated] = useState<GeneratedTimetable | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    const response = await api.post<{ success: true; data: GeneratedTimetable }>("/timetable/generate", config);
    setGenerated(response.data.data);
    setLoading(false);
  }

  async function saveAndActivate() {
    if (!generated) return;
    const saved = await api.post<{ success: true; data: GeneratedTimetable }>("/timetable/save", generated);
    const active = await api.patch<{ success: true; data: GeneratedTimetable }>(
      `/timetable/${saved.data.data.id}/activate`
    );
    setGenerated(active.data.data);
  }

  function toggleDay(day: DayOfWeek) {
    setConfig((current) => ({
      ...current,
      days: current.days.includes(day)
        ? current.days.filter((item) => item !== day)
        : [...current.days, day]
    }));
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <Card>
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold">Timetable Generator</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Generates slots while avoiding faculty and room clashes.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Semester</span>
              <select
                value={config.semester}
                onChange={(event) => setConfig({ ...config, semester: Number(event.target.value) })}
                className="h-11 w-full rounded-md border border-white/10 bg-overlay px-3 text-sm text-white"
              >
                {Array.from({ length: 8 }, (_, index) => index + 1).map((semester) => (
                  <option key={semester} value={semester}>
                    Semester {semester}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Duration</span>
              <select
                value={config.slotDuration}
                onChange={(event) => setConfig({ ...config, slotDuration: Number(event.target.value) })}
                className="h-11 w-full rounded-md border border-white/10 bg-overlay px-3 text-sm text-white"
              >
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Max consecutive</span>
              <select
                value={config.maxConsecutive}
                onChange={(event) => setConfig({ ...config, maxConsecutive: Number(event.target.value) })}
                className="h-11 w-full rounded-md border border-white/10 bg-overlay px-3 text-sm text-white"
              >
                <option value={2}>2 hours</option>
                <option value={3}>3 hours</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {days.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`rounded-full border px-3 py-2 text-xs ${
                config.days.includes(day)
                  ? "border-primary bg-primary/20 text-white"
                  : "border-white/10 text-slate-400"
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={generate} loading={loading}>
            <WandSparkles className="h-4 w-4" />
            Generate Schedule
          </Button>
          <Button variant="secondary" disabled={!generated || generated.isActive} onClick={saveAndActivate}>
            Activate This Timetable
          </Button>
        </div>
      </Card>

      {generated ? (
        <>
          <Card className={generated.conflicts.length ? "border-danger/20 bg-danger/10" : "border-success/20 bg-success/10"}>
            <p className="font-medium text-white">
              {generated.conflicts.length
                ? `${generated.conflicts.length} conflict(s) detected`
                : `Generated ${generated.slots.length} slots with zero conflicts`}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {generated.isActive ? "This timetable is active." : "Review the grid, then activate it."}
            </p>
          </Card>
          <TimetableGrid slots={generated.slots} />
        </>
      ) : null}
    </motion.section>
  );
}
