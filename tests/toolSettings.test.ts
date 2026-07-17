import { describe, expect, it } from "vitest";
import { getToolInstallAction, getToolInstallDetail } from "../src/lib/toolSettings";

describe("dependency settings view helpers", () => {
  it("shows an installing state only for the active install request", () => {
    const missingTool = {
      id: "gallery-dl",
      state: "missing",
      path: null,
      managed: false,
      updatable: true
    } as const;

    expect(getToolInstallAction(missingTool, "gallery-dl")).toEqual({
      label: "Installing",
      disabled: true
    });
    expect(getToolInstallAction(missingTool, "")).toEqual({
      label: "Install",
      disabled: false
    });
  });

  it("keeps install unavailable for tools already resolved by path or state", () => {
    expect(
      getToolInstallAction(
        {
          id: "yt-dlp",
          state: "installed",
          path: "E:/tools/yt-dlp.exe",
          managed: false,
          updatable: true
        },
        ""
      )
    ).toEqual({
      label: "Installed",
      disabled: true
    });

    expect(
      getToolInstallAction(
        {
          id: "ffmpeg",
          state: "missing",
          path: "E:/tools/ffmpeg.exe",
          managed: false,
          updatable: false
        },
        ""
      )
    ).toEqual({
      label: "Path set",
      disabled: true
    });
  });

  it("offers update for installed managed tools with an update source", () => {
    expect(
      getToolInstallAction(
        {
          id: "yt-dlp",
          state: "installed",
          path: "E:/Data/FetchDock/data/dependencies/yt-dlp/yt-dlp.exe",
          managed: true,
          updatable: true
        },
        ""
      )
    ).toEqual({
      label: "Update",
      disabled: false
    });

    expect(
      getToolInstallAction(
        {
          id: "yt-dlp",
          state: "installed",
          path: "E:/Data/FetchDock/data/dependencies/yt-dlp/yt-dlp.exe",
          managed: true,
          updatable: true
        },
        "yt-dlp"
      )
    ).toEqual({
      label: "Updating",
      disabled: true
    });
  });

  it("prefers backend install progress detail over idle tool errors", () => {
    expect(
      getToolInstallDetail(
        {
          id: "ffmpeg",
          state: "error",
          error: "previous install failed"
        },
        {
          tool_id: "ffmpeg",
          stage: "verifying",
          message: "Verifying built-in dependency artifact.",
          updated_at: "2026-07-11T00:00:00Z",
          schema_version: 1
        }
      )
    ).toEqual({
      text: "Verifying built-in dependency artifact.",
      level: "info"
    });

    expect(
      getToolInstallDetail(
        {
          id: "ffmpeg",
          state: "error",
          error: "verification failed"
        },
        {
          tool_id: "ffmpeg",
          stage: "failed",
          message: "Dependency install failed.",
          error: "hash mismatch",
          updated_at: "2026-07-11T00:00:00Z",
          schema_version: 1
        }
      )
    ).toEqual({
      text: "hash mismatch",
      level: "error"
    });
  });
});
