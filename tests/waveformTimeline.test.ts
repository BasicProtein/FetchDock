import { describe, expect, it } from "vitest";

import {
  listWaveformTimelinePeaks,
  normalizeWaveformPeakWidth,
  parseWaveformSeekTime,
  waveformPeakContainsTime
} from "../src/lib/waveformTimeline";
import type { WaveformPeak } from "../src/lib/api";

function peak(index: number): WaveformPeak {
  return {
    index,
    start_seconds: index,
    end_seconds: index + 1,
    min: -0.2,
    max: 0.4,
    rms: 0.3
  };
}

describe("waveform timeline helpers", () => {
  it("keeps every generated peak available for timeline rendering", () => {
    const peaks = Array.from({ length: 70 }, (_, index) => peak(index));

    expect(listWaveformTimelinePeaks(peaks)).toHaveLength(70);
    expect(listWaveformTimelinePeaks(peaks).at(-1)?.index).toBe(69);
  });

  it("keeps the waveform peak width control within readable bounds", () => {
    expect(normalizeWaveformPeakWidth(1)).toBe(2);
    expect(normalizeWaveformPeakWidth(7.4)).toBe(7);
    expect(normalizeWaveformPeakWidth(20)).toBe(12);
    expect(normalizeWaveformPeakWidth(Number.NaN)).toBe(4);
  });

  it("parses waveform seek times and clamps them to the media duration", () => {
    expect(parseWaveformSeekTime("1:02.500", 120)).toBe(62.5);
    expect(parseWaveformSeekTime("75", 120)).toBe(75);
    expect(parseWaveformSeekTime("-2", 120)).toBe(0);
    expect(parseWaveformSeekTime("200", 120)).toBe(120);
    expect(parseWaveformSeekTime("not time", 120)).toBeNull();
  });

  it("detects which waveform peak contains the selected time", () => {
    expect(waveformPeakContainsTime(peak(2), 2)).toBe(true);
    expect(waveformPeakContainsTime(peak(2), 2.5)).toBe(true);
    expect(waveformPeakContainsTime(peak(2), 3)).toBe(false);
    expect(waveformPeakContainsTime(peak(2), null)).toBe(false);
  });
});
