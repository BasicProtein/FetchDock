const runtimeApi = globalThis.browser ?? globalThis.chrome;
const params = new URLSearchParams(location.search);
const DEFAULT_SETTINGS = {
  bridgeBaseUrl: "http://127.0.0.1:17654",
  bridgeDiscoveryPorts: Array.from({ length: 11 }, (_, index) => 17654 + index),
  useDeepLinkFallback: true,
  mediaSnifferEnabled: true,
  headerCaptureEnabled: true,
  blockedHosts: []
};
const BRIDGE_HEALTH_TIMEOUT_MS = 1500;

const message = document.querySelector("#message");
const statusText = document.querySelector("#status");
const diagnostics = document.querySelector("#diagnostics");
const retryBridge = document.querySelector("#retry-bridge");
const copyDiagnostics = document.querySelector("#copy-diagnostics");

let latestDiagnosticLines = [];

message.textContent = params.get("message") || "The local bridge was not available.";
document.querySelector("#open-options").addEventListener("click", () => runtimeApi.runtime.openOptionsPage());
retryBridge.addEventListener("click", retryBridgeCheck);
copyDiagnostics.addEventListener("click", copyDiagnosticSummary);

void renderDiagnostics();

async function renderDiagnostics(extraLines = []) {
  const settings = await runtimeApi.storage.local.get(DEFAULT_SETTINGS);
  const summary = buildSettingsSummary(settings);
  latestDiagnosticLines = [
    `error: ${message.textContent}`,
    `bridge: ${summary.bridgeBaseUrl}`,
    `discovery ports: ${summary.bridgeDiscoveryPorts.join(", ")}`,
    `deep link fallback: ${summary.useDeepLinkFallback ? "on" : "off"}`,
    `media sniffer: ${summary.mediaSnifferEnabled ? "on" : "off"}`,
    `header capture: ${summary.headerCaptureEnabled ? "on" : "off"}`,
    `blocked hosts: ${summary.blockedHosts.length}`,
    `pairing token configured: ${summary.pairingToken ? "yes" : "no"}`,
    "pairing token value copied: no",
    "Cookie values copied: no",
    "Authorization header values copied: no",
    "browser storage payload bodies copied: no",
    "captured payload bodies copied: no",
    ...extraLines
  ];
  diagnostics.replaceChildren(
    diagnosticRow("Bridge", summary.bridgeBaseUrl),
    diagnosticRow("Ports", summary.bridgeDiscoveryPorts.join(", ")),
    diagnosticRow("Fallback", summary.useDeepLinkFallback ? "desktop link enabled" : "desktop link disabled"),
    diagnosticRow("Capture", `media ${summary.mediaSnifferEnabled ? "on" : "off"} / headers ${summary.headerCaptureEnabled ? "on" : "off"}`),
    diagnosticRow("Blocked hosts", String(summary.blockedHosts.length)),
    diagnosticRow("Pairing token", summary.pairingToken ? "configured" : "not configured")
  );
}

async function retryBridgeCheck() {
  retryBridge.disabled = true;
  statusText.className = "";
  statusText.textContent = "Checking local bridge and discovery ports.";
  try {
    const settings = buildSettingsSummary(await runtimeApi.storage.local.get(DEFAULT_SETTINGS));
    const result = await resolveBridgeBaseUrl(settings);
    if (!result.ok) {
      statusText.className = "error";
      statusText.textContent = result.error || "Bridge check failed.";
      await renderDiagnostics([`last retry: failed`, `retry detail: ${statusText.textContent}`]);
      return;
    }
    await runtimeApi.storage.local.set({ bridgeBaseUrl: result.bridgeBaseUrl });
    statusText.textContent = result.health.token_required && !result.health.token_valid
      ? "Bridge reachable, but the saved pairing token is missing, invalid, or expired."
      : `Bridge reachable at ${result.bridgeBaseUrl}.`;
    statusText.className = result.health.token_required && !result.health.token_valid ? "error" : "";
    await renderDiagnostics([
      `last retry: ${result.health.token_required && !result.health.token_valid ? "pairing required" : "ok"}`,
      `reachable bridge: ${result.bridgeBaseUrl}`,
      `bridge port: ${result.health.port || "unknown"}`,
      `token required: ${result.health.token_required ? "yes" : "no"}`,
      `token valid: ${result.health.token_valid ? "yes" : "no"}`
    ]);
  } catch (error) {
    statusText.className = "error";
    statusText.textContent = error instanceof Error ? error.message : String(error);
    await renderDiagnostics([`last retry: failed`, `retry detail: ${statusText.textContent}`]);
  } finally {
    retryBridge.disabled = false;
  }
}

