import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";
import { AiOutput } from "@/components/ai-output";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer · Aria" }] }),
  component: MeetingsPage,
});

const SAMPLE = `Kickoff call - Q4 launch
Attendees: Sarah (PM), James (Eng), Priya (Design), Marco (Marketing)

- Sarah: launch target Nov 14. Need landing page copy by Oct 28.
- James: backend ready, API auth still pending review from security. Risk: 1-week slip if not done by Friday.
- Priya: hero illustration draft tomorrow. Needs final brand colors.
- Marco: paid campaign budget approved at $40k. Will book influencer outreach.
- Decision: launch in 2 phases - beta to existing users Nov 7, public Nov 14.
- Open Q: pricing tier names not finalized. Sarah to confirm with CEO next week.`;

function MeetingsPage() {
  const run = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (notes.trim().length < 10) {
      toast.error("Paste at least a few lines of notes.");
      return;
    }
    setLoading(true);
    setError(null);
    setText("");
    try {
      const res = await run({ data: { notes } });
      setText(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Meeting Notes Summarizer"
      description="Paste raw notes or a transcript. Aria extracts decisions, actions, and deadlines."
      icon={FileText}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notes">Meeting notes</Label>
                  <button
                    type="button"
                    onClick={() => setNotes(SAMPLE)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Load sample
                  </button>
                </div>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Paste your raw notes, bullet points, or transcript here…"
                  rows={16}
                  className="mt-1.5 font-mono text-xs"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
              >
                {loading ? "Summarizing…" : "Summarize Meeting"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <AiOutput
          text={text}
          loading={loading}
          error={error}
          emptyHint="Structured summary will appear here."
        />
      </div>
    </PageShell>
  );
}
