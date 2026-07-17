import type { DownloadKind } from "./api";

export type UrlCandidateKind = "known_platform" | "direct_file" | "generic";
export type UrlCandidateIntent = "single_media" | "playlist" | "profile" | "gallery" | "live" | "clip" | "direct_file" | "webpage";

export interface UrlCandidateClassification {
  label: string;
  platform: string;
  kind: UrlCandidateKind;
  intent: UrlCandidateIntent;
  suggestedKind: DownloadKind;
  detail: string;
  subtype?: string;
  subtypeLabel?: string;
}

interface PlatformPattern {
  needles: string[];
  platform: string;
  label: string;
  defaultIntent?: UrlCandidateIntent;
}

const KNOWN_PLATFORMS: PlatformPattern[] = [
  { needles: ["youtube.com", "youtu.be"], platform: "youtube", label: "YouTube" },
  { needles: ["instagram.com"], platform: "instagram", label: "Instagram" },
  { needles: ["tiktok.com"], platform: "tiktok", label: "TikTok" },
  { needles: ["twitter.com", "x.com"], platform: "twitter_x", label: "Twitter/X" },
  { needles: ["reddit.com", "redd.it"], platform: "reddit", label: "Reddit" },
  { needles: ["twitch.tv"], platform: "twitch", label: "Twitch" },
  { needles: ["pinterest."], platform: "pinterest", label: "Pinterest", defaultIntent: "gallery" },
  { needles: ["vimeo.com"], platform: "vimeo", label: "Vimeo" },
  { needles: ["bsky.app"], platform: "bluesky", label: "Bluesky" },
  { needles: ["bilibili.com", "b23.tv"], platform: "bilibili", label: "Bilibili" },
  { needles: ["douyin.com", "iesdouyin.com"], platform: "douyin", label: "Douyin" }
];

const GALLERY_PLATFORMS: PlatformPattern[] = [
  { needles: ["pixiv.net"], platform: "pixiv", label: "Pixiv", defaultIntent: "gallery" },
  { needles: ["deviantart.com"], platform: "deviantart", label: "DeviantArt", defaultIntent: "gallery" },
  { needles: ["artstation.com"], platform: "artstation", label: "ArtStation", defaultIntent: "gallery" },
  { needles: ["flickr.com"], platform: "flickr", label: "Flickr", defaultIntent: "gallery" },
  { needles: ["tumblr.com"], platform: "tumblr", label: "Tumblr", defaultIntent: "gallery" },
  { needles: ["imgur.com", "imgur.io"], platform: "imgur", label: "Imgur", defaultIntent: "gallery" },
  { needles: ["kemono.su", "kemono.party"], platform: "kemono", label: "Kemono", defaultIntent: "gallery" },
  { needles: ["newgrounds.com"], platform: "newgrounds", label: "Newgrounds", defaultIntent: "gallery" }
];

const ASIAN_PLATFORM_PATTERNS: PlatformPattern[] = [
  { needles: ["xiaohongshu.com", "xhslink.com"], platform: "xiaohongshu", label: "Xiaohongshu" },
  { needles: ["kuaishou.com", "kuaishouapp.com", "gifshow.com"], platform: "kuaishou", label: "Kuaishou" },
  { needles: ["youku.com"], platform: "youku", label: "Youku" },
  { needles: ["iqiyi.com", "iq.com"], platform: "iqiyi", label: "iQiyi" },
  { needles: ["v.qq.com", "video.qq.com"], platform: "tencent_video", label: "Tencent Video" },
  { needles: ["mgtv.com", "hunantv.com"], platform: "mango_tv", label: "Mango TV" }
];

const ALL_PLATFORM_PATTERNS = [...KNOWN_PLATFORMS, ...GALLERY_PLATFORMS, ...ASIAN_PLATFORM_PATTERNS];

const DIRECT_FILE_EXTENSIONS = new Set([
  "7z",
  "aac",
  "ass",
  "avi",
  "cbz",
  "epub",
  "flac",
  "gif",
  "jpeg",
  "jpg",
  "m4a",
  "mkv",
  "mov",
  "mp3",
  "mp4",
  "ogg",
  "opus",
  "pdf",
  "png",
  "rar",
  "srt",
  "tar",
  "txt",
  "vtt",
  "wav",
  "webm",
  "webp",
  "zip"
]);

const IMAGE_EXTENSIONS = new Set(["gif", "jpeg", "jpg", "png", "webp"]);
const BOOK_EXTENSIONS = new Set(["cbz", "epub"]);
const AUDIO_EXTENSIONS = new Set(["aac", "flac", "m4a", "mp3", "ogg", "opus", "wav"]);
const VIDEO_EXTENSIONS = new Set(["avi", "mkv", "mov", "mp4", "webm"]);
const SUBTITLE_EXTENSIONS = new Set(["ass", "srt", "vtt"]);

