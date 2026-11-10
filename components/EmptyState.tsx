export function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 px-4 py-10 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        No tasks yet
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Add your first task above to get started.
      </p>
    </div>
  );
}
