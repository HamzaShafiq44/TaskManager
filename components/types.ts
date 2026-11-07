export type Priority = "high" | "medium" | "low";

export const priorities: { value: Priority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate: string;
};
