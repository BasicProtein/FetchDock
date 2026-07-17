import type { ClipVideoRequest } from "./api";

export type ClipReencodeProfileId = "h264_balanced" | "h265_compact" | "vp9_web" | "custom";

export interface ClipReencodeProfile {
  id: ClipReencodeProfileId;
  label: string;
  videoCodec: string;
  audioCodec: string;
  crf: string;
  preset: string;
}

export interface ClipVideoFormValues {
  inputPath: string;
  outputPath: string;
  mode: "copy" | "reencode";
  profile?: ClipReencodeProfileId;
  videoCodec: string;
  audioCodec: string;
  crf: string;
  preset: string;
  startSeconds: string;
  endSeconds: string;
}

export const clipReencodeProfiles: ClipReencodeProfile[] = [
  {
    id: "h264_balanced",
    label: "H.264 balanced",
    videoCodec: "libx264",
    audioCodec: "aac",
    crf: "23",
    preset: "medium"
  },
  {
    id: "h265_compact",
    label: "H.265 compact",
    videoCodec: "libx265",
    audioCodec: "aac",
    crf: "28",
    preset: "slow"
  },
  {
    id: "vp9_web",
    label: "VP9 web",
    videoCodec: "libvpx-vp9",
    audioCodec: "libopus",
    crf: "32",
    preset: "fast"
  },
  {
    id: "custom",
    label: "Custom",
    videoCodec: "",
    audioCodec: "",
    crf: "",
    preset: ""
  }
];

export function buildClipVideoRequest(values: ClipVideoFormValues): ClipVideoRequest {
  const inputPath = values.inputPath.trim();
  const outputPath = values.outputPath.trim();
  const startSeconds = parseOptionalSeconds(values.startSeconds, "Start seconds");
  const endSeconds = parseOptionalSeconds(values.endSeconds, "End seconds");
  const mode = values.mode === "reencode" ? "reencode" : "copy";
  const reencodeValues = resolveReencodeValues(values);
  const crf = mode === "reencode" ? parseOptionalCrf(reencodeValues.crf) : undefined;
  const videoCodec = cleanOptionalText(reencodeValues.videoCodec);
  const audioCodec = cleanOptionalText(reencodeValues.audioCodec);
  const preset = cleanOptionalText(reencodeValues.preset);

  if (!inputPath) {
    throw new Error("Input video path is required.");
  }
  if (!outputPath) {
    throw new Error("Output video path is required.");
  }
  if (startSeconds !== undefined && endSeconds !== undefined && endSeconds <= startSeconds) {
    throw new Error("End seconds must be greater than start seconds.");
  }

  return {
    inputPath,
    outputPath,
    ...(mode === "reencode" ? { mode } : {}),
    ...(mode === "reencode" && videoCodec ? { videoCodec } : {}),
    ...(mode === "reencode" && audioCodec ? { audioCodec } : {}),
    ...(mode === "reencode" && crf !== undefined ? { crf } : {}),
    ...(mode === "reencode" && preset ? { preset } : {}),
    ...(startSeconds === undefined ? {} : { startSeconds }),
    ...(endSeconds === undefined ? {} : { endSeconds })
  };
}

function resolveReencodeValues(values: ClipVideoFormValues): Pick<
  ClipVideoFormValues,
  "videoCodec" | "audioCodec" | "crf" | "preset"
> {
  const profile = clipReencodeProfiles.find((item) => item.id === values.profile);
  if (!profile || profile.id === "custom") {
    return values;
  }

  return profile;
}

function cleanOptionalText(value: string): string | undefined {
  const normalized = value.trim();
  return normalized ? normalized : undefined;
}

function parseOptionalCrf(value: string): number | undefined {
  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 51) {
    throw new Error("CRF must be between 0 and 51.");
  }

  return parsed;
}

function parseOptionalSeconds(value: string, label: string): number | undefined {
  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${label} must be a non-negative number.`);
  }

  return parsed;
}
