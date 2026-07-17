const DEFAULT_SETTINGS = {
  bridgeBaseUrl: "http://127.0.0.1:17654",
  bridgeDiscoveryPorts: Array.from({ length: 11 }, (_, index) => 17654 + index),
  useDeepLinkFallback: true,
  pairingToken: "",
  mediaSnifferEnabled: true,
  headerCaptureEnabled: true,
  blockedHosts: []
};

const MENU_PAGE_ID = "fetchdock-send-page";
const MENU_LINK_ID = "fetchdock-send-link";
const MENU_MEDIA_ID = "fetchdock-send-media";
const MEDIA_STORAGE_KEY = "detectedMedia";
const HEADER_STORAGE_KEY = "requestHeaders";
const AUTH_PAYLOAD_STORAGE_KEY = "authorizationPayloadRefs";
const MAX_MEDIA_ITEMS = 80;
const MAX_HEADER_ITEMS = 120;
const MAX_AUTH_PAYLOAD_REFS = 40;
const DEFAULT_BRIDGE_PORT = 17654;
const BRIDGE_DISCOVERY_PORTS = Array.from({ length: 11 }, (_, index) => DEFAULT_BRIDGE_PORT + index);
const BRIDGE_HEALTH_TIMEOUT_MS = 450;
const ACTION_RESET_MS = 3500;
const ACTION_DEFAULT_TITLE = "FetchDock";

const runtimeApi = globalThis.browser ?? globalThis.chrome;
let settingsCache = { ...DEFAULT_SETTINGS };
const actionResetTimers = new Map();
const pendingStreamSegments = new Map();

void refreshSettingsCache();

runtimeApi.runtime.onInstalled.addListener(() => {
  runtimeApi.contextMenus.create({
    id: MENU_PAGE_ID,
    title: "Send page to FetchDock",
    contexts: ["page"]
  });
  runtimeApi.contextMenus.create({
    id: MENU_LINK_ID,
    title: "Send link to FetchDock",
    contexts: ["link"]
  });
  runtimeApi.contextMenus.create({
    id: MENU_MEDIA_ID,
    title: "Send media to FetchDock",
    contexts: ["audio", "video", "image"]
  });
});

runtimeApi.contextMenus.onClicked.addListener((info, tab) => {
  const url =
    info.menuItemId === MENU_LINK_ID
      ? info.linkUrl
      : info.menuItemId === MENU_MEDIA_ID
        ? info.srcUrl
        : tab?.url;
  const title =
    info.menuItemId === MENU_LINK_ID
      ? info.linkText || info.linkUrl
      : info.menuItemId === MENU_MEDIA_ID
        ? tab?.title || info.srcUrl
        : tab?.title;
  if (!url) {
    openErrorPage("No URL was available for this action.");
    return;
  }
  void sendToFetchDock({
    url,
    title,
    source: info.menuItemId === MENU_MEDIA_ID ? "context_media" : "context_menu",
    kind: contextMenuKindForUrl(url, info.menuItemId),
    tabId: tab?.id,
    pageUrl: tab?.url
  });
});

runtimeApi.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (
    !message ||
    ![
      "fetchdock.send",
      "fetchdock.media.list",
      "fetchdock.media.clear",
      "fetchdock.media.clear_shown",
      "fetchdock.media.send_shown",
      "fetchdock.cookies.capture",
      "fetchdock.auth.capture",
      "fetchdock.bridge.check"
    ].includes(message.type)
  ) {
    return false;
  }
  handleRuntimeMessage(message, sender)
    .then((result) => sendResponse(result))
    .catch((error) => sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) }));
  return true;
});

runtimeApi.storage?.onChanged?.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }
  if (changes.bridgeBaseUrl || changes.bridgeDiscoveryPorts || changes.useDeepLinkFallback || changes.pairingToken || changes.mediaSnifferEnabled || changes.headerCaptureEnabled || changes.blockedHosts) {
    void refreshSettingsCache();
  }
  if (changes[MEDIA_STORAGE_KEY]) {
    void refreshDetectedMediaActionState();
  }
});

runtimeApi.webRequest.onBeforeRequest.addListener(
  (details) => {
    void captureMediaRequest(details);
  },
  { urls: ["<all_urls>"] }
);

runtimeApi.tabs?.onActivated?.addListener((activeInfo) => {
  void refreshDetectedMediaActionState(activeInfo.tabId);
});

runtimeApi.tabs?.onUpdated?.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    void clearMediaForTab(tabId);
    return;
  }
  if (changeInfo.status === "loading" || changeInfo.title) {
    void refreshDetectedMediaActionState(tabId);
  }
});

runtimeApi.tabs?.onRemoved?.addListener((tabId) => {
  void clearMediaForTab(tabId, { refreshBadge: false });
});

