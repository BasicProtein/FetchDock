import type { DownloadKind, DownloadTaskCreateOptions } from "./api";

const audioFormats = new Set(["mp3", "m4a", "opus", "flac", "wav"]);

export interface TaskCreateOptionInput {
  kind: DownloadKind;
  outputDir: string;
  outputPath?: string;
  userAgent: string;
  referer: string;
  proxy: string;
  cookieBucketId?: string;
  authPayloadRef?: string;
  rateLimit: string;
  liveFromStart: boolean;
  runAfterActiveSlot?: boolean;
  concurrentFragments: string;
  customYtdlpArgs?: string;
  startSeconds?: string;
  endSeconds?: string;
  audioFormat: string;
  selectedFormatId: string;
  thumbnailUrl?: string | null;
  expectedSha256?: string;
  subtitleLanguages?: string[];
  subtitleAuto?: boolean;
  subtitleEmbed?: boolean;
  subtitleKeepVtt?: boolean;
  sponsorBlockEnabled?: boolean;
  sponsorBlockCategories?: string[];
  embedMetadata?: boolean;
  embedThumbnail?: boolean;
  splitChapters?: boolean;
}

function optionalTrimmed(value: string | undefined): string | undefined {
  const trimmed = value?.trim() ?? "";
  return trimmed || undefined;
}

function optionalPositiveInteger(value: string | undefined): number | undefined {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number(trimmed);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function optionalNonNegativeNumber(value: string | undefined): number | undefined {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function normalizeAudioFormat(value: string): string {
  const normalized = value.trim().toLowerCase();
  return audioFormats.has(normalized) ? normalized : "m4a";
}

function uniqueTrimmedList(values: string[] | undefined): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values ?? []) {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    result.push(trimmed);
  }
  return result;
}

export function buildTaskCreateOptions(input: TaskCreateOptionInput): DownloadTaskCreateOptions {
  const kind = input.kind;
  const subtitleLanguages = uniqueTrimmedList(input.subtitleLanguages);
  const hasSubtitleOverride =
    input.subtitleLanguages !== undefined ||
    input.subtitleAuto !== undefined ||
    input.subtitleEmbed !== undefined ||
    input.subtitleKeepVtt !== undefined;
  const sponsorBlockCategories = uniqueTrimmedList(input.sponsorBlockCategories);
  const hasSponsorBlockOverride =
    input.sponsorBlockEnabled !== undefined || input.sponsorBlockCategories !== undefined;
  const hasMetadataOverride =
    input.embedMetadata !== undefined ||
    input.embedThumbnail !== undefined ||
    input.splitChapters !== undefined;
  return {
    kind,
    outputDir: optionalTrimmed(input.outputDir),
    outputPath: optionalTrimmed(input.outputPath),
    userAgent: optionalTrimmed(input.userAgent),
    referer: optionalTrimmed(input.referer),
    proxy: optionalTrimmed(input.proxy),
    cookieBucketId: optionalTrimmed(input.cookieBucketId),
    authPayloadRef: optionalTrimmed(input.authPayloadRef),
    rateLimit: optionalTrimmed(input.rateLimit),
    liveFromStart: input.liveFromStart || undefined,
    runAfterActiveSlot: input.runAfterActiveSlot || undefined,
    concurrentFragments: optionalPositiveInteger(input.concurrentFragments),
    customYtdlpArgs: optionalTrimmed(input.customYtdlpArgs),
    startSeconds: kind === "video" || kind === "audio" ? optionalNonNegativeNumber(input.startSeconds) : undefined,
    endSeconds: kind === "video" || kind === "audio" ? optionalNonNegativeNumber(input.endSeconds) : undefined,
    quality: kind === "video" || kind === "playlist" ? optionalTrimmed(input.selectedFormatId) : undefined,
    audioFormat: kind === "audio" ? normalizeAudioFormat(input.audioFormat) : undefined,
    thumbnailUrl: optionalTrimmed(input.thumbnailUrl ?? undefined),
    expectedSha256: optionalTrimmed(input.expectedSha256),
    subtitles:
      hasSubtitleOverride
        ? {
            languages: subtitleLanguages,
            auto: Boolean(input.subtitleAuto),
            embed: Boolean(input.subtitleEmbed),
            keep_vtt: Boolean(input.subtitleKeepVtt)
          }
        : undefined,
    sponsorblock: hasSponsorBlockOverride
      ? {
          enabled: Boolean(input.sponsorBlockEnabled),
          categories: sponsorBlockCategories
        }
      : undefined,
    metadata: hasMetadataOverride
      ? {
          embed_metadata: Boolean(input.embedMetadata),
          embed_thumbnail: Boolean(input.embedThumbnail),
          split_chapters: Boolean(input.splitChapters)
        }
      : undefined
  };
}
