// AI-generated example sentences via the MaibornWolff aikeys endpoint, an
// OpenAI-compatible LiteLLM proxy. Requests go through the Vite dev proxy at
// `/api/ai` (see vite.config.ts), which injects the secret Authorization
// header so the key never reaches the browser.

const MODEL = import.meta.env.VITE_AI_MODEL ?? "gpt-4o-mini";

interface ChatResponse {
  choices?: { message?: { content?: string } }[];
}

/**
 * Generate `count` German example sentences for a word. Each returned string is
 * a German sentence followed by its English translation in parentheses.
 * Throws on network/API errors so the UI can surface a message.
 */
export async function generateExamples(
  german: string,
  english: string,
  count = 2,
): Promise<string[]> {
  const prompt =
    `You are a German language tutor. Write ${count} short, natural example ` +
    `sentences using the German word "${german}" (English: "${english}"). ` +
    `Each line must be one German sentence followed by its English translation ` +
    `in parentheses. Return ONLY the sentences, one per line, no numbering or extra text.`;

  const res = await fetch("/api/ai/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a concise, accurate German tutor." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `AI request failed (${res.status}). ${detail.slice(0, 200)}`.trim(),
    );
  }

  const data = (await res.json()) as ChatResponse;
  const content = data.choices?.[0]?.message?.content ?? "";

  return content
    .split("\n")
    .map((line) => line.replace(/^\s*(?:[-*\d.)]+\s*)/, "").trim())
    .filter((line) => line.length > 0)
    .slice(0, count);
}
