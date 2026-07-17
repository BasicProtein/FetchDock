import { describe, expect, it } from "vitest";
import { filterDownloadsByDateRange, filterDownloadsByStatus, sortDownloads } from "../src/lib/downloadsView";

const tasks = [
  { id: "queued", status: "queued" },
  { id: "completed", status: "completed" },
  { id: "failed", status: "failed" }
];

describe("downloads view helpers", () => {
  it("filters downloads by selected status", () => {
    expect(filterDownloadsByStatus(tasks, "all").map((task) => task.id)).toEqual(["queued", "completed", "failed"]);
    expect(filterDownloadsByStatus(tasks, "completed").map((task) => task.id)).toEqual(["completed"]);
    expect(filterDownloadsByStatus(tasks, "active")).toEqual([]);
  });

  it("sorts downloads by platform", () => {
    expect(
      sortDownloads(
        [
          { id: "b", platform: "youtube" },
          { id: "a", platform: "direct_file" }
        ],
        "platform_asc"
      ).map((task) => task.id)
    ).toEqual(["a", "b"]);
  });

  it("filters downloads by updated date range", () => {
    expect(
      filterDownloadsByDateRange(
        [
          { id: "old", updated_at: "2026-07-14T10:00:00Z" },
          { id: "new", updated_at: "2026-07-16T10:00:00Z" }
        ],
        "2026-07-16",
        "",
        "updated"
      ).map((task) => task.id)
    ).toEqual(["new"]);
  });
});
