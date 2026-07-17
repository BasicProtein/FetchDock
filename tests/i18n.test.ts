import { describe, expect, it } from "vitest";
import { normalizeLanguage, translate } from "../src/lib/i18n";

describe("i18n helpers", () => {
  it("normalizes supported and unsupported language tags", () => {
    expect(normalizeLanguage("zh-CN")).toBe("zh-CN");
    expect(normalizeLanguage("unknown")).toBe("en");
    expect(normalizeLanguage("")).toBe("en");
  });

  it("translates route labels and interpolated command text", () => {
    expect(translate("zh-CN", "nav.downloads")).toBe("下载");
    expect(translate("zh-CN", "nav.legal")).toBe("法务");
    expect(translate("zh-CN", "command.goTo", { label: "设置" })).toBe("前往设置");
    expect(translate("en", "command.goTo", { label: "Settings" })).toBe("Go to Settings");
  });

  it("falls back to English when a partial dictionary misses a key", () => {
    expect(translate("es", "button.search")).toBe("Search");
  });
});
