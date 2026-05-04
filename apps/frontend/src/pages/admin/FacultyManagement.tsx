import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { FacultyProductivityRow } from "@campusiq/shared";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { api } from "../../lib/axios";

export function AdminFacultyManagement() {
  const [rows, setRows] = useState<FacultyProductivityRow[]>([]);
  const [form, setForm] = useState({
    name: "",
    employeeId: "",
    department: "Computer Science",
    subjectCode: ""
  });

  function load() {
    api.get<{ success: true; data: FacultyProductivityRow[] }>("/admin/faculty").then((response) => {
      setRows(response.data.data);
    });
  }

  useEffect(() => {
    load();
  }, []);

  async function addFaculty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await api.post("/admin/faculty", form);
    setForm({ name: "", employeeId: "", department: "Computer Science", subjectCode: "" });
    load();
  }

  async function remove(id: string) {
    if (!window.confirm("Remove this faculty member from the demo roster?")) return;
    await api.delete(`/admin/faculty/${id}`);
    load();
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
        <h2 className="font-display text-2xl font-semibold">Add New Faculty</h2>
        <p className="mt-1 text-sm text-slate-500">Use this when a new faculty member joins or receives a subject assignment.</p>
        <form onSubmit={addFaculty} className="mt-5 grid gap-3 md:grid-cols-5">
          <Input placeholder="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <Input placeholder="Employee ID" value={form.employeeId} onChange={(event) => setForm((current) => ({ ...current, employeeId: event.target.value }))} />
          <Input placeholder="Department" value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} />
          <Input placeholder="Subject Code" value={form.subjectCode} onChange={(event) => setForm((current) => ({ ...current, subjectCode: event.target.value }))} />
          <Button disabled={!form.name || !form.employeeId || !form.subjectCode}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-display text-2xl font-semibold">Faculty Productivity</h2>
        <div className="mt-5 overflow-hidden rounded-lg border border-white/[0.07]">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Employee ID</th>
                <th className="p-4">Department</th>
                <th className="p-4">Subject Code</th>
                <th className="p-4">Classes</th>
                <th className="p-4">Students</th>
                <th className="p-4">Leave Days</th>
                <th className="p-4">Uploads</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-white/[0.06]">
                  <td className="p-4 text-white">{row.name}</td>
                  <td className="p-4 font-mono text-cyan">{row.employeeId}</td>
                  <td className="p-4 text-slate-400">{row.department}</td>
                  <td className="p-4 font-mono text-slate-300">{row.subjectCode}</td>
                  <td className="p-4">{row.classesThisMonth}</td>
                  <td className="p-4">{row.studentsTaught}</td>
                  <td className="p-4">{row.leaveDaysUsed}</td>
                  <td className="p-4">{row.materialUploads}</td>
                  <td className="p-4">
                    <Button variant="danger" size="sm" onClick={() => void remove(row.id)}>
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
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
