const runtimeApi = globalThis.browser ?? globalThis.chrome;

const pageTitle = document.querySelector("#page-title");
const pageUrl = document.querySelector("#page-url");
const statusText = document.querySelector("#status");
const message = document.querySelector("#message");
const sendButton = document.querySelector("#send-page");
const captureCookiesButton = document.querySelector("#capture-cookies");
const captureAuthButton = document.querySelector("#capture-auth");
const checkBridgeButton = document.querySelector("#check-bridge");
const optionsButton = document.querySelector("#open-options");
const copyPageSummaryButton = document.querySelector("#copy-page-summary");
const mediaList = document.querySelector("#media-list");
const clearMediaButton = document.querySelector("#clear-media");
const sendShownMediaButton = document.querySelector("#send-media-shown");
const copyShownMediaButton = document.querySelector("#copy-media-shown");
const copyMediaDetailsButton = document.querySelector("#copy-media-details");
const copyMediaJsonButton = document.querySelector("#copy-media-json");
const clearShownMediaButton = document.querySelector("#clear-media-shown");
const mediaKindFilter = document.querySelector("#media-kind-filter");
const mediaSummary = document.querySelector("#media-summary");

const DEFAULT_SETTINGS = {
  bridgeBaseUrl: "http://127.0.0.1:17654",
  bridgeDiscoveryPorts: Array.from({ length: 11 }, (_, index) => 17654 + index),
  useDeepLinkFallback: true,
  pairingToken: "",
  mediaSnifferEnabled: true,
  headerCaptureEnabled: true,
  blockedHosts: []
};

let activeTab = null;
let currentMediaItems = [];
let currentMediaTotal = 0;
let currentVisibleMediaItems = [];

init();

async function init() {
  try {
    const tabs = await runtimeApi.tabs.query({ active: true, currentWindow: true });
    activeTab = tabs[0] ?? null;
    pageTitle.textContent = activeTab?.title || "Untitled page";
    pageUrl.textContent = activeTab?.url || "No URL available";
    const settings = normalizeSettings(await runtimeApi.storage.local.get(DEFAULT_SETTINGS));
    const isSupportedPage = /^https?:\/\//i.test(activeTab?.url || "");
    const isBlockedPage = isBlockedHost(activeTab?.url || "", settings.blockedHosts);
    sendButton.disabled = !isSupportedPage || isBlockedPage;
    captureCookiesButton.disabled = sendButton.disabled;
    captureAuthButton.disabled = sendButton.disabled;
    statusText.textContent = !isSupportedPage ? "Unsupported" : isBlockedPage ? "Blocked" : "Ready";
    if (isBlockedPage) {
      setMessage("This host is blocked by the FetchDock extension settings.", true);
    }
    await refreshMediaList();
  } catch (error) {
    setMessage(error instanceof Error ? error.message : String(error), true);
    sendButton.disabled = true;
    captureCookiesButton.disabled = true;
    captureAuthButton.disabled = true;
  }
}

sendButton.addEventListener("click", async () => {
  if (!(await ensureActivePageAllowed())) {
    return;
  }
  sendButton.disabled = true;
  statusText.textContent = "Sending";
  setMessage("Sending to FetchDock.", false);
  try {
    const result = await runtimeApi.runtime.sendMessage({
      type: "fetchdock.send",
      url: activeTab.url,
      title: activeTab.title ?? "",
      source: "popup",
      tabId: activeTab.id,
      pageUrl: activeTab.url
    });
    if (result?.ok) {
      statusText.textContent = result.mode === "deep_link" ? "Opened" : "Sent";
      setMessage(result.mode === "deep_link" ? "Opened FetchDock through the desktop link." : `Sent through ${result.bridgeBaseUrl || "the local bridge"}.`, false);
    } else {
      statusText.textContent = "Failed";
      setMessage(result?.error || "FetchDock did not accept the page.", true);
    }
  } catch (error) {
    statusText.textContent = "Failed";
    setMessage(error instanceof Error ? error.message : String(error), true);
  } finally {
    sendButton.disabled = false;
  }
});

optionsButton.addEventListener("click", () => {
  runtimeApi.runtime.openOptionsPage();
});

