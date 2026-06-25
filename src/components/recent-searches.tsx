"use client";

import { useState, useEffect, useCallback } from "react";
import { History, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const STORAGE_KEY = "aria-research-searches";
const DEFAULT_LIMIT = 12;

export function useRecentSearches(limit = DEFAULT_LIMIT) {
  const [searches, setSearches] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSearches(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    } catch {
      // ignore storage errors
    }
  }, [searches]);

  const addSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      setSearches((prev) => {
        const filtered = prev.filter(
          (s) => s.toLowerCase() !== trimmed.toLowerCase(),
        );
        return [trimmed, ...filtered].slice(0, limit);
      });
    },
    [limit],
  );

  const removeSearch = useCallback((term: string) => {
    setSearches((prev) => prev.filter((s) => s !== term));
  }, []);

  const clearSearches = useCallback(() => {
    setSearches([]);
  }, []);

  return { searches, addSearch, removeSearch, clearSearches };
}

export function RecentSearchesWindow({
  searches,
  onSelect,
  onRemove,
  onClear,
}: {
  searches: string[];
  onSelect: (term: string) => void;
  onRemove?: (term: string) => void;
  onClear?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasSearches = searches.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          Recent searches
          {hasSearches ? (
            <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
              {searches.length}
            </span>
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Recent search prompts
          </DialogTitle>
          <DialogDescription>
            Pick a past prompt to rerun it instantly, or remove prompts you no longer need.
          </DialogDescription>
        </DialogHeader>

        {!hasSearches ? (
          <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            No recent searches yet.
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <ul className="space-y-2">
              {searches.map((term) => (
                <li
                  key={term}
                  className="group flex items-center gap-2 rounded-lg border bg-card p-2 transition-colors hover:bg-accent"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onSelect(term);
                    }}
                    className="min-w-0 flex-1 text-left text-sm font-medium text-card-foreground"
                  >
                    <span className="line-clamp-2">{term}</span>
                  </button>
                  {onRemove ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove "${term}"`}
                      className="h-7 w-7 shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
                      onClick={() => onRemove(term)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasSearches && onClear ? (
          <div className="flex justify-end border-t pt-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-destructive"
              onClick={onClear}
            >
              <X className="h-3.5 w-3.5" />
              Clear history
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