registerHeaderCaptureListener();

async function handleRuntimeMessage(message, sender) {
  if (message.type === "fetchdock.media.list") {
    const tabId = Number.isFinite(message.tabId) ? message.tabId : sender.tab?.id;
    return mediaListResponseForTab(tabId);
  }
  if (message.type === "fetchdock.media.clear") {
    await clearMediaForTab(Number.isFinite(message.tabId) ? message.tabId : sender.tab?.id);
    return { ok: true };
  }
  if (message.type === "fetchdock.media.clear_shown") {
    return clearShownMediaForTab(
      Number.isFinite(message.tabId) ? message.tabId : sender.tab?.id,
      message.mediaIds
    );
  }
  if (message.type === "fetchdock.media.send_shown") {
    return sendShownMediaForTab({
      tabId: Number.isFinite(message.tabId) ? message.tabId : sender.tab?.id,
      pageUrl: message.pageUrl,
      mediaIds: message.mediaIds
    });
  }
  if (message.type === "fetchdock.cookies.capture") {
    return captureCookiesForPage({
      tabId: Number.isFinite(message.tabId) ? message.tabId : sender.tab?.id,
      pageUrl: message.pageUrl,
      source: message.source ?? "popup"
    });
  }
  if (message.type === "fetchdock.auth.capture") {
    return captureAuthorizationForPage({
      tabId: Number.isFinite(message.tabId) ? message.tabId : sender.tab?.id,
      pageUrl: message.pageUrl,
      source: message.source ?? "popup"
    });
  }
  if (message.type === "fetchdock.bridge.check") {
    return checkBridgeFromSettings();
  }
  return sendToFetchDock({
    url: message.url,
    title: message.title,
    source: message.source ?? "popup",
    kind: message.kind ?? "video",
    tabId: Number.isFinite(message.tabId) ? message.tabId : sender.tab?.id,
    pageUrl: message.pageUrl
  });
}

async function sendToFetchDock(payload) {
  const url = String(payload.url ?? "").trim();
  if (!/^https?:\/\//i.test(url)) {
    return { ok: false, error: "Only http and https URLs can be sent." };
  }

  const settings = await loadSettings();
  if (isBlockedHost(url, settings.blockedHosts)) {
    const error = "This host is blocked by the FetchDock extension settings.";
    await setActionState("BLK", "#6b5a1e", { title: error, tabId: payload.tabId });
    return { ok: false, mode: "blocked_host", error };
  }

  const enrichedPayload = await withCapturedHeaderHints(payload);
  const bridgeResult = await tryBridge(settings, enrichedPayload);
  if (bridgeResult.ok) {
    await setActionState("OK", "#247153", { title: `Sent to FetchDock through ${bridgeResult.bridgeBaseUrl || "the local bridge"}.`, tabId: payload.tabId });
    return bridgeResult;
  }

  if (settings.useDeepLinkFallback) {
    await openDeepLink(enrichedPayload);
    await setActionState("OPEN", "#315b83", { title: "Opened FetchDock through the desktop link fallback.", tabId: payload.tabId });
    return { ok: true, mode: "deep_link", warning: bridgeResult.error };
  }

  await setActionState("ERR", "#9f2d2d", { title: bridgeResult.error || "FetchDock bridge is not reachable.", tabId: payload.tabId });
  await openErrorPage(bridgeResult.error || "FetchDock bridge is not reachable.");
  return bridgeResult;
}

async function sendShownMediaForTab(payload) {
  const { allMedia: availableMedia } = await mediaItemsForTab(payload.tabId);
  const selectedIds = normalizedMediaIdSet(payload.mediaIds);
  const media = selectedIds.size
    ? availableMedia.filter((item) => selectedIds.has(item.id)).slice(0, 8)
    : availableMedia.slice(0, 8);
  if (!media.length) {
    return { ok: false, sent: 0, failed: 0, attempted: 0, available: 0, error: "No detected media is available for this tab." };
  }

  let sent = 0;
  let failed = 0;
  let mode = "bridge";
  let bridgeBaseUrl = "";
  let lastError = "";
  for (const item of media) {
    const result = await sendToFetchDock({
      url: item.url,
      title: item.pageTitle || item.label || item.host || "Detected media",
      source: `media_sniffer:${item.kind || "media"}`,
      kind: item.kind || "media",
      tabId: item.tabId,
      pageUrl: item.pageUrl || payload.pageUrl
    });
    if (result?.ok) {
      sent += 1;
      mode = result.mode || mode;
      bridgeBaseUrl = result.bridgeBaseUrl || bridgeBaseUrl;
    } else {
      failed += 1;
      lastError = result?.error || lastError;
    }
  }

  return {
    ok: sent > 0,
    sent,
    failed,
    attempted: media.length,
    available: availableMedia.length,
    mode,
    bridgeBaseUrl,
    error: sent > 0 ? "" : lastError || "FetchDock did not accept the detected media."
  };
}