checkBridgeButton.addEventListener("click", checkBridge);
copyPageSummaryButton.addEventListener("click", copyPageSummary);

sendShownMediaButton.addEventListener("click", sendShownMediaItems);

copyShownMediaButton.addEventListener("click", copyShownMediaUrls);
copyMediaDetailsButton.addEventListener("click", copyShownMediaDetails);
copyMediaJsonButton.addEventListener("click", copyShownMediaJson);
mediaKindFilter.addEventListener("change", () => renderMedia(currentMediaItems, currentMediaTotal));

captureCookiesButton.addEventListener("click", async () => {
  if (!(await ensureActivePageAllowed())) {
    return;
  }
  captureCookiesButton.disabled = true;
  statusText.textContent = "Capturing";
  setMessage("Sending captured cookies to the local bridge.", false);
  try {
    const result = await runtimeApi.runtime.sendMessage({
      type: "fetchdock.cookies.capture",
      tabId: activeTab.id,
      pageUrl: activeTab.url,
      source: "popup"
    });
    if (result?.ok) {
      statusText.textContent = "Captured";
      setMessage(`Cookie payload ready: ${result.payloadRef || "created"}. Import it in FetchDock Settings.`, false);
    } else {
      statusText.textContent = "Failed";
      setMessage(result?.error || "No cookie payload was created.", true);
    }
  } catch (error) {
    statusText.textContent = "Failed";
    setMessage(error instanceof Error ? error.message : String(error), true);
  } finally {
    captureCookiesButton.disabled = false;
  }
});

captureAuthButton.addEventListener("click", async () => {
  if (!(await ensureActivePageAllowed())) {
    return;
  }
  captureAuthButton.disabled = true;
  statusText.textContent = "Capturing";
  setMessage("Sending captured authorization header to the local bridge.", false);
  try {
    const result = await runtimeApi.runtime.sendMessage({
      type: "fetchdock.auth.capture",
      tabId: activeTab.id,
      pageUrl: activeTab.url,
      source: "popup"
    });
    if (result?.ok) {
      statusText.textContent = "Captured";
      setMessage(`Authorization payload ready: ${result.payloadRef || "created"}${result.preview ? ` (${result.preview})` : ""}.`, false);
    } else {
      statusText.textContent = "Failed";
      setMessage(result?.error || "No authorization payload was created.", true);
    }
  } catch (error) {
    statusText.textContent = "Failed";
    setMessage(error instanceof Error ? error.message : String(error), true);
  } finally {
    captureAuthButton.disabled = false;
  }
});

clearMediaButton.addEventListener("click", async () => {
  if (!activeTab?.id) {
    return;
  }
  await runtimeApi.runtime.sendMessage({
    type: "fetchdock.media.clear",
    tabId: activeTab.id
  });
  await refreshMediaList();
  setMessage("Detected media cleared for this tab.", false);
});

clearShownMediaButton.addEventListener("click", async () => {
  if (!activeTab?.id) {
    return;
  }
  clearShownMediaButton.disabled = true;
  sendShownMediaButton.disabled = true;
  try {
    const result = await runtimeApi.runtime.sendMessage({
      type: "fetchdock.media.clear_shown",
      tabId: activeTab.id,
      mediaIds: currentVisibleMediaItems.map((item) => item.id).filter(Boolean)
    });
    if (result?.ok) {
      setMessage(`${result.cleared || 0} shown media candidate${result.cleared === 1 ? "" : "s"} cleared.`, false);
    } else {
      setMessage(result?.error || "Shown media candidates were not cleared.", true);
    }
  } catch (error) {
    setMessage(error instanceof Error ? error.message : String(error), true);
  } finally {
    await refreshMediaList();
  }
});

function setMessage(text, isError) {
  message.textContent = text;
  message.className = isError ? "error" : "";
}

