import type { AiMessage } from "@campusiq/shared";
import { QuizCard } from "./QuizCard";

interface ChatBubbleProps {
  message: AiMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const isQuiz = message.content.startsWith("[QUIZ]");
  const isSummary = message.content.startsWith("[SUMMARY]");
  const isConcept = message.content.startsWith("[CONCEPT]");
  const cleaned = message.content.replace(/^\[(QUIZ|SUMMARY|CONCEPT)\]\s*/i, "");

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[86%] rounded-lg border p-4 ${
          isUser
            ? "border-primary/30 bg-primary/20 text-white"
            : "border-white/[0.07] bg-white/[0.045] text-slate-200"
        }`}
      >
        {isQuiz ? <QuizCard content={message.content} /> : null}
        {isSummary ? <SpecialCard title="Summary" tone="cyan" content={cleaned} /> : null}
        {isConcept ? <SpecialCard title="Concept" tone="primary" content={cleaned} /> : null}
        {!isQuiz && !isSummary && !isConcept ? (
          <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
        ) : null}
      </div>
    </div>
  );
}

function SpecialCard({ title, content, tone }: { title: string; content: string; tone: "cyan" | "primary" }) {
  const bullets = content
    .split(/(?:\n|- |; )/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div>
      <p className={tone === "cyan" ? "mb-3 font-display text-xl text-cyan" : "mb-3 font-display text-xl text-primary"}>
        {title}
      </p>
      {bullets.length > 1 ? (
        <div className="space-y-2">
          {bullets.map((item, index) => (
            <p key={`${item}-${index}`} className="rounded-md bg-white/[0.04] px-3 py-2 text-sm leading-6 text-slate-200">
              {item}
            </p>
          ))}
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-200">{content}</p>
      )}
    </div>
  );
}
