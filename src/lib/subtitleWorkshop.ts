export interface SubtitleReplaceResult {
  content: string;
  replacedCount: number;
}

export interface SubtitleFindOptions {
  regex?: boolean;
}

export interface SubtitleAutoFixResult {
  content: string;
  fixedCount: number;
}

export interface SubtitleTextMatch {
  start: number;
  end: number;
}

export interface SubtitleCueTimingRange {
  startMilliseconds: number;
  endMilliseconds: number;
}

export interface SubtitleCueTextRange {
  start: number;
  end: number;
}

export interface SubtitleTimingShiftResult {
  content: string;
  shiftedCount: number;
}

export interface SubtitleTwoPointSyncInput {
  sourceA: number;
  targetA: number;
  sourceB: number;
  targetB: number;
}

export interface SubtitleTwoPointSyncResult {
  content: string;
  syncedCount: number;
}

export interface SubtitleTimelineCleanupResult {
  content: string;
  cleanedCount: number;
  removedDuplicateCount: number;
  adjustedOverlapCount: number;
  sortedCueCount: number;
  renumberedCount: number;
}

export type SubtitleWorkshopFormat = "srt" | "vtt" | "ass";

export interface SubtitleFormatConversionResult {
  content: string;
  converted: boolean;
  fromFormat: SubtitleWorkshopFormat;
  toFormat: SubtitleWorkshopFormat;
  cueCount: number;
}

interface SubtitleTextLine {
  text: string;
  ending: string;
}

interface LiteralReplaceResult {
  content: string;
  count: number;
}

interface SubtitleTextSegment {
  start: number;
  end: number;
}

interface SubtitleCueBlock {
  index?: string;
  timing: string;
  textLines: string[];
}

interface AssEventFormat {
  fields: string[];
  textIndex: number | null;
  startIndex: number | null;
  endIndex: number | null;
}

interface SubtitleCueTextCandidate {
  timing: SubtitleCueTimingRange;
  textRange: SubtitleCueTextRange;
}

interface SubtitleTimelineCue {
  index?: string;
  identifierLines: string[];
  startMilliseconds: number;
  endMilliseconds: number;
  separator: string;
  keepHourField: boolean;
  settings: string;
  textLines: string[];
  originalOrder: number;
}

interface SubtitleCueForConversion {
  startMilliseconds: number;
  endMilliseconds: number;
  settings: string;
  textLines: string[];
  identifierLines: string[];
}

export function findSubtitleTextMatches(content: string, findText: string, options: SubtitleFindOptions = {}): number {
  return listSubtitleTextMatches(content, findText, options).length;
}

export function listSubtitleTextMatches(
  content: string,
  findText: string,
  options: SubtitleFindOptions = {}
): SubtitleTextMatch[] {
  const needle = normalizedFindText(findText);
  if (!needle) {
    return [];
  }

  const matcher = createSubtitleMatcher(needle, options);
  const segments = subtitleTextSegments(content);
  return segments.flatMap((segment) =>
    matcher.listMatches(content.slice(segment.start, segment.end)).map((match) => ({
      start: segment.start + match.start,
      end: segment.start + match.end
    }))
  );
}

export function findNextSubtitleTextMatch(
  content: string,
  findText: string,
  cursorPosition: number,
  options: SubtitleFindOptions = {}
): SubtitleTextMatch | null {
  const matches = listSubtitleTextMatches(content, findText, options);
  if (matches.length === 0) {
    return null;
  }

  const safeCursorPosition = Math.max(0, Math.min(content.length, Math.floor(cursorPosition)));
  return matches.find((match) => match.start >= safeCursorPosition) ?? matches[0];
}

export function findSubtitleCueTimingAtPosition(
  content: string,
  cursorPosition: number
): SubtitleCueTimingRange | null {
  const safeCursorPosition = Math.max(0, Math.min(content.length, Math.floor(cursorPosition)));
  return findAssCueTimingAtPosition(content, safeCursorPosition) ?? findTimedCueTimingAtPosition(content, safeCursorPosition);
}

export function findSubtitleCueTextRangeAtTime(
  content: string,
  timestampMilliseconds: number
): SubtitleCueTextRange | null {
  if (!Number.isFinite(timestampMilliseconds)) {
    return null;
  }

  return findAssCueTextRangeAtTime(content, timestampMilliseconds) ?? findTimedCueTextRangeAtTime(content, timestampMilliseconds);
}

export function findNearestSubtitleCueTextRangeAtTime(
  content: string,
  timestampMilliseconds: number
): SubtitleCueTextRange | null {
  if (!Number.isFinite(timestampMilliseconds)) {
    return null;
  }

  const candidates = collectAssCueTextCandidates(content);
  if (candidates.length === 0) {
    candidates.push(...collectTimedCueTextCandidates(content));
  }

  if (candidates.length === 0) {
    return null;
  }

  const exactCandidate = candidates.find((candidate) =>
    subtitleCueContainsTimestamp(candidate.timing, timestampMilliseconds)
  );
  if (exactCandidate) {
    return exactCandidate.textRange;
  }

  let nearest = candidates[0];
  let nearestDistance = subtitleCueDistanceFromTimestamp(nearest.timing, timestampMilliseconds);
  for (const candidate of candidates.slice(1)) {
    const distance = subtitleCueDistanceFromTimestamp(candidate.timing, timestampMilliseconds);
    if (
      distance < nearestDistance ||
      (distance === nearestDistance &&
        candidate.timing.startMilliseconds >= timestampMilliseconds &&
        nearest.timing.startMilliseconds < timestampMilliseconds)
    ) {
      nearest = candidate;
      nearestDistance = distance;
    }
  }

  return nearest.textRange;
}

