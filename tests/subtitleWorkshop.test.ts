import { describe, expect, it } from "vitest";

import {
  autoFixSubtitleText,
  cleanupSubtitleTimeline,
  findSubtitleTextMatches,
  findNextSubtitleTextMatch,
  findSubtitleCueTimingAtPosition,
  findSubtitleCueTextRangeAtTime,
  findNearestSubtitleCueTextRangeAtTime,
  listSubtitleTextMatches,
  replaceSubtitleTextMatches,
  shiftSubtitleTiming,
  syncSubtitleTimingToTwoPoints
} from "../src/lib/subtitleWorkshop";

describe("subtitle workshop text helpers", () => {
  it("counts case-insensitive text matches in subtitle content", () => {
    expect(findSubtitleTextMatches("Hello\nhello again\nOther", "hello")).toBe(2);
  });

  it("lists plain text match ranges for find next navigation", () => {
    expect(listSubtitleTextMatches("Hello\nhello again\nOther", "hello")).toEqual([
      { start: 0, end: 5 },
      { start: 6, end: 11 }
    ]);
  });

  it("lists regex match ranges for find next navigation", () => {
    expect(listSubtitleTextMatches("Line 12\nLine 345\nOther", "\\d+", { regex: true })).toEqual([
      { start: 5, end: 7 },
      { start: 13, end: 16 }
    ]);
  });

  it("lists match ranges only in SRT cue text when subtitle structure is present", () => {
    expect(listSubtitleTextMatches("1\n00:00:01,000 --> 00:00:02,000\nLine 1\n", "1")).toEqual([
      { start: 37, end: 38 }
    ]);
  });
  it("finds the SRT cue timing range at the editor cursor", () => {
    const content = "1\n00:00:01,250 --> 00:00:03,500\nHello\n\n2\n00:00:04,000 --> 00:00:05,000\nWorld\n";
    expect(findSubtitleCueTimingAtPosition(content, content.indexOf("Hello") + 1)).toEqual({
      startMilliseconds: 1250,
      endMilliseconds: 3500
    });
  });

  it("finds the ASS cue timing range at the editor cursor using event Format fields", () => {
    const content = "[Events]\nFormat: Text, End, Start, Style\nDialogue: Hello,0:00:03.50,0:00:01.25,Default\n";
    expect(findSubtitleCueTimingAtPosition(content, content.indexOf("Hello") + 1)).toEqual({
      startMilliseconds: 1250,
      endMilliseconds: 3500
    });
  });
  it("finds the SRT cue text range at a waveform time", () => {
    const content = "1\n00:00:01,250 --> 00:00:03,500\nHello\nthere\n\n2\n00:00:04,000 --> 00:00:05,000\nWorld\n";
    expect(findSubtitleCueTextRangeAtTime(content, 2000)).toEqual({
      start: content.indexOf("Hello"),
      end: content.indexOf("\n\n2")
    });
  });

  it("finds the ASS cue text range at a waveform time using event Format fields", () => {
    const content = "[Events]\nFormat: Text, End, Start, Style\nDialogue: Hello,0:00:03.50,0:00:01.25,Default\nDialogue: World,0:00:06.00,0:00:04.00,Default\n";
    expect(findSubtitleCueTextRangeAtTime(content, 2000)).toEqual({
      start: content.indexOf("Hello"),
      end: content.indexOf(",0:00:03.50")
    });
  });

  it("finds the nearest SRT cue text range after a shot marker between cues", () => {
    const content = "1\n00:00:01,000 --> 00:00:02,000\nFirst\n\n2\n00:00:04,000 --> 00:00:05,000\nSecond\n";
    expect(findNearestSubtitleCueTextRangeAtTime(content, 3000)).toEqual({
      start: content.indexOf("Second"),
      end: content.indexOf("\n", content.indexOf("Second"))
    });
  });

  it("finds the nearest ASS cue text range after a shot marker using event Format fields", () => {
    const content = "[Events]\nFormat: Text, Start, End, Style\nDialogue: First,0:00:01.00,0:00:02.00,Default\nDialogue: Second,0:00:04.00,0:00:05.00,Default\n";
    expect(findNearestSubtitleCueTextRangeAtTime(content, 3000)).toEqual({
      start: content.indexOf("Second"),
      end: content.indexOf(",0:00:04.00")
    });
  });

  it("finds the next match at or after the current cursor", () => {
    expect(findNextSubtitleTextMatch("Hello\nhello again\nOther", "hello", 1)).toEqual({ start: 6, end: 11 });
  });

  it("wraps find next back to the first match", () => {
    expect(findNextSubtitleTextMatch("Hello\nhello again\nOther", "hello", 20)).toEqual({ start: 0, end: 5 });
  });

  it("replaces all text matches and reports the replacement count", () => {
    expect(replaceSubtitleTextMatches("Hello\nhello again\nOther", "hello", "Hi")).toEqual({
      content: "Hi\nHi again\nOther",
      replacedCount: 2
    });
  });

  it("replaces regex matches with capture groups", () => {
    expect(replaceSubtitleTextMatches("Episode 12\nEpisode 13", "Episode (\\d+)", "Part $1", { regex: true })).toEqual({
      content: "Part 12\nPart 13",
      replacedCount: 2
    });
  });

  it("counts matches only in SRT cue text when subtitle structure is present", () => {
    expect(
      findSubtitleTextMatches("1\n00:00:01,000 --> 00:00:02,000\nLine 1\n", "1")
    ).toBe(1);
  });

  it("replaces matches only in VTT cue text when subtitle structure is present", () => {
    expect(
      replaceSubtitleTextMatches("WEBVTT\n\n00:00.000 --> 00:01.000\nWEBVTT cue\n", "WEBVTT", "Caption")
    ).toEqual({
      content: "WEBVTT\n\n00:00.000 --> 00:01.000\nCaption cue\n",
      replacedCount: 1
    });
  });

  it("replaces matches only in ASS dialogue text fields", () => {
    expect(
      replaceSubtitleTextMatches(
        "Dialogue: 0,0:00:01.00,0:00:02.00,Default,,0,0,0,,Default text\n",
        "Default",
        "Caption"
      )
    ).toEqual({
      content: "Dialogue: 0,0:00:01.00,0:00:02.00,Default,,0,0,0,,Caption text\n",
      replacedCount: 1
    });
  });
  it("uses ASS event Format fields to replace only dialogue text when columns are reordered", () => {
    expect(
      replaceSubtitleTextMatches(
        "[Events]\nFormat: Start, End, Text, Style, Layer\nDialogue: 0:00:01.00,0:00:02.00,Default text,Default,0\n",
        "Default",
        "Caption"
      )
    ).toEqual({
      content: "[Events]\nFormat: Start, End, Text, Style, Layer\nDialogue: 0:00:01.00,0:00:02.00,Caption text,Default,0\n",
      replacedCount: 1
    });
  });

  it("rejects blank find text before changing content", () => {
    expect(() => replaceSubtitleTextMatches("Hello", " ", "Hi")).toThrow("Find text is required.");
  });

  it("rejects invalid regex find text before changing content", () => {
    expect(() => replaceSubtitleTextMatches("Hello", "(", "Hi", { regex: true })).toThrow("Invalid regular expression.");
  });

  it("auto-fixes SRT numbering, inverted timing, and cue whitespace", () => {
    expect(autoFixSubtitleText("3\n00:00:03,000 --> 00:00:01,000\n  Hello  \n\n\n8\n00:00:04,000 --> 00:00:05,000\nWorld\n")).toEqual({
      content: "1\n00:00:01,000 --> 00:00:03,000\nHello\n\n2\n00:00:04,000 --> 00:00:05,000\nWorld\n",
      fixedCount: 5
    });
  });

  it("auto-fixes VTT cue timing and whitespace without changing the header", () => {
    expect(autoFixSubtitleText("WEBVTT\n\n00:00.900 --> 00:00.100\n  Hello  \n")).toEqual({
      content: "WEBVTT\n\n00:00.100 --> 00:00.900\nHello\n",
      fixedCount: 2
    });
  });
  it("auto-fixes reordered ASS Start, End, and Text fields without changing Style", () => {
    expect(
      autoFixSubtitleText(
        "[Events]\nFormat: Text, End, Start, Style\nDialogue:   Hello  ,0:00:01.00,0:00:03.00,Default\n"
      )
    ).toEqual({
      content: "[Events]\nFormat: Text, End, Start, Style\nDialogue: Hello,0:00:03.00,0:00:01.00,Default\n",
      fixedCount: 2
    });
  });

  it("shifts SRT cue timestamps by milliseconds", () => {
    expect(
      shiftSubtitleTiming("1\n00:00:01,000 --> 00:00:02,250\nHello\n", 1500)
    ).toEqual({
      content: "1\n00:00:02,500 --> 00:00:03,750\nHello\n",
      shiftedCount: 2
    });
  });

  it("shifts VTT cue timestamps and clamps negative results to zero", () => {
    expect(
      shiftSubtitleTiming("WEBVTT\n\n00:00.400 --> 00:02.000\nHello\n", -800)
    ).toEqual({
      content: "WEBVTT\n\n00:00.000 --> 00:01.200\nHello\n",
      shiftedCount: 2
    });
  });

  it("shifts ASS dialogue timestamps by milliseconds", () => {
    expect(
      shiftSubtitleTiming("Dialogue: 0,0:00:01.00,0:00:02.50,Default,,0,0,0,,Hello\n", 1500)
    ).toEqual({
      content: "Dialogue: 0,0:00:02.50,0:00:04.00,Default,,0,0,0,,Hello\n",
      shiftedCount: 2
    });
  });
  it("uses ASS event Format fields to shift only Start and End timestamps", () => {
    expect(
      shiftSubtitleTiming(
        "[Events]\nFormat: Text, End, Start, Style\nDialogue: mention 0:00:05.00,0:00:02.00,0:00:01.00,Default\n",
        1000
      )
    ).toEqual({
      content: "[Events]\nFormat: Text, End, Start, Style\nDialogue: mention 0:00:05.00,0:00:03.00,0:00:02.00,Default\n",
      shiftedCount: 2
    });
  });

  it("syncs SRT cue timestamps to two calibration points", () => {
    expect(
      syncSubtitleTimingToTwoPoints("1\n00:00:01,000 --> 00:00:02,000\nHello\n", {
        sourceA: 1000,
        targetA: 2000,
        sourceB: 3000,
        targetB: 6000
      })
    ).toEqual({
      content: "1\n00:00:02,000 --> 00:00:04,000\nHello\n",
      syncedCount: 2
    });
  });

  it("syncs ASS dialogue timestamps to two calibration points", () => {
    expect(
      syncSubtitleTimingToTwoPoints("Dialogue: 0,0:00:01.00,0:00:02.00,Default,,0,0,0,,Hello\n", {
        sourceA: 1000,
        targetA: 2000,
        sourceB: 3000,
        targetB: 6000
      })
    ).toEqual({
      content: "Dialogue: 0,0:00:02.00,0:00:04.00,Default,,0,0,0,,Hello\n",
      syncedCount: 2
    });
  });

  it("rejects two-point sync when source points are the same", () => {
    expect(() =>
      syncSubtitleTimingToTwoPoints("00:00.000 --> 00:01.000", {
        sourceA: 1000,
        targetA: 2000,
        sourceB: 1000,
        targetB: 5000
      })
    ).toThrow("Source sync points must be different.");
  });

  it("cleans SRT timeline order, duplicate cues, numbering, and overlaps", () => {
    expect(
      cleanupSubtitleTimeline(
        "7\n00:00:05,000 --> 00:00:06,000\nSecond\n\n3\n00:00:01,000 --> 00:00:03,000\nFirst\n\n4\n00:00:01,000 --> 00:00:03,000\nFirst\n\n9\n00:00:02,500 --> 00:00:04,000\nOverlap\n"
      )
    ).toEqual({
      content:
        "1\n00:00:01,000 --> 00:00:03,000\nFirst\n\n2\n00:00:03,001 --> 00:00:04,000\nOverlap\n\n3\n00:00:05,000 --> 00:00:06,000\nSecond\n",
      cleanedCount: 9,
      removedDuplicateCount: 1,
      adjustedOverlapCount: 1,
      sortedCueCount: 3,
      renumberedCount: 3
    });
  });

  it("cleans VTT timelines while preserving header and cue settings", () => {
    expect(
      cleanupSubtitleTimeline("WEBVTT\n\n00:00.500 --> 00:01.000 align:start\nFirst\n\n00:00.250 --> 00:00.750\nEarly\n")
    ).toEqual({
      content: "WEBVTT\n\n00:00.250 --> 00:00.750\nEarly\n\n00:00.751 --> 00:01.000 align:start\nFirst\n",
      cleanedCount: 4,
      removedDuplicateCount: 0,
      adjustedOverlapCount: 1,
      sortedCueCount: 2,
      renumberedCount: 0
    });
  });
});