async function ensureActivePageAllowed() {
  if (!activeTab?.url) {
    setMessage("No page URL was available.", true);
    return false;
  }
  if (!/^https?:\/\//i.test(activeTab.url)) {
    setMessage("Only http and https pages can be sent or captured.", true);
    return false;
  }
  const settings = normalizeSettings(await runtimeApi.storage.local.get(DEFAULT_SETTINGS));
  if (isBlockedHost(activeTab.url, settings.blockedHosts)) {
    statusText.textContent = "Blocked";
    sendButton.disabled = true;
    captureCookiesButton.disabled = true;
    captureAuthButton.disabled = true;
    setMessage("This host is blocked by the FetchDock extension settings.", true);
    return false;
  }
  return true;
}

async function refreshMediaList() {
  if (!activeTab?.id) {
    renderMedia([]);
    return;
  }
  const response = await runtimeApi.runtime.sendMessage({
    type: "fetchdock.media.list",
    tabId: activeTab.id
  });
  currentMediaItems = response?.media || [];
  currentMediaTotal = response?.total ?? currentMediaItems.length;
  renderMedia(currentMediaItems, currentMediaTotal);
}

async function checkBridge() {
  checkBridgeButton.disabled = true;
  statusText.textContent = "Checking";
  setMessage("Checking the local bridge.", false);
  try {
    const result = await runtimeApi.runtime.sendMessage({ type: "fetchdock.bridge.check" });
    const body = result?.health ?? {};
    const bridgeBaseUrl = result?.bridgeBaseUrl || DEFAULT_SETTINGS.bridgeBaseUrl;
    if (!result?.ok) {
      statusText.textContent = "Failed";
      setMessage(result?.error ? `Bridge check failed: ${result.error}` : "Bridge check failed.", true);
      return;
    }
    if (body.token_required && !body.token_valid) {
      statusText.textContent = "Pairing";
      setMessage("Bridge is reachable, but the saved pairing token is missing, invalid, or expired.", true);
      return;
    }
    statusText.textContent = "Bridge OK";
    const tokenText = body.token_required ? "pairing token accepted" : "no token required";
    setMessage(`Bridge reachable on port ${body.port || new URL(bridgeBaseUrl).port || "unknown"}; ${tokenText}.`, false);
  } catch (error) {
    statusText.textContent = "Failed";
    setMessage(error instanceof Error ? `Bridge check failed: ${error.message}` : "Bridge check failed.", true);
  } finally {
    checkBridgeButton.disabled = false;
  }
}

async function copyPageSummary() {
  copyPageSummaryButton.disabled = true;
  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard write is not available in this browser context.");
    }
    const settings = normalizeSettings(await runtimeApi.storage.local.get(DEFAULT_SETTINGS));
    const selectedKind = mediaKindFilter.value || "all";
    const kindCounts = mediaKindCounts(currentMediaItems);
    const lines = [
      "FetchDock connector page summary",
      `page title: ${activeTab?.title || "Untitled page"}`,
      `page url: ${activeTab?.url || "No URL available"}`,
      `tab id: ${Number.isFinite(activeTab?.id) ? activeTab.id : "unknown"}`,
      `popup status: ${statusText.textContent || "unknown"}`,
      `media total: ${currentMediaTotal}`,
      `media loaded: ${currentMediaItems.length}`,
      `media shown: ${currentVisibleMediaItems.length}`,
      `media kind filter: ${selectedKind}`,
      `media kind counts: ${kindCounts.length ? kindCounts.map(([kind, count]) => `${kind}=${count}`).join(", ") : "(none)"}`,
      `current page blocked: ${isBlockedHost(activeTab?.url || "", settings.blockedHosts) ? "yes" : "no"}`,
      `bridge: ${settings.bridgeBaseUrl}`,
      `discovery ports: ${settings.bridgeDiscoveryPorts.join(", ")}`,
      `deep link fallback: ${settings.useDeepLinkFallback ? "on" : "off"}`,
      `media sniffer: ${settings.mediaSnifferEnabled ? "on" : "off"}`,
      `header capture: ${settings.headerCaptureEnabled ? "on" : "off"}`,
      `blocked hosts: ${settings.blockedHosts.length}`,
      `pairing token configured: ${settings.pairingToken ? "yes" : "no"}`,
      "pairing token value copied: no",
      "Cookie values copied: no",
      "Authorization header values copied: no",
      "browser storage payload bodies copied: no"
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setMessage("Page summary copied without tokens, Cookie values, Authorization headers, or payload bodies.", false);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : String(error), true);
  } finally {
    copyPageSummaryButton.disabled = false;
  }
}

