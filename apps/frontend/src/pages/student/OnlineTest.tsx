import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { OnlineTestSessionData } from "@campusiq/shared";
import { AlarmClock, CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/axios";

export function StudentOnlineTest() {
  const [test, setTest] = useState<OnlineTestSessionData | null>(null);
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get<{ success: true; data: OnlineTestSessionData }>("/student/online-test").then((response) => {
      setTest(response.data.data);
      setRemaining(response.data.data.durationSeconds);
    });
  }, []);

  useEffect(() => {
    if (!started || submitted || remaining <= 0) return;

    const timer = window.setInterval(() => setRemaining((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [remaining, started, submitted]);

  useEffect(() => {
    if (started && remaining === 0) {
      setSubmitted(true);
    }
  }, [remaining, started]);

  const score = useMemo(() => {
    if (!test) return 0;
    return test.questions.filter((question) => answers[question.id] === question.answerIndex).length;
  }, [answers, test]);

  if (!test) {
    return <Card className="animate-pulse text-sm text-slate-400">Loading online test...</Card>;
  }

  const minutes = Math.floor(remaining / 60).toString().padStart(2, "0");
  const seconds = (remaining % 60).toString().padStart(2, "0");

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <Card glow className="bg-white text-[#25324b]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Online Test</p>
            <h2 className="mt-2 text-3xl font-bold">{test.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{test.subjectCode} - 10 questions - Auto-submit when timer ends.</p>
          </div>
          <div className="rounded-2xl bg-[#ef0000] px-5 py-4 text-center text-white">
            <p className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em]">
              <AlarmClock className="h-4 w-4" />
              Timer
            </p>
            <p className="mt-1 font-mono text-3xl font-bold">{minutes}:{seconds}</p>
          </div>
        </div>

        {!started ? (
          <div className="mt-6 rounded-2xl bg-slate-100 p-5">
            <p className="font-semibold">Instructions</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              {test.instructions.map((instruction) => (
                <p key={instruction}>{instruction}</p>
              ))}
            </div>
            <Button className="mt-5 bg-[#ef0000] hover:bg-red-700" onClick={() => setStarted(true)}>
              <PlayCircle className="h-4 w-4" />
              Start Test
            </Button>
          </div>
        ) : null}
      </Card>

      {started ? (
        <div className="space-y-4">
          {test.questions.map((question, index) => (
            <Card key={question.id} className="bg-white text-[#25324b]">
              <p className="font-semibold">
                {index + 1}. {question.question}
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {question.options.map((option, optionIndex) => (
                  <button
                    key={option}
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                      answers[question.id] === optionIndex
                        ? "border-[#ef0000] bg-red-50 text-red-700"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-red-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {submitted ? (
                <p className={answers[question.id] === question.answerIndex ? "mt-3 text-sm text-emerald-600" : "mt-3 text-sm text-red-600"}>
                  {answers[question.id] === question.answerIndex ? "Correct" : `Correct answer: ${question.options[question.answerIndex]}`}
                </p>
              ) : null}
            </Card>
          ))}

          <Card className="bg-white text-[#25324b]">
            {submitted ? (
              <div className="flex items-center gap-3 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                Test submitted. Score: {score}/{test.questions.length}
              </div>
            ) : (
              <Button className="bg-[#ef0000] hover:bg-red-700" onClick={() => setSubmitted(true)}>
                Submit Test
              </Button>
            )}
          </Card>
        </div>
      ) : null}
    </motion.section>
  );
}
