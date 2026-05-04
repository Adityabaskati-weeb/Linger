import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { FacultyProductivityRow } from "@campusiq/shared";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/axios";

export function AdminFacultyManagement() {
  const [rows, setRows] = useState<FacultyProductivityRow[]>([]);

  useEffect(() => {
    api.get<{ success: true; data: FacultyProductivityRow[] }>("/admin/faculty").then((response) => {
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
        <h2 className="font-display text-2xl font-semibold">Faculty Productivity</h2>
        <div className="mt-5 overflow-hidden rounded-lg border border-white/[0.07]">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Department</th>
                <th className="p-4">Classes</th>
                <th className="p-4">Students</th>
                <th className="p-4">Leave Days</th>
                <th className="p-4">Uploads</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-white/[0.06]">
                  <td className="p-4 text-white">{row.name}</td>
                  <td className="p-4 text-slate-400">{row.department}</td>
                  <td className="p-4">{row.classesThisMonth}</td>
                  <td className="p-4">{row.studentsTaught}</td>
                  <td className="p-4">{row.leaveDaysUsed}</td>
                  <td className="p-4">{row.materialUploads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.section>
  );
}
