import { createFileRoute } from "@tanstack/react-router";
import { Hammer, Bug, Server, Database, ArrowRight, Wrench, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "Building Challenges · Aria" },
      { name: "description", content: "Behind the scenes: challenges faced while building Aria and how they were solved." },
    ],
  }),
  component: ChallengesPage,
});

const challenges = [
  {
    title: "Stale dev server during automated testing",
    icon: Server,
    problem: "Playwright tests were failing because the Vite dev server was serving stale content after rapid file edits. The test expected new UI elements but got old markup.",
    solution: "Added a dev server restart step in the build workflow after major edits. For local preview, now use a small polling loop to confirm the latest HTML contains the new element before asserting.",
    lesson: "Always verify the dev server has actually reloaded before running E2E assertions. In a CI context, a restart gate is safer.",
  },
  {
    title: "Sticky header + card shadow collisions",
    icon: Hammer,
    problem: "The sticky header needed a subtle shadow to look grounded, but the task cards also needed elevation. Default Tailwind shadow utilities looked muddy on the dark theme.",
    solution: "Defined custom CSS variables (e.g., --shadow-elegant) using a two-layer shadow: a very soft diffuse blur for ambience, and a tighter directional shadow for structure. Applied them separately to the header and cards.",
    lesson: "Generic shadows rarely work in custom themes. One ambient + one directional layer gives cards paper-like depth without heavy borders.",
  },
  {
    title: "URL search params and auto-run",
    icon: Database,
    problem: "The dashboard passes a research topic to the Research Assistant via a URL parameter, but TanStack Router strips unvalidated search params by default. The topic never arrived on the research page.",
    solution: "Added a Zod schema to the research route’s validateSearch config. Once typed, the param is preserved, and a useEffect in the component triggers the AI call automatically on mount.",
    lesson: "Search params in TanStack Start are opt-in by design. Always validate them with a schema or they silently disappear.",
  },
  {
    title: "Dialog buttons accidentally submitting forms",
    icon: Bug,
    problem: "Clicking the 'Recent searches' button inside the research form was triggering the form submit instead of opening the dialog, causing repeated API calls.",
    solution: "Added explicit type='button' to every dialog trigger and list item inside a <form>. The default button type is 'submit', which catches most people off guard.",
    lesson: "Inside a <form>, every <button> is a submit unless you say otherwise. Make 'type' a reflexive habit.",
  },
  {
    title: "Recent-search persistence across routes",
    icon: Wrench,
    problem: "The recent search history is powered by localStorage, but the hook is instantiated in two different places (Research page and Dashboard). The lists drifted out of sync after navigation.",
    solution: "Standardized on a single localStorage key and a single custom hook, useRecentSearches. Both pages consume the same hook, so state is shared and mutations are reflected immediately.",
    lesson: "If two pages need the same localStorage data, share the hook — not just the key. Encapsulating get/set in one hook prevents desync and race conditions.",
  },
  {
    title: "Streaming chat and SSR",
    icon: CheckCircle2,
    problem: "The chat route uses Vercel AI SDK streaming via the Lovable AI Gateway. In SSR, streaming text chunks can cause hydration mismatches or stalled requests in the serverless Worker runtime.",
    solution: "Kept the chat stream client-side only — the /api/chat endpoint returns raw streaming Responses, and the UI fetches it from the browser. No data is rendered on the server for the chat page.",
    lesson: "For real-time streaming, avoid SSR unless the framework explicitly supports streaming. A client-side fetch is simpler and eliminates hydration risk.",
  },
];

function ChallengesPage() {
  return (
    <PageShell
      title="Building Challenges"
      description="What went wrong while building Aria and how it was fixed."
      icon={Hammer}
    >
      <div className="space-y-6">
        {challenges.map((c) => (
          <Card key={c.title} className="border-border/60 shadow-elegant">
            <CardHeader>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-foreground">
                <c.icon className="h-5 w-5" />
              </div>
              <CardTitle className="font-display text-lg">{c.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Problem</div>
                <p className="text-sm leading-relaxed text-foreground">{c.problem}</p>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">Solution</div>
                  <p className="text-sm leading-relaxed text-foreground">{c.solution}</p>
                </div>
              </div>
              <div className="rounded-lg border border-dashed bg-secondary/40 px-3 py-2">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lesson</div>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.lesson}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
