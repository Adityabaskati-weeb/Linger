import { useMemo, useState } from "react";
import { Button } from "../ui/Button";

interface QuizCardProps {
  content: string;
}

export function QuizCard({ content }: QuizCardProps) {
  const [selected, setSelected] = useState("");
  const parsed = useMemo(() => parseQuiz(content), [content]);

  if (!parsed) {
    return <p className="text-sm leading-6 text-slate-300">{content}</p>;
  }

  const correct = selected && selected === parsed.answer;

  return (
    <div className="rounded-md border border-cyan/20 bg-cyan/10 p-4">
      <p className="font-medium text-white">{parsed.question}</p>
      <div className="mt-4 grid gap-2">
        {parsed.options.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setSelected(option.key)}
            className={`rounded-md border px-3 py-2 text-left text-sm transition ${
              selected === option.key ? "border-primary bg-primary/20 text-white" : "border-white/10 text-slate-300"
            }`}
          >
            {option.key}) {option.text}
          </button>
        ))}
      </div>
      {selected ? (
        <p className={correct ? "mt-3 text-sm text-emerald-200" : "mt-3 text-sm text-red-200"}>
          {correct ? "Correct." : `Not quite. Correct answer: ${parsed.answer}.`}
        </p>
      ) : (
        <Button className="mt-4" size="sm" variant="secondary" disabled>
          Choose an option
        </Button>
      )}
    </div>
  );
}

function parseQuiz(content: string) {
  const cleaned = content.replace("[QUIZ]", "").trim();
  const answer = cleaned.match(/ANSWER:\s*([A-D])/i)?.[1]?.toUpperCase();
  const parts = cleaned.split(/\s+A\)\s+/);

  if (!answer || parts.length < 2) return null;

  const question = parts[0].trim();
  const optionsRaw = `A) ${parts[1]}`;
  const optionMatches = [...optionsRaw.matchAll(/([A-D])\)\s*([^A-D]+?)(?=\s+[A-D]\)|\s+ANSWER:|$)/g)];

  return {
    question,
    answer,
    options: optionMatches.map((match) => ({ key: match[1].toUpperCase(), text: match[2].trim() }))
  };
}