export function replaceSubtitleTextMatches(
  content: string,
  findText: string,
  replacementText: string,
  options: SubtitleFindOptions = {}
): SubtitleReplaceResult {
  const needle = normalizedFindText(findText);
  if (!needle) {
    throw new Error("Find text is required.");
  }

  const matcher = createSubtitleMatcher(needle, options);
  const subtitleResult = mapSubtitleTextSegments(content, (segmentText) =>
    matcher.replaceMatches(segmentText, replacementText)
  );
  if (subtitleResult.usedSubtitleStructure) {
    return {
      content: subtitleResult.content,
      replacedCount: subtitleResult.count
    };
  }

  const result = matcher.replaceMatches(content, replacementText);
  return {
    content: result.content,
    replacedCount: result.count
  };
}

export function autoFixSubtitleText(content: string): SubtitleAutoFixResult {
  const assFix = autoFixAssSubtitleText(content);
  if (assFix.fixedCount > 0) {
    return assFix;
  }

  const lineEnding = content.includes("\r\n") ? "\r\n" : "\n";
  const normalizedContent = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const hasVttHeader = normalizedContent.startsWith("WEBVTT");
  const cueSection = hasVttHeader ? normalizedContent.replace(/^WEBVTT[^\n]*(?:\n+|$)/, "") : normalizedContent;
  const blocks = cueSection
    .split(/\n{2,}/)
    .map((block) => parseSubtitleCueBlock(block))
    .filter((block): block is SubtitleCueBlock => block !== null);

  if (blocks.length === 0) {
    return { content, fixedCount: 0 };
  }

  let fixedCount = 0;
  const nextBlocks = blocks.map((block, index) => {
    const nextIndex = String(index + 1);
    const isSrtCue = block.index !== undefined;
    const nextLines: string[] = [];

    if (isSrtCue) {
      if (block.index !== nextIndex) {
        fixedCount += 1;
      }
      nextLines.push(nextIndex);
    }

    const timingFix = normalizeSubtitleTimingLine(block.timing);
    if (timingFix.fixed) {
      fixedCount += 1;
    }
    nextLines.push(timingFix.timing);

    const trimmedTextLines = block.textLines.map((line) => line.trim());
    if (trimmedTextLines.some((line, lineIndex) => line !== block.textLines[lineIndex])) {
      fixedCount += 1;
    }
    nextLines.push(...trimmedTextLines);

    return nextLines.join(lineEnding);
  });

  const nextContent = `${hasVttHeader ? `WEBVTT${lineEnding}${lineEnding}` : ""}${nextBlocks.join(`${lineEnding}${lineEnding}`)}${lineEnding}`;
  if (nextContent !== content && content.includes("\n\n\n")) {
    fixedCount += 1;
  }

  return {
    content: nextContent,
    fixedCount
  };
}

function autoFixAssSubtitleText(content: string): SubtitleAutoFixResult {
  const lines = splitLinesPreservingEndings(content);
  let fixedCount = 0;
  let assEventFormat: AssEventFormat | null = null;
  let nextContent = "";

  for (const line of lines) {
    assEventFormat = parseAssEventFormat(line.text) ?? assEventFormat;
    const fixedLine = assEventFormat ? autoFixAssDialogueLine(line.text, assEventFormat) : { text: line.text, count: 0 };
    fixedCount += fixedLine.count;
    nextContent += fixedLine.text + line.ending;
  }

  return {
    content: fixedCount > 0 ? nextContent : content,
    fixedCount
  };
}

function autoFixAssDialogueLine(line: string, format: AssEventFormat): { text: string; count: number } {
  if (!/^\s*Dialogue\s*:/i.test(line)) {
    return { text: line, count: 0 };
  }

  const fields = splitAssEventFields(line, format.fields.length);
  if (!fields) {
    return { text: line, count: 0 };
  }

  let fixedCount = 0;
  const nextFields = [...fields];
  if (format.textIndex !== null) {
    const trimmedText = nextFields[format.textIndex].trim();
    if (trimmedText !== nextFields[format.textIndex]) {
      nextFields[format.textIndex] = trimmedText;
      fixedCount += 1;
    }
  }

  if (format.startIndex !== null && format.endIndex !== null) {
    const start = nextFields[format.startIndex].trim();
    const end = nextFields[format.endIndex].trim();
    const startMilliseconds = assTimestampToMilliseconds(start);
    const endMilliseconds = assTimestampToMilliseconds(end);
    if (startMilliseconds !== null && endMilliseconds !== null && startMilliseconds > endMilliseconds) {
      nextFields[format.startIndex] = end;
      nextFields[format.endIndex] = start;
      fixedCount += 1;
    }
  }

  if (fixedCount === 0) {
    return { text: line, count: 0 };
  }

  return {
    text: `${line.slice(0, line.indexOf(":") + 1)} ${nextFields.join(",")}`,
    count: fixedCount
  };
}

export function shiftSubtitleTiming(content: string, offsetMilliseconds: number): SubtitleTimingShiftResult {
  if (!Number.isFinite(offsetMilliseconds)) {
    throw new Error("Timing offset must be a finite number.");
  }

  const result = transformSubtitleTimestamps(content, (timestamp) => timestamp + offsetMilliseconds);

  return {
    content: result.content,
    shiftedCount: result.changedCount
  };
}

export function syncSubtitleTimingToTwoPoints(
  content: string,
  input: SubtitleTwoPointSyncInput
): SubtitleTwoPointSyncResult {
  for (const [label, value] of Object.entries(input)) {
    if (!Number.isFinite(value)) {
      throw new Error(`${label} must be a finite number.`);
    }
  }
  if (input.sourceA === input.sourceB) {
    throw new Error("Source sync points must be different.");
  }

  const scale = (input.targetB - input.targetA) / (input.sourceB - input.sourceA);
  const result = transformSubtitleTimestamps(
    content,
    (timestamp) => input.targetA + (timestamp - input.sourceA) * scale
  );

  return {
    content: result.content,
    syncedCount: result.changedCount
  };
}