async function copyDiagnosticSummary() {
  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard write is not available in this browser context.");
    }
    await navigator.clipboard.writeText(latestDiagnosticLines.join("\n"));
    statusText.className = "";
    statusText.textContent = "Connector diagnostics copied without tokens or captured headers.";
  } catch (error) {
    statusText.className = "error";
    statusText.textContent = error instanceof Error ? error.message : String(error);
  }
}

async function resolveBridgeBaseUrl(settings) {
  const configuredHealth = await checkBridgeHealth(settings.bridgeBaseUrl, settings.pairingToken);
  if (configuredHealth.ok) {
    return { ok: true, bridgeBaseUrl: settings.bridgeBaseUrl, health: configuredHealth.health };
  }
  for (const candidate of bridgeDiscoveryCandidates(settings.bridgeBaseUrl, settings.bridgeDiscoveryPorts)) {
    if (candidate === settings.bridgeBaseUrl) {
      continue;
    }
    const candidateHealth = await checkBridgeHealth(candidate, settings.pairingToken);
    if (candidateHealth.ok) {
      return { ok: true, bridgeBaseUrl: candidate, health: candidateHealth.health };
    }
  }
  return {
    ok: false,
    error: `FetchDock bridge was not found at ${settings.bridgeBaseUrl} or ports ${settings.bridgeDiscoveryPorts.join(", ")}.`
  };
}

async function checkBridgeHealth(baseUrl, token = "") {
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

function buildSettingsSummary(settings) {
  return {
    bridgeBaseUrl: normalizeLocalBridgeUrl(settings.bridgeBaseUrl) || DEFAULT_SETTINGS.bridgeBaseUrl,
    bridgeDiscoveryPorts: normalizeBridgeDiscoveryPorts(settings.bridgeDiscoveryPorts),
    useDeepLinkFallback: settings.useDeepLinkFallback !== false,
    mediaSnifferEnabled: settings.mediaSnifferEnabled !== false,
    headerCaptureEnabled: settings.headerCaptureEnabled !== false,
    pairingToken: String(settings.pairingToken || "").trim(),
    blockedHosts: normalizeHosts(settings.blockedHosts)
  };
}

function bridgeDiscoveryCandidates(configured, discoveryPorts) {
  const parsed = safeUrl(configured);
  const configuredHost = parsed?.hostname === "localhost" ? "localhost" : "127.0.0.1";
  const hosts = Array.from(new Set([configuredHost, "127.0.0.1", "localhost"]));
  return hosts.flatMap((host) => discoveryPorts.map((port) => `http://${host}:${port}`));
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

function normalizeHosts(value) {
  const rawHosts = Array.isArray(value)
    ? value
    : String(value || "")
        .split(/\r?\n|,/)
        .map((host) => host.trim());
  return rawHosts
    .map((host) =>
      String(host || "")
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/\/.*$/, "")
        .replace(/:\d+$/, "")
        .replace(/^\.+|\.+$/g, "")
    )
    .filter(Boolean);
}

function normalizeLocalBridgeUrl(value) {
  const parsed = safeUrl(String(value || "").trim());
  if (!parsed || parsed.protocol !== "http:" || !["127.0.0.1", "localhost"].includes(parsed.hostname)) {
    return "";
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

function diagnosticRow(label, value) {
  const fragment = document.createDocumentFragment();
  const term = document.createElement("dt");
  const detail = document.createElement("dd");
  term.textContent = label;
  detail.textContent = value;
  fragment.append(term, detail);
  return fragment;
}
