import type { AiChatRequest, AiMessage, AiSubject } from "@campusiq/shared";
import { getMaterials } from "../data/facultyData";
import { getStudentAttendanceSummary } from "../data/studentData";

const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

const fallbackContext: Record<string, string> = {
  "sub-dsa":
    "Data Structures covers arrays, linked lists, stacks, queues, trees, heaps, hash tables, and graphs. Breadth-first search explores a graph level by level and is useful for shortest paths in unweighted graphs. Depth-first search explores deeply before backtracking and supports cycle detection, connected components, and topological ordering.",
  "sub-ai":
    "AI Fundamentals covers search, knowledge representation, machine learning basics, neural networks, evaluation metrics, and responsible AI. Supervised learning maps inputs to labels, while unsupervised learning finds structure without labels."
};

const history = new Map<string, AiMessage[]>();

export function getAiSubjects(): AiSubject[] {
  const materials = getMaterials();

  return getStudentAttendanceSummary().map((summary) => {
    const subjectMaterials = materials.filter((material) => material.subjectId === summary.subjectId);

    return {
      subjectId: summary.subjectId,
      subject: summary.subject,
      code: summary.code,
      materialCount: Math.max(subjectMaterials.length, fallbackContext[summary.subjectId] ? 1 : 0),
      lastUploadedAt: subjectMaterials[0]?.uploadedAt ?? "2026-05-01"
    };
  });
}

export function getAiHistory(studentId: string, subjectId: string) {
  return history.get(key(studentId, subjectId)) ?? [];
}

export function clearAiHistory(studentId: string, subjectId: string) {
  history.delete(key(studentId, subjectId));
}

export function saveAiExchange(studentId: string, subjectId: string, user: AiMessage, assistant: AiMessage) {
  const current = getAiHistory(studentId, subjectId);
  history.set(key(studentId, subjectId), [...current, user, assistant].slice(-20));
}

export async function streamStudyResponse(
  input: AiChatRequest,
  onToken: (token: string) => void | Promise<void>
) {
  if (!process.env.GEMINI_API_KEY) {
    await streamLocalResponse(input, onToken);
    return;
  }

  await streamGeminiResponse(input, onToken);
}

function buildSystemPrompt(subjectId: string) {
  const context = getSubjectContext(subjectId);
  const subject = getAiSubjects().find((item) => item.subjectId === subjectId)?.subject ?? "the subject";

  return `You are CampusIQ, an expert academic tutor for ${subject}.
You have access to the following course material:
------
${context}
------
Rules:
- Answer only from the provided course material.
- If asked for a quiz, produce exactly one MCQ in this format: [QUIZ] Question? A) ... B) ... C) ... D) ... ANSWER: X
- If asked for a summary, prefix with [SUMMARY].
- If explaining a concept, prefix with [CONCEPT].
- Keep explanations clear, practical, and student-friendly.`;
}

async function streamGeminiResponse(
  input: AiChatRequest,
  onToken: (token: string) => void | Promise<void>
) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY!
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: buildSystemPrompt(input.subjectId) }]
      },
      contents: input.messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }]
      })),
      generationConfig: {
        maxOutputTokens: 900,
        temperature: input.mode === "quiz" ? 0.35 : 0.55
      }
    })
  });

  if (!response.ok || !response.body) {
    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const event of events) {
      const dataLine = event
        .split("\n")
        .find((line) => line.startsWith("data: "));

      if (!dataLine) {
        continue;
      }

      const payload = JSON.parse(dataLine.slice("data: ".length));
      const token = payload.candidates?.[0]?.content?.parts?.[0]?.text;

      if (token) {
        await onToken(token);
      }
    }
  }
}

function getSubjectContext(subjectId: string) {
  const uploaded = getMaterials()
    .filter((material) => material.subjectId === subjectId)
    .map((material) => `Source: ${material.title}\n${material.content ?? material.contentPreview}`)
    .join("\n\n");

  return uploaded || fallbackContext[subjectId] || "No uploaded material is available yet.";
}

async function streamLocalResponse(input: AiChatRequest, onToken: (token: string) => void | Promise<void>) {
  const latest = input.messages[input.messages.length - 1]?.content.toLowerCase() ?? "";
  const wantsQuiz = input.mode === "quiz" || latest.includes("quiz");
  const wantsSummary = input.mode === "summary" || latest.includes("summar");
  const context = getSubjectContext(input.subjectId);
  const sourceTitle = context.match(/Source:\s*(.+)/)?.[1]?.trim() ?? "uploaded material";
  const sentences = context
    .replace(/Source:.+\n/g, "")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 30);
  const keyPoints = sentences.slice(0, 5);
  const quizFact = keyPoints[0] ?? context.slice(0, 140);
  let response: string;

  if (wantsQuiz) {
    response = `[QUIZ] According to ${sourceTitle}, which statement is most accurate? A) ${makeWrongOption(
      quizFact
    )} B) ${quizFact} C) The uploaded material is unrelated to this subject D) None of the concepts appear in the notes ANSWER: B`;
  } else if (wantsSummary) {
    response = `[SUMMARY]
- Source used: ${sourceTitle}
${keyPoints.map((point) => `- ${point}`).join("\n")}
- Exam focus: revise definitions, use cases, and the differences between similar concepts from this uploaded document.`;
  } else {
    response = `[CONCEPT] Based on the uploaded course context: ${context.slice(
      0,
      320
    )} Ask for quiz mode to practice the concept or summary mode for quick revision.`;
  }

  for (const token of response.match(/.{1,18}(\s|$)/g) ?? [response]) {
    await new Promise((resolve) => setTimeout(resolve, 18));
    await onToken(token);
  }
}

function makeWrongOption(text: string) {
  if (/breadth-first|bfs/i.test(text)) {
    return "Breadth-first search always explores the deepest branch before checking nearby vertices";
  }

  if (/supervised/i.test(text)) {
    return "Supervised learning never uses labels during training";
  }

  return "The document says the topic should be ignored during exam preparation";
}

function key(studentId: string, subjectId: string) {
  return `${studentId}:${subjectId}`;
}
