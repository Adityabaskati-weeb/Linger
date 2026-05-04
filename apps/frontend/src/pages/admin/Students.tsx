import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/axios";

interface StudentRow {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  semester: number;
  overall: number;
}

export function AdminStudents() {
  const [rows, setRows] = useState<StudentRow[]>([]);

  useEffect(() => {
    api.get<{ success: true; data: StudentRow[] }>("/admin/students").then((response) => {
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
        <h2 className="font-display text-2xl font-semibold">Student Enrollment Overview</h2>
        <div className="mt-5 overflow-hidden rounded-lg border border-white/[0.07]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Roll No</th>
                <th className="p-4">Department</th>
                <th className="p-4">Semester</th>
                <th className="p-4">Overall</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-white/[0.06]">
                  <td className="p-4 text-white">{row.name}</td>
                  <td className="p-4 font-mono text-slate-400">{row.rollNumber}</td>
                  <td className="p-4 text-slate-400">{row.department}</td>
                  <td className="p-4">{row.semester}</td>
                  <td className={row.overall < 75 ? "p-4 text-red-200" : "p-4 text-emerald-200"}>
                    {row.overall}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.section>
  );
}
