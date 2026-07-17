export type ToastLevel = "success" | "info" | "warning" | "error";

export interface ToastMessage {
  id: string;
  level: ToastLevel;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function createToast(
  title: string,
  level: ToastLevel = "info",
  message?: string,
  action?: ToastMessage["action"]
): ToastMessage {
  return {
    id: crypto.randomUUID(),
    level,
    title,
    message,
    action
  };
}
