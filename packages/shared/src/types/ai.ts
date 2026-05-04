export type AiRole = "user" | "assistant";
export type AiMode = "text" | "quiz" | "summary";

export interface AiMessage {
  role: AiRole;
  content: string;
}

export interface AiSubject {
  subjectId: string;
  subject: string;
  code: string;
  materialCount: number;
  lastUploadedAt: string;
}

export interface AiChatRequest {
  subjectId: string;
  messages: AiMessage[];
  mode: AiMode;
}
