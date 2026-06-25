import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";
import { AiOutput } from "@/components/ai-output";
import { researchTopic } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant · Aria" }] }),
  component: ResearchPage,
});

const SUGGESTIONS = [
  "Enterprise adoption of agentic AI in 2025",
  "Best practices for async remote engineering teams",
  "Pricing strategies for B2B SaaS in mid-market",
];

function ResearchPage() {
  const run = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (t: string) => {
    if (t.trim().length < 3) {
      toast.error("Enter a topic to research.");
      return;
    }
    setLoading(true);
    setError(null);
    setText("");
    try {
      const res = await run({ data: { topic: t } });
      setText(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="AI Research Assistant"
      description="Get a structured briefing on any topic — insights, risks, and next steps."
      icon={Search}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(topic);
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="topic">Research topic</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. AI regulation in the EU"
                  className="mt-1.5"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setTopic(s);
                      submit(s);
                    }}
                    className="rounded-full border bg-secondary px-3 py-1 text-xs text-secondary-foreground transition hover:bg-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
              >
                {loading ? "Researching…" : "Research Topic"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <AiOutput
          text={text}
          loading={loading}
          error={error}
          emptyHint="Your research briefing will appear here."
        />
      </div>
    </PageShell>
  );
}
