import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(MODEL);
}

async function run(system: string, prompt: string) {
  const { text } = await generateText({ model: getModel(), system, prompt });
  return { text };
}

// --- Email Generator ---
const EmailInput = z.object({
  purpose: z.string().min(1),
  audience: z.string().min(1),
  tone: z.string().min(1),
  keyPoints: z.string().optional().default(""),
});
export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => EmailInput.parse(i))
  .handler(async ({ data }) =>
    run(
      `You are a professional email writer. Write polished, concise business emails.
Always include:
- A clear subject line on the first line prefixed with "Subject: "
- A greeting appropriate to the audience
- 2-4 short paragraphs
- A professional sign-off
Match the requested tone exactly. Avoid filler. Output plain text only.`,
      `Audience: ${data.audience}
Tone: ${data.tone}
Purpose: ${data.purpose}
Key points to cover: ${data.keyPoints || "(none provided)"}

Write the email now.`,
    ),
  );

// --- Meeting Summarizer ---
const MeetingInput = z.object({ notes: z.string().min(10) });
export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => MeetingInput.parse(i))
  .handler(async ({ data }) =>
    run(
      `You are a meeting notes analyst. Given raw meeting notes or a transcript, output a structured markdown summary with exactly these sections, in this order:

## Summary
A 2-3 sentence overview.

## Key Discussion Points
Bulleted list of the main topics discussed.

## Decisions Made
Bulleted list. If none, write "None recorded."

## Action Items
A markdown table with columns: Owner | Task | Deadline. Use "Unassigned" or "TBD" if missing.

## Risks & Open Questions
Bulleted list. If none, write "None."

Be precise. Do not invent facts not present in the notes.`,
      data.notes,
    ),
  );

// --- Task Planner ---
const TasksInput = z.object({ tasks: z.string().min(3), hours: z.coerce.number().min(1).max(24).default(8) });
export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => TasksInput.parse(i))
  .handler(async ({ data }) =>
    run(
      `You are an executive productivity coach. Given a brain-dump of tasks and a workday duration, produce a prioritized schedule.

Output markdown with:

## Prioritized Tasks
Table: Priority (P1/P2/P3) | Task | Est. Time | Rationale

## Suggested Schedule
A time-blocked schedule for the day, in a table: Time Block | Task | Focus Type (Deep / Shallow / Admin). Start at 9:00 AM unless context suggests otherwise. Include short breaks.

## Recommendations
2-3 bullets on focus, batching, or what to defer.

Apply Eisenhower-style prioritization (urgent vs important) and protect deep work time.`,
      `Available hours: ${data.hours}
Tasks:
${data.tasks}`,
    ),
  );

// --- Research Assistant ---
const ResearchInput = z.object({ topic: z.string().min(3) });
export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => ResearchInput.parse(i))
  .handler(async ({ data }) =>
    run(
      `You are a senior research analyst. Provide a structured briefing on the given topic using only well-established knowledge. Output markdown with:

## Executive Summary
3-4 sentence overview.

## Key Insights
5-7 bullet points, each starting with a bold takeaway.

## Background & Context
2 short paragraphs.

## Opportunities
Bulleted list.

## Risks / Challenges
Bulleted list.

## Suggested Next Steps
Numbered list of 3-5 concrete actions.

If the topic requires very recent data you may not have, say so explicitly under each affected section. Never fabricate statistics or citations.`,
      data.topic,
    ),
  );
