import type { SaveMetadataThumbnailRequest, ThumbnailOption } from "./api";

export type PickedThumbnailSave = Pick<SaveMetadataThumbnailRequest, "url" | "fileName">;

export function thumbnailKey(option: ThumbnailOption): string {
  return option.url;
}

export function pickThumbnailToSave(options: ThumbnailOption[], selectedKey: string): PickedThumbnailSave | null {
  const selectedOption = options.find((option) => thumbnailKey(option) === selectedKey);
  if (!selectedOption) {
    return null;
  }

  return {
    url: selectedOption.url,
    fileName: thumbnailFileName(selectedOption)
  };
}

function thumbnailFileName(option: ThumbnailOption): string {
  const sourceName = option.id?.trim() || option.url.split(/[?#]/)[0].split("/").filter(Boolean).pop() || "thumbnail";
  const hasExtension = /\.[a-z0-9]{2,5}$/i.test(sourceName);
  return hasExtension ? sourceName : `${sourceName}.jpg`;
}
