import { useEffect, useRef, useState } from "react";

type AgentState = "idle" | "listening" | "processing" | "speaking";

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort?: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event?: { error?: string }) => void) | null;
  onspeechend?: (() => void) | null;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal?: boolean }>;
}

export function useVoiceAgent() {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef("");
  const submittedTranscriptRef = useRef("");
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [finalTranscriptId, setFinalTranscriptId] = useState(0);
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState("");

  useEffect(() => {
    const recognitionConstructor =
      (window as typeof window & { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ??
      (window as typeof window & { webkitSpeechRecognition?: new () => SpeechRecognitionLike })
        .webkitSpeechRecognition;

    if (!recognitionConstructor) {
      setVoiceError("Voice input is not supported in this browser. Use Chrome or Edge, or type your question.");
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
      transcriptRef.current = nextTranscript;
      setTranscript(nextTranscript);
    };
    recognition.onspeechend = () => {
      recognition.stop();
    };
    recognition.onend = () => {
      const finalTranscript = transcriptRef.current.trim();

      if (finalTranscript && finalTranscript !== submittedTranscriptRef.current) {
        submittedTranscriptRef.current = finalTranscript;
        setFinalTranscript(finalTranscript);
        setFinalTranscriptId((current) => current + 1);
      } else if (!finalTranscript) {
        setAgentState("idle");
      }
    };
    recognition.onerror = (event) => {
      const reason = event?.error === "not-allowed" ? "Microphone permission was blocked." : "Voice input stopped.";
      setVoiceError(`${reason} You can still type the question below.`);
      setAgentState("idle");
    };
    recognitionRef.current = recognition;
    setVoiceSupported(true);
  }, []);

  function startListening() {
    if (!recognitionRef.current) {
      setVoiceError("Voice input is not available in this browser. Type your question instead.");
      return;
    }

    speechSynthesis.cancel();
    setTranscript("");
    setFinalTranscript("");
    transcriptRef.current = "";
    submittedTranscriptRef.current = "";
    setVoiceError("");
    setAgentState("listening");

    try {
      recognitionRef.current.start();
    } catch {
      setVoiceError("Voice input is already active. Stop it and try again.");
    }
  }

  function stopListening() {
    if (!recognitionRef.current) {
      setAgentState("idle");
      return;
    }

    setAgentState("processing");
    recognitionRef.current.stop();
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

  function stopSpeaking() {
    speechSynthesis.cancel();
    setAgentState("idle");
  }

  return {
    transcript,
    finalTranscript,
    finalTranscriptId,
    setTranscript,
    agentState,
    setAgentState,
    voiceSupported,
    voiceError,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  };
}
