import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { TimetableSlot } from "@campusiq/shared";
import { TimetableGrid } from "../../components/shared/TimetableGrid";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/axios";

export function StudentSchedule() {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);

  useEffect(() => {
    api
      .get<{ success: true; data: TimetableSlot[] }>("/student/schedule")
      .then((response) => setSlots(response.data.data));
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <Card>
        <h2 className="font-display text-2xl font-semibold">Weekly Timetable</h2>
        <p className="mt-1 text-sm text-slate-500">
          Active semester schedule, filtered to the student&apos;s enrolled course.
        </p>
      </Card>
      <TimetableGrid slots={slots} />
    </motion.section>
  );
}
