import type { SaveMetadataSubtitleRequest, SubtitleOption } from "./api";

export type PickedSubtitleSave = Pick<SaveMetadataSubtitleRequest, "language" | "format" | "isAuto">;

export function subtitleKey(option: SubtitleOption): string {
  return `${option.is_auto ? "auto" : "manual"}:${option.language}`;
}

export function subtitleLanguageFromKey(key: string): string {
  return key.split(":").slice(1).join(":").trim();
}

export function subtitleSelectionUsesAuto(keys: string[]): boolean {
  return keys.some((key) => key.startsWith("auto:"));
}

export function pickSubtitleToSave(options: SubtitleOption[], selectedKeys: string[]): PickedSubtitleSave | null {
  const selectedKeySet = new Set(selectedKeys);
  const selectedOption = options.find((option) => selectedKeySet.has(subtitleKey(option)) && option.formats.length > 0);
  if (!selectedOption) {
    return null;
  }

  return {
    language: selectedOption.language,
    format: selectedOption.formats[0],
    isAuto: selectedOption.is_auto
  };
}
