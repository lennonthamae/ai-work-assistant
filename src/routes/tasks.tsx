import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";
import { AiOutput } from "@/components/ai-output";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner · Aria" }] }),
  component: TasksPage,
});

function TasksPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState(8);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tasks.trim().length < 3) {
      toast.error("Add at least one task.");
      return;
    }
    setLoading(true);
    setError(null);
    setText("");
    try {
      const res = await run({ data: { tasks, hours } });
      setText(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="AI Task Planner"
      description="Dump everything on your plate. Aria prioritizes and schedules your day."
      icon={ListChecks}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="tasks">Your tasks</Label>
                <Textarea
                  id="tasks"
                  value={tasks}
                  onChange={(e) => setTasks(e.target.value)}
                  placeholder={`- Review PR for billing module\n- Write Q3 board update\n- Reply to client emails\n- Prep for 1:1 with Alex\n- Research competitor pricing`}
                  rows={12}
                  className="mt-1.5 font-mono text-xs"
                />
              </div>
              <div className="max-w-[160px]">
                <Label htmlFor="hours">Hours available</Label>
                <Input
                  id="hours"
                  type="number"
                  min={1}
                  max={24}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
              >
                {loading ? "Planning…" : "Plan My Day"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <AiOutput
          text={text}
          loading={loading}
          error={error}
          emptyHint="Your prioritized plan and time blocks will appear here."
        />
      </div>
    </PageShell>
  );
}
