"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

type TaskSearchProps = {
  onQueryChange: (query: string) => void;
};

export function TaskSearch({ onQueryChange }: TaskSearchProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onQueryChange(debouncedQuery.trim().toLowerCase());
  }, [debouncedQuery, onQueryChange]);

  return (
    <div className="flex gap-2">
      <label className="sr-only" htmlFor="task-search">
        Search tasks
      </label>
      <input
        id="task-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search tasks"
        className="h-12 min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 focus-visible:ring-2 focus-visible:ring-zinc-500 [&::-webkit-search-cancel-button]:hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/10 dark:focus-visible:ring-zinc-400"
      />
      <button
        type="button"
        onClick={() => setQuery("")}
        disabled={!query}
        className="h-12 shrink-0 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 disabled:cursor-not-allowed disabled:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:disabled:text-zinc-600"
      >
        Clear
      </button>
    </div>
  );
}
