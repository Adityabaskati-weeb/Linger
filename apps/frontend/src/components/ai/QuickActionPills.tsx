import type { AiMode } from "@campusiq/shared";

interface QuickActionPillsProps {
  onSelect: (prompt: string, mode: AiMode) => void;
}

const actions: Array<{ label: string; prompt: string; mode: AiMode }> = [
  { label: "Summarize", prompt: "Summarize this subject", mode: "summary" },
  { label: "Quiz me", prompt: "Quiz me on key concepts", mode: "quiz" },
  { label: "Explain", prompt: "Explain the most important concept", mode: "text" },
  { label: "Exam questions", prompt: "What are likely exam questions?", mode: "text" }
];

export function QuickActionPills({ onSelect }: QuickActionPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={() => onSelect(action.prompt, action.mode)}
          className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-slate-300 transition hover:border-cyan/40 hover:text-white"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
