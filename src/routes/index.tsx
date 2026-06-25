import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessageSquare, ArrowRight, Sparkles, History } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AiDisclaimer } from "@/components/page-shell";
import { useRecentSearches, RecentSearchesWindow } from "@/components/recent-searches";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aria — AI Workplace Productivity Assistant" },
      { name: "description", content: "Automate emails, meetings, tasks, and research with AI." },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    title: "Smart Email Generator",
    description: "Draft polished emails tuned to tone and audience.",
    icon: Mail,
    href: "/email",
    accent: "from-blue-500/20 to-indigo-500/20",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn raw notes into decisions, actions, and deadlines.",
    icon: FileText,
    href: "/meetings",
    accent: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "AI Task Planner",
    description: "Prioritize your day and block your calendar intelligently.",
    icon: ListChecks,
    href: "/tasks",
    accent: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "AI Research Assistant",
    description: "Get structured briefings on any topic in seconds.",
    icon: Search,
    href: "/research",
    accent: "from-fuchsia-500/20 to-rose-500/20",
  },
  {
    title: "Aria Chat",
    description: "Conversational AI for everything else you need at work.",
    icon: MessageSquare,
    href: "/chat",
    accent: "from-violet-500/20 to-purple-500/20",
  },
] as const;

const stats = [
  { label: "Avg. time saved / week", value: "6.4 hrs" },
  { label: "Drafts generated", value: "1,284" },
  { label: "Tasks prioritized", value: "327" },
  { label: "Meetings summarized", value: "92" },
];

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <section className="mb-10 overflow-hidden rounded-2xl border bg-card p-8 shadow-elegant md:p-10">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Your AI workplace
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Good day — let's get the busywork off your plate.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Aria drafts emails, summarizes meetings, plans your day, and researches topics so you can focus on the work that matters.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
            <Link to="/chat">
              Start a chat <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/email">Draft an email</Link>
          </Button>
        </div>
      </section>

      <section className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-1 font-display text-2xl font-bold tracking-tight">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-semibold tracking-tight">Tools</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.href} to={f.href} className="group">
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-elegant">
                <CardHeader>
                  <div
                    className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.accent} text-foreground`}
                  >
                    <f.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="font-display text-lg">{f.title}</CardTitle>
                  <CardDescription>{f.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-10">
        <AiDisclaimer />
      </div>
    </div>
  );
}
