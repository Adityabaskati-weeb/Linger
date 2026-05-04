import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { StudentOverviewRow } from "@campusiq/shared";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { api } from "../../lib/axios";

export function AdminStudents() {
  const [rows, setRows] = useState<StudentOverviewRow[]>([]);
  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    department: "CS",
    semester: 5,
    overall: 75
  });

  function load() {
    api.get<{ success: true; data: StudentOverviewRow[] }>("/admin/students").then((response) => {
      setRows(response.data.data);
    });
  }

  useEffect(() => {
    load();
  }, []);

  async function addStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await api.post("/admin/students", form);
    setForm({ name: "", rollNumber: "", department: "CS", semester: 5, overall: 75 });
    load();
  }

  async function remove(id: string) {
    if (!window.confirm("Remove this student from the demo roster?")) return;
    await api.delete(`/admin/students/${id}`);
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
        <h2 className="font-display text-2xl font-semibold">Add New Student</h2>
        <p className="mt-1 text-sm text-slate-500">Use this when a new student joins a section or elective roster.</p>
        <form onSubmit={addStudent} className="mt-5 grid gap-3 md:grid-cols-6">
          <Input placeholder="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <Input placeholder="Roll Number" value={form.rollNumber} onChange={(event) => setForm((current) => ({ ...current, rollNumber: event.target.value }))} />
          <Input placeholder="Department" value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} />
          <Input type="number" min={1} max={8} value={form.semester} onChange={(event) => setForm((current) => ({ ...current, semester: Number(event.target.value) }))} />
          <Input type="number" min={0} max={100} value={form.overall} onChange={(event) => setForm((current) => ({ ...current, overall: Number(event.target.value) }))} />
          <Button disabled={!form.name || !form.rollNumber}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-display text-2xl font-semibold">Student Enrollment Overview</h2>
        <div className="mt-5 overflow-hidden rounded-lg border border-white/[0.07]">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Roll No</th>
                <th className="p-4">Department</th>
                <th className="p-4">Semester</th>
                <th className="p-4">Overall</th>
                <th className="p-4">Action</th>
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
