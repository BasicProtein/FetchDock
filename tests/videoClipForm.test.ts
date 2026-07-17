import { describe, expect, it } from "vitest";

import { buildClipVideoRequest, clipReencodeProfiles } from "../src/lib/videoClipForm";

describe("video clip form", () => {
  it("trims paths and converts optional second inputs into a clip request", () => {
    expect(
      buildClipVideoRequest({
        inputPath: " C:/Media/source.mp4 ",
        outputPath: " C:/Downloads/clip.mp4 ",
        mode: "reencode",
        videoCodec: " libx264 ",
        audioCodec: " aac ",
        crf: " 23 ",
        preset: " medium ",
        startSeconds: " 3.5 ",
        endSeconds: "9"
      })
    ).toEqual({
      inputPath: "C:/Media/source.mp4",
      outputPath: "C:/Downloads/clip.mp4",
      mode: "reencode",
      videoCodec: "libx264",
      audioCodec: "aac",
      crf: 23,
      preset: "medium",
      startSeconds: 3.5,
      endSeconds: 9
    });
  });

  it("omits blank optional second inputs", () => {
    expect(
      buildClipVideoRequest({
        inputPath: "C:/Media/source.mp4",
        outputPath: "C:/Downloads/clip.mp4",
        mode: "copy",
        videoCodec: "",
        audioCodec: "",
        crf: "",
        preset: "",
        startSeconds: "",
        endSeconds: " "
      })
    ).toEqual({
      inputPath: "C:/Media/source.mp4",
      outputPath: "C:/Downloads/clip.mp4"
    });
  });

  it("rejects invalid ranges before invoking the backend", () => {
    expect(() =>
      buildClipVideoRequest({
        inputPath: "C:/Media/source.mp4",
        outputPath: "C:/Downloads/clip.mp4",
        mode: "copy",
        videoCodec: "",
        audioCodec: "",
        crf: "",
        preset: "",
        startSeconds: "10",
        endSeconds: "4"
      })
    ).toThrow("End seconds must be greater than start seconds.");
  });

  it("rejects invalid CRF values before invoking the backend", () => {
    expect(() =>
      buildClipVideoRequest({
        inputPath: "C:/Media/source.mp4",
        outputPath: "C:/Downloads/clip.mp4",
        mode: "reencode",
        videoCodec: "libx264",
        audioCodec: "aac",
        crf: "80",
        preset: "medium",
        startSeconds: "",
        endSeconds: ""
      })
    ).toThrow("CRF must be between 0 and 51.");
  });

  it("maps built-in reencode profiles to explicit FFmpeg options", () => {
    expect(clipReencodeProfiles.map((profile) => profile.id)).toContain("h265_compact");
    expect(
      buildClipVideoRequest({
        inputPath: "C:/Media/source.mp4",
        outputPath: "C:/Downloads/clip.mp4",
        mode: "reencode",
        profile: "h265_compact",
        videoCodec: "",
        audioCodec: "",
        crf: "",
        preset: "",
        startSeconds: "1",
        endSeconds: "2"
      })
    ).toEqual({
      inputPath: "C:/Media/source.mp4",
      outputPath: "C:/Downloads/clip.mp4",
      mode: "reencode",
      videoCodec: "libx265",
      audioCodec: "aac",
      crf: 28,
      preset: "slow",
      startSeconds: 1,
      endSeconds: 2
    });
  });

  it("keeps manual reencode options when the custom profile is selected", () => {
    expect(
      buildClipVideoRequest({
        inputPath: "C:/Media/source.mp4",
        outputPath: "C:/Downloads/clip.mp4",
        mode: "reencode",
        profile: "custom",
        videoCodec: " libvpx-vp9 ",
        audioCodec: " libopus ",
        crf: " 32 ",
        preset: " ",
        startSeconds: "",
        endSeconds: ""
      })
    ).toEqual({
      inputPath: "C:/Media/source.mp4",
      outputPath: "C:/Downloads/clip.mp4",
      mode: "reencode",
      videoCodec: "libvpx-vp9",
      audioCodec: "libopus",
      crf: 32
    });
  });
});
