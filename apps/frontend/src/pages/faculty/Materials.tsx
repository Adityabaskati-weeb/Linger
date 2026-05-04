import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { CourseMaterialData, FacultySubject } from "@campusiq/shared";
import { Upload } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { api } from "../../lib/axios";

export function FacultyMaterials() {
  const [subjects, setSubjects] = useState<FacultySubject[]>([]);
  const [materials, setMaterials] = useState<CourseMaterialData[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("Graph traversal notes");
  const [file, setFile] = useState<File | null>(null);

  function loadMaterials() {
    api.get<{ success: true; data: CourseMaterialData[] }>("/faculty/materials").then((response) => {
      setMaterials(response.data.data);
    });
  }

  useEffect(() => {
    api.get<{ success: true; data: FacultySubject[] }>("/faculty/subjects").then((response) => {
      setSubjects(response.data.data);
      setSubjectId(response.data.data[0]?.subjectId ?? "");
    });
    loadMaterials();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!file) return;

    const body = new FormData();
    body.append("subjectId", subjectId);
    body.append("title", title);
    body.append("file", file);
    await api.post("/faculty/materials/upload", body);
    setFile(null);
    loadMaterials();
  }

  async function deleteUpload(id: string) {
    await api.delete(`/faculty/materials/${id}`);
    loadMaterials();
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]"
    >
      <Card>
        <h2 className="font-display text-2xl font-semibold">Upload Course Material</h2>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Subject</span>
            <select
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              className="h-11 w-full rounded-md border border-white/10 bg-overlay px-3 text-sm text-white"
            >
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subject}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Title</span>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label className="grid min-h-36 cursor-pointer place-items-center rounded-lg border border-dashed border-white/15 bg-white/[0.035] p-6 text-center">
            <input
              className="hidden"
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            <span>
              <Upload className="mx-auto mb-3 h-6 w-6 text-cyan" />
              <span className="block text-sm text-white">{file ? file.name : "Choose PDF, TXT, or DOCX"}</span>
              <span className="mt-1 block text-xs text-slate-500">
                Uploaded content powers the AI Study Agent context.
              </span>
            </span>
          </label>
          <Button className="w-full" disabled={!file}>Upload Material</Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-display text-2xl font-semibold">Uploaded Materials</h2>
        <div className="mt-5 space-y-3">
          {materials.map((material) => (
            <div key={material.id} className="rounded-md border border-white/[0.07] bg-white/[0.035] p-4">
              <p className="font-medium text-white">{material.title}</p>
              <p className="mt-1 text-xs text-slate-500">
                {material.subject} - {material.fileName} - {Math.round(material.fileSize / 1024)} KB
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{material.contentPreview}</p>
              <Button className="mt-3" size="sm" variant="danger" onClick={() => void deleteUpload(material.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </motion.section>
  );
}