export function cleanupSubtitleTimeline(content: string, minimumGapMilliseconds = 1): SubtitleTimelineCleanupResult {
  const normalizedGap = Math.max(0, Math.floor(Number.isFinite(minimumGapMilliseconds) ? minimumGapMilliseconds : 0));
  const lineEnding = content.includes("\r\n") ? "\r\n" : "\n";
  const normalizedContent = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const headerMatch = normalizedContent.match(/^WEBVTT[^\n]*(?:\n+|$)/);
  const header = headerMatch?.[0].replace(/\n+$/, "") ?? "";
  const cueSection = headerMatch ? normalizedContent.slice(headerMatch[0].length) : normalizedContent;
  const cues = cueSection
    .split(/\n{2,}/)
    .map((block, index) => parseSubtitleTimelineCue(block, index))
    .filter((cue): cue is SubtitleTimelineCue => cue !== null);

  if (cues.length === 0) {
    return {
      content,
      cleanedCount: 0,
      removedDuplicateCount: 0,
      adjustedOverlapCount: 0,
      sortedCueCount: 0,
      renumberedCount: 0
    };
  }

  const uniqueCues: SubtitleTimelineCue[] = [];
  const seenCueKeys = new Set<string>();
  let removedDuplicateCount = 0;
  for (const cue of cues) {
    const key = subtitleTimelineCueKey(cue);
    if (seenCueKeys.has(key)) {
      removedDuplicateCount += 1;
      continue;
    }
    seenCueKeys.add(key);
    uniqueCues.push({ ...cue });
  }

  const sortedCues = [...uniqueCues].sort(
    (left, right) =>
      left.startMilliseconds - right.startMilliseconds ||
      left.endMilliseconds - right.endMilliseconds ||
      left.originalOrder - right.originalOrder
  );
  const sortedCueCount = sortedCues.filter((cue, index) => cue.originalOrder !== uniqueCues[index]?.originalOrder).length;
  let adjustedOverlapCount = 0;
  for (let index = 1; index < sortedCues.length; index += 1) {
    const previous = sortedCues[index - 1];
    const cue = sortedCues[index];
    const minimumStart = previous.endMilliseconds + normalizedGap;
    if (cue.startMilliseconds < minimumStart) {
      cue.startMilliseconds = minimumStart;
      if (cue.endMilliseconds < cue.startMilliseconds) {
        cue.endMilliseconds = cue.startMilliseconds;
      }
      adjustedOverlapCount += 1;
    }
  }

  const srtLike = header.length === 0 && sortedCues.some((cue) => cue.index !== undefined);
  let renumberedCount = 0;
  const nextBlocks = sortedCues.map((cue, index) => {
    const lines: string[] = [];
    if (srtLike) {
      const nextIndex = String(index + 1);
      if (cue.index !== nextIndex) {
        renumberedCount += 1;
      }
      lines.push(nextIndex);
    } else {
      lines.push(...cue.identifierLines);
    }
    lines.push(formatSubtitleTimelineTiming(cue));
    lines.push(...cue.textLines);
    return lines.join(lineEnding);
  });

  const nextContent = `${header ? `${header}${lineEnding}${lineEnding}` : ""}${nextBlocks.join(`${lineEnding}${lineEnding}`)}${lineEnding}`;
  const cleanedCount = removedDuplicateCount + adjustedOverlapCount + sortedCueCount + renumberedCount + (nextContent !== content ? 1 : 0);

  return {
    content: nextContent,
    cleanedCount,
    removedDuplicateCount,
    adjustedOverlapCount,
    sortedCueCount,
    renumberedCount
  };
}

export function convertSubtitleWorkshopFormat(
  content: string,
  outputPath: string,
  currentFormat?: string
): SubtitleFormatConversionResult {
  const toFormat = subtitleFormatFromPath(outputPath);
  const fromFormat = normalizeSubtitleWorkshopFormat(currentFormat) ?? detectSubtitleWorkshopFormat(content);
  if (!toFormat || toFormat === fromFormat) {
    return {
      content,
      converted: false,
      fromFormat,
      toFormat: toFormat ?? fromFormat,
      cueCount: 0
    };
  }

  if (fromFormat === "ass" || toFormat === "ass") {
    throw new Error("ASS conversion is not supported because style and event fields would be lost.");
  }

  const cues = parseSubtitleCuesForConversion(content);
  if (cues.length === 0) {
    throw new Error("No timed subtitle cues were found to convert.");
  }

  return {
    content: toFormat === "vtt" ? buildVttSubtitle(cues) : buildSrtSubtitle(cues),
    converted: true,
    fromFormat,
    toFormat,
    cueCount: cues.length
  };
}

function normalizedFindText(findText: string): string {
  return findText.trim();
}

function parseSubtitleCueBlock(block: string): SubtitleCueBlock | null {
  const lines = block.split("\n").map((line) => line.trimEnd()).filter((line) => line.trim());
  if (lines.length === 0) {
    return null;
  }

  const timingLineIndex = lines.findIndex((line) => line.includes("-->"));
  if (timingLineIndex === -1) {
    return null;
  }

  const index = timingLineIndex > 0 && /^\d+$/.test(lines[timingLineIndex - 1].trim())
    ? lines[timingLineIndex - 1].trim()
    : undefined;

  return {
    index,
    timing: lines[timingLineIndex].trim(),
    textLines: lines.slice(timingLineIndex + 1)
  };
}

function parseSubtitleTimelineCue(block: string, originalOrder: number): SubtitleTimelineCue | null {
  const lines = block.split("\n").map((line) => line.trimEnd()).filter((line) => line.trim());
  if (lines.length === 0) {
    return null;
  }

  const timingLineIndex = lines.findIndex((line) => line.includes("-->"));
  if (timingLineIndex === -1) {
    return null;
  }

  const timing = parseSubtitleTimelineTiming(lines[timingLineIndex]);
  if (!timing) {
    return null;
  }

  const identifierLines = lines.slice(0, timingLineIndex);
  const index = identifierLines.length > 0 && /^\d+$/.test(identifierLines[identifierLines.length - 1].trim())
    ? identifierLines[identifierLines.length - 1].trim()
    : undefined;

  return {
    index,
    identifierLines,
    startMilliseconds: timing.startMilliseconds,
    endMilliseconds: timing.endMilliseconds,
    separator: timing.separator,
    keepHourField: timing.keepHourField,
    settings: timing.settings,
    textLines: lines.slice(timingLineIndex + 1),
    originalOrder
  };
}

