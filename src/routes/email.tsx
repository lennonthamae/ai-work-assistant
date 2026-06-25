import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";
import { AiOutput } from "@/components/ai-output";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Email Generator · Aria" }] }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Persuasive", "Apologetic", "Direct", "Enthusiastic"];

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("Professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim() || !audience.trim()) {
      toast.error("Please fill in purpose and audience.");
      return;
    }
    setLoading(true);
    setError(null);
    setText("");
    try {
      const res = await run({ data: { purpose, audience, tone, keyPoints } });
      setText(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Smart Email Generator"
      description="Generate professional emails tailored to your audience and tone."
      icon={Mail}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Follow up on the Q3 partnership proposal we sent last week"
                  rows={3}
                  className="mt-1.5"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="audience">Audience</Label>
                  <Input
                    id="audience"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. VP of Sales at a client"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="key">Key points (optional)</Label>
                <Textarea
                  id="key"
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  placeholder="Anything specific you'd like included"
                  rows={3}
                  className="mt-1.5"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
              >
                {loading ? "Generating…" : "Generate Email"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <AiOutput
          text={text}
          loading={loading}
          error={error}
          emptyHint="Your drafted email will appear here."
        />
      </div>
    </PageShell>
  );
}