function renderMedia(items, totalCount = items.length) {
  mediaList.replaceChildren();
  syncMediaKindFilter(items);
  const selectedKind = mediaKindFilter.value || "all";
  const filteredItems = selectedKind === "all" ? items : items.filter((item) => (item.kind || "media") === selectedKind);
  const visibleItems = filteredItems.slice(0, 8);
  currentVisibleMediaItems = visibleItems;
  const hiddenCount = Math.max(0, filteredItems.length - visibleItems.length);
  const filteredText = selectedKind === "all" ? "" : ` · ${filteredItems.length}/${items.length} ${selectedKind}`;
  mediaSummary.textContent = hiddenCount
    ? `${visibleItems.length} shown · ${hiddenCount} more${filteredText}`
    : `${visibleItems.length} shown${filteredText}`;
  if (!items.length) {
    mediaList.className = "media-list empty";
    mediaList.textContent = "No media requests yet.";
    setMediaActionButtons(false, 0);
    return;
  }
  if (!filteredItems.length) {
    mediaList.className = "media-list empty";
    mediaList.textContent = "No media requests match this kind.";
    setMediaActionButtons(false, 0);
    return;
  }
  setMediaActionButtons(true, visibleItems.length);
  mediaList.className = "media-list";
  for (const item of visibleItems) {
    const segmentText = item.segmentCount ? ` · ${item.segmentCount} segment${item.segmentCount === 1 ? "" : "s"}` : "";
    const row = document.createElement("article");
    row.className = "media-item";
    row.title = item.url;
    row.innerHTML = `
      <span>
        <strong>${escapeHtml(item.kind || "media")} · ${escapeHtml(item.label || item.host || "resource")}</strong>
        <small>${escapeHtml(item.host || "")}${escapeHtml(segmentText)}</small>
      </span>
      <code>${escapeHtml(item.url || "")}</code>
      <div class="media-item-actions">
        <button class="link-button" type="button" data-action="send">Send</button>
        <button class="link-button" type="button" data-action="open">Open</button>
      </div>
    `;
    row.querySelector('[data-action="send"]')?.addEventListener("click", () => sendMediaItem(item));
    row.querySelector('[data-action="open"]')?.addEventListener("click", () => openMediaItemSource(item));
    mediaList.append(row);
  }
}

function setMediaActionButtons(enabled, count) {
  sendShownMediaButton.disabled = !enabled;
  copyShownMediaButton.disabled = !enabled;
  copyMediaDetailsButton.disabled = !enabled;
  copyMediaJsonButton.disabled = !enabled;
  clearShownMediaButton.disabled = !enabled;
  sendShownMediaButton.textContent = enabled ? `Send shown (${count})` : "Send shown";
  copyShownMediaButton.textContent = enabled ? `Copy URLs (${count})` : "Copy URLs";
  copyMediaDetailsButton.textContent = enabled ? `Copy details (${count})` : "Copy details";
  copyMediaJsonButton.textContent = enabled ? `Copy JSON (${count})` : "Copy JSON";
  clearShownMediaButton.textContent = enabled ? `Clear shown (${count})` : "Clear shown";
}

function syncMediaKindFilter(items) {
  const current = mediaKindFilter.value || "all";
  const kinds = ["all", ...Array.from(new Set(items.map((item) => item.kind || "media").filter(Boolean))).sort()];
  mediaKindFilter.replaceChildren(
    ...kinds.map((kind) => {
      const option = document.createElement("option");
      option.value = kind;
      option.textContent = kind === "all" ? "All media" : kind;
      return option;
    })
  );
  mediaKindFilter.value = kinds.includes(current) ? current : "all";
  mediaKindFilter.disabled = items.length === 0;
}

function mediaKindCounts(items) {
  const counts = new Map();
  for (const item of items) {
    const kind = item.kind || "media";
    counts.set(kind, (counts.get(kind) || 0) + 1);
  }
  return Array.from(counts.entries()).sort(([left], [right]) => left.localeCompare(right));
}

