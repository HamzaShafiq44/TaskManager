import { EmptyState } from "@/components/EmptyState";
import { TaskItem } from "@/components/TaskItem";
import type { Task } from "@/components/types";

type TaskListProps = {
  tasks: Task[];
  enteringIds: ReadonlySet<string>;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEntered: (id: string) => void;
};

export function TaskList({
  tasks,
  enteringIds,
  onUpdate,
  onDelete,
  onToggleComplete,
  onEntered,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          animateIn={enteringIds.has(task.id)}
          onEntered={onEntered}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </ul>
  );
}
