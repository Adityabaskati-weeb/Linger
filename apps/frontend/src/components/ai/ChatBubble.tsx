import type { AiMessage } from "@campusiq/shared";
import { QuizCard } from "./QuizCard";

interface ChatBubbleProps {
  message: AiMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const special = message.content.startsWith("[QUIZ]");

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[86%] rounded-lg border p-4 ${
          isUser
            ? "border-primary/30 bg-primary/20 text-white"
            : "border-white/[0.07] bg-white/[0.045] text-slate-200"
        }`}
      >
        {special ? <QuizCard content={message.content} /> : <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>}
      </div>
    </div>
  );
}
