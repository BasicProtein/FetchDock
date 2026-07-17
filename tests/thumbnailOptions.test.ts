import { describe, expect, it } from "vitest";

import { pickThumbnailToSave, thumbnailKey } from "../src/lib/thumbnailOptions";

const options = [
  {
    id: "default",
    url: "https://img.example/default.jpg",
    width: 120,
    height: 90,
    preference: -10
  },
  {
    id: "hqdefault",
    url: "https://img.example/hqdefault.jpg",
    width: 480,
    height: 360,
    preference: 1
  }
];

describe("thumbnail options", () => {
  it("uses the thumbnail URL as a stable selection key", () => {
    expect(thumbnailKey(options[1])).toBe("https://img.example/hqdefault.jpg");
  });

  it("picks the selected thumbnail URL for saving", () => {
    expect(pickThumbnailToSave(options, thumbnailKey(options[1]))).toEqual({
      url: "https://img.example/hqdefault.jpg",
      fileName: "hqdefault.jpg"
    });
  });
});
