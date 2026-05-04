import { useEffect, useRef, useState } from "react";

type AgentState = "idle" | "listening" | "processing" | "speaking";

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

export function useVoiceAgent() {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [transcript, setTranscript] = useState("");
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [voiceSupported, setVoiceSupported] = useState(false);

  useEffect(() => {
    const recognitionConstructor =
      (window as typeof window & { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ??
      (window as typeof window & { webkitSpeechRecognition?: new () => SpeechRecognitionLike })
        .webkitSpeechRecognition;

    if (!recognitionConstructor) {
      return;
    }

    const recognition = new recognitionConstructor();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const nextTranscript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ");
      setTranscript(nextTranscript);
    };
    recognition.onend = () => setAgentState((current) => (current === "listening" ? "idle" : current));
    recognition.onerror = () => setAgentState("idle");
    recognitionRef.current = recognition;
    setVoiceSupported(true);
  }, []);

  function startListening() {
    setTranscript("");
    setAgentState("listening");
    recognitionRef.current?.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setAgentState("processing");
  }

  function speak(text: string) {
    if (!("speechSynthesis" in window)) {
      setAgentState("idle");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text.replace(/\[.*?\]/g, ""));
    utterance.rate = 0.95;
    utterance.pitch = 1;
    const voices = speechSynthesis.getVoices();
    utterance.voice =
      voices.find((voice) => voice.lang === "en-IN" && voice.name.toLowerCase().includes("female")) ??
      voices.find((voice) => voice.lang.startsWith("en")) ??
      voices[0];
    utterance.onstart = () => setAgentState("speaking");
    utterance.onend = () => setAgentState("idle");
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  return {
    transcript,
    setTranscript,
    agentState,
    setAgentState,
    voiceSupported,
    startListening,
    stopListening,
    speak
  };
}
