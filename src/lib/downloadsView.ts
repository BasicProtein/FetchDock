export type DownloadStatusFilter =
  | "all"
  | "queued"
  | "active"
  | "paused"
  | "completed"
  | "failed"
  | "canceled"
  | "archived";

export interface DownloadStatusLike {
  status: string;
}

export type DownloadKindFilter =
  | "all"
  | "video"
  | "playlist"
  | "audio"
  | "image"
  | "subtitles_only"
  | "torrent"
  | "p2p"
  | "pdf"
  | "book"
  | "webpage"
  | "telegram_media"
  | "course_lesson"
  | "generic";

export interface DownloadKindLike {
  kind: string;
}

export interface DownloadSearchLike {
  id?: string | null;
  kind?: string | null;
  title?: string | null;
  source_url?: string | null;
  platform?: string | null;
  output_dir?: string | null;
  output_path?: string | null;
  last_error?: string | null;
  error_category?: string | null;
  user_agent?: string | null;
  referer?: string | null;
  proxy?: string | null;
  cookie_bucket_id?: string | null;
  auth_payload_ref?: string | null;
  rate_limit?: string | null;
  custom_ytdlp_args?: string | null;
  quality?: string | null;
  audio_format?: string | null;
  thumbnail_url?: string | null;
  thumbnail_path?: string | null;
  subtitles?: unknown;
  sponsorblock?: unknown;
  metadata?: unknown;
  details_json?: unknown;
}

export type DownloadOperationalFilter = "all" | "errors" | "retryable" | "with_output";

export interface DownloadOperationalLike {
  last_error?: string | null;
  output_dir?: string | null;
  output_path?: string | null;
  retryable?: boolean | null;
}

export interface DownloadDateLike {
  created_at?: string | null;
  updated_at?: string | null;
}

export type DownloadDateField = "created" | "updated";

export interface DownloadSortLike {
  position?: number | null;
  status?: string | null;
  kind?: string | null;
  platform?: string | null;
  title?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export type DownloadSortMode =
  | "queue"
  | "created_desc"
  | "created_asc"
  | "updated_desc"
  | "updated_asc"
  | "title_asc"
  | "status_asc"
  | "platform_asc"
  | "kind_asc";

export const downloadStatusFilters: Array<{ id: DownloadStatusFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "queued", label: "Queued" },
  { id: "active", label: "Active" },
  { id: "paused", label: "Paused" },
  { id: "completed", label: "Completed" },
  { id: "failed", label: "Failed" },
  { id: "canceled", label: "Canceled" },
  { id: "archived", label: "Archived" }
];

export const downloadKindFilters: Array<{ id: DownloadKindFilter; label: string }> = [
  { id: "all", label: "All types" },
  { id: "video", label: "Video" },
  { id: "playlist", label: "Playlists" },
  { id: "audio", label: "Audio" },
  { id: "image", label: "Images" },
  { id: "subtitles_only", label: "Subtitles" },
  { id: "torrent", label: "Torrent" },
  { id: "p2p", label: "P2P" },
  { id: "pdf", label: "PDF" },
  { id: "book", label: "Books" },
  { id: "webpage", label: "Web" },
  { id: "telegram_media", label: "Telegram" },
  { id: "course_lesson", label: "Courses" },
  { id: "generic", label: "Generic" }
];

export const downloadOperationalFilters: Array<{ id: DownloadOperationalFilter; label: string }> = [
  { id: "all", label: "All operations" },
  { id: "errors", label: "Failed only" },
  { id: "retryable", label: "Retryable" },
  { id: "with_output", label: "Has output" }
];

export const downloadSortModes: Array<{ id: DownloadSortMode; label: string }> = [
  { id: "queue", label: "Queue order" },
  { id: "created_desc", label: "Newest created" },
  { id: "created_asc", label: "Oldest created" },
  { id: "updated_desc", label: "Recently updated" },
  { id: "updated_asc", label: "Least recently updated" },
  { id: "title_asc", label: "Title A-Z" },
  { id: "status_asc", label: "Status A-Z" },
  { id: "platform_asc", label: "Platform A-Z" },
  { id: "kind_asc", label: "Kind A-Z" }
];

export function filterDownloadsByStatus<T extends DownloadStatusLike>(
  tasks: T[],
  status: DownloadStatusFilter
): T[] {
  if (status === "all") {
    return tasks;
  }

  return tasks.filter((task) => task.status === status);
}

export function filterDownloadsByKind<T extends DownloadKindLike>(
  tasks: T[],
  kind: DownloadKindFilter
): T[] {
  if (kind === "all") {
    return tasks;
  }

  return tasks.filter((task) => task.kind === kind);
}

export function filterDownloadsByPlatform<T extends DownloadSearchLike>(tasks: T[], platform: string): T[] {
  const normalized = platform.trim().toLowerCase();
  if (!normalized || normalized === "all") {
    return tasks;
  }

  return tasks.filter((task) => (task.platform ?? "").toLowerCase() === normalized);
}