async function checkBridgeFromSettings() {
  const settings = await loadSettings();
  let bridgeBaseUrl;
  try {
    bridgeBaseUrl = await resolveBridgeBaseUrl(settings);
  } catch (error) {
    return { ok: false, mode: "bridge", error: error instanceof Error ? error.message : String(error) };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BRIDGE_HEALTH_TIMEOUT_MS);
  try {
    const response = await fetch(`${bridgeBaseUrl}/health`, {
      method: "GET",
      cache: "no-store",
      headers: settings.pairingToken ? { "X-FetchDock-Token": settings.pairingToken } : {},
      signal: controller.signal
    });
    const health = await response.json().catch(() => ({}));
    if (!response.ok || health.ok === false) {
      return { ok: false, mode: "bridge", bridgeBaseUrl, error: `Bridge returned HTTP ${response.status}.` };
    }
    return { ok: true, mode: "bridge", bridgeBaseUrl, health };
  } catch (error) {
    return { ok: false, mode: "bridge", bridgeBaseUrl, error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

async function tryBridge(settings, payload) {
  let bridgeBaseUrl;
  try {
    bridgeBaseUrl = await resolveBridgeBaseUrl(settings);
  } catch (error) {
    return { ok: false, mode: "bridge", error: error instanceof Error ? error.message : String(error) };
  }
  try {
    const response = await fetch(`${bridgeBaseUrl}/v1/extension/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(settings.pairingToken ? { "X-FetchDock-Token": settings.pairingToken } : {})
      },
      body: JSON.stringify({
        schema_version: 1,
        url: payload.url,
        title: payload.title ?? null,
        source: payload.source ?? "extension",
        kind: payload.kind ?? "video",
        page_url: payload.pageUrl ?? null,
        referer: payload.referer ?? null,
        user_agent: payload.userAgent ?? null,
        auth_payload_ref: payload.authPayloadRef ?? null,
        header_summary: payload.headerSummary ?? null,
        sent_at: new Date().toISOString()
      })
    });
    if (!response.ok) {
      return { ok: false, mode: "bridge", bridgeBaseUrl, error: `Bridge returned HTTP ${response.status}.` };
    }
    return { ok: true, mode: "bridge", bridgeBaseUrl };
  } catch (error) {
    return { ok: false, mode: "bridge", bridgeBaseUrl, error: error instanceof Error ? error.message : String(error) };
  }
}

async function resolveBridgeBaseUrl(settings) {
  const configured = normalizeBridgeBaseUrl(settings.bridgeBaseUrl || DEFAULT_SETTINGS.bridgeBaseUrl);
  if (await bridgeHealthOk(configured)) {
    return configured;
  }

  for (const candidate of bridgeDiscoveryCandidates(configured, settings)) {
    if (candidate === configured) {
      continue;
    }
    if (await bridgeHealthOk(candidate)) {
      await runtimeApi.storage.local.set({ bridgeBaseUrl: candidate });
      settingsCache = { ...settingsCache, bridgeBaseUrl: candidate };
      return candidate;
    }
  }

  throw new Error(`FetchDock bridge was not found at ${configured} or ports ${settings.bridgeDiscoveryPorts.join(", ")}.`);
}

function bridgeDiscoveryCandidates(configured, settings) {
  const configuredUrl = safeUrl(configured);
  const configuredHost = configuredUrl?.hostname === "localhost" ? "localhost" : "127.0.0.1";
  const hosts = Array.from(new Set([configuredHost, "127.0.0.1", "localhost"]));
  return hosts.flatMap((host) => settings.bridgeDiscoveryPorts.map((port) => `http://${host}:${port}`));
}

async function bridgeHealthOk(baseUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BRIDGE_HEALTH_TIMEOUT_MS);
  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal
    });
    if (!response.ok) {
      return false;
    }
    const body = await response.json().catch(() => ({}));
    return body.ok !== false;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeBridgeBaseUrl(value) {
  const raw = String(value || DEFAULT_SETTINGS.bridgeBaseUrl).trim().replace(/\/+$/, "");
  const parsed = safeUrl(raw);
  if (!parsed || parsed.protocol !== "http:" || !["127.0.0.1", "localhost"].includes(parsed.hostname)) {
    return DEFAULT_SETTINGS.bridgeBaseUrl;
  }
  return `${parsed.protocol}//${parsed.host}`;
}

function safeUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

async function captureCookiesForPage(payload) {
  const pageUrl = String(payload.pageUrl || "").trim();
  if (!/^https?:\/\//i.test(pageUrl)) {
    return { ok: false, error: "Only http and https pages can provide cookies." };
  }
  const stored = await runtimeApi.storage.local.get({ [HEADER_STORAGE_KEY]: [] });
  const items = Array.isArray(stored[HEADER_STORAGE_KEY]) ? stored[HEADER_STORAGE_KEY] : [];
  const match =
    items.find((item) => item.tabId === payload.tabId && item.cookieHeader) ||
    items.find((item) => item.referer === pageUrl && item.cookieHeader) ||
    items.find((item) => safeUrlHost(item.url) === safeUrlHost(pageUrl) && item.cookieHeader);
  if (!match?.cookieHeader) {
    return { ok: false, error: "No cookie header has been captured for this page yet." };
  }

  const settings = await loadSettings();
  const bridgeBaseUrl = await resolveBridgeBaseUrl(settings);
  try {
    const response = await fetch(`${bridgeBaseUrl}/v1/extension/cookies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(settings.pairingToken ? { "X-FetchDock-Token": settings.pairingToken } : {})
      },
      body: JSON.stringify({
        schema_version: 1,
        page_url: pageUrl,
        cookie_header: match.cookieHeader,
        source: payload.source ?? "popup",
        captured_at: match.updatedAt || new Date().toISOString()
      })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.ok === false) {
      return { ok: false, mode: "bridge", error: body.error || `Bridge returned HTTP ${response.status}.` };
    }
    await setActionState("CK", "#8a5a16", { title: `Cookie payload staged${body.payload_ref ? `: ${body.payload_ref}` : "."}`, tabId: payload.tabId });
    return { ok: true, mode: "bridge", payloadRef: body.payload_ref || "" };
  } catch (error) {
    return { ok: false, mode: "bridge", error: error instanceof Error ? error.message : String(error) };
  }
}

async function captureAuthorizationForPage(payload) {
  const pageUrl = String(payload.pageUrl || "").trim();
  if (!/^https?:\/\//i.test(pageUrl)) {
    return { ok: false, error: "Only http and https pages can provide authorization headers." };
  }
  const stored = await runtimeApi.storage.local.get({ [HEADER_STORAGE_KEY]: [] });
  const items = Array.isArray(stored[HEADER_STORAGE_KEY]) ? stored[HEADER_STORAGE_KEY] : [];
  const match =
    items.find((item) => item.tabId === payload.tabId && item.authorizationHeader) ||
    items.find((item) => item.referer === pageUrl && item.authorizationHeader) ||
    items.find((item) => safeUrlHost(item.url) === safeUrlHost(pageUrl) && item.authorizationHeader);
  if (!match?.authorizationHeader) {
    return { ok: false, error: "No authorization header has been captured for this page yet." };
  }

  const settings = await loadSettings();
  const bridgeBaseUrl = await resolveBridgeBaseUrl(settings);
  try {
    const response = await fetch(`${bridgeBaseUrl}/v1/extension/authorization`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(settings.pairingToken ? { "X-FetchDock-Token": settings.pairingToken } : {})
      },
      body: JSON.stringify({
        schema_version: 1,
        page_url: pageUrl,
        request_url: match.url || "",
        authorization_header: match.authorizationHeader,
        source: payload.source ?? "popup",
        captured_at: match.updatedAt || new Date().toISOString()
      })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.ok === false) {
      return { ok: false, mode: "bridge", error: body.error || `Bridge returned HTTP ${response.status}.` };
    }
    await rememberAuthorizationPayloadRef({
      payloadRef: body.payload_ref || "",
      pageUrl,
      requestUrl: match.url || "",
      preview: body.preview || "",
      capturedAt: match.updatedAt || new Date().toISOString()
    });
    await setActionState("AUTH", "#5c4f9f", { title: `Authorization payload staged${body.payload_ref ? `: ${body.payload_ref}` : "."}`, tabId: payload.tabId });
    return { ok: true, mode: "bridge", payloadRef: body.payload_ref || "", preview: body.preview || "" };
  } catch (error) {
    return { ok: false, mode: "bridge", error: error instanceof Error ? error.message : String(error) };
  }
}

async function openDeepLink(payload) {
  const params = new URLSearchParams();
  params.set("url", payload.url);
  if (payload.title) {
    params.set("title", payload.title);
  }
  params.set("source", payload.source ?? "extension");
  if (payload.kind) {
    params.set("kind", payload.kind);
  }
  await runtimeApi.tabs.create({ url: `fetchdock://capture?${params.toString()}` });
}

async function openErrorPage(message) {
  const params = new URLSearchParams({ message: String(message || "Unknown error") });
  await runtimeApi.tabs.create({ url: runtimeApi.runtime.getURL(`error/error.html?${params.toString()}`) });
}

async function loadSettings() {
  const stored = await runtimeApi.storage.local.get(DEFAULT_SETTINGS);
  return normalizeSettings(stored);
}

async function refreshSettingsCache() {
  settingsCache = await loadSettings();
}

function normalizeSettings(value) {
  const blockedHosts = Array.isArray(value.blockedHosts)
    ? value.blockedHosts
    : String(value.blockedHosts ?? "")
        .split(/\r?\n|,/)
        .map((host) => host.trim())
        .filter(Boolean);
  return {
    ...DEFAULT_SETTINGS,
    ...value,
    mediaSnifferEnabled: value.mediaSnifferEnabled !== false,
    headerCaptureEnabled: value.headerCaptureEnabled !== false,
    bridgeDiscoveryPorts: normalizeBridgeDiscoveryPorts(value.bridgeDiscoveryPorts),
    blockedHosts
  };
}

function normalizeBridgeDiscoveryPorts(value) {
  const rawPorts = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/\r?\n|,/)
      : BRIDGE_DISCOVERY_PORTS;
  const ports = [];
  for (const rawPort of rawPorts) {
    const port = Number(rawPort);
    if (Number.isInteger(port) && port > 0 && port <= 65535 && !ports.includes(port)) {
      ports.push(port);
    }
  }
  return ports.length ? ports : BRIDGE_DISCOVERY_PORTS;
}

async function captureMediaRequest(details) {
  if (!settingsCache.mediaSnifferEnabled || details.tabId < 0 || !/^https?:\/\//i.test(details.url)) {
    return;
  }

  const media = classifyMediaUrl(details.url, details.type);
  if (!media) {
    return;
  }
  if (isBlockedHost(details.url, settingsCache.blockedHosts)) {
    return;
  }

  let tab = null;
  try {
    tab = await runtimeApi.tabs.get(details.tabId);
  } catch {
    tab = null;
  }

  const item = {
    id: media.groupId || stableMediaId(details.tabId, details.url),
    tabId: details.tabId,
    pageUrl: tab?.url || details.documentUrl || details.initiator || "",
    pageTitle: tab?.title || "",
    url: details.url,
    host: safeUrlHost(details.url),
    kind: media.kind,
    label: media.label,
    groupId: media.groupId || "",
    segmentCount: media.isSegment ? 1 : 0,
    pendingSegmentCount: 0,
    sourceType: details.type || "request",
    firstSeenAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
    count: 1
  };

  const stored = await runtimeApi.storage.local.get({ [MEDIA_STORAGE_KEY]: [] });
  const items = Array.isArray(stored[MEDIA_STORAGE_KEY]) ? stored[MEDIA_STORAGE_KEY] : [];
  const existingIndex = items.findIndex((candidate) => candidate.id === item.id);
  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      lastSeenAt: item.lastSeenAt,
      count: Number(items[existingIndex].count || 1) + 1,
      segmentCount: Number(items[existingIndex].segmentCount || 0) + item.segmentCount,
      url: media.isSegment ? items[existingIndex].url : item.url,
      label: media.isSegment ? items[existingIndex].label : item.label
    };
  } else if (!media.isSegment) {
    const pendingSegments = takePendingStreamSegmentCount(media.groupId);
    item.segmentCount += pendingSegments;
    item.pendingSegmentCount = pendingSegments;
    items.unshift(item);
  } else {
    rememberPendingStreamSegment(media.groupId);
    return;
  }
  await runtimeApi.storage.local.set({ [MEDIA_STORAGE_KEY]: items.slice(0, MAX_MEDIA_ITEMS) });
  await refreshDetectedMediaActionState(details.tabId);
}

async function captureRequestHeaders(details) {
  if (!settingsCache.headerCaptureEnabled || details.tabId < 0 || !/^https?:\/\//i.test(details.url)) {
    return;
  }
  if (isBlockedHost(details.url, settingsCache.blockedHosts)) {
    return;
  }
  const headers = Array.isArray(details.requestHeaders) ? details.requestHeaders : [];
  const pick = (name) => headers.find((header) => String(header.name || "").toLowerCase() === name)?.value || "";
  const item = {
    id: stableMediaId(details.tabId, details.url),
    tabId: details.tabId,
    url: details.url,
    referer: pick("referer"),
    userAgent: pick("user-agent"),
    cookieHeader: pick("cookie"),
    hasCookie: Boolean(pick("cookie")),
    authorizationHeader: pick("authorization"),
    hasAuthorization: Boolean(pick("authorization")),
    updatedAt: new Date().toISOString()
  };
  if (!item.referer && !item.userAgent && !item.hasCookie && !item.hasAuthorization) {
    return;
  }
  const stored = await runtimeApi.storage.local.get({ [HEADER_STORAGE_KEY]: [] });
  const items = Array.isArray(stored[HEADER_STORAGE_KEY]) ? stored[HEADER_STORAGE_KEY] : [];
  const nextItems = [item, ...items.filter((candidate) => candidate.id !== item.id)];
  await runtimeApi.storage.local.set({ [HEADER_STORAGE_KEY]: nextItems.slice(0, MAX_HEADER_ITEMS) });
}

function registerHeaderCaptureListener() {
  const listener = (details) => {
    void captureRequestHeaders(details);
  };
  try {
    runtimeApi.webRequest.onBeforeSendHeaders.addListener(
      listener,
      { urls: ["<all_urls>"] },
      ["requestHeaders", "extraHeaders"]
    );
  } catch {
    runtimeApi.webRequest.onBeforeSendHeaders.addListener(
      listener,
      { urls: ["<all_urls>"] },
      ["requestHeaders"]
    );
  }
}

async function withCapturedHeaderHints(payload) {
  const stored = await runtimeApi.storage.local.get({
    [HEADER_STORAGE_KEY]: [],
    [AUTH_PAYLOAD_STORAGE_KEY]: []
  });
  const items = Array.isArray(stored[HEADER_STORAGE_KEY]) ? stored[HEADER_STORAGE_KEY] : [];
  const directMatch = items.find((item) => item.url === payload.url);
  const pageMatch = items.find((item) => item.tabId === payload.tabId && item.referer);
  const match = directMatch || pageMatch;
  const authPayloadRef = payload.authPayloadRef || latestAuthorizationPayloadRefForUrl(stored[AUTH_PAYLOAD_STORAGE_KEY], payload.url, payload.pageUrl);
  if (!match && !authPayloadRef) {
    return payload;
  }
  const summary = match
    ? {
        has_cookie: Boolean(match.hasCookie),
        has_authorization: Boolean(match.hasAuthorization || authPayloadRef),
        captured_at: match.updatedAt
      }
    : {
        has_cookie: false,
        has_authorization: true,
        captured_at: "authorization_payload_ref"
      };
  return {
    ...payload,
    referer: payload.referer || match?.referer || payload.pageUrl || "",
    userAgent: payload.userAgent || match?.userAgent || "",
    authPayloadRef,
    headerSummary: summary
  };
}

async function rememberAuthorizationPayloadRef(payload) {
  const payloadRef = String(payload.payloadRef || "").trim();
  if (!payloadRef) {
    return;
  }
  const host = safeUrlHost(payload.pageUrl);
  const requestHost = safeUrlHost(payload.requestUrl);
  if (!host && !requestHost) {
    return;
  }
  const stored = await runtimeApi.storage.local.get({ [AUTH_PAYLOAD_STORAGE_KEY]: [] });
  const items = Array.isArray(stored[AUTH_PAYLOAD_STORAGE_KEY]) ? stored[AUTH_PAYLOAD_STORAGE_KEY] : [];
  const item = {
    payloadRef,
    host,
    requestHost,
    preview: String(payload.preview || ""),
    capturedAt: payload.capturedAt || new Date().toISOString(),
    storedAt: new Date().toISOString()
  };
  const nextItems = [item, ...items.filter((candidate) => candidate.payloadRef !== payloadRef)];
  await runtimeApi.storage.local.set({ [AUTH_PAYLOAD_STORAGE_KEY]: nextItems.slice(0, MAX_AUTH_PAYLOAD_REFS) });
}

function latestAuthorizationPayloadRefForUrl(items, rawUrl, pageUrl) {
  const refs = Array.isArray(items) ? items : [];
  const urlHost = safeUrlHost(rawUrl);
  const pageHost = safeUrlHost(pageUrl);
  const match = refs.find((item) =>
    hostMatchesAuthorizationRef(urlHost, item.requestHost || item.host) ||
    hostMatchesAuthorizationRef(urlHost, item.host) ||
    hostMatchesAuthorizationRef(pageHost, item.host)
  );
  return match?.payloadRef || "";
}

function hostMatchesAuthorizationRef(targetHost, allowedHost) {
  const target = String(targetHost || "").trim().toLowerCase().replace(/^\./, "");
  const allowed = String(allowedHost || "").trim().toLowerCase().replace(/^\./, "");
  return Boolean(target && allowed && (target === allowed || target.endsWith(`.${allowed}`)));
}

async function listMediaForTab(tabId) {
  const { allMedia } = await mediaItemsForTab(tabId);
  return allMedia.slice(0, 20);
}

async function mediaListResponseForTab(tabId) {
  const { allMedia } = await mediaItemsForTab(tabId);
  return {
    ok: true,
    media: allMedia.slice(0, 20),
    total: allMedia.length,
    limit: 20
  };
}

async function mediaItemsForTab(tabId) {
  const stored = await runtimeApi.storage.local.get({ [MEDIA_STORAGE_KEY]: [] });
  const items = Array.isArray(stored[MEDIA_STORAGE_KEY]) ? stored[MEDIA_STORAGE_KEY] : [];
  const allMedia = items.filter((item) => item.tabId === tabId);
  return { items, allMedia };
}

async function clearMediaForTab(tabId, options = {}) {
  const stored = await runtimeApi.storage.local.get({ [MEDIA_STORAGE_KEY]: [] });
  const items = Array.isArray(stored[MEDIA_STORAGE_KEY]) ? stored[MEDIA_STORAGE_KEY] : [];
  await runtimeApi.storage.local.set({
    [MEDIA_STORAGE_KEY]: items.filter((item) => item.tabId !== tabId)
  });
  if (options.refreshBadge !== false) {
    await refreshDetectedMediaActionState(tabId);
  }
}

async function clearShownMediaForTab(tabId, mediaIds = []) {
  const { items, allMedia } = await mediaItemsForTab(tabId);
  const selectedIds = normalizedMediaIdSet(mediaIds);
  const shownIds = selectedIds.size
    ? new Set(allMedia.filter((item) => selectedIds.has(item.id)).slice(0, 8).map((item) => item.id))
    : new Set(allMedia.slice(0, 8).map((item) => item.id));
  if (!shownIds.size) {
    return { ok: false, cleared: 0, remaining: 0, error: "No shown media candidates are available for this tab." };
  }
  const nextItems = items.filter((item) => item.tabId !== tabId || !shownIds.has(item.id));
  await runtimeApi.storage.local.set({ [MEDIA_STORAGE_KEY]: nextItems });
  await refreshDetectedMediaActionState(tabId);
  return {
    ok: true,
    cleared: items.length - nextItems.length,
    remaining: nextItems.filter((item) => item.tabId === tabId).length
  };
}

function normalizedMediaIdSet(value) {
  return new Set(
    (Array.isArray(value) ? value : [])
      .map((item) => String(item || "").trim())
      .filter(Boolean)
  );
}

function classifyMediaUrl(rawUrl, requestType) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }

  const path = parsed.pathname.toLowerCase();
  const lastSegment = path.split("/").pop() || "";
  const ext = lastSegment.includes(".") ? lastSegment.split(".").pop() : "";
  const streamGroupId = streamGroupIdForUrl(parsed);

  if (path.endsWith(".m3u8")) {
    return { kind: "hls", label: "HLS playlist", groupId: streamGroupId };
  }
  if (path.endsWith(".mpd")) {
    return { kind: "dash", label: "DASH manifest", groupId: streamGroupId };
  }
  if (["ts", "m4s", "cmfv", "cmfa", "m2ts"].includes(ext)) {
    return { kind: "stream", label: `${ext.toUpperCase()} segment`, groupId: streamGroupId, isSegment: true };
  }
  if (["mp4", "webm", "mov", "mkv", "m4v"].includes(ext)) {
    return { kind: "video", label: ext.toUpperCase() };
  }
  if (["mp3", "m4a", "aac", "flac", "ogg", "opus", "wav"].includes(ext)) {
    return { kind: "audio", label: ext.toUpperCase() };
  }
  if (["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(ext) && requestType === "image") {
    return { kind: "image", label: ext.toUpperCase() };
  }
  if (requestType === "media") {
    return { kind: "media", label: "Media request" };
  }

  return null;
}

function extensionKindForUrl(rawUrl, requestType = "media") {
  return classifyMediaUrl(rawUrl, requestType)?.kind || "video";
}

function contextMenuKindForUrl(rawUrl, menuItemId) {
  if (menuItemId === MENU_MEDIA_ID) {
    return extensionKindForUrl(rawUrl, "media");
  }
  if (menuItemId !== MENU_LINK_ID) {
    return "video";
  }
  return directLinkKindForUrl(rawUrl) || "video";
}

function directLinkKindForUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }
  const ext = (parsed.pathname.toLowerCase().split("/").pop() || "").split(".").pop() || "";
  if (["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(ext)) {
    return "image";
  }
  if (["mp3", "m4a", "aac", "flac", "ogg", "opus", "wav"].includes(ext)) {
    return "audio";
  }
  if (["mp4", "webm", "mov", "mkv", "m4v"].includes(ext)) {
    return "video";
  }
  if (ext === "pdf") {
    return "pdf";
  }
  if (["epub", "cbz"].includes(ext)) {
    return "book";
  }
  return null;
}

