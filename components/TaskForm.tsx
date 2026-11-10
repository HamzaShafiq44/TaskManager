"use client";

import { FormEvent, useEffect, useState } from "react";
import { priorities, type Priority } from "@/components/types";

type TaskFormProps = {
  onAdd: (title: string, priority: Priority, dueDate: string) => boolean;
};

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [today, setToday] = useState("");
  const [dateTouched, setDateTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    // Compute the minimum after hydration to keep the server and client markup identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(`${year}-${month}-${day}`);
  }, []);

  const dateError =
    dueDate === ""
      ? "Please choose a deadline date."
      : today && dueDate < today
        ? "Deadline can't be in the past."
        : "";
  const showDateError = Boolean(dateError && (dateTouched || submitAttempted));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);
    const trimmed = title.trim();
    if (!trimmed) return;
    if (!dueDate || (today && dueDate < today)) return;

    const added = onAdd(trimmed, priority, dueDate);
    if (!added) return;

    setTitle("");
    setPriority("medium");
    setDueDate("");
    setDateTouched(false);
    setSubmitAttempted(false);
  }

  return (
    <section
      aria-labelledby="new-task-heading"
      className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>
        <h2
          id="new-task-heading"
          className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
        >
          New task
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Add a deadline to keep it on your radar.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-3"
      >
        <label className="sr-only" htmlFor="task-title">
          Task title
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a task"
          className="h-12 min-w-0 rounded-xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 focus-visible:ring-2 focus-visible:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/10 dark:focus-visible:ring-zinc-400"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
          <label className="sr-only" htmlFor="task-priority">
            Priority
          </label>
          <div className="relative min-w-0">
            <select
              id="task-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)}
              className="h-12 w-full min-w-0 appearance-none rounded-xl border border-zinc-200 bg-white py-3 pr-10 pl-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 focus-visible:ring-2 focus-visible:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/10 dark:focus-visible:ring-zinc-400"
            >
              {priorities.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
            >
              <path
                d="m5 7.5 5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <label className="sr-only" htmlFor="task-due">
            Due date
          </label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            onBlur={() => setDateTouched(true)}
            required
            min={today || undefined}
            aria-invalid={showDateError}
            aria-describedby={showDateError ? "task-due-error" : undefined}
            className={`h-12 min-w-0 rounded-xl border bg-white px-3 text-sm text-zinc-900 outline-none transition dark:bg-zinc-900 dark:text-zinc-50 ${
              showDateError
                ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-500 dark:focus:border-red-500"
                : "border-zinc-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 focus-visible:ring-2 focus-visible:ring-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/10 dark:focus-visible:ring-zinc-400"
            }`}
          />
          <button
            type="submit"
            className="col-span-2 h-12 whitespace-nowrap rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500 sm:col-span-1"
            disabled={!title.trim()}
          >
            Add task
          </button>
        </div>
      </form>
      {showDateError && (
        <p
          id="task-due-error"
          role="alert"
          className="-mt-1 text-sm text-red-600 dark:text-red-400"
        >
          {dateError}
        </p>
      )}
    </section>
  );
}
