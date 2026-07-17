import type { SettingsSearchResult } from "./api";

export function isSettingsSectionHighlighted(
  sectionId: string,
  results: readonly Pick<SettingsSearchResult, "section_id">[]
): boolean {
  return results.some((result) => result.section_id === sectionId);
}

export function settingsSearchSummary(
  query: string,
  results: readonly Pick<SettingsSearchResult, "section_id">[]
): string {
  const trimmed = query.trim();
  if (!trimmed) {
    return "";
  }

  if (results.length === 0) {
    return `No implemented settings match ${trimmed}.`;
  }

  const noun = results.length === 1 ? "setting" : "settings";
  const verb = results.length === 1 ? "matches" : "match";
  return `${results.length} implemented ${noun} ${verb} ${trimmed}.`;
}

export function uniqueTrimmedList(values: readonly string[]): string[] {
  const result: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (trimmed && !result.includes(trimmed)) {
      result.push(trimmed);
    }
  }
  return result;
}