export function filterDownloadsByOperationalState<T extends DownloadOperationalLike>(
  tasks: T[],
  operational: DownloadOperationalFilter
): T[] {
  switch (operational) {
    case "errors":
      return tasks.filter((task) => Boolean(task.last_error?.trim()));
    case "retryable":
      return tasks.filter((task) => task.retryable === true);
    case "with_output":
      return tasks.filter((task) => Boolean((task.output_path ?? task.output_dir ?? "").trim()));
    case "all":
    default:
      return tasks;
  }
}

export function filterDownloadsByQuery<T extends DownloadSearchLike>(tasks: T[], query: string): T[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return tasks;
  }

  return tasks.filter((task) =>
    [
      task.id,
      task.title,
      task.source_url,
      task.kind,
      task.platform,
      task.output_dir,
      task.output_path,
      task.last_error,
      task.error_category,
      task.user_agent,
      task.referer,
      task.proxy,
      task.cookie_bucket_id,
      task.auth_payload_ref,
      task.rate_limit,
      task.custom_ytdlp_args,
      task.quality,
      task.audio_format,
      task.thumbnail_url,
      task.thumbnail_path,
      searchTextFromUnknown(task.subtitles),
      searchTextFromUnknown(task.sponsorblock),
      searchTextFromUnknown(task.metadata),
      searchTextFromUnknown(task.details_json)
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalized))
  );
}

function searchTextFromUnknown(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(searchTextFromUnknown).filter(Boolean).join(" ");
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .flatMap(([key, nestedValue]) => [key, searchTextFromUnknown(nestedValue)])
      .filter(Boolean)
      .join(" ");
  }
  return "";
}

function taskDate(task: DownloadDateLike, field: DownloadDateField): string {
  const value = field === "updated" ? task.updated_at : task.created_at;
  return (value ?? "").slice(0, 10);
}

export function filterDownloadsByDateRange<T extends DownloadDateLike>(
  tasks: T[],
  from = "",
  to = "",
  field: DownloadDateField = "created"
): T[] {
  const normalizedFrom = from.trim();
  const normalizedTo = to.trim();
  if (!normalizedFrom && !normalizedTo) {
    return tasks;
  }

  return tasks.filter((task) => {
    const date = taskDate(task, field);
    if (!date) {
      return false;
    }

    return (!normalizedFrom || date >= normalizedFrom) && (!normalizedTo || date <= normalizedTo);
  });
}

export function sortDownloads<T extends DownloadSortLike>(tasks: T[], mode: DownloadSortMode): T[] {
  const sorted = [...tasks];
  switch (mode) {
    case "created_desc":
      return sorted.sort((left, right) => (right.created_at ?? "").localeCompare(left.created_at ?? ""));
    case "created_asc":
      return sorted.sort((left, right) => (left.created_at ?? "").localeCompare(right.created_at ?? ""));
    case "updated_desc":
      return sorted.sort((left, right) => (right.updated_at ?? "").localeCompare(left.updated_at ?? ""));
    case "updated_asc":
      return sorted.sort((left, right) => (left.updated_at ?? "").localeCompare(right.updated_at ?? ""));
    case "title_asc":
      return sorted.sort((left, right) => (left.title ?? "").localeCompare(right.title ?? ""));
    case "status_asc":
      return sorted.sort((left, right) => (left.status ?? "").localeCompare(right.status ?? ""));
    case "platform_asc":
      return sorted.sort((left, right) => (left.platform ?? "").localeCompare(right.platform ?? ""));
    case "kind_asc":
      return sorted.sort((left, right) => (left.kind ?? "").localeCompare(right.kind ?? ""));
    case "queue":
    default:
      return sorted.sort((left, right) => (left.position ?? 0) - (right.position ?? 0));
  }
}

export function downloadPlatformFilters<T extends DownloadSearchLike>(tasks: T[]): Array<{ id: string; label: string }> {
  const platforms = [...new Set(tasks.map((task) => task.platform?.trim()).filter(Boolean) as string[])].sort((a, b) =>
    a.localeCompare(b)
  );
  return [{ id: "all", label: "All platforms" }, ...platforms.map((platform) => ({ id: platform, label: platform }))];
}

export function filterDownloads<
  T extends DownloadStatusLike &
    DownloadKindLike &
    DownloadSearchLike &
    DownloadOperationalLike &
    DownloadDateLike &
    DownloadSortLike
>(
  tasks: T[],
  status: DownloadStatusFilter,
  kind: DownloadKindFilter,
  platform = "all",
  operational: DownloadOperationalFilter = "all",
  query = "",
  createdFrom = "",
  createdTo = "",
  dateField: DownloadDateField = "created",
  sortMode: DownloadSortMode = "queue"
): T[] {
  return sortDownloads(
    filterDownloadsByDateRange(
      filterDownloadsByQuery(
        filterDownloadsByOperationalState(
          filterDownloadsByPlatform(filterDownloadsByKind(filterDownloadsByStatus(tasks, status), kind), platform),
          operational
        ),
        query
      ),
      createdFrom,
      createdTo,
      dateField
    ),
    sortMode
  );
}
