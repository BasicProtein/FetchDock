import { describe, expect, it } from "vitest";
import {
  classifyUrlCandidate,
  extractBatchUrls,
  extractCapturedTitle,
  extractCapturedUrl,
  extractFirstHttpUrl,
  extractHttpUrls,
  inferTaskKindForUrl,
  recommendedTaskKindForUrl
} from "../src/lib/capture";

describe("capture URL helpers", () => {
  it("extracts nested URL payloads from protocol links", () => {
    expect(extractCapturedUrl("fetchdock://capture?url=https%3A%2F%2Fexample.com%2Ffile.zip")).toBe(
      "https://example.com/file.zip"
    );
  });

  it("extracts optional title payloads from protocol links", () => {
    expect(extractCapturedTitle("fetchdock://capture?url=https%3A%2F%2Fexample.com&title=Readable%20title")).toBe(
      "Readable title"
    );
    expect(extractCapturedTitle("https://example.com/file.zip")).toBe("");
  });

  it("extracts the first http URL from clipboard text", () => {
    expect(extractFirstHttpUrl("notes https://example.com/first.zip and https://example.com/second.zip")).toBe(
      "https://example.com/first.zip"
    );
    expect(extractFirstHttpUrl("Open this: https://example.com/file.zip.")).toBe("https://example.com/file.zip");
    expect(extractCapturedUrl("https://example.com/file.pdf,")).toBe("https://example.com/file.pdf");
    expect(extractFirstHttpUrl("local note without a link")).toBe("");
  });

  it("extracts multiple http URLs from one pasted line", () => {
    expect(extractHttpUrls("mirrors: (https://example.com/a.zip), <https://example.com/b.zip>; and fetchdock://capture?u=https%3A%2F%2Fexample.com%2Fc.zip")).toEqual([
      "https://example.com/a.zip",
      "https://example.com/b.zip",
      "https://example.com/c.zip"
    ]);
  });

  it("classifies known capture URLs without claiming metadata support", () => {
    expect(classifyUrlCandidate("https://www.youtube.com/watch?v=abc")).toMatchObject({
      label: "YouTube",
      platform: "youtube",
      kind: "known_platform"
    });
    expect(classifyUrlCandidate("https://bsky.app/profile/user.example/post/1")).toMatchObject({
      label: "Bluesky",
      platform: "bluesky",
      kind: "known_platform"
    });
    expect(classifyUrlCandidate("https://example.com/files/archive.zip")).toMatchObject({
      label: "Direct file",
      platform: "direct_file",
      kind: "direct_file"
    });
    expect(classifyUrlCandidate("https://example.com/article")).toMatchObject({
      label: "Generic web URL",
      platform: "generic",
      kind: "generic"
    });
    expect(classifyUrlCandidate("not a url")).toBeNull();
  });

  it("recommends a safer Home task mode from URL classification without overriding special flows", () => {
    expect(recommendedTaskKindForUrl("https://example.com/book.epub", "video")).toBe("book");
    expect(recommendedTaskKindForUrl("https://example.com/manual.pdf", "video")).toBe("pdf");
    expect(recommendedTaskKindForUrl("https://www.pinterest.com/example/board/", "video")).toBe("image");
    expect(recommendedTaskKindForUrl("https://www.youtube.com/playlist?list=PL123", "video")).toBe("playlist");
    expect(recommendedTaskKindForUrl("https://example.com/book.epub", "audio")).toBeNull();
    expect(recommendedTaskKindForUrl("https://example.com/book.epub", "torrent")).toBeNull();
    expect(inferTaskKindForUrl("https://example.com/book.epub", "video")).toBe("book");
  });

  it("extracts batch URLs one per line and drops blanks", () => {
    expect(extractBatchUrls(" https://example.com/a.zip https://example.com/d.zip \n\nmirror: https://example.com/c.zip.\nfetchdock://capture?u=https%3A%2F%2Fexample.com%2Fb.zip")).toEqual([
      "https://example.com/a.zip",
      "https://example.com/d.zip",
      "https://example.com/c.zip",
      "https://example.com/b.zip"
    ]);
  });
});
