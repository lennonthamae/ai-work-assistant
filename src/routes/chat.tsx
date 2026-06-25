import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageShell, AiDisclaimer } from "@/components/page-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Aria Chat" }] }),
  component: ChatPage,
});

const STARTERS = [
  "Draft a polite decline to a vendor pitch.",
  "What questions should I ask in a 1:1 with my report?",
  "Outline a 30/60/90 plan for a new PM role.",
  "Summarize the pros and cons of OKRs vs KPIs.",
];

function ChatPage() {
  const [transport] = useState(
    () => new DefaultChatTransport({ api: "/api/chat" }),
  );
  const { messages, sendMessage, status, error } = useChat({ transport });
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || isLoading) return;
    void sendMessage({ text: t });
    setInput("");
  };

  return (
    <PageShell
      title="Aria Chat"
      description="Conversational AI for drafting, brainstorming, and thinking through work."
      icon={MessageSquare}
    >
      <div className="flex h-[calc(100vh-260px)] min-h-[500px] flex-col rounded-2xl border bg-card shadow-elegant">
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-xl py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold">How can I help you today?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask anything — drafting, planning, summarizing, deciding.
              </p>
              <div className="mt-6 grid gap-2 text-left sm:grid-cols-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border bg-background/60 p-3 text-sm transition hover:border-primary/40 hover:bg-accent/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((m) => {
                const text = m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
                  >
                    {!isUser && (
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                        isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground",
                      )}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{text}</p>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:font-display prose-pre:bg-background/60">
                          <ReactMarkdown>{text || "…"}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {status === "submitted" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Aria is thinking…
                </div>
              )}
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  {error.message}
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        <div className="border-t bg-background/60 p-3 md:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="mx-auto flex max-w-3xl items-end gap-2"
          >
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Message Aria…"
              rows={1}
              className="min-h-[44px] max-h-40 resize-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-11 bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="mx-auto mt-2 max-w-3xl">
            <AiDisclaimer />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
