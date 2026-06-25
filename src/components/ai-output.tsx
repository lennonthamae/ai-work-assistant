import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check, Loader2 } from "lucide-react";
import { AiDisclaimer } from "./page-shell";

export function AiOutput({
  text,
  loading,
  error,
  emptyHint,
}: {
  text: string;
  loading?: boolean;
  error?: string | null;
  emptyHint: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) {
    return (
      <Card className="flex min-h-[280px] flex-col items-center justify-center gap-3 p-8 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm">Aria is thinking…</p>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        {error}
      </Card>
    );
  }
  if (!text) {
    return (
      <Card className="flex min-h-[280px] items-center justify-center p-8 text-center text-sm text-muted-foreground">
        {emptyHint}
      </Card>
    );
  }
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Output
        </span>
        <Button variant="ghost" size="sm" onClick={onCopy} className="h-7 gap-1.5">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none px-6 py-5 prose-headings:font-display prose-headings:tracking-tight prose-h2:mt-6 prose-h2:text-lg prose-table:text-sm prose-pre:bg-muted">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
      <div className="border-t bg-muted/30 px-4 py-2">
        <AiDisclaimer />
      </div>
    </Card>
  );
}