function parseSubtitleTimelineTiming(timing: string): {
  startMilliseconds: number;
  endMilliseconds: number;
  separator: string;
  keepHourField: boolean;
  settings: string;
} | null {
  const parts = timing.split("-->");
  if (parts.length < 2) {
    return null;
  }

  const start = parts[0].trim();
  const endAndSettings = parts.slice(1).join("-->").trim();
  const endMatch = endAndSettings.match(/^(\S+)(.*)$/);
  if (!endMatch) {
    return null;
  }

  const end = endMatch[1];
  const separator = start.includes(",") ? "," : ".";
  const startMilliseconds = subtitleTimestampToMilliseconds(start);
  const endMilliseconds = subtitleTimestampToMilliseconds(end);
  if (startMilliseconds === null || endMilliseconds === null) {
    return null;
  }

  return {
    startMilliseconds,
    endMilliseconds,
    separator,
    keepHourField: start.split(/[,.]/)[0].split(":").length === 3,
    settings: endMatch[2] ?? ""
  };
}

function formatSubtitleTimelineTiming(cue: SubtitleTimelineCue): string {
  return `${formatTimestampMilliseconds(cue.startMilliseconds, cue.keepHourField, cue.separator)} --> ${formatTimestampMilliseconds(cue.endMilliseconds, cue.keepHourField, cue.separator)}${cue.settings}`;
}

function subtitleTimelineCueKey(cue: SubtitleTimelineCue): string {
  return [
    cue.startMilliseconds,
    cue.endMilliseconds,
    cue.textLines.map((line) => line.trim()).join("\n").toLowerCase()
  ].join("|");
}

function normalizeSubtitleTimingLine(timing: string): { timing: string; fixed: boolean } {
  const parts = timing.split("-->");
  if (parts.length < 2) {
    return { timing, fixed: false };
  }

  const start = parts[0].trim();
  const endAndSettings = parts.slice(1).join("-->").trim();
  const endMatch = endAndSettings.match(/^(\S+)(.*)$/);
  if (!endMatch) {
    return { timing, fixed: false };
  }

  const end = endMatch[1];
  const settings = endMatch[2] ?? "";
  const startMilliseconds = subtitleTimestampToMilliseconds(start);
  const endMilliseconds = subtitleTimestampToMilliseconds(end);
  if (startMilliseconds === null || endMilliseconds === null || startMilliseconds <= endMilliseconds) {
    return { timing, fixed: false };
  }

  return {
    timing: `${end} --> ${start}${settings}`,
    fixed: true
  };
}

function subtitleTimestampToMilliseconds(value: string): number | null {
  const match = value.match(/^(?:(\d{2}):)?(\d{2}):(\d{2})([,.])(\d{3})$/);
  if (!match) {
    return null;
  }

  return timestampPartsToMilliseconds(match[1], match[2], match[3], match[5]);
}

function findTimedCueTimingAtPosition(content: string, cursorPosition: number): SubtitleCueTimingRange | null {
  const normalizedContent = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const normalizedCursor = content.slice(0, cursorPosition).replace(/\r\n/g, "\n").replace(/\r/g, "\n").length;
  let blockStart = 0;
  for (const block of normalizedContent.split(/\n{2,}/)) {
    const blockEnd = blockStart + block.length;
    if (normalizedCursor >= blockStart && normalizedCursor <= blockEnd) {
      return parseTimedCueTimingRange(block);
    }
    const separatorMatch = normalizedContent.slice(blockEnd).match(/^\n{2,}/);
    blockStart = blockEnd + (separatorMatch?.[0].length ?? 0);
  }

  return null;
}

function parseTimedCueTimingRange(block: string): SubtitleCueTimingRange | null {
  const lines = block.split("\n");
  const timingLine = lines.find((line) => line.includes("-->"));
  if (!timingLine) {
    return null;
  }

  const parts = timingLine.split("-->");
  const start = parts[0].trim();
  const end = parts.slice(1).join("-->").trim().split(/\s+/)[0] ?? "";
  const startMilliseconds = subtitleTimestampToMilliseconds(start);
  const endMilliseconds = subtitleTimestampToMilliseconds(end);
  if (startMilliseconds === null || endMilliseconds === null) {
    return null;
  }

  return { startMilliseconds, endMilliseconds };
}

function findTimedCueTextRangeAtTime(content: string, timestampMilliseconds: number): SubtitleCueTextRange | null {
  const candidate = collectTimedCueTextCandidates(content).find((item) =>
    subtitleCueContainsTimestamp(item.timing, timestampMilliseconds)
  );
  return candidate?.textRange ?? null;
}

function collectTimedCueTextCandidates(content: string): SubtitleCueTextCandidate[] {
  const normalizedContent = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const offsetMap = normalizedOffsetMap(content, normalizedContent);
  const candidates: SubtitleCueTextCandidate[] = [];
  let blockStart = 0;

  for (const block of normalizedContent.split(/\n{2,}/)) {
    const blockEnd = blockStart + block.length;
    const timingRange = parseTimedCueTimingRange(block);
    const textRange = timingRange ? timedCueTextRangeFromBlock(block, blockStart, offsetMap) : null;
    if (timingRange && textRange) {
      candidates.push({
        timing: timingRange,
        textRange
      });
    }
    const separatorMatch = normalizedContent.slice(blockEnd).match(/^\n{2,}/);
    blockStart = blockEnd + (separatorMatch?.[0].length ?? 0);
  }

  return candidates;
}

