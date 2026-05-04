import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { DepartmentAcademicMap } from "@campusiq/shared";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/axios";

export function AdminDepartments() {
  const [rows, setRows] = useState<DepartmentAcademicMap[]>([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    api.get<{ success: true; data: DepartmentAcademicMap[] }>("/admin/departments").then((response) => {
      setRows(response.data.data);
      setSelectedId((current) => current || response.data.data[0]?.id || "");
    });
  }, []);

  const selected = rows.find((row) => row.id === selectedId) ?? rows[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <Card>
        <h2 className="font-display text-2xl font-semibold">Departments & Courses</h2>
        <p className="mt-1 text-sm text-slate-500">Institution structure used by analytics and timetables.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {rows.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => setSelectedId(row.id)}
              className={`rounded-md border p-4 text-left transition ${
                selected?.id === row.id
                  ? "border-cyan bg-cyan/10"
                  : "border-white/[0.07] bg-white/[0.035] hover:border-cyan/40"
              }`}
            >
              <p className="font-display text-2xl font-semibold">{row.code}</p>
              <p className="mt-2 text-sm text-white">{row.name}</p>
              <p className="mt-1 text-xs text-slate-500">{row.courses} active course(s)</p>
              <p className="mt-3 text-xs leading-5 text-slate-400">{row.purpose}</p>
            </button>
          ))}
        </div>
      </Card>

      {selected ? (
        <Card>
            <h2 className="font-display text-2xl font-semibold">{selected.code} Faculty & Student Map</h2>
            <p className="mt-1 text-sm text-slate-500">Shows which faculty teaches each subject and which students are enrolled.</p>
          <div className="mt-5 grid gap-3 xl:grid-cols-2">
              {selected.subjects.map((subject) => (
                <div key={subject.code} className="rounded-lg border border-white/[0.07] bg-white/[0.035] p-4">
                  <p className="font-mono text-sm text-cyan">{subject.code}</p>
                  <p className="mt-1 text-lg font-semibold text-white">{subject.subject}</p>
                  <p className="mt-3 text-sm text-slate-400">Faculty: {subject.faculty.join(", ")}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Students: {subject.students.join(", ")}</p>
                </div>
              ))}
            </div>
        </Card>
      ) : null}
    </motion.section>
  );
}
