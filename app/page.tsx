"use client";

import { useCallback, useState } from "react";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { TaskSearch } from "@/components/TaskSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ToastViewport,
  type ToastMessage,
  type ToastVariant,
} from "@/components/ToastViewport";
import type { Priority, Task } from "@/components/types";
import { useLocalStorage } from "@/components/useLocalStorage";

const errorMessage = "Error: Could not complete the task action.";

type TaskFilter = "all" | "active" | "completed";

const filters: { id: TaskFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

const priorityOrder: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [normalizedQuery, setNormalizedQuery] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [enteringIds, setEnteringIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const markEntered = useCallback((id: string) => {
    setEnteringIds((current) => {
      if (!current.has(id)) return current;
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, variant: ToastVariant) => {
    setToasts((current) => [
      ...current,
      {
        id: `toast-${Date.now()}-${current.length}`,
        message,
        variant,
      },
    ]);
  }, []);

  const handleQueryChange = useCallback((next: string) => {
    setNormalizedQuery((current) => (current === next ? current : next));
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active" && task.completed) return false;
    if (filter === "completed" && !task.completed) return false;
    if (
      normalizedQuery &&
      !task.title.toLowerCase().includes(normalizedQuery)
    ) {
      return false;
    }
    return true;
  });
  const visibleTasks =
    filter === "active"
      ? [...filteredTasks].sort((a, b) => {
          const dueDateOrder = (a.dueDate || "9999-12-31").localeCompare(
            b.dueDate || "9999-12-31",
          );
          return dueDateOrder || priorityOrder[a.priority] - priorityOrder[b.priority];
        })
      : filteredTasks;
  const activeCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.length - activeCount;

  const addTask = useCallback(
    (title: string, priority: Priority, dueDate: string) => {
      if (!dueDate) return false;

      try {
        const id = crypto.randomUUID();
        setEnteringIds((current) => {
          const next = new Set(current);
          next.add(id);
          return next;
        });
        setTasks((current) => [
          ...current,
          { id, title, completed: false, priority, dueDate },
        ]);
        showToast("Task added successfully!", "success");
        return true;
      } catch {
        showToast(errorMessage, "error");
        return false;
      }
    },
    [showToast],
  );

  const updateTask = useCallback(
    (id: string, title: string) => {
      try {
        let found = false;
        setTasks((current) => {
          const index = current.findIndex((task) => task.id === id);
          found = index !== -1;
          if (index === -1 || current[index].title === title) return current;
          return current.map((task) =>
            task.id === id ? { ...task, title } : task,
          );
        });
        if (!found) throw new Error("Task not found");
        showToast("Task updated successfully!", "success");
      } catch {
        showToast(errorMessage, "error");
      }
    },
    [showToast],
  );

  const deleteTask = useCallback(
    (id: string) => {
      try {
        let found = false;
        setTasks((current) => {
          const next = current.filter((task) => task.id !== id);
          found = next.length !== current.length;
          return found ? next : current;
        });
        if (!found) throw new Error("Task not found");
        showToast("Task deleted successfully!", "success");
      } catch {
        showToast(errorMessage, "error");
      }
    },
    [showToast],
  );

  const toggleTask = useCallback((id: string, completed: boolean) => {
    if (!completed) return;

    setTasks((current) => {
      const task = current.find((item) => item.id === id);
      if (!task || task.completed) return current;
      return current.map((item) =>
        item.id === id ? { ...item, completed: true } : item,
      );
    });
  }, []);

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-8">
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Tasks
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Add a task and it shows up in the list below.
            </p>
          </div>
          <ThemeToggle />
        </header>
        <TaskForm onAdd={addTask} />
        <section
          aria-label="Task list"
          className="flex flex-col gap-4"
        >
          <TaskSearch onQueryChange={handleQueryChange} />
          <p
            role="status"
            aria-live="polite"
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {activeCount} active
            </span>
            <span className="mx-2 text-zinc-400" aria-hidden="true">
              ·
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {completedCount} completed
            </span>
          </p>
          <div className="flex gap-2" role="group" aria-label="Filter tasks">
            {filters.map((item) => {
              const selected = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    setFilter((current) =>
                      current === item.id ? current : item.id,
                    )
                  }
                  className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 active:scale-[0.98] motion-reduce:transform-none ${
                    selected
                      ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                      : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          {tasks.length > 0 && visibleTasks.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
              {normalizedQuery
                ? "No tasks match your search."
                : filter === "active"
                  ? "No active tasks. Add one above to get started."
                  : "No completed tasks yet. Check off a task when you're done."}
            </p>
          ) : (
            <TaskList
              tasks={visibleTasks}
              enteringIds={enteringIds}
              onEntered={markEntered}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onToggleComplete={toggleTask}
            />
          )}
        </section>
      </main>
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