function timedCueTextRangeFromBlock(
  block: string,
  blockStart: number,
  offsetMap: number[]
): SubtitleCueTextRange | null {
  const lines = block.split("\n");
  let cursor = blockStart;
  let timingLineFound = false;
  let textStart: number | null = null;

  for (const line of lines) {
    const lineEnd = cursor + line.length;
    if (timingLineFound && line.trim()) {
      textStart = cursor;
      break;
    }
    if (line.includes("-->")) {
      timingLineFound = true;
    }
    cursor = lineEnd + 1;
  }

  if (textStart === null) {
    return null;
  }

  let textEnd = blockStart + block.length;
  while (textEnd > textStart && normalizedLineBreakCharacter(block[textEnd - blockStart - 1])) {
    textEnd -= 1;
  }

  return {
    start: originalOffsetFromNormalized(offsetMap, textStart),
    end: originalOffsetFromNormalized(offsetMap, textEnd)
  };
}

function normalizedLineBreakCharacter(value: string | undefined): boolean {
  return value === "\n";
}

function findAssCueTimingAtPosition(content: string, cursorPosition: number): SubtitleCueTimingRange | null {
  const lines = splitLinesPreservingEndings(content);
  let assEventFormat: AssEventFormat | null = null;
  let cursor = 0;

  for (const line of lines) {
    assEventFormat = parseAssEventFormat(line.text) ?? assEventFormat;
    const lineStart = cursor;
    const lineEnd = lineStart + line.text.length;
    if (cursorPosition >= lineStart && cursorPosition <= lineEnd && assEventFormat) {
      return parseAssDialogueTimingRange(line.text, assEventFormat);
    }
    cursor += line.text.length + line.ending.length;
  }

  return null;
}

function parseAssDialogueTimingRange(line: string, format: AssEventFormat): SubtitleCueTimingRange | null {
  if (!/^\s*Dialogue\s*:/i.test(line) || format.startIndex === null || format.endIndex === null) {
    return null;
  }

  const fields = splitAssEventFields(line, format.fields.length);
  if (!fields) {
    return null;
  }

  const startMilliseconds = assTimestampToMilliseconds(fields[format.startIndex].trim());
  const endMilliseconds = assTimestampToMilliseconds(fields[format.endIndex].trim());
  if (startMilliseconds === null || endMilliseconds === null) {
    return null;
  }

  return { startMilliseconds, endMilliseconds };
}

function findAssCueTextRangeAtTime(content: string, timestampMilliseconds: number): SubtitleCueTextRange | null {
  const candidate = collectAssCueTextCandidates(content).find((item) =>
    subtitleCueContainsTimestamp(item.timing, timestampMilliseconds)
  );
  return candidate?.textRange ?? null;
}

function collectAssCueTextCandidates(content: string): SubtitleCueTextCandidate[] {
  const lines = splitLinesPreservingEndings(content);
  let assEventFormat: AssEventFormat | null = null;
  let cursor = 0;
  const candidates: SubtitleCueTextCandidate[] = [];

  for (const line of lines) {
    assEventFormat = parseAssEventFormat(line.text) ?? assEventFormat;
    if (assEventFormat) {
      const timing = parseAssDialogueTimingRange(line.text, assEventFormat);
      const segment = assDialogueTextSegment(line.text, assEventFormat);
      if (timing && segment) {
        candidates.push({
          timing,
          textRange: {
            start: cursor + segment.start,
            end: cursor + segment.end
          }
        });
      }
    }
    cursor += line.text.length + line.ending.length;
  }

  return candidates;
}

function subtitleCueContainsTimestamp(timingRange: SubtitleCueTimingRange, timestampMilliseconds: number): boolean {
  return timestampMilliseconds >= timingRange.startMilliseconds && timestampMilliseconds <= timingRange.endMilliseconds;
}

function subtitleCueDistanceFromTimestamp(timingRange: SubtitleCueTimingRange, timestampMilliseconds: number): number {
  if (subtitleCueContainsTimestamp(timingRange, timestampMilliseconds)) {
    return 0;
  }

  if (timestampMilliseconds < timingRange.startMilliseconds) {
    return timingRange.startMilliseconds - timestampMilliseconds;
  }

  return timestampMilliseconds - timingRange.endMilliseconds;
}

function normalizedOffsetMap(original: string, normalized: string): number[] {
  const map: number[] = [];
  let originalIndex = 0;
  let normalizedIndex = 0;
  while (originalIndex < original.length && normalizedIndex < normalized.length) {
    map[normalizedIndex] = originalIndex;
    if (original[originalIndex] === "\r" && original[originalIndex + 1] === "\n") {
      originalIndex += 2;
      normalizedIndex += 1;
    } else {
      originalIndex += 1;
      normalizedIndex += 1;
    }
  }
  map[normalized.length] = original.length;
  return map;
}

function originalOffsetFromNormalized(offsetMap: number[], normalizedOffset: number): number {
  return offsetMap[Math.max(0, Math.min(offsetMap.length - 1, normalizedOffset))] ?? 0;
}

function createSubtitleMatcher(
  needle: string,
  options: SubtitleFindOptions
): {
  listMatches: (content: string) => SubtitleTextMatch[];
  replaceMatches: (content: string, replacementText: string) => LiteralReplaceResult;
} {
  if (!options.regex) {
    return {
      listMatches: (content) => listLiteralMatches(content, needle),
      replaceMatches: (content, replacementText) => replaceLiteralMatches(content, needle, replacementText)
    };
  }

  return createRegexMatcher(needle);
}

function createRegexMatcher(pattern: string): {
  listMatches: (content: string) => SubtitleTextMatch[];
  replaceMatches: (content: string, replacementText: string) => LiteralReplaceResult;
} {
  let expression: RegExp;
  try {
    expression = new RegExp(pattern, "gi");
  } catch {
    throw new Error("Invalid regular expression.");
  }

  return {
    listMatches: (content) => listRegexMatches(content, expression),
    replaceMatches: (content, replacementText) => replaceRegexMatches(content, expression, replacementText)
  };
}