export function extractCapturedUrl(rawUrl: string): string {
  try {
    const parsedUrl = new URL(rawUrl);
    return parsedUrl.searchParams.get("url") ?? parsedUrl.searchParams.get("u") ?? trimTrailingUrlPunctuation(rawUrl);
  } catch {
    return trimTrailingUrlPunctuation(rawUrl);
  }
}

export function extractCapturedTitle(rawUrl: string): string {
  try {
    return new URL(rawUrl).searchParams.get("title")?.trim() ?? "";
  } catch {
    return "";
  }
}

export function extractCapturedKind(rawUrl: string): DownloadKind | null {
  try {
    const rawKind = new URL(rawUrl).searchParams.get("kind");
    if (!rawKind) {
      return null;
    }
    return normalizeCapturedKind(rawKind);
  } catch {
    return null;
  }
}

export function extractFirstHttpUrl(rawText: string): string {
  return extractHttpUrls(rawText)[0] ?? "";
}

function trimTrailingUrlPunctuation(value: string): string {
  return value.replace(/[\])}>,"'`),.;:!?，。；：！？]+$/u, "");
}

export function extractHttpUrls(rawText: string): string[] {
  const tokens = [
    ...[...rawText.matchAll(/https?:\/\/[^\s<>"'`]+/giu)].map((match) => ({
      index: match.index ?? 0,
      value: trimTrailingUrlPunctuation(match[0])
    })),
    ...[...rawText.matchAll(/fetchdock:\/\/\S+/giu)].map((match) => ({
      index: match.index ?? 0,
      value: extractCapturedUrl(match[0])
    }))
  ].sort((first, second) => first.index - second.index);

  const seen = new Set<string>();
  return tokens
    .map((token) => trimTrailingUrlPunctuation(token.value))
    .filter((url) => {
      if (!isHttpUrl(url) || seen.has(url)) {
        return false;
      }
      seen.add(url);
      return true;
    });
}

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeCapturedKind(rawKind: string): DownloadKind | null {
  switch (rawKind.trim().toLowerCase().replace(/-/g, "_")) {
    case "generic":
    case "video":
    case "playlist":
    case "audio":
    case "image":
    case "subtitles_only":
    case "torrent":
    case "p2p":
    case "pdf":
    case "book":
    case "webpage":
    case "telegram_media":
    case "course_lesson":
      return rawKind.trim().toLowerCase().replace(/-/g, "_") as DownloadKind;
    case "hls":
    case "dash":
    case "stream":
    case "media":
      return "video";
    case "web":
    case "page":
      return "webpage";
    case "images":
    case "gallery":
      return "image";
    case "subtitle":
    case "subtitles":
      return "subtitles_only";
    case "course":
      return "course_lesson";
    default:
      return null;
  }
}

export function classifyUrlCandidate(rawUrl: string): UrlCandidateClassification | null {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(extractCapturedUrl(rawUrl.trim()));
  } catch {
    return null;
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return null;
  }

  const lowerUrl = parsedUrl.href.toLowerCase();
  const extension = parsedUrl.pathname.split(".").pop()?.toLowerCase() ?? "";
  const platform = ALL_PLATFORM_PATTERNS.find((candidate) =>
    candidate.needles.some((needle) => lowerUrl.includes(needle))
  );

  if (platform) {
    const bilibiliSubtype = platform.platform === "bilibili" ? classifyBilibiliSubtype(parsedUrl, lowerUrl) : null;
    const intent = bilibiliSubtype?.intent ?? classifyUrlIntent(parsedUrl, lowerUrl, platform.defaultIntent ?? "single_media");
    return {
      label: bilibiliSubtype ? `Bilibili ${bilibiliSubtype.label}` : platform.label,
      platform: platform.platform,
      kind: "known_platform",
      intent,
      suggestedKind: suggestedKindForIntent(intent),
      detail: bilibiliSubtype?.detail ?? intentLabel(intent),
      subtype: bilibiliSubtype?.id,
      subtypeLabel: bilibiliSubtype?.label
    };
  }

  if (DIRECT_FILE_EXTENSIONS.has(extension)) {
    const suggestedKind = directFileKind(extension);
    return {
      label: "Direct file",
      platform: "direct_file",
      kind: "direct_file",
      intent: "direct_file",
      suggestedKind,
      detail: directFileDetail(extension, suggestedKind)
    };
  }

  return {
    label: "Generic web URL",
    platform: "generic",
    kind: "generic",
    intent: "webpage",
    suggestedKind: "video",
    detail: "yt-dlp route"
  };
}

export function inferTaskKindForUrl(url: string, selectedKind: DownloadKind): DownloadKind {
  const classification = classifyUrlCandidate(url);
  if (!classification) {
    return selectedKind;
  }
  if (classification.intent === "gallery" || classification.suggestedKind === "image") {
    return "image";
  }
  if (classification.intent === "playlist") {
    return "playlist";
  }
  if (selectedKind !== "video") {
    return selectedKind;
  }
  return classification.suggestedKind;
}