function normalizeSettings(settings) {
  return {
    ...DEFAULT_SETTINGS,
    bridgeBaseUrl: normalizeLocalBridgeUrl(settings.bridgeBaseUrl),
    bridgeDiscoveryPorts: normalizeBridgeDiscoveryPorts(settings.bridgeDiscoveryPorts),
    useDeepLinkFallback: settings.useDeepLinkFallback !== false,
    pairingToken: String(settings.pairingToken || "").trim(),
    mediaSnifferEnabled: settings.mediaSnifferEnabled !== false,
    headerCaptureEnabled: settings.headerCaptureEnabled !== false,
    blockedHosts: Array.isArray(settings.blockedHosts)
      ? settings.blockedHosts.map((host) => String(host || "").trim().toLowerCase()).filter(Boolean)
      : []
  };
}

function normalizeLocalBridgeUrl(value) {
  const raw = String(value || DEFAULT_SETTINGS.bridgeBaseUrl).trim().replace(/\/+$/, "");
  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.toLowerCase();
    if ((host === "127.0.0.1" || host === "localhost") && (parsed.protocol === "http:" || parsed.protocol === "https:")) {
      return parsed.origin;
    }
  } catch {
    // Fall through to the default bridge URL.
  }
  return DEFAULT_SETTINGS.bridgeBaseUrl;
}

function normalizeBridgeDiscoveryPorts(value) {
  const rawValues = Array.isArray(value)
    ? value
    : String(value || "")
        .split(/[\s,;]+/)
        .filter(Boolean);
  const ports = rawValues
    .map((port) => Number(port))
    .filter((port) => Number.isInteger(port) && port >= 1 && port <= 65535);
  const unique = Array.from(new Set(ports));
  return unique.length ? unique.slice(0, 32) : DEFAULT_SETTINGS.bridgeDiscoveryPorts;
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
async function sendShownMediaItems() {
  if (!activeTab?.id) {
    setMessage("No active tab was available.", true);
    return;
  }
  sendShownMediaButton.disabled = true;
  clearShownMediaButton.disabled = true;
  statusText.textContent = "Sending";
  setMessage("Sending detected media shown in this popup.", false);
  try {
    const result = await runtimeApi.runtime.sendMessage({
      type: "fetchdock.media.send_shown",
      tabId: activeTab.id,
      pageUrl: activeTab.url,
      mediaIds: currentVisibleMediaItems.map((item) => item.id).filter(Boolean)
    });
    if (result?.ok) {
      statusText.textContent = result.mode === "deep_link" ? "Opened" : "Sent";
      const failedText = result.failed ? `, ${result.failed} failed` : "";
      const attempted = result.attempted || result.sent || 0;
      const hiddenText = result.available && result.available > attempted ? ` ${result.available - attempted} not shown.` : "";
      setMessage(`${result.sent || 0}/${attempted} detected media item${attempted === 1 ? "" : "s"} sent${failedText}.${hiddenText}`, Boolean(result.failed));
    } else {
      statusText.textContent = "Failed";
      setMessage(result?.error || "No detected media was sent.", true);
    }
  } catch (error) {
    statusText.textContent = "Failed";
    setMessage(error instanceof Error ? error.message : String(error), true);
  } finally {
    await refreshMediaList();
  }
}

async function copyShownMediaUrls() {
  const urls = Array.from(new Set(currentVisibleMediaItems.map((item) => item.url).filter(Boolean)));
  if (urls.length === 0) {
    setMessage("No shown media URLs are available to copy.", true);
    return;
  }
  copyShownMediaButton.disabled = true;
  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard write is not available in this browser context.");
    }
    await navigator.clipboard.writeText(urls.join("\n"));
    setMessage(`${urls.length} shown media URL${urls.length === 1 ? "" : "s"} copied.`, false);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : String(error), true);
  } finally {
    copyShownMediaButton.disabled = currentVisibleMediaItems.length === 0;
  }
}