function subtitleTextSegments(content: string): SubtitleTextSegment[] {
  const structuralSegments = structuralSubtitleTextSegments(content);
  if (structuralSegments.length > 0) {
    return structuralSegments;
  }

  return [{ start: 0, end: content.length }];
}

function structuralSubtitleTextSegments(content: string): SubtitleTextSegment[] {
  const lines = splitLinesPreservingEndings(content);
  const segments: SubtitleTextSegment[] = [];
  let cursor = 0;
  let inTimedCueText = false;
  let assEventFormat: AssEventFormat | null = null;

  for (const line of lines) {
    const lineStart = cursor;
    const lineEnd = lineStart + line.text.length;
    assEventFormat = parseAssEventFormat(line.text) ?? assEventFormat;
    const dialogueTextSegment = assDialogueTextSegment(line.text, assEventFormat);

    if (dialogueTextSegment !== null) {
      segments.push({
        start: lineStart + dialogueTextSegment.start,
        end: lineStart + dialogueTextSegment.end
      });
    } else if (inTimedCueText && line.text.trim()) {
      segments.push({
        start: lineStart,
        end: lineEnd
      });
    }

    if (!line.text.trim()) {
      inTimedCueText = false;
    } else if (line.text.includes("-->")) {
      inTimedCueText = true;
    }

    cursor += line.text.length + line.ending.length;
  }

  return segments;
}

function mapSubtitleTextSegments(
  content: string,
  mapSegment: (segmentText: string) => LiteralReplaceResult
): { content: string; count: number; usedSubtitleStructure: boolean } {
  const structuralSegments = structuralSubtitleTextSegments(content);
  if (structuralSegments.length === 0) {
    const result = mapSegment(content);
    return {
      content: result.content,
      count: result.count,
      usedSubtitleStructure: false
    };
  }

  let count = 0;
  let cursor = 0;
  let nextContent = "";

  for (const segment of structuralSegments) {
    nextContent += content.slice(cursor, segment.start);
    const result = mapSegment(content.slice(segment.start, segment.end));
    nextContent += result.content;
    count += result.count;
    cursor = segment.end;
  }
  nextContent += content.slice(cursor);

  return {
    content: nextContent,
    count,
    usedSubtitleStructure: true
  };
}

function splitLinesPreservingEndings(content: string): SubtitleTextLine[] {
  const lines: SubtitleTextLine[] = [];
  const linePattern = /([^\r\n]*)(\r\n|\n|\r|$)/g;
  let match: RegExpExecArray | null;
  while ((match = linePattern.exec(content)) !== null) {
    if (match[0] === "" && match.index === content.length) {
      break;
    }
    lines.push({
      text: match[1] ?? "",
      ending: match[2] ?? ""
    });
  }
  return lines;
}

function subtitleFormatFromPath(path: string): SubtitleWorkshopFormat | null {
  const match = path.trim().toLowerCase().match(/\.([a-z0-9]+)$/);
  const extension = match?.[1];
  return normalizeSubtitleWorkshopFormat(extension);
}

function normalizeSubtitleWorkshopFormat(value?: string | null): SubtitleWorkshopFormat | null {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "srt" || normalized === "vtt" || normalized === "ass") {
    return normalized;
  }
  return null;
}

function detectSubtitleWorkshopFormat(content: string): SubtitleWorkshopFormat {
  const normalized = content.replace(/^\uFEFF/, "").trimStart();
  if (/^WEBVTT\b/i.test(normalized)) {
    return "vtt";
  }
  if (/^\s*\[Script Info\]|\n\s*\[Events\]|\n\s*Dialogue\s*:/i.test(content)) {
    return "ass";
  }
  return "srt";
}

function parseSubtitleCuesForConversion(content: string): SubtitleCueForConversion[] {
  const normalizedContent = content
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
  const cueSection = normalizedContent.replace(/^WEBVTT[^\n]*(?:\n+|$)/i, "");
  return cueSection
    .split(/\n{2,}/)
    .map((block, index) => parseSubtitleTimelineCue(block, index))
    .filter((cue): cue is SubtitleTimelineCue => cue !== null)
    .map((cue) => ({
      startMilliseconds: cue.startMilliseconds,
      endMilliseconds: cue.endMilliseconds,
      settings: cue.settings,
      textLines: cue.textLines,
      identifierLines: cue.identifierLines.filter((line) => line.trim() && !/^\d+$/.test(line.trim()))
    }));
}

function buildVttSubtitle(cues: SubtitleCueForConversion[]): string {
  const blocks = cues.map((cue) => {
    const lines = [...cue.identifierLines];
    lines.push(
      `${formatTimestampMilliseconds(cue.startMilliseconds, true, ".")} --> ${formatTimestampMilliseconds(
        cue.endMilliseconds,
        true,
        "."
      )}${cue.settings}`
    );
    lines.push(...cue.textLines);
    return lines.join("\n");
  });
  return `WEBVTT\n\n${blocks.join("\n\n")}\n`;
}

function buildSrtSubtitle(cues: SubtitleCueForConversion[]): string {
  const blocks = cues.map((cue, index) => {
    const lines = [
      String(index + 1),
      `${formatTimestampMilliseconds(cue.startMilliseconds, true, ",")} --> ${formatTimestampMilliseconds(
        cue.endMilliseconds,
        true,
        ","
      )}`
    ];
    lines.push(...cue.textLines);
    return lines.join("\n");
  });
  return `${blocks.join("\n\n")}\n`;
}

function parseAssEventFormat(line: string): AssEventFormat | null {
  const match = line.match(/^\s*Format\s*:(.*)$/i);
  if (!match) {
    return null;
  }

  const fields = match[1].split(",").map((field) => field.trim().toLocaleLowerCase());
  const textIndex = nullableFieldIndex(fields, "text");
  const startIndex = nullableFieldIndex(fields, "start");
  const endIndex = nullableFieldIndex(fields, "end");
  if (textIndex === null && startIndex === null && endIndex === null) {
    return null;
  }

  return { fields, textIndex, startIndex, endIndex };
}

