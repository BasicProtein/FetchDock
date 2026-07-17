const DEFAULT_SETTINGS = {
  bridgeBaseUrl: "http://127.0.0.1:17654",
  bridgeDiscoveryPorts: Array.from({ length: 11 }, (_, index) => 17654 + index),
  useDeepLinkFallback: true,
  pairingToken: "",
  mediaSnifferEnabled: true,
  headerCaptureEnabled: true,
  blockedHosts: []
};

const BRIDGE_HEALTH_TIMEOUT_MS = 1500;

const runtimeApi = globalThis.browser ?? globalThis.chrome;
const bridgeUrl = document.querySelector("#bridge-url");
const bridgeDiscoveryPorts = document.querySelector("#bridge-discovery-ports");
const pairingToken = document.querySelector("#pairing-token");
const deepLink = document.querySelector("#deep-link");
const mediaSniffer = document.querySelector("#media-sniffer");
const headerCapture = document.querySelector("#header-capture");
const blockedHosts = document.querySelector("#blocked-hosts");
const connectorProfile = document.querySelector("#connector-profile");
const checkBridgeButton = document.querySelector("#check-bridge");
const copySummaryButton = document.querySelector("#copy-summary");
const copyJsonButton = document.querySelector("#copy-json");
const message = document.querySelector("#message");

init();

document.querySelector("#save").addEventListener("click", saveSettings);
checkBridgeButton.addEventListener("click", checkBridge);
copySummaryButton.addEventListener("click", copySafeSummary);
copyJsonButton.addEventListener("click", copySafeJson);
document.querySelector("#import-profile").addEventListener("click", importConnectorProfile);
document.querySelector("#reset").addEventListener("click", resetSettings);

async function init() {
  const settings = await runtimeApi.storage.local.get(DEFAULT_SETTINGS);
  bridgeUrl.value = settings.bridgeBaseUrl || DEFAULT_SETTINGS.bridgeBaseUrl;
  bridgeDiscoveryPorts.value = normalizeBridgeDiscoveryPorts(settings.bridgeDiscoveryPorts).join(",");
  pairingToken.value = settings.pairingToken || "";
  deepLink.checked = settings.useDeepLinkFallback !== false;
  mediaSniffer.checked = settings.mediaSnifferEnabled !== false;
  headerCapture.checked = settings.headerCaptureEnabled !== false;
  blockedHosts.value = Array.isArray(settings.blockedHosts) ? settings.blockedHosts.join("\n") : "";
}

async function saveSettings() {
  const url = normalizeLocalBridgeUrl(bridgeUrl.value);
  if (!url) {
    setMessage("Enter a local bridge URL on 127.0.0.1 or localhost.", true);
    return;
  }
  await runtimeApi.storage.local.set({
    bridgeBaseUrl: url,
    bridgeDiscoveryPorts: normalizeBridgeDiscoveryPorts(bridgeDiscoveryPorts.value),
    pairingToken: pairingToken.value.trim(),
    useDeepLinkFallback: deepLink.checked,
    mediaSnifferEnabled: mediaSniffer.checked,
    headerCaptureEnabled: headerCapture.checked,
    blockedHosts: parseHosts(blockedHosts.value)
  });
  setMessage("Settings saved.", false);
}

async function resetSettings() {
  await runtimeApi.storage.local.set(DEFAULT_SETTINGS);
  await init();
  setMessage("Settings reset.", false);
}

async function copySafeSummary() {
  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard write is not available in this browser context.");
    }
    const payload = safeSettingsPayload();
    const lines = [
      "FetchDock connector settings",
      `bridge: ${payload.bridgeBaseUrl}`,
      `discovery ports: ${payload.bridgeDiscoveryPorts.join(", ")}`,
      `deep link fallback: ${payload.useDeepLinkFallback ? "on" : "off"}`,
      `media sniffer: ${payload.mediaSnifferEnabled ? "on" : "off"}`,
      `header capture: ${payload.headerCaptureEnabled ? "on" : "off"}`,
      `blocked hosts: ${payload.blockedHosts.length}`,
      `blocked host list: ${payload.blockedHosts.length ? payload.blockedHosts.join(", ") : "(none)"}`,
      `pairing token configured: ${payload.pairingTokenConfigured ? "yes" : "no"}`,
      "secret values copied: no",
      "captured Cookie/Auth payloads copied: no"
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setMessage("Safe settings summary copied without pairing tokens, Cookie values, or Authorization headers.", false);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : String(error), true);
  }
}

