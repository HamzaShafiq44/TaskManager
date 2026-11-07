function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseDueDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function daysUntil(dueDate: string, now: Date) {
  const due = parseDueDate(dueDate);
  if (!due) return null;

  const milliseconds = startOfDay(due).getTime() - startOfDay(now).getTime();
  return Math.round(milliseconds / 86_400_000);
}

export function formatDueDate(dueDate: string | undefined, now = new Date()) {
  if (!dueDate) return "";

  const diffDays = daysUntil(dueDate, now);
  if (diffDays === null) return "";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `In ${diffDays} days`;
  if (diffDays === -1) return "1 day overdue";
  return `${Math.abs(diffDays)} days overdue`;
}

export function isOverdue(dueDate: string | undefined, now = new Date()) {
  if (!dueDate) return false;

  const diffDays = daysUntil(dueDate, now);
  return diffDays !== null && diffDays < 0;
}