function streamGroupIdForUrl(parsed) {
  const folder = parsed.pathname.replace(/\/[^/]*$/, "/");
  return `stream-${stableMediaId(0, `${parsed.hostname}${folder}`)}`;
}

function rememberPendingStreamSegment(groupId) {
  const key = String(groupId || "").trim();
  if (!key) {
    return;
  }
  const existing = pendingStreamSegments.get(key) || { count: 0, lastSeenAt: "" };
  pendingStreamSegments.set(key, {
    count: Number(existing.count || 0) + 1,
    lastSeenAt: new Date().toISOString()
  });
  if (pendingStreamSegments.size > MAX_MEDIA_ITEMS) {
    const oldestKey = pendingStreamSegments.keys().next().value;
    pendingStreamSegments.delete(oldestKey);
  }
}

function takePendingStreamSegmentCount(groupId) {
  const key = String(groupId || "").trim();
  if (!key) {
    return 0;
  }
  const existing = pendingStreamSegments.get(key);
  pendingStreamSegments.delete(key);
  return Number(existing?.count || 0);
}

function isBlockedHost(rawUrl, blockedHosts) {
  const host = safeUrlHost(rawUrl);
  if (!host) {
    return false;
  }
  return blockedHosts.some((blocked) => {
    const normalized = String(blocked).trim().toLowerCase().replace(/^\*\./, "");
    return normalized && (host === normalized || host.endsWith(`.${normalized}`));
  });
}

