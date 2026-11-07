"use client";

import { useEffect, useState } from "react";

export type ToastVariant = "success" | "error";

export type ToastMessage = {
  id: string;
  message: string;
  variant: ToastVariant;
};

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
};

type ToastViewportProps = {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
};

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[min(24rem,calc(100%-2rem))] flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    const hideTimer = window.setTimeout(() => setShown(false), 3000);
    const removeTimer = window.setTimeout(() => onDismiss(toast.id), 3400);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, [onDismiss, toast.id]);

  return (
    <p
      role={toast.variant === "error" ? "alert" : "status"}
      className={`pointer-events-auto rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition duration-300 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      } ${variantStyles[toast.variant]}`}
    >
      {toast.message}
    </p>
  );
}