async function copySafeJson() {
  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard write is not available in this browser context.");
    }
    const payload = {
      kind: "fetchdock.browser_extension.options.safe_settings",
      schemaVersion: 1,
      copiedAt: new Date().toISOString(),
      settings: safeSettingsPayload(),
      privacy: {
        pairingTokenValueCopied: false,
        cookieValuesCopied: false,
        authorizationHeaderValuesCopied: false,
        browserStoragePayloadBodiesCopied: false,
        capturedPayloadBodiesCopied: false
      }
    };
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setMessage("Safe settings JSON copied without pairing tokens, Cookie values, or Authorization headers.", false);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : String(error), true);
  }
}

function safeSettingsPayload() {
  const url = normalizeLocalBridgeUrl(bridgeUrl.value) || DEFAULT_SETTINGS.bridgeBaseUrl;
  const ports = normalizeBridgeDiscoveryPorts(bridgeDiscoveryPorts.value);
  const hosts = parseHosts(blockedHosts.value);
  return {
    bridgeBaseUrl: url,
    bridgeDiscoveryPorts: ports,
    useDeepLinkFallback: deepLink.checked,
    mediaSnifferEnabled: mediaSniffer.checked,
    headerCaptureEnabled: headerCapture.checked,
    blockedHosts: hosts,
    blockedHostCount: hosts.length,
    pairingTokenConfigured: Boolean(pairingToken.value.trim())
  };
}

async function importConnectorProfile() {
  const raw = connectorProfile.value.trim();
  if (!raw) {
    setMessage("Paste a connector profile JSON first.", true);
    return;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    setMessage(error instanceof Error ? `Profile JSON is invalid: ${error.message}` : "Profile JSON is invalid.", true);
    return;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    setMessage("Profile JSON must be an object.", true);
    return;
  }
  const url = normalizeLocalBridgeUrl(
    parsed.bridgeBaseUrl ||
      parsed.bridge_url ||
      parsed.bridgeUrl ||
      bridgeUrlFromDefaultPort(parsed.defaultBridgePort ?? parsed.default_bridge_port)
  );
  if (!url) {
    setMessage("Profile must include a local bridge URL on 127.0.0.1 or localhost.", true);
    return;
  }
  const appId = String(parsed.appId || parsed.app_id || "").trim();
  const profileVersion = Number(parsed.profileVersion || parsed.profile_version || parsed.schema_version || 0);
  const discoveryPorts = normalizeBridgeDiscoveryPorts(
    parsed.bridgeDiscoveryPorts ?? parsed.bridge_discovery_ports ?? parsed.discovery_ports
  );

  bridgeUrl.value = url;
  bridgeDiscoveryPorts.value = discoveryPorts.join(",");
  pairingToken.value = String(parsed.pairingToken || parsed.pairing_token || parsed.token || "").trim();
  deepLink.checked = parsed.useDeepLinkFallback ?? parsed.deep_link_fallback ?? true;
  mediaSniffer.checked = parsed.mediaSnifferEnabled ?? parsed.media_sniffer_enabled ?? parsed.capture_media ?? parsed.captureMedia ?? true;
  headerCapture.checked = parsed.headerCaptureEnabled ?? parsed.header_capture_enabled ?? parsed.capture_headers ?? parsed.headerCapture ?? true;
  blockedHosts.value = parseHostsInput(parsed.blockedHosts ?? parsed.blocked_hosts ?? "").join("\n");
  await saveSettings();
  connectorProfile.value = "";
  const profileLabel = appId === "dev.fetchdock.desktop" ? `FetchDock profile v${profileVersion || 1}` : "Connector profile";
  setMessage(`${profileLabel} imported and saved.`, false);
}

