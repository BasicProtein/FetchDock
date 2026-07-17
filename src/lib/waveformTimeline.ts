import type { WaveformPeak } from "./api";

export function listWaveformTimelinePeaks(peaks: WaveformPeak[]): WaveformPeak[] {
  return peaks;
}

export function normalizeWaveformPeakWidth(width: number): number {
  if (!Number.isFinite(width)) {
    return 4;
  }

  return Math.max(2, Math.min(12, Math.round(width)));
}

export function parseWaveformSeekTime(input: string, durationSeconds: number): number | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const parts = trimmed.split(":");
  if (parts.length > 3 || parts.some((part) => part.trim() === "")) {
    return null;
  }

  const values = parts.map((part) => Number(part));
  if (values.some((value) => !Number.isFinite(value))) {
    return null;
  }

  let seconds = 0;
  for (const value of values) {
    seconds = seconds * 60 + value;
  }

  if (!Number.isFinite(seconds)) {
    return null;
  }

  const maxSeconds = Number.isFinite(durationSeconds) && durationSeconds > 0 ? durationSeconds : Number.POSITIVE_INFINITY;
  return Math.max(0, Math.min(maxSeconds, seconds));
}

export function waveformPeakContainsTime(peak: WaveformPeak, timeSeconds: number | null): boolean {
  if (timeSeconds === null || !Number.isFinite(timeSeconds)) {
    return false;
  }

  return timeSeconds >= peak.start_seconds && timeSeconds < peak.end_seconds;
}
