import type { ToolInstallProgressEvent, ToolStatus } from "./api";

export interface ToolInstallAction {
  label: string;
  disabled: boolean;
}

type MinimalToolStatus = Pick<ToolStatus, "id" | "state" | "path" | "managed" | "updatable">;
type DetailToolStatus = Pick<ToolStatus, "id" | "state" | "error">;

export function getToolInstallAction(tool: MinimalToolStatus, installingToolId: string): ToolInstallAction {
  if (installingToolId === tool.id) {
    return {
      label: tool.state === "installed" && tool.managed && tool.updatable ? "Updating" : "Installing",
      disabled: true
    };
  }

  if (tool.state === "installed") {
    if (tool.managed && tool.updatable) {
      return {
        label: "Update",
        disabled: false
      };
    }

    return {
      label: "Installed",
      disabled: true
    };
  }

  if (tool.path) {
    return {
      label: "Path set",
      disabled: true
    };
  }

  return {
    label: "Install",
    disabled: false
  };
}

export function getToolInstallDetail(
  tool: DetailToolStatus,
  progress?: ToolInstallProgressEvent | null
): { text: string; level: "info" | "error" } | null {
  if (progress && progress.tool_id === tool.id) {
    if (progress.stage === "failed") {
      return {
        text: progress.error || progress.message,
        level: "error"
      };
    }

    return {
      text: formatToolProgressMessage(progress),
      level: "info"
    };
  }

  if (tool.error) {
    return {
      text: tool.error,
      level: "error"
    };
  }

  return null;
}
function formatToolProgressMessage(progress: ToolInstallProgressEvent): string {
  const parts = [progress.message];
  if (typeof progress.percent === "number") {
    parts.push(`${Math.max(0, Math.min(100, Math.round(progress.percent)))}%`);
  }
  if (typeof progress.downloaded_bytes === "number") {
    const downloaded = formatBytes(progress.downloaded_bytes);
    const total = typeof progress.total_bytes === "number" ? formatBytes(progress.total_bytes) : "unknown";
    parts.push(`${downloaded} / ${total}`);
  }
  return parts.join(" · ");
}

function formatBytes(value: number): string {
  if (!Number.isFinite(value) || value < 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  let scaled = value;
  let unitIndex = 0;
  while (scaled >= 1024 && unitIndex < units.length - 1) {
    scaled /= 1024;
    unitIndex += 1;
  }
  const precision = unitIndex === 0 || scaled >= 10 ? 0 : 1;
  return `${scaled.toFixed(precision)} ${units[unitIndex]}`;
}
