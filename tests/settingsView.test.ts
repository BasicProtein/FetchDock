import { describe, expect, it } from "vitest";
import { isSettingsSectionHighlighted, settingsSearchSummary, uniqueTrimmedList } from "../src/lib/settingsView";

const results = [
  {
    schema_version: 1,
    section_id: "dependencies",
    title: "Dependencies",
    description: "Downloader tool detection.",
    keywords: ["dependency", "yt-dlp"]
  }
] as const;

describe("settings view helpers", () => {
  it("highlights sections returned by settings search", () => {
    expect(isSettingsSectionHighlighted("dependencies", results)).toBe(true);
    expect(isSettingsSectionHighlighted("downloads", results)).toBe(false);
  });

  it("summarizes settings search results without implying unavailable sections", () => {
    expect(settingsSearchSummary("", [])).toBe("");
    expect(settingsSearchSummary("cookies", [])).toBe("No implemented settings match cookies.");
    expect(settingsSearchSummary("dependency", results)).toBe("1 implemented setting matches dependency.");
  });

  it("trims subtitle language lists without keeping duplicates or blanks", () => {
    expect(uniqueTrimmedList([" en ", "", "zh-Hans", "en", " ja "])).toEqual(["en", "zh-Hans", "ja"]);
  });
});
