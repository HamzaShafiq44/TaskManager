"use client";

import {
  memo,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type TransitionEvent,
} from "react";
import { formatDueDate, isOverdue } from "@/components/formatDueDate";
import { priorities, type Priority, type Task } from "@/components/types";

const playedEnterIds = new Set<string>();

const priorityBadgeStyles: Record<Priority, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
  low: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
};

type TaskItemProps = {
  task: Task;
  animateIn?: boolean;
  onEntered?: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
};

export const TaskItem = memo(function TaskItem({
  task,
  animateIn = false,
  onEntered,
  onUpdate,
  onDelete,
  onToggleComplete,
}: TaskItemProps) {
  const [visible, setVisible] = useState(
    () => !animateIn || playedEnterIds.has(task.id),
  );
  const [isRemoving, setIsRemoving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const removedRef = useRef(false);
  const onDeleteRef = useRef(onDelete);
  const onEnteredRef = useRef(onEntered);
  const checkboxId = `complete-${task.id}`;
  const editId = `edit-${task.id}`;
  const dueLabel = formatDueDate(task.dueDate);
  const overdue = isOverdue(task.dueDate) && !task.completed;
  const dueToday = dueLabel === "Today" && !task.completed;
  const priorityLabel =
    priorities.find((option) => option.value === task.priority)?.label ??
    task.priority;

  useEffect(() => {
    onDeleteRef.current = onDelete;
    onEnteredRef.current = onEntered;
  });

  useEffect(() => {
    if (!animateIn || playedEnterIds.has(task.id)) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      playedEnterIds.add(task.id);
      onEnteredRef.current?.(task.id);
      setVisible(true);
      return;
    }

    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        playedEnterIds.add(task.id);
        onEnteredRef.current?.(task.id);
        setVisible(true);
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [animateIn, task.id]);

  useEffect(() => {
    if (!isRemoving) return;

    const timeout = window.setTimeout(() => {
      if (removedRef.current) return;
      removedRef.current = true;
      onDeleteRef.current(task.id);
    }, 280);

    return () => window.clearTimeout(timeout);
  }, [isRemoving, task.id]);

  function startEditing() {
    setDraft(task.title);
    setIsEditing(true);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;

    onUpdate(task.id, trimmed);
    setDraft(trimmed);
    setIsEditing(false);
  }

  function handleCancel() {
    setDraft(task.title);
    setIsEditing(false);
  }

  function handleComplete(checked: boolean) {
    if (!checked || task.completed) return;

    const confirmed = window.confirm(
      "Mark this task as complete? This can't be undone.",
    );
    if (confirmed) onToggleComplete(task.id, true);
  }

  function handleDelete() {
    if (isRemoving || removedRef.current) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );
    if (!confirmed) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      removedRef.current = true;
      onDelete(task.id);
      return;
    }

    setIsRemoving(true);
  }

  function handleTransitionEnd(event: TransitionEvent<HTMLLIElement>) {
    if (!isRemoving || event.target !== event.currentTarget) return;
    if (event.propertyName !== "opacity" && event.propertyName !== "transform") {
      return;
    }
    if (removedRef.current) return;

    removedRef.current = true;
    onDelete(task.id);
  }

  const motionClass = isRemoving
    ? "translate-x-6 opacity-0"
    : visible
      ? "translate-y-0 opacity-100 hover:-translate-y-0.5"
      : "translate-y-2 opacity-0";

  return (
    <li
      onTransitionEnd={handleTransitionEnd}
      className={`rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition-[opacity,transform,box-shadow,border-color] duration-[250ms] ease-out hover:border-zinc-300 hover:shadow-md motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 ${
        overdue
          ? "border-l-4 border-l-red-500"
          : dueToday
            ? "border-l-4 border-l-amber-400"
            : ""
      } ${motionClass} ${
        isRemoving ? "pointer-events-none" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          checked={task.completed}
          onChange={(event) => handleComplete(event.target.checked)}
          disabled={task.completed}
          title={
            task.completed
              ? "Completed tasks can't be reopened."
              : undefined
          }
          className={`mt-1 size-4 shrink-0 accent-zinc-900 transition hover:ring-2 hover:ring-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 active:scale-90 motion-reduce:transform-none dark:accent-zinc-100 dark:hover:ring-zinc-600 ${
            task.completed
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
        />
        <label htmlFor={checkboxId} className="sr-only">
          {task.completed ? "Completed: " : "Mark complete: "}
          {task.title}
        </label>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityBadgeStyles[task.priority]}`}
          >
            {priorityLabel}
          </span>
          {isEditing && !task.completed ? (
            <form
              onSubmit={handleSave}
              className="flex w-full min-w-0 flex-col gap-2 sm:flex-row"
            >
              <label className="sr-only" htmlFor={editId}>
                Edit task
              </label>
              <input
                id={editId}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="h-10 min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 focus-visible:ring-2 focus-visible:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/10 dark:focus-visible:ring-zinc-400"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="h-10 cursor-pointer rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white transition hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 active:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:active:bg-zinc-200 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
                  disabled={!draft.trim()}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="h-10 cursor-pointer rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 active:bg-zinc-200 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={task.completed ? undefined : startEditing}
              disabled={task.completed}
              className={`min-w-0 rounded-md text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 ${
                task.completed
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:text-zinc-600 active:text-zinc-500 dark:hover:text-zinc-300 dark:active:text-zinc-400"
              }`}
            >
              <span className="sr-only">Edit task: </span>
              <h2
                className={`text-base font-medium break-words transition-all duration-200 ease-out motion-reduce:transition-none ${
                  task.completed
                    ? "text-zinc-500 line-through dark:text-zinc-400"
                    : overdue
                      ? "text-red-600 dark:text-red-400"
                      : "text-zinc-900 dark:text-zinc-50"
                }`}
              >
                {task.title}
              </h2>
            </button>
          )}
          {dueLabel ? (
            <p
              className={`text-sm ${
                overdue
                  ? "rounded-md bg-red-50 px-2 py-1 font-medium text-red-700 dark:bg-red-950/60 dark:text-red-300"
                  : dueToday
                    ? "rounded-md bg-amber-50 px-2 py-1 font-medium text-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
                    : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {dueLabel}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isRemoving}
          aria-label={`Delete task: ${task.title}`}
          className="shrink-0 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-700 hover:text-white active:bg-red-800 focus:ring-2 focus:ring-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-700 dark:hover:text-white dark:active:bg-red-800"
        >
          Delete
        </button>
      </div>
    </li>
  );
});
