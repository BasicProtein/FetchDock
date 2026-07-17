import { describe, expect, it } from "vitest";

import { pickSubtitleToSave, subtitleKey } from "../src/lib/subtitleOptions";

describe("subtitle options", () => {
  it("picks the first selected subtitle option with its first available format", () => {
    const options = [
      {
        language: "en",
        name: "English",
        formats: ["vtt", "ttml"],
        is_auto: false
      },
      {
        language: "ja",
        name: "Japanese auto",
        formats: ["srv3", "vtt"],
        is_auto: true
      }
    ];

    expect(pickSubtitleToSave(options, [subtitleKey(options[1])])).toEqual({
      language: "ja",
      format: "srv3",
      isAuto: true
    });
  });

  it("returns null when no selected subtitle has a format", () => {
    expect(
      pickSubtitleToSave(
        [
          {
            language: "en",
            name: "English",
            formats: [],
            is_auto: false
          }
        ],
        ["manual:en"]
      )
    ).toBeNull();
  });
});