export function recommendedTaskKindForUrl(url: string, selectedKind: DownloadKind): DownloadKind | null {
  if (selectedKind === "course" || selectedKind === "torrent" || selectedKind === "p2p") {
    return null;
  }
  const recommended = inferTaskKindForUrl(url, selectedKind);
  return recommended === selectedKind ? null : recommended;
}


interface BilibiliSubtype {
  id: string;
  label: string;
  detail: string;
  intent: UrlCandidateIntent;
}

function classifyBilibiliSubtype(parsedUrl: URL, lowerUrl: string): BilibiliSubtype {
  const host = parsedUrl.hostname.toLowerCase();
  const path = parsedUrl.pathname.toLowerCase();
  const search = parsedUrl.searchParams;
  if (lowerUrl.includes("b23.tv")) {
    return { id: "short_link", label: "short link", detail: "b23 short link draft", intent: "single_media" };
  }
  if (path.includes("/watchlater")) {
    return { id: "watch_later", label: "watch later", detail: "watch-later import route", intent: "playlist" };
  }
  if (path.includes("/history")) {
    return { id: "history", label: "history", detail: "history import route", intent: "playlist" };
  }
  if (path.includes("/popular/weekly") || path.includes("/weekly")) {
    return { id: "weekly", label: "weekly", detail: "weekly playlist draft", intent: "playlist" };
  }
  if (path.includes("/favlist") || path.includes("/favorite") || path.includes("/medialist/detail") || search.has("fid")) {
    return { id: "favorites", label: "favorites", detail: "favorites playlist draft", intent: "playlist" };
  }
  if (path.includes("/bangumi/") || path.includes("/anime/") || path.includes("/movie/")) {
    return { id: "bangumi", label: "bangumi", detail: "bangumi/media route draft", intent: "playlist" };
  }
  if (path.includes("/cheese/") || path.includes("/course/")) {
    return { id: "course", label: "course", detail: "course route draft", intent: "playlist" };
  }
  if (host.startsWith("space.") || path.includes("/space/") || path.includes("/medialist/play/")) {
    return { id: "creator", label: "creator", detail: "creator/profile draft", intent: "profile" };
  }
  if (path.includes("/video/") || /^\/bv[0-9a-z]+/i.test(path) || /^\/av\d+/i.test(path)) {
    return { id: "video", label: "video", detail: "video route", intent: "single_media" };
  }
  return { id: "generic", label: "generic", detail: "Bilibili generic route", intent: "single_media" };
}
function classifyUrlIntent(parsedUrl: URL, lowerUrl: string, fallback: UrlCandidateIntent): UrlCandidateIntent {
  const path = parsedUrl.pathname.toLowerCase();
  const search = parsedUrl.searchParams;
  if (search.has("list") || path.includes("/playlist") || path.includes("/sets/") || path.includes("/show/")) {
    return "playlist";
  }
  if (path.includes("/live") || path.includes("/streams") || search.has("live")) {
    return "live";
  }
  if (path.includes("/clip") || path.includes("/clips/")) {
    return "clip";
  }
  if (
    path.includes("/profile") ||
    path.includes("/channel") ||
    path.includes("/c/") ||
    path.includes("/user/") ||
    path.includes("/@") ||
    path.includes("/subreddit") ||
    lowerUrl.includes("reddit.com/r/") ||
    lowerUrl.includes("reddit.com/user/")
  ) {
    return "profile";
  }
  if (
    path.includes("/album") ||
    path.includes("/gallery") ||
    path.includes("/boards/") ||
    path.includes("/pin/") ||
    path.includes("/pins/")
  ) {
    return "gallery";
  }
  return fallback;
}

function suggestedKindForIntent(intent: UrlCandidateIntent): DownloadKind {
  if (intent === "gallery") {
    return "image";
  }
  return "video";
}

function directFileKind(extension: string): DownloadKind {
  if (IMAGE_EXTENSIONS.has(extension)) {
    return "image";
  }
  if (extension === "pdf") {
    return "pdf";
  }
  if (BOOK_EXTENSIONS.has(extension)) {
    return "book";
  }
  if (AUDIO_EXTENSIONS.has(extension)) {
    return "audio";
  }
  if (SUBTITLE_EXTENSIONS.has(extension)) {
    return "subtitles_only";
  }
  if (VIDEO_EXTENSIONS.has(extension)) {
    return "video";
  }
  return "generic";
}

function directFileDetail(extension: string, suggestedKind: DownloadKind): string {
  if (!extension) {
    return "file download";
  }
  return `${extension.toUpperCase()} -> ${suggestedKind}`;
}

function intentLabel(intent: UrlCandidateIntent): string {
  switch (intent) {
    case "playlist":
      return "playlist draft";
    case "profile":
      return "profile/channel draft";
    case "gallery":
      return "gallery route";
    case "live":
      return "live/stream route";
    case "clip":
      return "clip route";
    default:
      return "media route";
  }
}

export function extractBatchUrls(rawText: string): string[] {
  return rawText
    .split(/\r?\n/)
    .flatMap((line) => extractHttpUrls(line.trim()))
    .filter(Boolean);
}
