import { describe, expect, it } from "vitest";

import { buildTaskCreateOptions, normalizeAudioFormat } from "../src/lib/taskCreateOptions";

describe("task create options", () => {
  it("uses the selected audio format only for audio tasks", () => {
    expect(
      buildTaskCreateOptions({
        kind: "audio",
        outputDir: " C:/Downloads ",
        userAgent: " FetchDock/Test ",
        referer: " https://example.com/watch ",
        proxy: " socks5://127.0.0.1:1080 ",
        rateLimit: " 1M ",
        liveFromStart: true,
        concurrentFragments: " 4 ",
        audioFormat: "flac",
        selectedFormatId: ""
      })
    ).toEqual({
      kind: "audio",
      outputDir: "C:/Downloads",
      userAgent: "FetchDock/Test",
      referer: "https://example.com/watch",
      proxy: "socks5://127.0.0.1:1080",
      rateLimit: "1M",
      liveFromStart: true,
      concurrentFragments: 4,
      audioFormat: "flac"
    });

    expect(
      buildTaskCreateOptions({
        kind: "video",
        outputDir: "",
        userAgent: "",
        referer: "",
        proxy: "",
        rateLimit: "",
        liveFromStart: false,
        concurrentFragments: "",
        audioFormat: "mp3",
        selectedFormatId: ""
      })
    ).toEqual({
      kind: "video",
      outputDir: undefined,
      userAgent: undefined,
      referer: undefined,
      proxy: undefined,
      rateLimit: undefined,
      audioFormat: undefined
    });
  });

  it("uses a selected preview format as the video task quality", () => {
    expect(
      buildTaskCreateOptions({
        kind: "video",
        outputDir: "",
        userAgent: "",
        referer: "",
        proxy: "",
        rateLimit: "",
        liveFromStart: false,
        concurrentFragments: "",
        audioFormat: "m4a",
        selectedFormatId: " 18 "
      })
    ).toEqual({
      kind: "video",
      outputDir: undefined,
      userAgent: undefined,
      referer: undefined,
      proxy: undefined,
      rateLimit: undefined,
      audioFormat: undefined,
      quality: "18"
    });

    expect(
      buildTaskCreateOptions({
        kind: "audio",
        outputDir: "",
        userAgent: "",
        referer: "",
        proxy: "",
        rateLimit: "",
        liveFromStart: false,
        concurrentFragments: "",
        audioFormat: "opus",
        selectedFormatId: "251"
      }).quality
    ).toBeUndefined();
  });

  it("builds subtitles-only task options without media format choices", () => {
    expect(
      buildTaskCreateOptions({
        kind: "subtitles_only",
        outputDir: "",
        userAgent: "",
        referer: "",
        proxy: "",
        rateLimit: "",
        liveFromStart: false,
        concurrentFragments: "",
        audioFormat: "opus",
        selectedFormatId: "18"
      })
    ).toEqual({
      kind: "subtitles_only",
      outputDir: undefined,
      userAgent: undefined,
      referer: undefined,
      proxy: undefined,
      rateLimit: undefined,
      audioFormat: undefined,
      quality: undefined
    });
  });

  it("uses selected subtitle languages only for subtitles-only tasks", () => {
    expect(
      buildTaskCreateOptions({
        kind: "subtitles_only",
        outputDir: "",
        userAgent: "",
        referer: "",
        proxy: "",
        rateLimit: "",
        liveFromStart: false,
        concurrentFragments: "",
        audioFormat: "opus",
        selectedFormatId: "",
        subtitleLanguages: [" en ", "zh-Hans", "en", ""],
        subtitleAuto: true,
        subtitleEmbed: false,
        subtitleKeepVtt: true
      })
    ).toEqual({
      kind: "subtitles_only",
      outputDir: undefined,
      userAgent: undefined,
      referer: undefined,
      audioFormat: undefined,
      quality: undefined,
      subtitles: {
        languages: ["en", "zh-Hans"],
        auto: true,
        embed: false,
        keep_vtt: true
      }
    });

    expect(
      buildTaskCreateOptions({
        kind: "video",
        outputDir: "",
        userAgent: "",
        referer: "",
        proxy: "",
        rateLimit: "",
        liveFromStart: false,
        concurrentFragments: "",
        audioFormat: "m4a",
        selectedFormatId: "",
        subtitleLanguages: ["en"],
        subtitleAuto: true,
        subtitleEmbed: true,
        subtitleKeepVtt: true
      }).subtitles
    ).toBeUndefined();
  });

  it("falls back to m4a for unsupported audio formats", () => {
    expect(normalizeAudioFormat("aac")).toBe("m4a");
    expect(normalizeAudioFormat("OPUS")).toBe("opus");
  });
});