async function copyShownMediaDetails() {
  const rows = currentVisibleMediaItems
    .map((item) => [
      item.kind || "media",
      item.label || "",
      item.host || "",
      String(item.segmentCount || 0),
      String(item.pendingSegmentCount || 0),
      item.url || ""
    ].map(formatTsvField).join("\t"));
  if (rows.length === 0) {
    setMessage("No shown media details are available to copy.", true);
    return;
  }
  copyMediaDetailsButton.disabled = true;
  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard write is not available in this browser context.");
    }
    await navigator.clipboard.writeText(["kind\tlabel\thost\tsegments\tpending_segments\turl", ...rows].join("\n"));
    setMessage(`${rows.length} shown media detail row${rows.length === 1 ? "" : "s"} copied.`, false);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : String(error), true);
  } finally {
    copyMediaDetailsButton.disabled = currentVisibleMediaItems.length === 0;
  }
}

async function copyShownMediaJson() {
  if (currentVisibleMediaItems.length === 0) {
    setMessage("No shown media JSON is available to copy.", true);
    return;
  }
  copyMediaJsonButton.disabled = true;
  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard write is not available in this browser context.");
    }
    const payload = {
      schema_version: 1,
      kind: "fetchdock.browser_extension.visible_media",
      copied_at: new Date().toISOString(),
      page: {
        title: activeTab?.title || "",
        url: activeTab?.url || "",
        tab_id: Number.isFinite(activeTab?.id) ? activeTab.id : null
      },
      selected_kind: mediaKindFilter.value || "all",
      loaded_count: currentMediaItems.length,
      total_count: currentMediaTotal,
      shown_count: currentVisibleMediaItems.length,
      media: currentVisibleMediaItems.map((item) => ({
        id: item.id || "",
        kind: item.kind || "media",
        label: item.label || "",
        host: item.host || "",
        url: item.url || "",
        page_url: item.pageUrl || "",
        source_type: item.sourceType || "",
        group_id: item.groupId || "",
        segment_count: Number(item.segmentCount || 0),
        pending_segment_count: Number(item.pendingSegmentCount || 0),
        request_count: Number(item.count || 0),
        first_seen_at: item.firstSeenAt || "",
        last_seen_at: item.lastSeenAt || ""
      })),
      privacy: {
        pairing_token_value_copied: false,
        cookie_values_copied: false,
        authorization_header_values_copied: false,
        browser_storage_payload_bodies_copied: false
      }
    };
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setMessage(`${currentVisibleMediaItems.length} shown media JSON item${currentVisibleMediaItems.length === 1 ? "" : "s"} copied without tokens or captured headers.`, false);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : String(error), true);
  } finally {
    copyMediaJsonButton.disabled = currentVisibleMediaItems.length === 0;
  }
}

function formatTsvField(value) {
  return String(value ?? "").replace(/[\t\r\n]+/g, " ").trim();
}
async function sendMediaItem(item) {
  statusText.textContent = "Sending";
  setMessage("Sending detected media to FetchDock.", false);
  try {
    const result = await runtimeApi.runtime.sendMessage({
      type: "fetchdock.send",
      url: item.url,
      title: item.pageTitle || item.label || item.host || "Detected media",
      source: `media_sniffer:${item.kind || "media"}`,
      kind: item.kind || "media",
      tabId: item.tabId,
      pageUrl: item.pageUrl
    });
    if (result?.ok) {
      statusText.textContent = result.mode === "deep_link" ? "Opened" : "Sent";
      setMessage(result.mode === "deep_link" ? "Opened FetchDock through the desktop link." : `Sent detected media through ${result.bridgeBaseUrl || "the local bridge"}.`, false);
    } else {
      statusText.textContent = "Failed";
      setMessage(result?.error || "FetchDock did not accept the media URL.", true);
    }
  } catch (error) {
    statusText.textContent = "Failed";
    setMessage(error instanceof Error ? error.message : String(error), true);
  }
}

async function openMediaItemSource(item) {
  const url = String(item?.url || "").trim();
  if (!/^https?:\/\//i.test(url)) {
    setMessage("Only http and https media URLs can be opened.", true);
    return;
  }
  try {
    await runtimeApi.tabs.create({ url });
    setMessage("Opened the detected media source URL in a new tab.", false);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : String(error), true);
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