function assDialogueTextSegment(line: string, format: AssEventFormat | null): SubtitleTextSegment | null {
  if (!/^\s*Dialogue\s*:/i.test(line)) {
    return null;
  }

  if (format?.textIndex !== null && format?.textIndex !== undefined) {
    const segment = assEventFieldSegment(line, format.textIndex, format.fields.length);
    if (segment) {
      return segment;
    }
  }

  const fallbackStart = fallbackAssDialogueTextStartIndex(line);
  return fallbackStart === null ? null : { start: fallbackStart, end: line.length };
}

function nullableFieldIndex(fields: string[], name: string): number | null {
  const index = fields.indexOf(name);
  return index === -1 ? null : index;
}

function assEventFieldSegment(line: string, fieldIndex: number, fieldCount: number): SubtitleTextSegment | null {
  const colonIndex = line.indexOf(":");
  if (colonIndex === -1 || fieldIndex < 0 || fieldCount <= fieldIndex) {
    return null;
  }

  let fieldStart = colonIndex + 1;
  while (line[fieldStart] === " ") {
    fieldStart += 1;
  }

  for (let currentIndex = 0; currentIndex < fieldCount; currentIndex += 1) {
    const isLastField = currentIndex === fieldCount - 1;
    const fieldEnd = isLastField ? line.length : line.indexOf(",", fieldStart);
    if (fieldEnd === -1) {
      return null;
    }
    if (currentIndex === fieldIndex) {
      return {
        start: fieldStart,
        end: fieldEnd
      };
    }
    fieldStart = fieldEnd + 1;
  }

  return null;
}

function splitAssEventFields(line: string, fieldCount: number): string[] | null {
  const colonIndex = line.indexOf(":");
  if (colonIndex === -1 || fieldCount <= 0) {
    return null;
  }

  let fieldStart = colonIndex + 1;
  while (line[fieldStart] === " ") {
    fieldStart += 1;
  }

  const fields: string[] = [];
  for (let currentIndex = 0; currentIndex < fieldCount; currentIndex += 1) {
    const isLastField = currentIndex === fieldCount - 1;
    const fieldEnd = isLastField ? line.length : line.indexOf(",", fieldStart);
    if (fieldEnd === -1) {
      return null;
    }
    fields.push(line.slice(fieldStart, fieldEnd));
    fieldStart = fieldEnd + 1;
  }
  return fields;
}

function fallbackAssDialogueTextStartIndex(line: string): number | null {
  let commaCount = 0;
  for (let index = 0; index < line.length; index += 1) {
    if (line[index] === ",") {
      commaCount += 1;
      if (commaCount === 9) {
        return index + 1;
      }
    }
  }
  return null;
}

function countLiteralMatches(content: string, needle: string): number {
  return listLiteralMatches(content, needle).length;
}

function listLiteralMatches(content: string, needle: string): SubtitleTextMatch[] {
  const matches: SubtitleTextMatch[] = [];
  let startIndex = 0;
  const haystack = content.toLocaleLowerCase();
  const normalizedNeedle = needle.toLocaleLowerCase();
  while (startIndex <= haystack.length) {
    const matchIndex = haystack.indexOf(normalizedNeedle, startIndex);
    if (matchIndex === -1) {
      break;
    }
    matches.push({
      start: matchIndex,
      end: matchIndex + needle.length
    });
    startIndex = matchIndex + needle.length;
  }
  return matches;
}

function listRegexMatches(content: string, expression: RegExp): SubtitleTextMatch[] {
  const matches: SubtitleTextMatch[] = [];
  expression.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = expression.exec(content)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length
    });
    if (match[0].length === 0) {
      expression.lastIndex += 1;
    }
  }
  return matches;
}

function replaceLiteralMatches(content: string, needle: string, replacementText: string): LiteralReplaceResult {
  let count = 0;
  let cursor = 0;
  let nextContent = "";
  const haystack = content.toLocaleLowerCase();
  const normalizedNeedle = needle.toLocaleLowerCase();
  while (cursor <= content.length) {
    const matchIndex = haystack.indexOf(normalizedNeedle, cursor);
    if (matchIndex === -1) {
      nextContent += content.slice(cursor);
      break;
    }
    nextContent += content.slice(cursor, matchIndex);
    nextContent += replacementText;
    count += 1;
    cursor = matchIndex + needle.length;
  }

  return {
    content: nextContent,
    count
  };
}

function replaceRegexMatches(content: string, expression: RegExp, replacementText: string): LiteralReplaceResult {
  let count = 0;
  expression.lastIndex = 0;
  const nextContent = content.replace(expression, (...args: unknown[]) => {
    const match = String(args[0] ?? "");
    count += 1;
    if (match.length === 0) {
      return match;
    }
    return replacementText.replace(/\$(\d+)/g, (_placeholder, groupNumber: string) => {
      const groupIndex = Number(groupNumber);
      const groupValue = args[groupIndex];
      return typeof groupValue === "string" ? groupValue : "";
    });
  });

  return {
    content: nextContent,
    count
  };
}

