import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { AiMessage, AiMode, AiSubject } from "@campusiq/shared";
import { Mic, Send, Square } from "lucide-react";
import { AiOrb } from "../../components/ai/AiOrb";
import { ChatBubble } from "../../components/ai/ChatBubble";
import { QuickActionPills } from "../../components/ai/QuickActionPills";
import { VoiceWaveform } from "../../components/ai/VoiceWaveform";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { useVoiceAgent } from "../../hooks/useVoiceAgent";
import { api } from "../../lib/axios";
import { useAuthStore } from "../../store/auth.store";

export function StudentAiAgent() {
  const [subjects, setSubjects] = useState<AiSubject[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<AiMode>("text");
  const [streaming, setStreaming] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const processedVoiceIdRef = useRef(0);
  const {
    transcript,
    finalTranscript,
    finalTranscriptId,
    agentState,
    setAgentState,
    voiceSupported,
    voiceError,
    startListening,
    stopListening,
    speak
  } = useVoiceAgent();

  const sendMessage = useCallback(
    async (prompt = input, nextMode = mode) => {
      const trimmed = prompt.trim();
      if (!trimmed || !subjectId || !accessToken || streaming) return;

      const userMessage: AiMessage = { role: "user", content: trimmed };
      const nextMessages = [...messages, userMessage];
      setMessages([...nextMessages, { role: "assistant", content: "" }]);
      setInput("");
      setMode(nextMode);
      setStreaming(true);
      setAgentState("processing");

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL ?? "http://localhost:4000/api"}/ai/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            subjectId,
            mode: nextMode,
            messages: nextMessages
          })
        });

        if (!response.ok || !response.body) {
          throw new Error("AI stream failed");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let assistantText = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            const data = event.replace("data: ", "").trim();
            if (!data) continue;
            if (data === "[DONE]") {
              setStreaming(false);
              setMessages((current) =>
                current.map((message, index) =>
                  index === current.length - 1 ? { role: "assistant", content: assistantText } : message
                )
              );
              speak(assistantText);
              return;
            }

            const token = JSON.parse(data).token as string;
            assistantText += token;
            setMessages((current) =>
              current.map((message, index) =>
                index === current.length - 1 ? { role: "assistant", content: assistantText } : message
              )
            );
          }
        }

        setStreaming(false);
        setAgentState("idle");
      } catch {
        setStreaming(false);
        setAgentState("idle");
        setMessages((current) =>
          current.map((message, index) =>
            index === current.length - 1
              ? { role: "assistant", content: "I could not reach the tutor service. Please try again." }
              : message
          )
        );
      }
    },
    [accessToken, input, messages, mode, setAgentState, speak, subjectId, streaming]
  );

  useEffect(() => {
    api.get<{ success: true; data: AiSubject[] }>("/ai/subjects").then((response) => {
      setSubjects(response.data.data);
      setSubjectId(response.data.data[0]?.subjectId ?? "");
    });
  }, []);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (!finalTranscript || finalTranscriptId === processedVoiceIdRef.current) {
      return;
    }

    processedVoiceIdRef.current = finalTranscriptId;
    setInput(finalTranscript);
    void sendMessage(finalTranscript, "text");
  }, [finalTranscript, finalTranscriptId, sendMessage]);

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.subjectId === subjectId),
    [subjectId, subjects]
  );

  function submit(event: FormEvent) {
    event.preventDefault();
    void sendMessage();
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"
    >
      <Card className="flex min-h-[680px] flex-col">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-semibold">AI Study Agent</h2>
          <p className="mt-1 text-sm text-slate-500">Material-grounded tutoring with streaming responses.</p>
        </div>

        <select
          value={subjectId}
          onChange={(event) => setSubjectId(event.target.value)}
          className="mb-4 h-11 rounded-md border border-white/10 bg-overlay px-3 text-sm text-white"
        >
          {subjects.map((subject) => (
            <option key={subject.subjectId} value={subject.subjectId}>
              {subject.subject}
            </option>
          ))}
        </select>

        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.length ? (
            messages.map((message, index) => <ChatBubble key={index} message={message} />)
          ) : (
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.035] p-5 text-sm leading-6 text-slate-400">
              Ask for a concept explanation, summary, or quiz. Uploaded faculty material is used as context.
            </div>
          )}
        </div>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <QuickActionPills onSelect={(prompt, nextMode) => void sendMessage(prompt, nextMode)} />
          <div className="flex gap-2">
            <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask CampusIQ..." />
            <Button type="submit" disabled={streaming}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Card>

      <Card className="grid place-items-center text-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan">
            {selectedSubject?.code ?? "CampusIQ"} Tutor
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold">{selectedSubject?.subject ?? "Study Agent"}</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
            {selectedSubject?.materialCount ?? 0} material source(s), last updated {selectedSubject?.lastUploadedAt ?? "today"}.
          </p>
          <div className="my-8 flex justify-center">
            <AiOrb state={agentState} />
          </div>
          <VoiceWaveform active={agentState === "listening" || agentState === "speaking" || streaming} />
          {voiceError ? (
            <p className="mx-auto mt-4 max-w-md rounded-md border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-amber-100">
              {voiceError}
            </p>
          ) : null}
          {transcript && agentState === "listening" ? (
            <p className="mx-auto mt-4 max-w-md rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
              {transcript}
            </p>
          ) : null}
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="secondary"
              disabled={streaming}
              onClick={agentState === "listening" ? stopListening : startListening}
            >
              {agentState === "listening" ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {agentState === "listening" ? "Stop" : voiceSupported ? "Talk" : "Voice Check"}
            </Button>
            <Button variant="secondary" onClick={() => void sendMessage("Quiz me on key concepts", "quiz")}>
              Quiz Mode
            </Button>
          </div>
        </div>
      </Card>
    </motion.section>
  );
}