async function checkBridge() {
  const url = normalizeLocalBridgeUrl(bridgeUrl.value);
  if (!url) {
    setMessage("Enter a local bridge URL on 127.0.0.1 or localhost.", true);
    return;
  }
  const ports = normalizeBridgeDiscoveryPorts(bridgeDiscoveryPorts.value);
  checkBridgeButton.disabled = true;
  setMessage("Checking local bridge and discovery ports.", false);
  try {
    const result = await resolveBridgeBaseUrl(url, ports, pairingToken.value.trim());
    if (!result.ok) {
      setMessage(result.error || "Bridge check failed.", true);
      return;
    }
    bridgeUrl.value = result.bridgeBaseUrl;
    await runtimeApi.storage.local.set({
      bridgeBaseUrl: result.bridgeBaseUrl,
      bridgeDiscoveryPorts: ports
    });
    if (result.health.token_required && !result.health.token_valid) {
      setMessage("Bridge reachable, but the pairing token is missing, invalid, or expired.", true);
      return;
    }
    const tokenText = result.health.token_required ? "pairing token accepted" : "no token required";
    const foundText = result.bridgeBaseUrl === url ? "configured port" : `discovered ${result.bridgeBaseUrl}`;
    setMessage(`Bridge reachable on ${foundText}; port ${result.health.port || new URL(result.bridgeBaseUrl).port || "unknown"}; ${tokenText}.`, false);
  } catch (error) {
    setMessage(error instanceof Error ? `Bridge check failed: ${error.message}` : "Bridge check failed.", true);
  } finally {
    checkBridgeButton.disabled = false;
  }
}

async function resolveBridgeBaseUrl(configured, discoveryPorts, token) {
  const configuredHealth = await checkBridgeHealth(configured, token);
  if (configuredHealth.ok) {
    return { ok: true, bridgeBaseUrl: configured, health: configuredHealth.health };
  }

  for (const candidate of bridgeDiscoveryCandidates(configured, discoveryPorts)) {
    if (candidate === configured) {
      continue;
    }
    const candidateHealth = await checkBridgeHealth(candidate, token);
    if (candidateHealth.ok) {
      return { ok: true, bridgeBaseUrl: candidate, health: candidateHealth.health };
    }
  }

  return {
    ok: false,
    error: `FetchDock bridge was not found at ${configured} or ports ${discoveryPorts.join(", ")}.`
  };
}

async function checkBridgeHealth(baseUrl, token) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BRIDGE_HEALTH_TIMEOUT_MS);
  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: "GET",
      cache: "no-store",
      headers: token ? { "X-FetchDock-Token": token } : {},
      signal: controller.signal
    });
    const health = await response.json().catch(() => ({}));
    if (!response.ok || health.ok === false) {
      return { ok: false, error: `Bridge returned HTTP ${response.status}.` };
    }
    return { ok: true, health };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

function bridgeDiscoveryCandidates(configured, discoveryPorts) {
  const parsed = safeUrl(configured);
  const configuredHost = parsed?.hostname === "localhost" ? "localhost" : "127.0.0.1";
  const hosts = Array.from(new Set([configuredHost, "127.0.0.1", "localhost"]));
  return hosts.flatMap((host) => discoveryPorts.map((port) => `http://${host}:${port}`));
}

function setMessage(text, isError) {
  message.textContent = text;
  message.className = isError ? "error" : "";
}

function parseHosts(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return normalizeHosts(parsed);
    }
    if (Array.isArray(parsed?.blockedHosts)) {
      return normalizeHosts(parsed.blockedHosts);
    }
  } catch {
    // Fall through to newline/comma parsing.
  }
  return normalizeHosts(raw.split(/\r?\n|,/));
}

function parseHostsInput(value) {
  if (Array.isArray(value)) {
    return normalizeHosts(value);
  }
  if (value && typeof value === "object" && Array.isArray(value.blockedHosts)) {
    return normalizeHosts(value.blockedHosts);
  }
  return parseHosts(value);
}

function normalizeBridgeDiscoveryPorts(value) {
  const rawPorts = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/\r?\n|,/)
      : DEFAULT_SETTINGS.bridgeDiscoveryPorts;
  const ports = [];
  for (const rawPort of rawPorts) {
    const port = Number(rawPort);
    if (Number.isInteger(port) && port > 0 && port <= 65535 && !ports.includes(port)) {
      ports.push(port);
    }
  }
  return ports.length ? ports : DEFAULT_SETTINGS.bridgeDiscoveryPorts;
}

function bridgeUrlFromDefaultPort(value) {
  const port = Number(value);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    return "";
  }
  return `http://127.0.0.1:${port}`;
}

function normalizeHosts(values) {
  const hosts = [];
  for (const value of values) {
    const host = normalizeHost(value);
    if (host && !hosts.includes(host)) {
      hosts.push(host);
    }
  }
  return hosts;
}

function normalizeHost(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .replace(/^\.+|\.+$/g, "");
}

function normalizeLocalBridgeUrl(value) {
  try {
    const parsed = new URL(String(value || "").trim());
    if (parsed.protocol !== "http:" || !["127.0.0.1", "localhost"].includes(parsed.hostname)) {
      return "";
    }
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return "";
  }
}

function safeUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}
