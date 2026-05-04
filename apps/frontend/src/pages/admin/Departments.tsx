import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/axios";

interface DepartmentRow {
  id: string;
  name: string;
  code: string;
  courses: number;
}

export function AdminDepartments() {
  const [rows, setRows] = useState<DepartmentRow[]>([]);

  useEffect(() => {
    api.get<{ success: true; data: DepartmentRow[] }>("/admin/departments").then((response) => {
      setRows(response.data.data);
    });
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <Card>
        <h2 className="font-display text-2xl font-semibold">Departments & Courses</h2>
        <p className="mt-1 text-sm text-slate-500">Institution structure used by analytics and timetables.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {rows.map((row) => (
            <div key={row.id} className="rounded-md border border-white/[0.07] bg-white/[0.035] p-4">
              <p className="font-display text-2xl font-semibold">{row.code}</p>
              <p className="mt-2 text-sm text-white">{row.name}</p>
              <p className="mt-1 text-xs text-slate-500">{row.courses} active course(s)</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.section>
  );
}