function safeUrlHost(rawUrl) {
  try {
    return new URL(rawUrl).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function stableMediaId(tabId, rawUrl) {
  let hash = 0;
  const value = `${tabId}:${rawUrl}`;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return `media-${hash.toString(16)}`;
}

async function setActionState(text, color, options = {}) {
  if (!runtimeApi.action) {
    return;
  }
  const actionTarget = Number.isFinite(options.tabId) ? { tabId: options.tabId } : {};
  const resetKey = Number.isFinite(options.tabId) ? `tab:${options.tabId}` : "global";
  const existingResetTimer = actionResetTimers.get(resetKey);
  if (existingResetTimer) {
    clearTimeout(existingResetTimer);
    actionResetTimers.delete(resetKey);
  }
  await runtimeApi.action.setBadgeText({ ...actionTarget, text });
  if (color) {
    await runtimeApi.action.setBadgeBackgroundColor({ ...actionTarget, color });
  }
  if (runtimeApi.action.setTitle) {
    await runtimeApi.action.setTitle({ ...actionTarget, title: options.title || actionTitleForText(text) });
  }
  if (text && options.autoClear !== false) {
    const resetTabId = Number.isFinite(options.tabId) ? options.tabId : null;
    const timer = setTimeout(() => {
      actionResetTimers.delete(resetKey);
      void refreshDetectedMediaActionState(resetTabId);
    }, ACTION_RESET_MS);
    actionResetTimers.set(resetKey, timer);
  }
}

async function refreshDetectedMediaActionState(tabId = null) {
  if (!runtimeApi.action) {
    return;
  }
  const activeTabId = Number.isFinite(tabId) ? tabId : await currentActiveTabId();
  const stored = await runtimeApi.storage.local.get({ [MEDIA_STORAGE_KEY]: [] });
  const items = Array.isArray(stored[MEDIA_STORAGE_KEY]) ? stored[MEDIA_STORAGE_KEY] : [];
  const count = Number.isFinite(activeTabId)
    ? items.filter((item) => item.tabId === activeTabId).length
    : items.length;
  const text = count ? String(Math.min(count, 99)) : "";
  const actionTarget = Number.isFinite(activeTabId) ? { tabId: activeTabId } : {};
  await runtimeApi.action.setBadgeText({ ...actionTarget, text });
  if (count) {
    await runtimeApi.action.setBadgeBackgroundColor({ ...actionTarget, color: "#247153" });
  }
  if (runtimeApi.action.setTitle) {
    await runtimeApi.action.setTitle({
      ...actionTarget,
      title: count ? `${count} media candidate${count === 1 ? "" : "s"} detected on this tab for FetchDock.` : ACTION_DEFAULT_TITLE
    });
  }
}

async function currentActiveTabId() {
  try {
    const tabs = await runtimeApi.tabs.query({ active: true, currentWindow: true });
    const tabId = tabs[0]?.id;
    return Number.isFinite(tabId) ? tabId : null;
  } catch {
    return null;
  }
}

function actionTitleForText(text) {
  if (!text) {
    return ACTION_DEFAULT_TITLE;
  }
  if (/^\d+$/.test(text)) {
    return `${text} media candidate${text === "1" ? "" : "s"} detected on this tab for FetchDock.`;
  }
  const titles = {
    OK: "Sent to FetchDock.",
    OPEN: "Opened FetchDock through the desktop link fallback.",
    ERR: "FetchDock action failed.",
    CK: "Cookie payload staged for FetchDock.",
    AUTH: "Authorization payload staged for FetchDock."
  };
  return titles[text] || ACTION_DEFAULT_TITLE;
}