function transformSubtitleTimestamps(
  content: string,
  transform: (timestampMilliseconds: number) => number
): { content: string; changedCount: number } {
  const assFormatAwareResult = transformAssFormatAwareTimestamps(content, transform);
  if (assFormatAwareResult.usedAssFormat) {
    return assFormatAwareResult;
  }

  let changedCount = 0;
  const nextContent = content.replace(
    /(?<!\d)(?:(\d+):(\d{2}):(\d{2})\.(\d{2})|(?:(\d{2}):)?(\d{2}):(\d{2})([,.])(\d{3}))(?!\d)/g,
    (
      _match,
      assHours: string | undefined,
      assMinutes: string | undefined,
      assSeconds: string | undefined,
      assCentiseconds: string | undefined,
      hours: string | undefined,
      minutes: string | undefined,
      seconds: string | undefined,
      separator: string | undefined,
      milliseconds: string | undefined
    ) => {
      if (assHours !== undefined && assMinutes !== undefined && assSeconds !== undefined && assCentiseconds !== undefined) {
        const currentMilliseconds = assTimestampPartsToMilliseconds(assHours, assMinutes, assSeconds, assCentiseconds);
        const nextTimestamp = formatAssTimestampMilliseconds(transform(currentMilliseconds), assHours.length);
        changedCount += 1;
        return nextTimestamp;
      }

      const currentMilliseconds = timestampPartsToMilliseconds(hours, minutes!, seconds!, milliseconds!);
      const nextTimestamp = formatTimestampMilliseconds(
        transform(currentMilliseconds),
        hours !== undefined,
        separator!
      );
      changedCount += 1;
      return nextTimestamp;
    }
  );

  return { content: nextContent, changedCount };
}

function transformAssFormatAwareTimestamps(
  content: string,
  transform: (timestampMilliseconds: number) => number
): { content: string; changedCount: number; usedAssFormat: boolean } {
  const lines = splitLinesPreservingEndings(content);
  let changedCount = 0;
  let usedAssFormat = false;
  let assEventFormat: AssEventFormat | null = null;
  let nextContent = "";

  for (const line of lines) {
    assEventFormat = parseAssEventFormat(line.text) ?? assEventFormat;
    const transformedLine = assEventFormat
      ? transformAssDialogueTimingFields(line.text, assEventFormat, transform)
      : { text: line.text, count: 0 };

    if (transformedLine.count > 0) {
      usedAssFormat = true;
    }
    changedCount += transformedLine.count;
    nextContent += transformedLine.text + line.ending;
  }

  return {
    content: nextContent,
    changedCount,
    usedAssFormat
  };
}

function transformAssDialogueTimingFields(
  line: string,
  format: AssEventFormat,
  transform: (timestampMilliseconds: number) => number
): { text: string; count: number } {
  if (!/^\s*Dialogue\s*:/i.test(line)) {
    return { text: line, count: 0 };
  }

  const segments = [format.startIndex, format.endIndex]
    .filter((index): index is number => index !== null)
    .map((index) => assEventFieldSegment(line, index, format.fields.length))
    .filter((segment): segment is SubtitleTextSegment => segment !== null)
    .sort((left, right) => left.start - right.start);

  let count = 0;
  let cursor = 0;
  let nextText = "";
  for (const segment of segments) {
    nextText += line.slice(cursor, segment.start);
    const value = line.slice(segment.start, segment.end);
    const transformedValue = transformAssTimestampValue(value, transform);
    nextText += transformedValue.text;
    count += transformedValue.count;
    cursor = segment.end;
  }
  nextText += line.slice(cursor);

  return { text: nextText, count };
}

function transformAssTimestampValue(
  value: string,
  transform: (timestampMilliseconds: number) => number
): { text: string; count: number } {
  const match = value.match(/^(\d+):(\d{2}):(\d{2})\.(\d{2})$/);
  if (!match) {
    return { text: value, count: 0 };
  }

  const currentMilliseconds = assTimestampPartsToMilliseconds(match[1], match[2], match[3], match[4]);
  return {
    text: formatAssTimestampMilliseconds(transform(currentMilliseconds), match[1].length),
    count: 1
  };
}

function timestampPartsToMilliseconds(
  hours: string | undefined,
  minutes: string,
  seconds: string,
  milliseconds: string
): number {
  return Number(hours ?? "0") * 3_600_000 + Number(minutes) * 60_000 + Number(seconds) * 1_000 + Number(milliseconds);
}

function assTimestampPartsToMilliseconds(hours: string, minutes: string, seconds: string, centiseconds: string): number {
  return Number(hours) * 3_600_000 + Number(minutes) * 60_000 + Number(seconds) * 1_000 + Number(centiseconds) * 10;
}

function assTimestampToMilliseconds(value: string): number | null {
  const match = value.match(/^(\d+):(\d{2}):(\d{2})\.(\d{2})$/);
  if (!match) {
    return null;
  }

  return assTimestampPartsToMilliseconds(match[1], match[2], match[3], match[4]);
}

function formatTimestampMilliseconds(value: number, keepHourField: boolean, separator: string): string {
  const nextMilliseconds = Math.max(0, Math.round(value));
  const hours = Math.floor(nextMilliseconds / 3_600_000);
  const minutes = Math.floor((nextMilliseconds % 3_600_000) / 60_000);
  const seconds = Math.floor((nextMilliseconds % 60_000) / 1_000);
  const milliseconds = nextMilliseconds % 1_000;

  if (keepHourField) {
    return `${paddedNumber(hours)}:${paddedNumber(minutes)}:${paddedNumber(seconds)}${separator}${paddedMilliseconds(milliseconds)}`;
  }

  if (hours > 0) {
    return `${paddedNumber(hours)}:${paddedNumber(minutes)}:${paddedNumber(seconds)}${separator}${paddedMilliseconds(milliseconds)}`;
  }

  return `${paddedNumber(minutes)}:${paddedNumber(seconds)}${separator}${paddedMilliseconds(milliseconds)}`;
}

function formatAssTimestampMilliseconds(value: number, hourWidth: number): string {
  const nextCentiseconds = Math.max(0, Math.round(value / 10));
  const hours = Math.floor(nextCentiseconds / 360_000);
  const minutes = Math.floor((nextCentiseconds % 360_000) / 6_000);
  const seconds = Math.floor((nextCentiseconds % 6_000) / 100);
  const centiseconds = nextCentiseconds % 100;

  return `${hours.toString().padStart(hourWidth, "0")}:${paddedNumber(minutes)}:${paddedNumber(seconds)}.${centiseconds.toString().padStart(2, "0")}`;
}

function paddedNumber(value: number): string {
  return value.toString().padStart(2, "0");
}

function paddedMilliseconds(value: number): string {
  return value.toString().padStart(3, "0");
}
