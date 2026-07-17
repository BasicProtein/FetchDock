import { describe, expect, it } from "vitest";
import { filterCommands } from "../src/lib/commandPalette";
import { isRouteId, navItems } from "../src/lib/navigation";

describe("navigation shell", () => {
  it("defines the required module A shell routes", () => {
    expect(navItems.map((item) => item.id)).toEqual([
      "home",
      "downloads",
      "tools",
      "channels",
      "courses",
      "learning",
      "telegram",
      "settings",
      "plugins",
      "legal",
      "about"
    ]);
  });

  it("validates route identifiers", () => {
    expect(isRouteId("downloads")).toBe(true);
    expect(isRouteId("legal")).toBe(true);
    expect(isRouteId("unknown")).toBe(false);
  });

  it("filters command palette actions", () => {
    const routesFor = (query: string) => filterCommands(query).map((item) => item.route);
    expect(routesFor("plugin")).toContain("plugins");
    expect(routesFor("platform")).toContain("tools");
    expect(routesFor("support matrix")).toContain("tools");
    expect(routesFor("clip")).toContain("tools");
    expect(routesFor("metadata")).toContain("tools");
    expect(routesFor("thumbnail")).toContain("tools");
    expect(routesFor("subtitles")).toContain("tools");
    expect(routesFor("comments")).toContain("tools");
    expect(routesFor("shot")).toContain("tools");
    expect(routesFor("waveform")).toContain("tools");
    expect(routesFor("subtitle workshop")).toContain("tools");
    expect(routesFor("review-cards")).toContain("learning");
    expect(routesFor("spaced-review")).toContain("learning");
  });
});
