import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";

export interface AppStatus {
  schema_version: 1;
  app_version: string;
  platform: string;
  arch: string;
  mode: "regular" | "portable";
  paths: {
    config_dir: string;
    data_dir: string;
    cache_dir: string;
    downloads_dir: string;
    plugins_dir: string;
    dependencies_dir: string;
    logs_dir: string;
  };
  database_migration: number;
}

export interface AppInfrastructureSummaryResponse {
  schema_version: 1;
  generated_at: string;
  app_status: AppStatus;
  autostart_available: boolean;
  autostart_enabled?: boolean | null;
  autostart_error?: string | null;
  shell_settings: AppShellSettings;
  quick_capture_enabled: boolean;
  quick_capture_shortcut: string;
  quick_capture_registered?: boolean | null;
  path_count: number;
  review_notes: string[];
}

export interface AppInfrastructureCapabilityItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  config_files: string[];
  events: string[];
  runtime_scope: string;
  mutates_state: boolean;
  requires_desktop_runtime: boolean;
  verifies_os_behavior: boolean;
  limitations: string[];
}

export interface AppInfrastructureCapabilityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  capability_count: number;
  capabilities: AppInfrastructureCapabilityItem[];
  includes_path_values: boolean;
  includes_shortcut_value: boolean;
  includes_autostart_state: boolean;
  mutates_shortcuts: boolean;
  mutates_autostart: boolean;
  opens_windows: boolean;
  starts_downloads: boolean;
  verifies_os_shell_behavior: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface PrivacyRedactionMatrixEntry {
  data_class: string;
  default_handling: string;
  export_handling: string;
  user_control: string;
}

export interface PrivacyStatusResponse {
  schema_version: 1;
  telemetry_enabled: boolean;
  network_telemetry_enabled: boolean;
  diagnostics_include_urls_default: boolean;
  cookie_values_exported_in_diagnostics: boolean;
  notes: string[];
  redaction_matrix: PrivacyRedactionMatrixEntry[];
}

export interface ReleaseChecklistGate {
  id: string;
  label: string;
  status: "ready" | "review_needed" | "pending" | "blocked" | string;
  evidence: string;
  next_step: string;
}

export interface ReleaseChecklistResponse {
  schema_version: 1;
  generated_at: string;
  ready_count: number;
  review_needed_count: number;
  pending_count: number;
  blocked_count: number;
  gates: ReleaseChecklistGate[];
}

export interface ReleaseCapabilityCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  data_files: string[];
  evidence_fields: string[];
  sensitive_fields: string[];
  mutates_release_files: boolean;
  reads_artifact_files: boolean;
  calculates_hashes: boolean;
  runs_build: boolean;
  runs_packaging: boolean;
  signs_artifacts: boolean;
  publishes_artifacts: boolean;
  checks_remote_updates: boolean;
  supports_batch: boolean;
  scope: string;
  limitations: string[];
}

export interface ReleaseCapabilityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  source_root: string;
  data_root: string;
  capability_count: number;
  capabilities: ReleaseCapabilityCatalogItem[];
  release_surfaces: string[];
  data_files: string[];
  evidence_fields: string[];
  sensitive_fields: string[];
  supported_gate_statuses: string[];
  supported_package_areas: string[];
  mutates_release_files: boolean;
  reads_artifact_files: boolean;
  calculates_hashes: boolean;
  runs_build: boolean;
  runs_packaging: boolean;
  signs_artifacts: boolean;
  publishes_artifacts: boolean;
  checks_remote_updates: boolean;
  verifies_packaged_app_e2e: boolean;
  verifies_signing_e2e: boolean;
  verifies_update_install_e2e: boolean;
  parity_gate_status: string;
  review_notes: string[];
}

export interface ReleasePackageAreaSummary {
  label: string;
  status: "present" | "missing" | "empty" | "review_needed" | string;
  path: string;
  file_count: number;
  total_size_bytes: number;
  latest_modified_at?: string | null;
  notes: string[];
}

export interface ReleasePackageFileSummary {
  kind: string;
  path: string;
  file_name: string;
  size_bytes: number;
  modified_at?: string | null;
  sha256?: string | null;
}

export interface ReleasePackageSummaryResponse {
  schema_version: 1;
  generated_at: string;
  source_root: string;
  frontend_dist: ReleasePackageAreaSummary;
  windows_portable: ReleasePackageAreaSummary;
  tauri_bundles: ReleasePackageAreaSummary;
  packaging_templates: ReleasePackageAreaSummary;
  scripts: ReleasePackageAreaSummary;
  package_files: ReleasePackageFileSummary[];
  gate_counts: LocalCountEntry[];
  review_notes: string[];
}

export interface ReleaseDocumentFileSummary {
  kind: string;
  path: string;
  exists: boolean;
  size_bytes?: number | null;
  modified_at?: string | null;
  sha256?: string | null;
}

export interface ReleaseDocumentSummaryResponse {
  schema_version: 1;
  generated_at: string;
  source_root: string;
  document_count: number;
  missing_count: number;
  total_size_bytes: number;
  documents: ReleaseDocumentFileSummary[];
  function_parity_status_counts: LocalCountEntry[];
  acceptance_status_counts: LocalCountEntry[];
  review_notes: string[];
}

export interface LegalReadinessSummaryResponse {
  schema_version: 1;
  generated_at: string;
  source_root: string;
  data_root: string;
  ready_count: number;
  review_needed_count: number;
  pending_count: number;
  blocked_count: number;
  missing_document_count: number;
  missing_documents: string[];
  npm_package_count: number;
  npm_missing_license_count: number;
  rust_crate_count: number;
  rust_missing_license_count: number;
  package_status_counts: LocalCountEntry[];
  checklist_gate_counts: LocalCountEntry[];
  review_notes: string[];
}

export interface LegalCapabilityCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  data_files: string[];
  notice_fields: string[];
  sensitive_fields: string[];
  mutates_legal_files: boolean;
  reads_dependency_manifests: boolean;
  reads_bundled_artifacts: boolean;
  calculates_hashes: boolean;
  generates_final_notices: boolean;
  requires_human_review: boolean;
  runs_external_audit_tools: boolean;
  supports_batch: boolean;
  scope: string;
  limitations: string[];
}

export interface LegalCapabilityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  source_root: string;
  data_root: string;
  capability_count: number;
  capabilities: LegalCapabilityCatalogItem[];
  legal_surfaces: string[];
  data_files: string[];
  notice_fields: string[];
  sensitive_fields: string[];
  tracked_documents: string[];
  supported_review_outputs: string[];
  mutates_legal_files: boolean;
  reads_dependency_manifests: boolean;
  reads_bundled_artifacts: boolean;
  calculates_hashes: boolean;
  generates_final_notices: boolean;
  runs_external_audit_tools: boolean;
  verifies_license_clearance: boolean;
  verifies_bundled_notice_clearance: boolean;
  verifies_store_notice_clearance: boolean;
  parity_gate_status: string;
  review_notes: string[];
}

export interface DiagnosticsCapabilityCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  data_files: string[];
  evidence_fields: string[];
  sensitive_fields: string[];
  reads_diagnostics_files: boolean;
  reads_download_log_bodies: boolean;
  reads_download_urls: boolean;
  reads_cookie_values: boolean;
  reads_auth_values: boolean;
  reads_downloaded_content: boolean;
  writes_diagnostics_files: boolean;
  deletes_local_files: boolean;
  mutates_settings: boolean;
  supports_batch: boolean;
  scope: string;
  limitations: string[];
}

export interface DiagnosticsCapabilityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  source_root: string;
  data_root: string;
  capability_count: number;
  capabilities: DiagnosticsCapabilityCatalogItem[];
  diagnostics_surfaces: string[];
  data_files: string[];
  evidence_fields: string[];
  sensitive_fields: string[];
  supported_outputs: string[];
  reads_diagnostics_files: boolean;
  reads_download_log_bodies: boolean;
  reads_download_urls: boolean;
  reads_cookie_values: boolean;
  reads_auth_values: boolean;
  reads_downloaded_content: boolean;
  writes_diagnostics_files: boolean;
  deletes_local_files: boolean;
  mutates_settings: boolean;
  runs_recovery: boolean;
  uploads_diagnostics: boolean;
  verifies_recovery_e2e: boolean;
  verifies_privacy_matrix: boolean;
  parity_gate_status: string;
  review_notes: string[];
}

export interface ThirdPartyNoticeSummaryResponse {
  schema_version: 1;
  generated_at: string;
  source_root: string;
  npm_package_count: number;
  npm_missing_license_count: number;
  npm_dev_package_count: number;
  npm_optional_package_count: number;
  rust_crate_count: number;
  rust_missing_license_count: number;
  bundled_review_file_count: number;
  bundled_review_total_size_bytes: number;
  license_counts: LocalCountEntry[];
  bundled_kind_counts: LocalCountEntry[];
  bundled_review_files: ReleasePackageFileSummary[];
  review_required: boolean;
  review_notes: string[];
}

export interface UpdateManifestCheckResponse {
  schema_version: 1;
  current_version: string;
  latest_version?: string | null;
  update_available: boolean;
  manifest_path: string;
  source_kind: string;
  release_notes?: string | null;
  download_url?: string | null;
  checked_at: string;
}

export interface UpdateSettingsState {
  schema_version: 1;
  enabled: boolean;
  manifest_path?: string | null;
  check_interval_hours: number;
  last_checked_at?: string | null;
  last_result?: string | null;
}

export interface UpdateSettingsExportResponse {
  output_path: string;
  exported_setting_count: number;
  settings: UpdateSettingsState;
}

export interface UpdateSettingsImportResponse {
  input_path: string;
  imported_setting_count: number;
  settings: UpdateSettingsState;
}

export interface UpdateManifestDueCheckResponse {
  schema_version: 1;
  status: string;
  checked: boolean;
  due: boolean;
  reason?: string | null;
  next_check_at?: string | null;
  settings: UpdateSettingsState;
  result?: UpdateManifestCheckResponse | null;
}
export interface UpdateLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  current_version: string;
  enabled: boolean;
  manifest_configured: boolean;
  manifest_source_kind: string;
  manifest_path?: string | null;
  manifest_file?: LocalFileSummary | null;
  configured_manifest_version?: string | null;
  configured_download_url_set: boolean;
  configured_release_notes_set: boolean;
  check_interval_hours: number;
  last_checked_at?: string | null;
  last_result?: string | null;
  next_check_at?: string | null;
  due_now: boolean;
  can_check_without_network: boolean;
  remote_manifest_configured: boolean;
  signed_updater_enabled: boolean;
  downloads_update: boolean;
  installs_update: boolean;
  review_notes: string[];
}

export interface UpdateCapabilityCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  data_files: string[];
  settings_fields: string[];
  sensitive_fields: string[];
  mutates_settings: boolean;
  reads_local_manifest: boolean;
  fetches_remote_manifest: boolean;
  downloads_update: boolean;
  installs_update: boolean;
  verifies_signature: boolean;
  emits_notifications: boolean;
  supports_due_poll: boolean;
  supports_batch: boolean;
  scope: string;
  limitations: string[];
}

export interface UpdateCapabilityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  capability_count: number;
  capabilities: UpdateCapabilityCatalogItem[];
  update_surfaces: string[];
  data_files: string[];
  settings_fields: string[];
  sensitive_fields: string[];
  supported_manifest_sources: string[];
  supported_check_modes: string[];
  mutates_settings: boolean;
  reads_local_manifest: boolean;
  fetches_remote_manifest: boolean;
  downloads_update: boolean;
  installs_update: boolean;
  verifies_signature: boolean;
  emits_notifications: boolean;
  verifies_signed_update_e2e: boolean;
  verifies_rollback_e2e: boolean;
  verifies_packaged_update_e2e: boolean;
  parity_gate_status: string;
  review_notes: string[];
}

export interface LocalEvidenceSummaryResponse {
  schema_version: 1;
  generated_at: string;
  module_count: number;
  secrets_exported: boolean;
  modules: Record<string, Record<string, unknown>>;
  honesty_notes: string[];
}

export interface LocalCountEntry {
  key: string;
  count: number;
}

export interface LocalSettingsSummaryResponse {
  schema_version: 1;
  generated_at: string;
  appearance: Record<string, unknown>;
  downloads: Record<string, unknown>;
  network: Record<string, unknown>;
  ai: Record<string, unknown>;
  app_shell: Record<string, unknown>;
  advanced: Record<string, unknown>;
  update: Record<string, unknown>;
  extension: Record<string, unknown>;
  channels: Record<string, unknown>;
  plugins: Record<string, unknown>;
  dependencies: Record<string, unknown>;
  safety_notes: string[];
}

export interface SettingsCapabilityCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  setting_sections: string[];
  data_files: string[];
  settings_fields: string[];
  sensitive_fields: string[];
  reads_settings_values: boolean;
  writes_settings_values: boolean;
  imports_settings_files: boolean;
  exports_settings_files: boolean;
  resets_settings: boolean;
  reads_secret_values: boolean;
  exports_secret_values: boolean;
  triggers_os_side_effects: boolean;
  supports_batch: boolean;
  scope: string;
  limitations: string[];
}

export interface SettingsCapabilityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  source_root: string;
  data_root: string;
  capability_count: number;
  capabilities: SettingsCapabilityCatalogItem[];
  settings_surfaces: string[];
  setting_sections: string[];
  data_files: string[];
  settings_fields: string[];
  sensitive_fields: string[];
  supported_backup_outputs: string[];
  reads_settings_values: boolean;
  writes_settings_values: boolean;
  imports_settings_files: boolean;
  exports_settings_files: boolean;
  resets_settings: boolean;
  reads_secret_values: boolean;
  exports_secret_values: boolean;
  triggers_os_side_effects: boolean;
  verifies_settings_roundtrip_e2e: boolean;
  verifies_os_integration_e2e: boolean;
  parity_gate_status: string;
  review_notes: string[];
}

export interface LocalChannelsSummaryResponse {
  schema_version: 1;
  generated_at: string;
  channel_count: number;
  enabled_count: number;
  auto_download_count: number;
  history_count: number;
  queued_history_count: number;
  notification_pending_count: number;
  platform_counts: LocalCountEntry[];
  source_kind_counts: LocalCountEntry[];
  settings: ChannelSettings;
}
export interface ChannelsCapabilityCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  data_files: string[];
  record_fields: string[];
  includes_source_urls_in_store: boolean;
  exports_source_urls: boolean;
  mutates_subscriptions: boolean;
  mutates_history: boolean;
  creates_download_tasks: boolean;
  polls_remote_sources: boolean;
  emits_events: string[];
  supports_batch: boolean;
  scope: string;
  limitations: string[];
}

export interface ChannelsCapabilityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  capability_count: number;
  capabilities: ChannelsCapabilityCatalogItem[];
  storage_files: string[];
  event_names: string[];
  supported_status_filters: string[];
  supported_backup_kinds: string[];
  includes_source_urls: boolean;
  includes_cookie_values: boolean;
  includes_downloaded_files: boolean;
  includes_download_log_bodies: boolean;
  mutates_subscriptions: boolean;
  mutates_history: boolean;
  creates_download_tasks: boolean;
  polls_remote_sources: boolean;
  verifies_remote_feeds: boolean;
  review_notes: string[];
}

export interface LocalPluginsSummaryResponse {
  schema_version: 1;
  generated_at: string;
  plugin_count: number;
  marketplace_entry_count: number;
  state_counts: LocalCountEntry[];
  preflight_counts: LocalCountEntry[];
  enabled_count: number;
  failed_count: number;
  command_count: number;
  event_count: number;
  nav_item_count: number;
  capability_count: number;
  permission_count: number;
  marketplace_capability_count: number;
  marketplace_permission_count: number;
  local_execution_status: string;
}

export interface PluginCapabilityCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  data_files: string[];
  manifest_fields: string[];
  registry_fields: string[];
  sensitive_fields: string[];
  mutates_registry: boolean;
  mutates_marketplace: boolean;
  mutates_settings: boolean;
  mutates_plugin_data: boolean;
  reads_manifest_files: boolean;
  reads_dynamic_libraries: boolean;
  executes_dynamic_code: boolean;
  imports_external_files: boolean;
  deletes_local_files: boolean;
  fetches_remote_registry: boolean;
  supports_batch: boolean;
  scope: string;
  limitations: string[];
}

export interface PluginCapabilityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  capability_count: number;
  capabilities: PluginCapabilityCatalogItem[];
  plugin_surfaces: string[];
  data_files: string[];
  manifest_fields: string[];
  registry_fields: string[];
  sensitive_fields: string[];
  supported_plugin_states: string[];
  supported_preflight_states: string[];
  mutates_registry: boolean;
  mutates_marketplace: boolean;
  mutates_settings: boolean;
  mutates_plugin_data: boolean;
  reads_manifest_files: boolean;
  reads_dynamic_libraries: boolean;
  executes_dynamic_code: boolean;
  imports_external_files: boolean;
  deletes_local_files: boolean;
  fetches_remote_registry: boolean;
  verifies_signature_chain: boolean;
  verifies_dynamic_runtime_e2e: boolean;
  verifies_remote_marketplace_e2e: boolean;
  parity_gate_status: string;
  review_notes: string[];
}

export interface LocalPluginTrustEntry {
  id: string;
  display_name: string;
  version: string;
  state: "installed" | "enabled" | "disabled" | "failed" | "incompatible";
  preflight_status: string;
  preflight_message: string;
  abi_version: string;
  host_abi_version: string;
  has_library: boolean;
  has_entrypoint: boolean;
  command_count: number;
  event_count: number;
  nav_item_count: number;
  capability_count: number;
  permission_count: number;
  manifest_path: string;
  dynamic_library_path?: string | null;
  last_error?: string | null;
  trust_status: string;
  review_note: string;
}

export interface LocalPluginMarketplaceTrustEntry {
  id: string;
  name: string;
  version?: string | null;
  source_kind: string;
  manifest_path: string;
  source?: string | null;
  sha256?: string | null;
  signature?: string | null;
  signature_url?: string | null;
  capability_count: number;
  permission_count: number;
  installed: boolean;
  review_note: string;
}

export interface LocalPluginTrustSummaryResponse {
  schema_version: 1;
  generated_at: string;
  plugin_count: number;
  marketplace_entry_count: number;
  ready_local_count: number;
  manifest_only_count: number;
  failed_count: number;
  incompatible_count: number;
  unsigned_count: number;
  remote_marketplace_count: number;
  marketplace_hash_count: number;
  marketplace_signature_count: number;
  permission_grant_count: number;
  marketplace_capability_count: number;
  marketplace_permission_count: number;
  dynamic_execution_enabled: boolean;
  release_gate_status: string;
  entries: LocalPluginTrustEntry[];
  marketplace_entries: LocalPluginMarketplaceTrustEntry[];
  review_notes: string[];
}

export interface LocalAuditSummaryResponse {
  schema_version: 1;
  generated_at: string;
  settings: LocalSettingsSummaryResponse;
  channels: LocalChannelsSummaryResponse;
  plugins: LocalPluginsSummaryResponse;
  plugin_trust: LocalPluginTrustSummaryResponse;
  review_notes: string[];
}

export async function getAppStatus(): Promise<AppStatus | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AppStatus>("app_get_status");
}

export async function getAppInfrastructureSummary(): Promise<AppInfrastructureSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AppInfrastructureSummaryResponse>("app_get_infrastructure_summary");
}

export async function exportAppInfrastructureSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_infrastructure_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getAppInfrastructureCapabilityCatalog(): Promise<AppInfrastructureCapabilityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AppInfrastructureCapabilityCatalogResponse>("app_get_infrastructure_capability_catalog");
}

export async function exportAppInfrastructureCapabilityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_infrastructure_capability_catalog", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getPrivacyStatus(): Promise<PrivacyStatusResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PrivacyStatusResponse>("app_get_privacy_status");
}

export async function exportPrivacyStatus(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_privacy_status", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getReleaseChecklist(): Promise<ReleaseChecklistResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ReleaseChecklistResponse>("app_get_release_checklist");
}

export async function exportReleaseChecklist(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_release_checklist", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getReleaseCapabilityCatalog(): Promise<ReleaseCapabilityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ReleaseCapabilityCatalogResponse>("app_get_release_capability_catalog");
}

export async function exportReleaseCapabilityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_release_capability_catalog", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getReleasePackageSummary(): Promise<ReleasePackageSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ReleasePackageSummaryResponse>("app_get_release_package_summary");
}

export async function exportReleasePackageSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const result = await invoke<{ archive_path: string }>("app_export_release_package_summary", {
    request: outputPath ? { output_path: outputPath } : null
  });
  return result.archive_path;
}

export async function getLegalReadinessSummary(): Promise<LegalReadinessSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LegalReadinessSummaryResponse>("app_get_legal_readiness_summary");
}

export async function exportLegalReadinessSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const result = await invoke<{ archive_path: string }>("app_export_legal_readiness_summary", {
    request: outputPath ? { output_path: outputPath } : null
  });
  return result.archive_path;
}

export async function getLegalCapabilityCatalog(): Promise<LegalCapabilityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LegalCapabilityCatalogResponse>("app_get_legal_capability_catalog");
}

export async function exportLegalCapabilityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const result = await invoke<{ archive_path: string }>("app_export_legal_capability_catalog", {
    request: outputPath ? { output_path: outputPath } : null
  });
  return result.archive_path;
}

export async function getDiagnosticsCapabilityCatalog(): Promise<DiagnosticsCapabilityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DiagnosticsCapabilityCatalogResponse>("app_get_diagnostics_capability_catalog");
}

export async function exportDiagnosticsCapabilityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const result = await invoke<{ archive_path: string }>("app_export_diagnostics_capability_catalog", {
    request: outputPath ? { output_path: outputPath } : null
  });
  return result.archive_path;
}

export async function getReleaseDocumentSummary(): Promise<ReleaseDocumentSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ReleaseDocumentSummaryResponse>("app_get_release_document_summary");
}

export async function exportReleaseDocumentSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const result = await invoke<{ archive_path: string }>("app_export_release_document_summary", {
    request: outputPath ? { output_path: outputPath } : null
  });
  return result.archive_path;
}

export async function getThirdPartyNoticeSummary(): Promise<ThirdPartyNoticeSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ThirdPartyNoticeSummaryResponse>("app_get_third_party_notice_summary");
}

export async function exportThirdPartyNoticeSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_third_party_notice_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function checkUpdateManifest(manifestPath: string): Promise<UpdateManifestCheckResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<UpdateManifestCheckResponse>("app_check_update_manifest", {
    request: { manifest_path: manifestPath }
  });
}

export async function checkConfiguredUpdateManifest(): Promise<UpdateManifestCheckResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<UpdateManifestCheckResponse>("app_check_configured_update_manifest");
}

export async function checkDueUpdateManifest(): Promise<UpdateManifestDueCheckResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<UpdateManifestDueCheckResponse>("app_check_due_update_manifest");
}

export async function getUpdateSettings(): Promise<UpdateSettingsState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<UpdateSettingsState>("app_get_update_settings");
}

export async function exportUpdateSettings(outputPath?: string | null): Promise<UpdateSettingsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<UpdateSettingsExportResponse>("app_export_update_settings", {
    request: { output_path: outputPath || null }
  });
}

export async function importUpdateSettings(inputPath: string): Promise<UpdateSettingsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<UpdateSettingsImportResponse>("app_import_update_settings", {
    request: { input_path: inputPath }
  });
}

export async function getUpdateLocalSummary(): Promise<UpdateLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<UpdateLocalSummaryResponse>("update_get_local_summary");
}

export async function exportUpdateLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("update_export_local_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getUpdateCapabilityCatalog(): Promise<UpdateCapabilityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<UpdateCapabilityCatalogResponse>("update_get_capability_catalog");
}

export async function exportUpdateCapabilityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("update_export_capability_catalog", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function updateUpdateSettings(patch: {
  enabled?: boolean;
  manifestPath?: string | null;
  checkIntervalHours?: number;
  lastCheckedAt?: string | null;
  lastResult?: string | null;
}): Promise<UpdateSettingsState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<UpdateSettingsState>("app_update_update_settings", {
    request: {
      patch: {
        enabled: patch.enabled,
        manifest_path: patch.manifestPath === undefined ? undefined : patch.manifestPath,
        check_interval_hours: patch.checkIntervalHours,
        last_checked_at: patch.lastCheckedAt === undefined ? undefined : patch.lastCheckedAt,
        last_result: patch.lastResult === undefined ? undefined : patch.lastResult
      }
    }
  });
}

export async function exportDiagnostics(includeUrls = false, outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_diagnostics", {
    request: { include_urls: includeUrls, output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function exportThirdPartyNoticeInventory(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_third_party_notice_inventory", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function exportThirdPartyNoticeDraft(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_third_party_notice_draft", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function exportReleaseEvidenceSnapshot(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_release_evidence_snapshot", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getLocalEvidenceSnapshot(): Promise<LocalEvidenceSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LocalEvidenceSummaryResponse>("app_get_local_evidence_snapshot");
}

export async function getLocalAuditSummary(): Promise<LocalAuditSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LocalAuditSummaryResponse>("app_get_local_audit_summary");
}

export async function exportLocalAuditSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_local_audit_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getLocalSettingsSummary(): Promise<LocalSettingsSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LocalSettingsSummaryResponse>("app_get_local_settings_summary");
}

export async function exportLocalSettingsSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_local_settings_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getSettingsCapabilityCatalog(): Promise<SettingsCapabilityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<SettingsCapabilityCatalogResponse>("settings_get_capability_catalog");
}

export async function exportSettingsCapabilityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("settings_export_capability_catalog", {
    request: outputPath ? { output_path: outputPath } : null
  });
  return response.archive_path;
}

export async function getLocalChannelsSummary(): Promise<LocalChannelsSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  try {
    return await invoke<LocalChannelsSummaryResponse>("channels_get_local_summary");
  } catch {
    return invoke<LocalChannelsSummaryResponse>("app_get_local_channels_summary");
  }
}

export async function exportChannelsLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("channels_export_local_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}
export async function getChannelsCapabilityCatalog(): Promise<ChannelsCapabilityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ChannelsCapabilityCatalogResponse>("channels_get_capability_catalog");
}

export async function exportChannelsCapabilityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("channels_export_capability_catalog", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getLocalPluginsSummary(): Promise<LocalPluginsSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LocalPluginsSummaryResponse>("app_get_local_plugins_summary");
}

export async function exportLocalPluginsSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_local_plugins_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getPluginCapabilityCatalog(): Promise<PluginCapabilityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginCapabilityCatalogResponse>("plugins_get_capability_catalog");
}

export async function exportPluginCapabilityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("plugins_export_capability_catalog", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getLocalPluginTrustSummary(): Promise<LocalPluginTrustSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LocalPluginTrustSummaryResponse>("app_get_local_plugin_trust_summary");
}

export async function exportLocalPluginTrustSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_local_plugin_trust_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function exportLocalEvidenceSnapshot(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string; module_count: number; secrets_exported: boolean }>(
    "app_export_local_evidence_snapshot",
    { request: { output_path: outputPath || null } }
  );
  return response.archive_path;
}

export async function exportDiagnosticsBundle(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_diagnostics_bundle", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function exportRecoveryManifest(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("app_export_recovery_manifest", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export interface LocalFileSummary {
  path: string;
  file_name: string;
  size_bytes: number;
  modified_at?: string | null;
}

export interface DownloadLogListFilters {
  query?: string | null;
  task_id?: string | null;
  limit?: number | null;
}

export interface DownloadLogListResponse {
  logs: LocalFileSummary[];
  total_log_count: number;
  filtered_log_count: number;
  filters: DownloadLogListFilters;
}

export interface DiagnosticsFilesChangedEvent {
  reason: string;
  diagnostics: LocalFileSummary[];
  logs: LocalFileSummary[];
}

export interface CleanupPartialDownloadsResponse {
  dry_run: boolean;
  matched: number;
  deleted: number;
  files: LocalFileSummary[];
}

export interface ReadAppTextFileResponse {
  file: LocalFileSummary;
  content: string;
  truncated: boolean;
  max_bytes: number;
  entries?: DownloadLogEntry[];
  issue_count?: number | null;
}

export async function listDiagnosticsFiles(): Promise<LocalFileSummary[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ files: LocalFileSummary[] }>("app_list_diagnostics");
  return response.files;
}

export async function listDownloadLogFilesResponse(
  filters: DownloadLogListFilters = {}
): Promise<DownloadLogListResponse> {
  if (!isTauriRuntime()) {
    return { logs: [], total_log_count: 0, filtered_log_count: 0, filters };
  }

  const request = {
    query: filters.query?.trim() || null,
    task_id: filters.task_id?.trim() || null,
    limit: filters.limit ?? null
  };
  return invoke<DownloadLogListResponse>("app_list_download_logs", { request });
}

export async function listDownloadLogFiles(filters: DownloadLogListFilters = {}): Promise<LocalFileSummary[]> {
  const response = await listDownloadLogFilesResponse(filters);
  return response.logs;
}

export async function onDiagnosticsFilesChanged(
  handler: (event: DiagnosticsFilesChangedEvent) => void
): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<DiagnosticsFilesChangedEvent>("diagnostics:files_changed", (event) => handler(event.payload));
}

export async function readDiagnosticsFile(path: string): Promise<ReadAppTextFileResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ReadAppTextFileResponse>("app_read_diagnostics_file", {
    request: { path }
  });
}

export async function deleteDiagnosticsFile(path: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("app_delete_diagnostics_file", {
    request: { path }
  });
  return response.deleted;
}

export async function clearDiagnosticsFiles(): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("app_clear_diagnostics");
  return response.cleared;
}

export async function readDownloadLog(path: string): Promise<ReadAppTextFileResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ReadAppTextFileResponse>("app_read_download_log", {
    request: { path }
  });
}

export async function deleteDownloadLogFile(path: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("app_delete_download_log", {
    request: { path }
  });
  return response.deleted;
}

export async function deleteLocalFiles(files: Array<{ kind: "diagnostics" | "log"; path: string }>): Promise<{
  deleted: string[];
  failed: BulkDownloadFailure[];
}> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [] };
  }

  return invoke<{ deleted: string[]; failed: BulkDownloadFailure[] }>("app_delete_local_files", {
    request: { files }
  });
}

export async function clearDownloadLogFiles(): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("app_clear_download_logs");
  return response.cleared;
}

export async function cleanupPartialDownloads(dryRun = true): Promise<CleanupPartialDownloadsResponse> {
  if (!isTauriRuntime()) {
    return { dry_run: dryRun, matched: 0, deleted: 0, files: [] };
  }

  return invoke<CleanupPartialDownloadsResponse>("app_cleanup_partial_downloads", {
    request: { dry_run: dryRun }
  });
}

export async function openPath(path: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  await invoke("app_open_path", { path });
  return true;
}

export async function revealFile(path: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  await invoke("app_reveal_file", { path });
  return true;
}

export async function getAutostart(): Promise<boolean | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<boolean>("app_get_autostart");
}

export async function setAutostart(enabled: boolean): Promise<boolean | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  await invoke("app_set_autostart", { enabled });
  return enabled;
}

export async function readClipboardText(): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<string>("plugin:clipboard-manager|read_text");
}

export interface AuthSettingsPublic {
  schema_version: 1;
  twitter_x: {
    manual_cookie_header_enabled: boolean;
    manual_cookie_header_set: boolean;
    manual_cookie_header_preview?: string | null;
    updated_at?: string | null;
  };
}

export interface AuthSettingsExportResponse {
  output_path: string;
  exported_setting_count: number;
  settings: AuthSettingsPublic;
}

export interface AuthSettingsImportResponse {
  input_path: string;
  imported_setting_count: number;
  skipped_secret_count: number;
  settings: AuthSettingsPublic;
  review_notes: string[];
}

export async function getAuthSettings(): Promise<AuthSettingsPublic | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AuthSettingsPublic>("auth_get_settings");
}

export async function exportAuthSettings(outputPath?: string | null): Promise<AuthSettingsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AuthSettingsExportResponse>("auth_export_settings", {
    request: { output_path: outputPath || null }
  });
}

export async function importAuthSettings(inputPath: string): Promise<AuthSettingsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AuthSettingsImportResponse>("auth_import_settings", {
    request: { input_path: inputPath }
  });
}

export async function updateTwitterXAuthSettings(patch: {
  manualCookieHeaderEnabled?: boolean;
  manualCookieHeader?: string | null;
}): Promise<AuthSettingsPublic | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AuthSettingsPublic>("auth_update_twitter_x", {
    request: {
      manual_cookie_header_enabled: patch.manualCookieHeaderEnabled,
      manual_cookie_header: patch.manualCookieHeader === undefined ? undefined : patch.manualCookieHeader
    }
  });
}
export interface ExtensionPairingStatus {
  paired: boolean;
  port: number;
  token_required: boolean;
  label?: string | null;
  created_at?: string | null;
  expires_at?: string | null;
}

export interface ExtensionPairingChangedEvent {
  reason: string;
  status: ExtensionPairingStatus;
}

export interface ExtensionPairingToken {
  pairing_code: string;
  expires_at: string;
}

export interface ExtensionPairingBackupMetadata {
  schema_version: 1;
  paired: boolean;
  label?: string | null;
  created_at?: string | null;
  expires_at?: string | null;
  revoked_at?: string | null;
}

export interface ExtensionOptionsState {
  schema_version: 1;
  bridge_url: string;
  bridge_discovery_ports: number[];
  token_set: boolean;
  deep_link_fallback: boolean;
  capture_media: boolean;
  capture_headers: boolean;
  blocked_hosts: string[];
  updated_at: string;
}

export interface ExtensionOptionsExportResponse {
  output_path: string;
  exported_setting_count: number;
  options: ExtensionOptionsState;
}

export interface ExtensionOptionsImportResponse {
  input_path: string;
  imported_setting_count: number;
  options: ExtensionOptionsState;
}

export interface ExtensionPairingExportResponse {
  schema_version: 1;
  output_path: string;
  pairing: ExtensionPairingBackupMetadata;
  includes_pairing_token_value: boolean;
  review_notes: string[];
}

export interface ExtensionPairingImportResponse {
  input_path: string;
  pairing: ExtensionPairingStatus;
  imported_was_paired: boolean;
  review_notes: string[];
}

export interface ExtensionConnectorProfile {
  schema_version: 1;
  appId: string;
  profileVersion: number;
  source: string;
  exported_at: string;
  defaultBridgePort: number;
  bridgeDiscoveryPorts: number[];
  bridgeBaseUrl: string;
  pairingToken: string;
  tokenExpiresAt?: string | null;
  useDeepLinkFallback: boolean;
  mediaSnifferEnabled: boolean;
  headerCaptureEnabled: boolean;
  blockedHosts: string[];
  privacy: {
    cookie_payload_contents_included: boolean;
    authorization_payload_contents_included: boolean;
  };
}

export interface ExtensionPackageFileSummary {
  path: string;
  size_bytes: number;
  sha256?: string | null;
}

export interface ExtensionPackageTargetSummary {
  target: string;
  zip_path?: string | null;
  zip_sha256?: string | null;
  file_count: number;
  total_size_bytes: number;
}

export interface ExtensionLocalPackageSummaryResponse {
  schema_version: 1;
  generated_at: string;
  source_root: string;
  extension_dir: string;
  manifest_path: string;
  manifest_version?: number | null;
  extension_name?: string | null;
  extension_version?: string | null;
  source_file_count: number;
  source_total_size_bytes: number;
  source_files: ExtensionPackageFileSummary[];
  package_manifest_path: string;
  package_manifest_present: boolean;
  package_generated_at?: string | null;
  package_targets: ExtensionPackageTargetSummary[];
  package_file_count: number;
  package_total_size_bytes: number;
  review_notes: string[];
}

export interface ExtensionReleaseSafetySummaryResponse {
  schema_version: 1;
  generated_at: string;
  package_source_file_count: number;
  package_target_count: number;
  package_manifest_present: boolean;
  package_file_count: number;
  package_total_size_bytes: number;
  paired: boolean;
  token_required: boolean;
  token_set_in_options: boolean;
  token_expires_at?: string | null;
  bridge_port: number;
  discovery_port_count: number;
  deep_link_fallback: boolean;
  media_sniffer_enabled: boolean;
  header_capture_enabled: boolean;
  blocked_host_count: number;
  staged_cookie_payload_count: number;
  staged_authorization_payload_count: number;
  release_gate_status: string;
  review_notes: string[];
}

export interface ExtensionLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  source_root: string;
  extension_dir: string;
  manifest_path: string;
  extension_name?: string | null;
  extension_version?: string | null;
  options: ExtensionOptionsState;
  pairing: ExtensionPairingStatus;
  cookie_payload_count: number;
  authorization_payload_count: number;
  cookie_payloads: ExtensionCookiePayloadInfo[];
  authorization_payloads: ExtensionAuthorizationPayloadInfo[];
  package: ExtensionLocalPackageSummaryResponse;
  release_safety: ExtensionReleaseSafetySummaryResponse;
  review_notes: string[];
}

export interface ExtensionCapabilityCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  extension_surfaces: string[];
  bridge_endpoints: string[];
  data_files: string[];
  sensitive_fields: string[];
  reads_browser_storage: boolean;
  includes_pairing_token_values: boolean;
  includes_cookie_payload_contents: boolean;
  includes_authorization_values: boolean;
  mutates_extension_options: boolean;
  mutates_pairing_state: boolean;
  mutates_staged_payloads: boolean;
  creates_download_tasks: boolean;
  requires_browser_runtime: boolean;
  supports_batch: boolean;
  scope: string;
  limitations: string[];
}

export interface ExtensionCapabilityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  capability_count: number;
  capabilities: ExtensionCapabilityCatalogItem[];
  bridge_endpoints: string[];
  extension_surfaces: string[];
  storage_files: string[];
  supported_payload_kinds: string[];
  release_gate_status: string;
  includes_browser_storage: boolean;
  includes_pairing_token_values: boolean;
  includes_cookie_payload_contents: boolean;
  includes_authorization_values: boolean;
  mutates_extension_options: boolean;
  mutates_pairing_state: boolean;
  mutates_staged_payloads: boolean;
  creates_download_tasks: boolean;
  installs_or_runs_browser_extension: boolean;
  packages_or_signs_extension: boolean;
  verifies_browser_e2e: boolean;
  review_notes: string[];
}

export interface ExtensionCookiePayloadInfo {
  payload_ref: string;
  file: LocalFileSummary;
}

export interface ExtensionAuthorizationPayloadInfo {
  schema_version: 1;
  payload_ref: string;
  file: LocalFileSummary;
  page_url: string;
  host: string;
  request_url?: string | null;
  request_host?: string | null;
  preview: string;
  source?: string | null;
  captured_at?: string | null;
  stored_at?: string | null;
}

export interface ExtensionPayloadsChangedEvent {
  reason: string;
  cookie_payloads: ExtensionCookiePayloadInfo[];
  authorization_payloads: ExtensionAuthorizationPayloadInfo[];
}

export interface ExtensionPayloadBulkDeleteResponse {
  deleted: string[];
  failed: BulkDownloadFailure[];
}

export async function getExtensionOptions(): Promise<ExtensionOptionsState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ExtensionOptionsState>("extension_get_options");
}

export async function exportExtensionOptions(outputPath?: string | null): Promise<ExtensionOptionsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ExtensionOptionsExportResponse>("extension_export_options", {
    request: { output_path: outputPath || null }
  });
}

export async function importExtensionOptions(inputPath: string): Promise<ExtensionOptionsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ExtensionOptionsImportResponse>("extension_import_options", {
    request: { input_path: inputPath }
  });
}

export async function exportExtensionPairing(outputPath?: string | null): Promise<ExtensionPairingExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ExtensionPairingExportResponse>("extension_export_pairing", {
    request: { output_path: outputPath || null }
  });
}

export async function importExtensionPairing(inputPath: string): Promise<ExtensionPairingImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ExtensionPairingImportResponse>("extension_import_pairing", {
    request: { input_path: inputPath }
  });
}

export async function getExtensionLocalPackageSummary(): Promise<ExtensionLocalPackageSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ExtensionLocalPackageSummaryResponse>("extension_get_local_package_summary");
}

export async function getExtensionLocalSummary(): Promise<ExtensionLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ExtensionLocalSummaryResponse>("extension_get_local_summary");
}

export async function exportExtensionLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("extension_export_local_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function exportExtensionLocalPackageSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("extension_export_local_package_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getExtensionReleaseSafetySummary(): Promise<ExtensionReleaseSafetySummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ExtensionReleaseSafetySummaryResponse>("extension_get_release_safety_summary");
}

export async function exportExtensionReleaseSafetySummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("extension_export_release_safety_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getExtensionCapabilityCatalog(): Promise<ExtensionCapabilityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ExtensionCapabilityCatalogResponse>("extension_get_capability_catalog");
}

export async function exportExtensionCapabilityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("extension_export_capability_catalog", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function updateExtensionOptions(patch: {
  bridgeUrl?: string;
  bridgeDiscoveryPorts?: number[];
  token?: string;
  deepLinkFallback?: boolean;
  captureMedia?: boolean;
  captureHeaders?: boolean;
  blockedHosts?: string[];
}): Promise<ExtensionOptionsState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ExtensionOptionsState>("extension_update_options", {
    request: {
      bridge_url: patch.bridgeUrl,
      bridge_discovery_ports: patch.bridgeDiscoveryPorts,
      token: patch.token,
      deep_link_fallback: patch.deepLinkFallback,
      capture_media: patch.captureMedia,
      capture_headers: patch.captureHeaders,
      blocked_hosts: patch.blockedHosts
    }
  });
}

export async function getExtensionConnectorProfile(options?: {
  token?: string;
  createToken?: boolean;
  label?: string;
}): Promise<ExtensionConnectorProfile | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ExtensionConnectorProfile>("extension_get_connector_profile", {
    request: {
      token: options?.token,
      create_token: options?.createToken ?? false,
      label: options?.label
    }
  });
}

export async function getExtensionPairingStatus(): Promise<ExtensionPairingStatus | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ExtensionPairingStatus>("extension_get_pairing_status");
}

export async function createExtensionPairingToken(label?: string): Promise<ExtensionPairingToken | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ExtensionPairingToken>("extension_create_pairing_token", {
    request: { label: label || null }
  });
}

export async function revokeExtensionPairing(): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ revoked: boolean }>("extension_revoke_pairing");
  return response.revoked;
}

export async function listExtensionCookiePayloads(): Promise<ExtensionCookiePayloadInfo[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ payloads: ExtensionCookiePayloadInfo[] }>(
    "extension_list_cookie_payloads"
  );
  return response.payloads;
}

export async function deleteExtensionCookiePayload(payloadRef: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("extension_delete_cookie_payload", {
    request: { payload_ref: payloadRef }
  });
  return response.deleted;
}

export async function deleteExtensionCookiePayloads(payloadRefs: string[]): Promise<ExtensionPayloadBulkDeleteResponse> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [] };
  }

  return invoke<ExtensionPayloadBulkDeleteResponse>("extension_delete_cookie_payloads", {
    request: { payload_refs: payloadRefs }
  });
}

export async function clearExtensionCookiePayloads(): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("extension_clear_cookie_payloads");
  return response.cleared;
}

export async function listExtensionAuthorizationPayloads(): Promise<ExtensionAuthorizationPayloadInfo[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ payloads: ExtensionAuthorizationPayloadInfo[] }>(
    "extension_list_authorization_payloads"
  );
  return response.payloads;
}

export async function deleteExtensionAuthorizationPayload(payloadRef: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("extension_delete_authorization_payload", {
    request: { payload_ref: payloadRef }
  });
  return response.deleted;
}

export async function deleteExtensionAuthorizationPayloads(payloadRefs: string[]): Promise<ExtensionPayloadBulkDeleteResponse> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [] };
  }

  return invoke<ExtensionPayloadBulkDeleteResponse>("extension_delete_authorization_payloads", {
    request: { payload_refs: payloadRefs }
  });
}

export async function clearExtensionAuthorizationPayloads(): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("extension_clear_authorization_payloads");
  return response.cleared;
}

export interface SettingsSearchResult {
  schema_version: 1;
  section_id:
    | "paths"
    | "infrastructure"
    | "dependencies"
    | "appearance"
    | "downloads"
    | "network"
    | "cookies"
    | "extension"
    | "channels"
    | "plugins"
    | "ai"
    | "advanced";
  title: string;
  description: string;
  keywords: string[];
}

export async function searchSettings(query: string): Promise<SettingsSearchResult[]> {
  if (!isTauriRuntime() || !query.trim()) {
    return [];
  }

  const response = await invoke<{ results: SettingsSearchResult[] }>("settings_search", {
    request: { query }
  });
  return response.results;
}

export interface ToolStatus {
  schema_version: 1;
  id: "yt-dlp" | "ffmpeg" | "gallery-dl" | "torrent-engine" | "whisper";
  state: "missing" | "installed" | "error";
  version?: string | null;
  path?: string | null;
  managed: boolean;
  updatable: boolean;
  last_checked_at: string;
  error?: string | null;
}

export interface ToolLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  tool_count: number;
  installed_count: number;
  missing_count: number;
  error_count: number;
  managed_count: number;
  updatable_count: number;
  path_override_count: number;
  download_source_count: number;
  install_error_count: number;
  source_hash_count: number;
  managed_file_count: number;
  managed_total_size_bytes: number;
  tools: ToolStatus[];
  configured_sources: ToolDownloadSource[];
  managed_files: Array<{
    path: string;
    file_name: string;
    size_bytes: number;
    modified_at?: string | null;
  }>;
  review_notes: string[];
}

export interface PlatformMatrixEntry {
  platform_key: string;
  display_name: string;
  category: string;
  route: string;
  status: "implemented" | "partial" | "local_draft" | "classifier_only" | "blocked" | string;
  evidence: string[];
  limitations: string[];
}

export interface PlatformMatrixResponse {
  schema_version: 1;
  platforms: PlatformMatrixEntry[];
}

export interface PlatformRouteSample {
  label: string;
  url: string;
}

export interface PlatformRouteSampleResponse {
  schema_version: 1;
  samples: PlatformRouteSample[];
  pending_real_site_verification: boolean;
}

export interface PlatformLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  platform_count: number;
  route_sample_count: number;
  implemented_count: number;
  partial_count: number;
  local_draft_count: number;
  classifier_only_count: number;
  category_counts: LocalCountEntry[];
  route_counts: LocalCountEntry[];
  status_counts: LocalCountEntry[];
  platforms: PlatformMatrixEntry[];
  route_samples: PlatformRouteSample[];
  pending_real_site_verification: boolean;
  executes_network_checks: boolean;
  creates_download_tasks: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  review_notes: string[];
}

export interface ToolUpdateCheckResponse {
  schema_version: 1;
  tool_id: ToolStatus["id"];
  current_version?: string | null;
  latest_version?: string | null;
  update_available?: boolean | null;
  source_url?: string | null;
  checked_at: string;
  message: string;
}

export interface ToolDownloadSource {
  tool_id: ToolStatus["id"];
  url: string;
  sha256: string;
  archive_member?: string | null;
}

export interface ToolSettingsExportResponse {
  output_path: string;
  path_override_count: number;
  download_source_count: number;
  install_error_count: number;
}

export interface ToolSettingsImportResponse {
  input_path: string;
  path_override_count: number;
  download_source_count: number;
  install_error_count: number;
  skipped_path_override_count: number;
  skipped_download_source_count: number;
}

export interface ToolInstallProgressEvent {
  schema_version: 1;
  tool_id: ToolStatus["id"];
  stage: "starting" | "downloading" | "verifying" | "installing" | "completed" | "failed";
  message: string;
  downloaded_bytes?: number | null;
  total_bytes?: number | null;
  percent?: number | null;
  error?: string | null;
  updated_at: string;
}

export type ToastLevel = "success" | "info" | "warning" | "error";

export interface ToastAction {
  label: string;
  command?: string | null;
}

export interface ToastShowEvent {
  level: ToastLevel;
  title: string;
  message?: string | null;
  action?: ToastAction | null;
}

export async function getToolStatuses(): Promise<ToolStatus[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ tools: ToolStatus[] }>("tools_get_status");
  return response.tools;
}

export async function getToolsLocalSummary(): Promise<ToolLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ToolLocalSummaryResponse>("tools_get_local_summary");
}

export async function exportToolsLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("tools_export_local_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function exportToolSettings(outputPath?: string | null): Promise<ToolSettingsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ToolSettingsExportResponse>("tools_export_settings", {
    request: { output_path: outputPath || null }
  });
}

export async function importToolSettings(inputPath: string): Promise<ToolSettingsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ToolSettingsImportResponse>("tools_import_settings", {
    request: { input_path: inputPath }
  });
}

export async function getToolDownloadSources(): Promise<ToolDownloadSource[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ sources: ToolDownloadSource[] }>("tools_get_download_sources");
  return response.sources;
}

export async function getPlatformMatrix(): Promise<PlatformMatrixEntry[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<PlatformMatrixResponse>("platforms_get_matrix");
  return response.platforms;
}

export async function getPlatformRouteSamples(): Promise<PlatformRouteSample[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<PlatformRouteSampleResponse>("platforms_get_route_samples");
  return response.samples;
}

export async function getPlatformLocalSummary(): Promise<PlatformLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PlatformLocalSummaryResponse>("platforms_get_local_summary");
}

export async function exportPlatformLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("platforms_export_local_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function exportPlatformMatrix(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("platforms_export_matrix", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function exportPlatformRouteSamples(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("platforms_export_route_samples", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function installTool(id: ToolStatus["id"]): Promise<ToolStatus | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ToolStatus>("tools_install", {
    request: { id }
  });
}

export async function checkToolUpdate(id: ToolStatus["id"]): Promise<ToolUpdateCheckResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ToolUpdateCheckResponse>("tools_check_update", {
    request: { id }
  });
}

export async function updateTool(id: ToolStatus["id"]): Promise<ToolStatus | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ToolStatus>("tools_update", {
    request: { id }
  });
}

export async function setToolPath(id: ToolStatus["id"], path: string): Promise<ToolStatus | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ToolStatus>("tools_set_path", {
    request: { id, path }
  });
}

export async function clearToolPath(id: ToolStatus["id"]): Promise<ToolStatus | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ToolStatus>("tools_clear_path", {
    request: { id }
  });
}

export async function setToolDownloadSource(
  id: ToolStatus["id"],
  url: string,
  sha256: string,
  archiveMember?: string
): Promise<ToolDownloadSource | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ToolDownloadSource>("tools_set_download_source", {
    request: {
      id,
      url,
      sha256,
      archive_member: archiveMember?.trim() ? archiveMember.trim() : null
    }
  });
}

export async function clearToolDownloadSource(id: ToolStatus["id"]): Promise<ToolDownloadSource[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ sources: ToolDownloadSource[] }>("tools_clear_download_source", {
    request: { id }
  });
  return response.sources;
}

export async function onToolInstallProgress(
  handler: (event: ToolInstallProgressEvent) => void
): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<ToolInstallProgressEvent>("tool:install-progress", (event) => handler(event.payload));
}

export async function onToolStatus(handler: (event: ToolStatus) => void): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<ToolStatus>("tool:status", (event) => handler(event.payload));
}

export async function showAppToast(event: ToastShowEvent): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  await invoke("app_show_toast", { request: event });
  return true;
}

export async function onToastShow(handler: (event: ToastShowEvent) => void): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<ToastShowEvent>("toast:show", (event) => handler(event.payload));
}

export interface SubtitleSettings {
  languages: string[];
  auto: boolean;
  embed: boolean;
  keep_vtt: boolean;
}

export interface SponsorBlockSettings {
  enabled: boolean;
  categories: string[];
}

export interface MetadataSettings {
  embed_metadata: boolean;
  embed_thumbnail: boolean;
  split_chapters: boolean;
}

export interface MetadataLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  default_output_dir_set: boolean;
  default_output_dir?: string | null;
  subtitle_language_count: number;
  subtitle_auto_enabled: boolean;
  subtitle_embed_enabled: boolean;
  subtitle_keep_vtt_enabled: boolean;
  sponsorblock_enabled: boolean;
  sponsorblock_category_count: number;
  embed_metadata_enabled: boolean;
  embed_thumbnail_enabled: boolean;
  split_chapters_enabled: boolean;
  ai_provider: string;
  whisper_model: string;
  whisper_task: string;
  whisper_language_set: boolean;
  subtitle_translate_enabled: boolean;
  grammar_cleanup_enabled: boolean;
  tool_override_count: number;
  tool_source_count: number;
  managed_tool_file_count: number;
  managed_tool_total_size_bytes: number;
  sidecar_file_count: number;
  sidecar_total_size_bytes: number;
  waveform_cache_file_count: number;
  waveform_cache_total_size_bytes: number;
  tool_status_counts: Array<{ key: string; count: number }>;
  sidecar_kind_counts: Array<{ key: string; count: number }>;
  sidecar_files: Array<{ path: string; file_name: string; size_bytes: number; modified_at?: string | null }>;
  waveform_cache_files: Array<{ path: string; file_name: string; size_bytes: number; modified_at?: string | null }>;
  managed_tool_files: Array<{ path: string; file_name: string; size_bytes: number; modified_at?: string | null }>;
  includes_source_urls: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  includes_file_bodies: boolean;
  executes_tools: boolean;
  review_notes: string[];
}

export async function getMetadataLocalSummary(): Promise<MetadataLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MetadataLocalSummaryResponse>("metadata_get_local_summary");
}

export async function exportMetadataLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("metadata_export_local_summary", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export interface MediaToolsLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  ffmpeg_configured: boolean;
  whisper_configured: boolean;
  tool_override_count: number;
  tool_source_count: number;
  install_error_count: number;
  clip_task_count: number;
  transcode_input_set: boolean;
  transcode_output_set: boolean;
  transcode_cover_set: boolean;
  shot_input_set: boolean;
  shot_marker_count: number;
  shot_output_set: boolean;
  waveform_input_set: boolean;
  waveform_cache_file_count: number;
  waveform_cache_total_size_bytes: number;
  whisper_input_set: boolean;
  whisper_output_dir_set: boolean;
  whisper_output_path_set: boolean;
  whisper_model: string;
  whisper_task: string;
  whisper_language_set: boolean;
  subtitle_workshop_input_set: boolean;
  subtitle_workshop_output_set: boolean;
  subtitle_workshop_format?: string | null;
  subtitle_workshop_line_count: number;
  subtitle_sidecar_file_count: number;
  subtitle_sidecar_total_size_bytes: number;
  waveform_cache_files: Array<{ path: string; file_name: string; size_bytes: number; modified_at?: string | null }>;
  subtitle_sidecar_files: Array<{ path: string; file_name: string; size_bytes: number; modified_at?: string | null }>;
  tool_status_counts: Array<{ key: string; count: number }>;
  executes_media_tools: boolean;
  includes_media_file_bodies: boolean;
  includes_subtitle_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  review_notes: string[];
}

export async function getMediaToolsLocalSummary(): Promise<MediaToolsLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MediaToolsLocalSummaryResponse>("media_get_local_summary");
}

export async function exportMediaToolsLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("media_export_local_summary", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export interface MetadataPreviewFormat {
  id: string;
  label?: string | null;
  ext?: string | null;
  width?: number | null;
  height?: number | null;
  filesize_bytes?: number | null;
  vcodec?: string | null;
  acodec?: string | null;
}

export interface MetadataPreview {
  schema_version: 1;
  source_url: string;
  platform: string;
  title?: string | null;
  author?: string | null;
  thumbnail_url?: string | null;
  duration_seconds?: number | null;
  formats: MetadataPreviewFormat[];
}

export interface MetadataPlaylistEntry {
  index?: number | null;
  id?: string | null;
  title?: string | null;
  url?: string | null;
  webpage_url?: string | null;
  duration_seconds?: number | null;
  author?: string | null;
  thumbnail_url?: string | null;
}

export interface MetadataPlaylistPreview {
  schema_version: 1;
  source_url: string;
  platform: string;
  title?: string | null;
  author?: string | null;
  item_count: number;
  truncated: boolean;
  entries: MetadataPlaylistEntry[];
}

export interface GalleryPreviewEntry {
  index: number;
  url: string;
  file_name?: string | null;
  extension?: string | null;
  media_kind: string;
}

export interface GalleryPreview {
  schema_version: 1;
  source_url: string;
  platform: string;
  item_count: number;
  truncated: boolean;
  entries: GalleryPreviewEntry[];
}

export interface MetadataProbeOptions {
  userAgent?: string;
  referer?: string;
  proxy?: string;
  cookieBucketId?: string;
  authPayloadRef?: string;
  rateLimit?: string;
}

export type GalleryProbeOptions = MetadataProbeOptions;

export interface SubtitleOption {
  language: string;
  name?: string | null;
  formats: string[];
  is_auto: boolean;
}

export interface MetadataSubtitlesResponse {
  subtitles: SubtitleOption[];
}

export interface ThumbnailOption {
  id?: string | null;
  url: string;
  width?: number | null;
  height?: number | null;
  preference?: number | null;
}

export interface MetadataThumbnailsResponse {
  thumbnails: ThumbnailOption[];
}

export interface ChapterOption {
  title?: string | null;
  start_seconds?: number | null;
  end_seconds?: number | null;
}

export interface MetadataChaptersResponse {
  chapters: ChapterOption[];
}

export interface CommentOption {
  id?: string | null;
  author?: string | null;
  text: string;
  timestamp_seconds?: number | null;
  like_count?: number | null;
  reply_count?: number | null;
}

export interface MetadataCommentsResponse {
  comments: CommentOption[];
}

export interface SaveMetadataSubtitleRequest {
  url: string;
  language: string;
  format: string;
  isAuto: boolean;
  outputDir?: string;
  outputPath?: string;
  options?: MetadataProbeOptions;
}

export interface SaveMetadataSubtitleResponse {
  output_path: string;
}

export interface MergeMetadataSubtitlesRequest {
  inputPaths: string[];
  outputPath: string;
}

export interface MergeMetadataSubtitlesResponse {
  output_path: string;
  merged_count: number;
}

export interface SubtitleWorkshopOpenResponse {
  path: string;
  format: "srt" | "vtt" | "ass";
  content: string;
  line_count: number;
}

export interface SaveSubtitleWorkshopFileRequest {
  outputPath: string;
  content: string;
}

export interface SubtitleWorkshopSaveResponse {
  output_path: string;
  format: "srt" | "vtt" | "ass";
  line_count: number;
}

export interface SaveMetadataThumbnailRequest {
  url: string;
  outputDir?: string;
  outputPath?: string;
  fileName?: string;
  options?: MetadataProbeOptions;
}

export interface SaveMetadataThumbnailResponse {
  output_path: string;
}

export interface SaveMetadataChaptersRequest {
  url: string;
  outputDir?: string;
  outputPath?: string;
  fileName?: string;
  options?: MetadataProbeOptions;
}

export interface SaveMetadataChaptersResponse {
  output_path: string;
  chapter_count: number;
}

export interface SaveMetadataInfoJsonRequest {
  url: string;
  outputDir?: string;
  outputPath?: string;
  options?: MetadataProbeOptions;
}

export interface SaveMetadataInfoJsonResponse {
  output_path: string;
}

export interface SaveMetadataCommentsRequest {
  url: string;
  outputDir?: string;
  outputPath?: string;
  options?: MetadataProbeOptions;
}

export interface SaveMetadataCommentsResponse {
  output_path: string;
}

export interface SaveMetadataLiveChatRequest {
  url: string;
  outputDir?: string;
  outputPath?: string;
  options?: MetadataProbeOptions;
}

export interface SaveMetadataLiveChatResponse {
  output_path: string;
}

export interface ClipVideoRequest {
  jobId?: string;
  inputPath: string;
  outputPath: string;
  mode?: "copy" | "reencode";
  videoCodec?: string;
  audioCodec?: string;
  crf?: number;
  preset?: string;
  startSeconds?: number;
  endSeconds?: number;
}

export interface ClipVideoResponse {
  job_id: string;
  output_path: string;
}

export interface TranscodeMediaRequest {
  jobId?: string;
  inputPath: string;
  outputPath: string;
  preset?: "copy" | "h264" | "h265" | "vp9" | "audio_mp3" | "audio_aac" | "audio_opus" | "custom";
  videoCodec?: string;
  audioCodec?: string;
  crf?: number;
  speedPreset?: string;
  audioBitrate?: string;
  metadataTitle?: string;
  metadataArtist?: string;
  coverPath?: string;
}

export interface WhisperSubtitlesRequest {
  jobId?: string;
  inputPath: string;
  outputDir?: string;
  outputPath?: string;
  language?: string;
  model?: string;
  task?: "transcribe" | "translate";
  outputFormat?: "srt" | "vtt" | "txt";
}

export interface WhisperSubtitlesResponse {
  job_id: string;
  output_path: string;
  format: "srt" | "vtt" | "txt";
}

export interface DetectShotsRequest {
  inputPath: string;
  threshold?: number;
}

export interface ShotMarker {
  timestamp_seconds: number;
  score: number;
}

export interface DetectShotsResponse {
  markers: ShotMarker[];
}

export interface SaveShotMarkersRequest {
  outputPath: string;
  markers: ShotMarker[];
}

export interface SaveShotMarkersResponse {
  output_path: string;
  marker_count: number;
}

export interface GenerateWaveformPeaksRequest {
  inputPath: string;
  bucketCount?: number;
}

export interface WaveformPeak {
  index: number;
  start_seconds: number;
  end_seconds: number;
  min: number;
  max: number;
  rms: number;
}

export interface WaveformPeaksResponse {
  cache_path: string;
  sample_rate: number;
  channel_count: number;
  bucket_count: number;
  duration_seconds: number;
  peaks: WaveformPeak[];
}

export interface TorrentFileEntry {
  path: string;
  size_bytes: number;
}

export interface TorrentMetadataResponse {
  name: string;
  info_hash: string;
  piece_length_bytes: number;
  piece_count: number;
  pieces_sha1_bytes: number;
  total_size_bytes: number;
  file_count: number;
  files: TorrentFileEntry[];
  trackers: string[];
}

export interface MagnetMetadataResponse {
  info_hash: string;
  display_name?: string | null;
  trackers: string[];
  web_seeds: string[];
  exact_topic: string;
}

export interface P2pOffer {
  schema_version: 1;
  id: string;
  short_code: string;
  file_name: string;
  file_path: string;
  size_bytes: number;
  sha256?: string | null;
  status: "waiting" | "serving" | "paused" | "receive_ready" | "completed" | "canceled" | "expired";
  endpoint_host?: string | null;
  endpoint_port?: number | null;
  share_code?: string | null;
  served_at?: string | null;
  receive_output_dir?: string | null;
  receive_requested_at?: string | null;
  created_at: string;
  expires_at: string;
  updated_at: string;
}

export interface P2pNetworkProbeResponse {
  schema_version: 1;
  short_code: string;
  file_name: string;
  size_bytes: number;
  sha256?: string | null;
  endpoint_host: string;
  endpoint_port: number;
  share_code: string;
}

export type P2pOfferBulkAction = "pause" | "resume" | "cancel" | "delete";

export interface P2pOfferBulkFailure {
  id: string;
  error: string;
}

export interface P2pOfferBulkActionResult {
  offers: P2pOffer[];
  deleted: string[];
  failed: P2pOfferBulkFailure[];
}

export interface P2pOffersExportResponse {
  schema_version: 1;
  output_path: string;
  exported_count: number;
}

export interface P2pOffersImportResponse {
  schema_version: 1;
  imported_count: number;
  skipped_count: number;
  offers: P2pOffer[];
}

export interface P2pOffersChangedEvent {
  reason: string;
  offers: P2pOffer[];
}

export interface CookieAuthLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  cookie_bucket_count: number;
  cookie_row_count: number;
  valid_cookie_bucket_count: number;
  expired_cookie_bucket_count: number;
  untested_cookie_bucket_count: number;
  error_cookie_bucket_count: number;
  browser_extension_bucket_count: number;
  pasted_bucket_count: number;
  file_bucket_count: number;
  secure_only_bucket_count: number;
  domain_hint_count: number;
  path_hint_count: number;
  storage_file_count: number;
  missing_storage_file_count: number;
  staged_cookie_payload_count: number;
  staged_authorization_payload_count: number;
  twitter_x_manual_cookie_enabled: boolean;
  twitter_x_manual_cookie_set: boolean;
  twitter_x_manual_cookie_preview?: string | null;
  twitter_x_manual_cookie_updated_at?: string | null;
  bilibili_cookie_bucket_set: boolean;
  bilibili_cookie_bucket_id?: string | null;
  bilibili_cookie_health?: CookieBucket["health"] | null;
  platform_counts: LocalCountEntry[];
  source_counts: LocalCountEntry[];
  health_counts: LocalCountEntry[];
  expiry_summary_counts: LocalCountEntry[];
  storage_status_counts: LocalCountEntry[];
  staged_payload_counts: LocalCountEntry[];
  last_cookie_bucket_updated_at?: string | null;
  last_cookie_tested_at?: string | null;
  last_staged_cookie_payload_modified_at?: string | null;
  last_staged_authorization_payload_modified_at?: string | null;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  review_notes: string[];
}
export interface CookieAuthCapabilityCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  data_files: string[];
  sensitive_fields: string[];
  stores_secret_values: boolean;
  exports_secret_values: boolean;
  mutates_cookie_store: boolean;
  mutates_auth_settings: boolean;
  executes_network_check: boolean;
  supports_batch: boolean;
  scope: string;
  limitations: string[];
}

export interface CookieAuthCapabilityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  capability_count: number;
  capabilities: CookieAuthCapabilityCatalogItem[];
  storage_files: string[];
  supported_sources: string[];
  supported_health_states: string[];
  supported_platform_helpers: string[];
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  includes_pairing_tokens: boolean;
  includes_staged_payload_bodies: boolean;
  reads_cookie_values: boolean;
  mutates_cookie_store: boolean;
  mutates_auth_settings: boolean;
  executes_network_checks: boolean;
  verifies_live_login: boolean;
  review_notes: string[];
}

export interface DownloadsTasksExportResponse {
  schema_version: 1;
  output_path: string;
  exported_task_count: number;
  includes_source_urls: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  executes_downloads: boolean;
  review_notes: string[];
}

export interface DownloadFilterPresetBackupItem {
  id: string;
  name: string;
  view_mode: string;
  status: string;
  kind: string;
  platform: string;
  operational: string;
  query: string;
  date_field: string;
  date_from: string;
  date_to: string;
  sort_mode: string;
}

export interface DownloadFilterPresetsExportResponse {
  schema_version: 1;
  output_path: string;
  exported_preset_count: number;
  includes_task_source_urls: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  includes_downloaded_content: boolean;
  includes_download_log_bodies: boolean;
  review_notes: string[];
}

export interface DownloadFilterPresetsImportResponse {
  schema_version: 1;
  input_path: string;
  imported_preset_count: number;
  selected_preset_id?: string | null;
  presets: DownloadFilterPresetBackupItem[];
  review_notes: string[];
}

export interface DownloadsTasksImportResponse {
  schema_version: 1;
  input_path: string;
  imported_task_count: number;
  skipped_task_count: number;
  downgraded_active_task_count: number;
  total_task_count: number;
  tasks: DownloadTask[];
  review_notes: string[];
}

export interface CookieBucketsExportResponse {
  schema_version: 1;
  output_path: string;
  exported_bucket_count: number;
  exported_cookie_row_count: number;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  includes_staged_payload_bodies: boolean;
  executes_network_requests: boolean;
  review_notes: string[];
}

export interface CookieBucketsImportResponse {
  schema_version: 1;
  input_path: string;
  imported_bucket_count: number;
  skipped_bucket_count: number;
  total_bucket_count: number;
  buckets: CookieBucket[];
  review_notes: string[];
}

export interface DownloadsLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  task_count: number;
  visible_task_count: number;
  queued_task_count: number;
  active_task_count: number;
  paused_task_count: number;
  completed_task_count: number;
  failed_task_count: number;
  canceled_task_count: number;
  archived_task_count: number;
  retryable_task_count: number;
  retried_task_count: number;
  retry_count_total: number;
  tasks_with_error_count: number;
  output_backed_task_count: number;
  output_path_count: number;
  output_dir_count: number;
  unique_output_dir_count: number;
  cookie_bucket_ref_count: number;
  auth_payload_ref_count: number;
  thumbnail_url_count: number;
  thumbnail_path_count: number;
  clip_task_count: number;
  custom_args_task_count: number;
  live_from_start_task_count: number;
  total_downloaded_bytes: number;
  total_known_bytes: number;
  total_file_count: number;
  log_file_count: number;
  log_total_size_bytes: number;
  log_backed_task_count: number;
  status_counts: LocalCountEntry[];
  kind_counts: LocalCountEntry[];
  platform_counts: LocalCountEntry[];
  error_category_counts: LocalCountEntry[];
  output_status_counts: LocalCountEntry[];
  log_status_counts: LocalCountEntry[];
  auth_usage_counts: LocalCountEntry[];
  network_option_counts: LocalCountEntry[];
  first_created_at?: string | null;
  last_created_at?: string | null;
  last_updated_at?: string | null;
  last_started_at?: string | null;
  last_finished_at?: string | null;
  last_log_modified_at?: string | null;
  includes_source_urls: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  executes_downloads: boolean;
  review_notes: string[];
}

export interface DownloadsKindCatalogItem {
  kind: string;
  aliases: string[];
  label: string;
  status: string;
  create_supported: boolean;
  queue_supported: boolean;
  desktop_ui_supported: boolean;
  cli_supported: boolean;
  extension_bridge_supported: boolean;
  local_summary_supported: boolean;
  execution_backend: string;
  dependency_hints: string[];
  source_hints: string[];
  limitations: string[];
}

export interface DownloadsKindCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  kind_count: number;
  kinds: DownloadsKindCatalogItem[];
  includes_source_urls: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  executes_downloads: boolean;
  verifies_remote_sources: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsOptionCatalogItem {
  option: string;
  aliases: string[];
  label: string;
  status: string;
  task_supported: boolean;
  default_supported: boolean;
  desktop_ui_supported: boolean;
  cli_supported: boolean;
  ytdlp_supported: boolean;
  direct_file_supported: boolean;
  export_supported: boolean;
  task_field: string;
  settings_field?: string | null;
  cli_flags: string[];
  applies_to_kinds: string[];
  value_hints: string[];
  limitations: string[];
}

export interface DownloadsOptionCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  option_count: number;
  options: DownloadsOptionCatalogItem[];
  includes_task_values: boolean;
  includes_source_urls: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  executes_downloads: boolean;
  verifies_ytdlp_matrix: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsStatusCatalogItem {
  status: string;
  label: string;
  visible_in_queue: boolean;
  visible_in_history: boolean;
  terminal: boolean;
  active_runtime_state: boolean;
  allowed_actions: string[];
  bulk_actions: string[];
  next_statuses: string[];
  event_names: string[];
  limitations: string[];
}

export interface DownloadsStatusCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  status_count: number;
  statuses: DownloadsStatusCatalogItem[];
  includes_task_values: boolean;
  includes_source_urls: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  mutates_tasks: boolean;
  executes_downloads: boolean;
  verifies_runtime_transitions: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsErrorCatalogItem {
  category: string;
  code: string;
  label: string;
  retryable_by_default: boolean;
  auto_retry_supported: boolean;
  max_auto_retries: number;
  retry_delay_seconds: number[];
  sample_match_hints: string[];
  user_action?: string | null;
  applies_to_backends: string[];
  limitations: string[];
}

export interface DownloadsErrorCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  category_count: number;
  retryable_category_count: number;
  max_auto_retries: number;
  categories: DownloadsErrorCatalogItem[];
  includes_task_values: boolean;
  includes_error_messages: boolean;
  includes_source_urls: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  mutates_tasks: boolean;
  executes_downloads: boolean;
  verifies_real_failures: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsIntegrityCatalogItem {
  capability: string;
  label: string;
  status: string;
  task_field: string;
  cli_flags: string[];
  applies_to_kinds: string[];
  writes_task_metadata: boolean;
  reads_output_file_on_completion: boolean;
  failure_behavior: string;
  limitations: string[];
}

export interface DownloadsIntegrityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  capability_count: number;
  capabilities: DownloadsIntegrityCatalogItem[];
  hash_algorithm: string;
  expected_hash_field: string;
  actual_hash_field: string;
  verified_at_field: string;
  includes_task_values: boolean;
  includes_source_urls: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  calculates_hashes: boolean;
  executes_downloads: boolean;
  verifies_real_files: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsCleanupCatalogItem {
  cleanup: string;
  label: string;
  status: string;
  command: string;
  cli_aliases: string[];
  settings_fields: string[];
  scope: string;
  deletes_task_records: boolean;
  deletes_output_files: boolean;
  deletes_partial_files: boolean;
  requires_confirmation_in_ui: boolean;
  emits_events: string[];
  limitations: string[];
}

export interface DownloadsCleanupCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  cleanup_count: number;
  cleanups: DownloadsCleanupCatalogItem[];
  includes_task_values: boolean;
  includes_source_urls: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  mutates_tasks: boolean;
  deletes_files: boolean;
  executes_downloads: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsLogCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  reads_log_bodies: boolean;
  deletes_log_files: boolean;
  writes_log_files: boolean;
  supports_pagination: boolean;
  supports_search: boolean;
  scope: string;
  limitations: string[];
}

export interface DownloadsLogCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  log_capability_count: number;
  capabilities: DownloadsLogCatalogItem[];
  log_directory: string;
  log_file_pattern: string;
  max_page_limit: number;
  includes_task_values: boolean;
  includes_source_urls: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  reads_log_bodies: boolean;
  deletes_log_files: boolean;
  writes_log_files: boolean;
  mutates_tasks: boolean;
  executes_downloads: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsEventCatalogItem {
  event_name: string;
  label: string;
  status: string;
  payload_shape: string;
  emitted_by: string[];
  frontend_consumers: string[];
  includes_task_metadata: boolean;
  includes_source_urls: boolean;
  includes_output_paths: boolean;
  includes_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  starts_downloads: boolean;
  mutates_tasks: boolean;
  limitations: string[];
}

export interface DownloadsEventCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  event_count: number;
  events: DownloadsEventCatalogItem[];
  includes_task_values: boolean;
  includes_source_urls: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  emits_events: boolean;
  mutates_tasks: boolean;
  executes_downloads: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsQueueCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  task_fields: string[];
  settings_fields: string[];
  emits_events: string[];
  reads_task_records: boolean;
  mutates_tasks: boolean;
  starts_downloads: boolean;
  stops_downloads: boolean;
  preserves_order: boolean;
  scope: string;
  limitations: string[];
}

export interface DownloadsQueueCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  queue_capability_count: number;
  capabilities: DownloadsQueueCatalogItem[];
  default_max_concurrency: number;
  max_concurrency_limit: number;
  position_field: string;
  scheduler_flag_field: string;
  includes_task_values: boolean;
  includes_source_urls: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  reads_task_records: boolean;
  mutates_tasks: boolean;
  starts_downloads: boolean;
  stops_downloads: boolean;
  executes_downloads: boolean;
  verifies_runtime_scheduler: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsRetryCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  task_fields: string[];
  error_categories: string[];
  retry_delays_seconds: number[];
  increments_retry_count: boolean;
  clears_error_state: boolean;
  auto_schedules: boolean;
  starts_downloads: boolean;
  mutates_tasks: boolean;
  scope: string;
  limitations: string[];
}

export interface DownloadsRetryCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  retry_capability_count: number;
  capabilities: DownloadsRetryCatalogItem[];
  max_auto_retries: number;
  retry_delay_seconds: number[];
  retryable_error_codes: string[];
  non_retryable_error_codes: string[];
  interrupted_message: string;
  includes_task_values: boolean;
  includes_error_messages: boolean;
  includes_source_urls: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  mutates_tasks: boolean;
  starts_downloads: boolean;
  executes_downloads: boolean;
  verifies_real_retries: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsSourceCatalogItem {
  source: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  task_kinds: string[];
  source_reference_fields: string[];
  supports_batch_queue: boolean;
  supports_cookie_ref: boolean;
  supports_auth_ref: boolean;
  probes_remote_metadata: boolean;
  queues_download_tasks: boolean;
  includes_source_urls_in_runtime_tasks: boolean;
  scope: string;
  limitations: string[];
}

export interface DownloadsSourceCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  source_count: number;
  sources: DownloadsSourceCatalogItem[];
  includes_source_urls: boolean;
  includes_task_values: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  probes_remote_metadata: boolean;
  queues_download_tasks: boolean;
  executes_downloads: boolean;
  verifies_remote_sources: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsOutputCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  task_fields: string[];
  settings_fields: string[];
  reads_output_paths: boolean;
  reads_file_bodies: boolean;
  writes_output_files: boolean;
  opens_paths: boolean;
  reveals_paths: boolean;
  deletes_output_files: boolean;
  mutates_tasks: boolean;
  executes_downloads: boolean;
  scope: string;
  limitations: string[];
}

export interface DownloadsOutputCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  output_capability_count: number;
  capabilities: DownloadsOutputCatalogItem[];
  output_directory_fields: string[];
  output_file_fields: string[];
  includes_task_values: boolean;
  includes_output_paths: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_source_urls: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  reads_output_paths: boolean;
  reads_file_bodies: boolean;
  writes_output_files: boolean;
  opens_paths: boolean;
  reveals_paths: boolean;
  deletes_output_files: boolean;
  mutates_tasks: boolean;
  executes_downloads: boolean;
  verifies_real_files: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsArtifactCatalogItem {
  artifact: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  artifact_roles: string[];
  file_extensions: string[];
  task_fields: string[];
  output_fields: string[];
  produced_by: string[];
  reads_artifact_paths: boolean;
  reads_file_bodies: boolean;
  writes_artifact_files: boolean;
  deletes_artifact_files: boolean;
  mutates_tasks: boolean;
  executes_downloads: boolean;
  scope: string;
  limitations: string[];
}

export interface DownloadsArtifactCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  artifact_count: number;
  artifacts: DownloadsArtifactCatalogItem[];
  artifact_roles: string[];
  artifact_path_fields: string[];
  includes_task_values: boolean;
  includes_artifact_paths: boolean;
  includes_artifact_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_source_urls: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  reads_artifact_paths: boolean;
  reads_file_bodies: boolean;
  writes_artifact_files: boolean;
  deletes_artifact_files: boolean;
  mutates_tasks: boolean;
  executes_downloads: boolean;
  verifies_real_artifacts: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsHistoryCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  statuses: string[];
  task_fields: string[];
  settings_fields: string[];
  emits_events: string[];
  reads_task_records: boolean;
  exports_task_records: boolean;
  includes_source_urls: boolean;
  mutates_tasks: boolean;
  deletes_task_records: boolean;
  executes_downloads: boolean;
  scope: string;
  limitations: string[];
}

export interface DownloadsHistoryCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  history_capability_count: number;
  capabilities: DownloadsHistoryCatalogItem[];
  history_statuses: string[];
  timestamp_fields: string[];
  includes_task_values: boolean;
  includes_source_urls: boolean;
  includes_output_paths: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  reads_task_records: boolean;
  exports_task_records: boolean;
  mutates_tasks: boolean;
  deletes_task_records: boolean;
  executes_downloads: boolean;
  verifies_real_history: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsPrivacyCatalogItem {
  boundary: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  sensitive_fields: string[];
  default_handling: string;
  user_controls: string[];
  includes_values: boolean;
  redacts_values: boolean;
  exports_metadata: boolean;
  scope: string;
  limitations: string[];
}

export interface DownloadsPrivacyCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  boundary_count: number;
  boundaries: DownloadsPrivacyCatalogItem[];
  includes_task_values: boolean;
  includes_source_urls: boolean;
  includes_output_paths: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  reads_cookie_values: boolean;
  reads_authorization_values: boolean;
  reads_log_bodies: boolean;
  reads_output_file_bodies: boolean;
  mutates_tasks: boolean;
  executes_downloads: boolean;
  verifies_privacy_matrix: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsRuntimeCatalogItem {
  runtime: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  task_kinds: string[];
  dependencies: string[];
  emits_events: string[];
  writes_logs: boolean;
  writes_output_files: boolean;
  reads_cookie_refs: boolean;
  reads_auth_refs: boolean;
  executes_external_process: boolean;
  executes_downloads: boolean;
  scope: string;
  limitations: string[];
}

export interface DownloadsRuntimeCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  runtime_count: number;
  runtimes: DownloadsRuntimeCatalogItem[];
  dependency_ids: string[];
  task_kinds: string[];
  includes_task_values: boolean;
  includes_source_urls: boolean;
  includes_output_paths: boolean;
  includes_output_file_bodies: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  executes_external_processes: boolean;
  executes_downloads: boolean;
  verifies_dependency_versions: boolean;
  verifies_real_download_matrix: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsInheritanceCatalogItem {
  setting: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  settings_fields: string[];
  task_fields: string[];
  task_kinds: string[];
  adapter_support: string[];
  inherited_by_single_task: boolean;
  inherited_by_batch: boolean;
  can_task_override: boolean;
  scope: string;
  limitations: string[];
}

export interface DownloadsInheritanceCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  inheritance_count: number;
  inheritances: DownloadsInheritanceCatalogItem[];
  settings_sections: string[];
  includes_task_values: boolean;
  includes_setting_values: boolean;
  includes_source_urls: boolean;
  includes_output_paths: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  reads_tasks: boolean;
  writes_tasks: boolean;
  mutates_settings: boolean;
  executes_downloads: boolean;
  verifies_runtime_inheritance: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface DownloadsFilterCatalogItem {
  filter: string;
  label: string;
  status: string;
  desktop_ui: string[];
  cli_flags: string[];
  task_fields: string[];
  preset_field: string | null;
  applies_to_views: string[];
  supports_copy: boolean;
  supports_export: boolean;
  mutates_tasks: boolean;
  scope: string;
  limitations: string[];
}

export interface DownloadsFilterCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  filter_count: number;
  filters: DownloadsFilterCatalogItem[];
  view_modes: string[];
  sort_modes: string[];
  preset_supported: boolean;
  includes_task_values: boolean;
  includes_source_urls: boolean;
  includes_output_paths: boolean;
  includes_log_bodies: boolean;
  includes_cookie_values: boolean;
  includes_authorization_values: boolean;
  reads_tasks: boolean;
  mutates_tasks: boolean;
  executes_downloads: boolean;
  verifies_manual_matrix: boolean;
  review_notes: string[];
}

export interface P2pCapabilityCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  p2p_surfaces: string[];
  data_files: string[];
  task_kinds: string[];
  sensitive_fields: string[];
  contacts_trackers: boolean;
  contacts_dht: boolean;
  contacts_relays: boolean;
  contacts_peers: boolean;
  reads_file_bodies: boolean;
  mutates_offers: boolean;
  creates_download_tasks: boolean;
  starts_local_listener: boolean;
  opens_local_files: boolean;
  supports_batch: boolean;
  scope: string;
  limitations: string[];
}

export interface P2pCapabilityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  capability_count: number;
  capabilities: P2pCapabilityCatalogItem[];
  p2p_surfaces: string[];
  data_files: string[];
  task_kinds: string[];
  supported_offer_statuses: string[];
  supported_draft_types: string[];
  sensitive_fields: string[];
  contacts_trackers: boolean;
  contacts_dht: boolean;
  contacts_relays: boolean;
  contacts_peers: boolean;
  reads_file_bodies: boolean;
  mutates_offers: boolean;
  creates_download_tasks: boolean;
  starts_local_listener: boolean;
  opens_local_files: boolean;
  verifies_bittorrent_e2e: boolean;
  verifies_lan_p2p_e2e: boolean;
  verifies_nat_or_relay_e2e: boolean;
  parity_gate_status: string;
  review_notes: string[];
}

export interface P2pLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  offer_count: number;
  active_offer_count: number;
  expired_offer_count: number;
  receive_ready_count: number;
  completed_offer_count: number;
  hashed_offer_count: number;
  missing_hash_offer_count: number;
  offered_total_size_bytes: number;
  receive_folder_count: number;
  source_path_count: number;
  local_source_path_count: number;
  missing_source_path_count: number;
  torrent_transfer_count: number;
  p2p_transfer_count: number;
  active_transfer_count: number;
  queued_transfer_count: number;
  completed_transfer_count: number;
  failed_transfer_count: number;
  canceled_transfer_count: number;
  archived_transfer_count: number;
  transfer_total_size_bytes: number;
  transfer_downloaded_bytes: number;
  torrent_file_draft_count: number;
  magnet_draft_count: number;
  p2p_receive_draft_count: number;
  torrent_info_hash_count: number;
  magnet_tracker_count: number;
  magnet_web_seed_count: number;
  torrent_tracker_count: number;
  selected_torrent_file_count: number;
  selected_torrent_total_size_bytes: number;
  sidecar_ready_transfer_count: number;
  offer_status_counts: LocalCountEntry[];
  transfer_status_counts: LocalCountEntry[];
  transfer_kind_counts: LocalCountEntry[];
  draft_type_counts: LocalCountEntry[];
  source_path_status_counts: LocalCountEntry[];
  last_offer_updated_at?: string | null;
  last_transfer_updated_at?: string | null;
  review_notes: string[];
}

export interface LibraryBookmark {
  id: string;
  label: string;
  position_percent: number;
  created_at: string;
}

export interface LibraryHighlight {
  id: string;
  text: string;
  note?: string | null;
  position_percent: number;
  created_at: string;
}

export interface LibraryReadingState {
  schema_version: 1;
  path: string;
  progress_percent: number;
  bookmarks: LibraryBookmark[];
  highlights: LibraryHighlight[];
  updated_at: string;
}

export interface LibraryAnnotationsDeleteResponse {
  state: LibraryReadingState;
  deleted: string[];
  failed: BulkDownloadFailure[];
}

export interface LibraryReaderSettings {
  schema_version: 1;
  focus_mode: boolean;
  theme: "paper" | "light" | "dark";
  font_family: "system" | "serif" | "sans" | "mono";
  font_size_percent: number;
  line_height_percent: number;
  zoom_percent: number;
  updated_at: string;
}

export interface LibraryReaderSettingsExportResponse {
  schema_version: 1;
  output_path: string;
}

export interface LibraryReaderSettingsImportResponse {
  schema_version: 1;
  settings: LibraryReaderSettings;
}

export interface LibraryExportReadingStateResponse {
  output_path: string;
  format: "json" | "markdown";
  bookmark_count: number;
  highlight_count: number;
}

export interface LibraryImportReadingStateResponse {
  state: LibraryReadingState;
  bookmark_count: number;
  highlight_count: number;
}

export interface LibraryReadingStatesExportResponse {
  schema_version: 1;
  output_path: string;
  exported_count: number;
  bookmark_count: number;
  highlight_count: number;
}

export interface LibraryReadingStatesImportResponse {
  schema_version: 1;
  imported_count: number;
  skipped_count: number;
  bookmark_count: number;
  highlight_count: number;
  states: LibraryReadingState[];
}

export interface LibraryItem {
  path: string;
  title: string;
  author?: string | null;
  metadata_source?: string | null;
  cover_path?: string | null;
  format: string;
  size_bytes: number;
  modified_at?: string | null;
}

export interface LibraryScanResponse {
  folder_path: string;
  item_count: number;
  items: LibraryItem[];
}

export interface LibraryCatalog {
  schema_version: 1;
  folders: string[];
  item_count: number;
  items: LibraryItem[];
  updated_at: string;
}

export interface LibraryCatalogExportResponse {
  schema_version: 1;
  output_path: string;
  exported_item_count: number;
  exported_folder_count: number;
}

export interface LibraryCatalogImportResponse {
  schema_version: 1;
  imported_item_count: number;
  imported_folder_count: number;
  skipped_item_count: number;
  catalog: LibraryCatalog;
}

export interface LibraryFormatCatalogItem {
  format: string;
  extensions: string[];
  scan_supported: boolean;
  metadata_supported: boolean;
  cover_supported: boolean;
  bounded_preview_supported: boolean;
  reading_state_supported: boolean;
  annotation_supported: boolean;
  export_supported: boolean;
  limitations: string[];
}

export interface LibraryFormatCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  format_count: number;
  formats: LibraryFormatCatalogItem[];
  includes_file_bodies: boolean;
  verifies_full_renderer: boolean;
  verifies_manual_reader_matrix: boolean;
  review_notes: string[];
}

export interface LibraryLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  folder_count: number;
  catalog_item_count: number;
  local_item_count: number;
  missing_item_count: number;
  supported_format_count: number;
  total_size_bytes: number;
  catalog_cover_count: number;
  author_count: number;
  reading_state_count: number;
  started_item_count: number;
  completed_item_count: number;
  average_progress_percent: number;
  bookmark_count: number;
  highlight_count: number;
  highlight_note_count: number;
  reader_focus_mode: boolean;
  reader_theme: string;
  reader_font_family: string;
  reader_font_size_percent: number;
  reader_line_height_percent: number;
  reader_zoom_percent: number;
  format_counts: LocalCountEntry[];
  metadata_source_counts: LocalCountEntry[];
  author_counts: LocalCountEntry[];
  reading_format_counts: LocalCountEntry[];
  last_catalog_updated_at?: string | null;
  last_reading_updated_at?: string | null;
  review_notes: string[];
}

export interface LibraryOpenResponse {
  path: string;
  title: string;
  format: string;
  content: string;
  word_count: number;
  modified_at?: string | null;
  extra_json?: Record<string, unknown> | null;
}

export interface LibraryCbzPagePreviewResponse {
  index: number;
  path: string;
  preview_path: string;
  size_bytes: number;
}

export interface LibraryEpubTextPreviewResponse {
  index: number;
  idref: string;
  href: string;
  path: string;
  text: string;
  size_bytes: number;
}

export interface MusicTrack {
  path: string;
  title: string;
  artist?: string | null;
  album?: string | null;
  cover_path?: string | null;
  metadata_source?: string | null;
  format: string;
  size_bytes: number;
  modified_at?: string | null;
}

export interface MusicScanResponse {
  folder_path: string;
  track_count: number;
  tracks: MusicTrack[];
  artists: string[];
  albums: string[];
}

export interface MusicCatalog {
  schema_version: 1;
  folders: string[];
  track_count: number;
  tracks: MusicTrack[];
  artists: string[];
  albums: string[];
  updated_at: string;
}

export interface MusicCatalogExportResponse {
  schema_version: 1;
  output_path: string;
  exported_track_count: number;
  exported_folder_count: number;
}

export interface MusicCatalogImportResponse {
  schema_version: 1;
  imported_track_count: number;
  imported_folder_count: number;
  skipped_track_count: number;
  catalog: MusicCatalog;
}

export interface MusicFormatCatalogItem {
  format: string;
  extensions: string[];
  scan_supported: boolean;
  metadata_supported: boolean;
  embedded_metadata_supported: boolean;
  sidecar_metadata_supported: boolean;
  cover_supported: boolean;
  embedded_cover_supported: boolean;
  queue_supported: boolean;
  lyrics_supported: boolean;
  playlist_supported: boolean;
  playback_stats_supported: boolean;
  export_supported: boolean;
  limitations: string[];
}

export interface MusicFormatCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  format_count: number;
  formats: MusicFormatCatalogItem[];
  includes_audio_file_bodies: boolean;
  verifies_playback_quality: boolean;
  verifies_external_service_connectors: boolean;
  verifies_manual_player_matrix: boolean;
  review_notes: string[];
}

export interface MusicLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  folder_count: number;
  track_count: number;
  local_track_count: number;
  missing_track_count: number;
  supported_format_count: number;
  artist_count: number;
  album_count: number;
  total_size_bytes: number;
  cover_count: number;
  queue_track_count: number;
  queue_active_track_present: boolean;
  queue_volume_percent: number;
  playlist_count: number;
  playlist_track_count: number;
  sleep_timer_enabled: boolean;
  sleep_timer_duration_minutes: number;
  equalizer_enabled: boolean;
  equalizer_preset: string;
  discord_presence_enabled: boolean;
  discord_presence_status: string;
  playback_event_count: number;
  played_seconds: number;
  top_track_count: number;
  recent_play_count: number;
  external_service_count: number;
  blocked_service_count: number;
  planned_service_count: number;
  format_counts: LocalCountEntry[];
  artist_counts: LocalCountEntry[];
  album_counts: LocalCountEntry[];
  metadata_source_counts: LocalCountEntry[];
  queue_format_counts: LocalCountEntry[];
  playlist_track_counts: LocalCountEntry[];
  service_status_counts: LocalCountEntry[];
  last_catalog_updated_at?: string | null;
  last_queue_updated_at?: string | null;
  last_playlist_updated_at?: string | null;
  last_played_at?: string | null;
  review_notes: string[];
}

export interface MusicPlaylist {
  schema_version: 1;
  id: string;
  name: string;
  tracks: MusicTrack[];
  created_at: string;
  updated_at: string;
}

export interface MusicPlaylistsExportResponse {
  schema_version: 1;
  output_path: string;
  exported_count: number;
}

export interface MusicPlaylistsImportResponse {
  schema_version: 1;
  imported_count: number;
  skipped_count: number;
  playlists: MusicPlaylist[];
}

export interface MusicQueueState {
  schema_version: 1;
  tracks: MusicTrack[];
  active_path?: string | null;
  volume_percent: number;
  updated_at: string;
}

export interface MusicQueueExportResponse {
  schema_version: 1;
  output_path: string;
  exported_track_count: number;
}

export interface MusicQueueImportResponse {
  schema_version: 1;
  imported_track_count: number;
  skipped_track_count: number;
  queue: MusicQueueState;
}

export interface MusicLyricsResponse {
  track_path: string;
  lyrics_path?: string | null;
  format?: string | null;
  content?: string | null;
  line_count: number;
}

export interface MusicLyricsSaveResponse {
  lyrics_path: string;
  format: string;
  line_count: number;
}

export interface MusicLyricsExportResponse {
  schema_version: 1;
  output_path: string;
  exported_line_count: number;
}

export interface MusicLyricsImportResponse {
  schema_version: 1;
  track_path: string;
  lyrics_path: string;
  format: string;
  imported_line_count: number;
}

export interface MusicSleepTimerState {
  schema_version: 1;
  enabled: boolean;
  duration_minutes: number;
  started_at?: string | null;
  ends_at?: string | null;
  updated_at: string;
}

export interface MusicEqualizerState {
  schema_version: 1;
  enabled: boolean;
  preset: "flat" | "warm" | "bright" | "voice" | "bass" | "custom";
  bass_gain_db: number;
  mid_gain_db: number;
  treble_gain_db: number;
  updated_at: string;
}

export interface MusicDiscordPresenceState {
  schema_version: 1;
  enabled: boolean;
  include_title: boolean;
  include_artist: boolean;
  include_album: boolean;
  include_elapsed: boolean;
  privacy_mode: "reduced" | "detailed" | "private";
  integration_status: "disabled" | "settings_saved_ipc_pending";
  updated_at: string;
}

export interface MusicSettingsExportResponse {
  schema_version: 1;
  output_path: string;
  exported_setting_count: number;
}

export interface MusicSettingsImportResponse {
  schema_version: 1;
  imported_setting_count: number;
  skipped_setting_count: number;
  sleep_timer: MusicSleepTimerState;
  equalizer: MusicEqualizerState;
  discord_presence: MusicDiscordPresenceState;
}

export interface MusicPlaybackEvent {
  schema_version: 1;
  id: string;
  track: MusicTrack;
  played_seconds: number;
  played_at: string;
}

export interface MusicTopTrack {
  track: MusicTrack;
  play_count: number;
  played_seconds: number;
  last_played_at: string;
}

export interface MusicPlaybackStatsResponse {
  play_count: number;
  played_seconds: number;
  top_tracks: MusicTopTrack[];
  recent: MusicPlaybackEvent[];
}

export interface MusicPlaybackHistoryExportResponse {
  schema_version: 1;
  output_path: string;
  exported_event_count: number;
}

export interface MusicPlaybackHistoryImportResponse {
  schema_version: 1;
  imported_event_count: number;
  skipped_event_count: number;
  stats: MusicPlaybackStatsResponse;
}

export interface MusicServiceMatrixEntry {
  id: string;
  name: string;
  status: "local_only" | "blocked" | "planned";
  mode: string;
  note: string;
}

export interface MusicServiceMatrixResponse {
  schema_version: 1;
  services: MusicServiceMatrixEntry[];
}

export interface ClipProgressEvent {
  schema_version: 1;
  job_id: string;
  status: "active" | "completed" | "failed" | "canceled";
  elapsed_seconds: number;
  output_path?: string | null;
  message: string;
  updated_at: string;
}

export async function probeMetadataUrl(sourceUrl: string, options?: MetadataProbeOptions): Promise<MetadataPreview | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MetadataPreview>("metadata_probe_url", {
    request: {
      source_url: sourceUrl,
      user_agent: options?.userAgent,
      referer: options?.referer,
      proxy: options?.proxy,
      cookie_bucket_id: options?.cookieBucketId,
      auth_payload_ref: options?.authPayloadRef,
      rate_limit: options?.rateLimit
    }
  });
}

export async function probeMetadataPlaylist(
  sourceUrl: string,
  limit = 50,
  options?: MetadataProbeOptions
): Promise<MetadataPlaylistPreview | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MetadataPlaylistPreview>("metadata_probe_playlist", {
    request: {
      source_url: sourceUrl,
      limit,
      user_agent: options?.userAgent,
      referer: options?.referer,
      proxy: options?.proxy,
      cookie_bucket_id: options?.cookieBucketId,
      auth_payload_ref: options?.authPayloadRef,
      rate_limit: options?.rateLimit
    }
  });
}

export async function probeGalleryUrl(sourceUrl: string, limit = 80, options?: GalleryProbeOptions): Promise<GalleryPreview | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<GalleryPreview>("gallery_probe_url", {
    request: {
      source_url: sourceUrl,
      limit,
      user_agent: options?.userAgent,
      referer: options?.referer,
      proxy: options?.proxy,
      cookie_bucket_id: options?.cookieBucketId,
      auth_payload_ref: options?.authPayloadRef,
      rate_limit: options?.rateLimit
    }
  });
}

export async function listMetadataSubtitles(sourceUrl: string, options?: MetadataProbeOptions): Promise<MetadataSubtitlesResponse> {
  if (!isTauriRuntime()) {
    return { subtitles: [] };
  }

  return invoke<MetadataSubtitlesResponse>("metadata_list_subtitles", {
    request: {
      url: sourceUrl,
      user_agent: options?.userAgent,
      referer: options?.referer,
      proxy: options?.proxy,
      cookie_bucket_id: options?.cookieBucketId,
      auth_payload_ref: options?.authPayloadRef,
      rate_limit: options?.rateLimit
    }
  });
}

export async function listMetadataThumbnails(sourceUrl: string, options?: MetadataProbeOptions): Promise<MetadataThumbnailsResponse> {
  if (!isTauriRuntime()) {
    return { thumbnails: [] };
  }

  return invoke<MetadataThumbnailsResponse>("metadata_list_thumbnails", {
    request: {
      url: sourceUrl,
      user_agent: options?.userAgent,
      referer: options?.referer,
      proxy: options?.proxy,
      cookie_bucket_id: options?.cookieBucketId,
      auth_payload_ref: options?.authPayloadRef,
      rate_limit: options?.rateLimit
    }
  });
}

export async function listMetadataChapters(sourceUrl: string, options?: MetadataProbeOptions): Promise<MetadataChaptersResponse> {
  if (!isTauriRuntime()) {
    return { chapters: [] };
  }

  return invoke<MetadataChaptersResponse>("metadata_list_chapters", {
    request: {
      url: sourceUrl,
      user_agent: options?.userAgent,
      referer: options?.referer,
      proxy: options?.proxy,
      cookie_bucket_id: options?.cookieBucketId,
      auth_payload_ref: options?.authPayloadRef,
      rate_limit: options?.rateLimit
    }
  });
}

export async function listMetadataComments(sourceUrl: string, options?: MetadataProbeOptions): Promise<MetadataCommentsResponse> {
  if (!isTauriRuntime()) {
    return { comments: [] };
  }

  return invoke<MetadataCommentsResponse>("metadata_list_comments", {
    request: {
      url: sourceUrl,
      user_agent: options?.userAgent,
      referer: options?.referer,
      proxy: options?.proxy,
      cookie_bucket_id: options?.cookieBucketId,
      auth_payload_ref: options?.authPayloadRef,
      rate_limit: options?.rateLimit
    }
  });
}

export async function saveMetadataSubtitle(
  request: SaveMetadataSubtitleRequest
): Promise<SaveMetadataSubtitleResponse> {
  if (!isTauriRuntime()) {
    return { output_path: "" };
  }

  return invoke<SaveMetadataSubtitleResponse>("metadata_save_subtitle", {
    request: {
      url: request.url,
      language: request.language,
      format: request.format,
      is_auto: request.isAuto,
      output_dir: request.outputDir,
      output_path: request.outputPath,
      user_agent: request.options?.userAgent,
      referer: request.options?.referer,
      proxy: request.options?.proxy,
      cookie_bucket_id: request.options?.cookieBucketId,
      auth_payload_ref: request.options?.authPayloadRef,
      rate_limit: request.options?.rateLimit
    }
  });
}

export async function saveMetadataThumbnail(
  request: SaveMetadataThumbnailRequest
): Promise<SaveMetadataThumbnailResponse> {
  if (!isTauriRuntime()) {
    return { output_path: "" };
  }

  return invoke<SaveMetadataThumbnailResponse>("metadata_save_thumbnail", {
    request: {
      url: request.url,
      output_dir: request.outputDir,
      output_path: request.outputPath,
      file_name: request.fileName,
      user_agent: request.options?.userAgent,
      referer: request.options?.referer,
      proxy: request.options?.proxy,
      cookie_bucket_id: request.options?.cookieBucketId,
      auth_payload_ref: request.options?.authPayloadRef,
      rate_limit: request.options?.rateLimit
    }
  });
}

export async function saveMetadataChapters(
  request: SaveMetadataChaptersRequest
): Promise<SaveMetadataChaptersResponse> {
  if (!isTauriRuntime()) {
    return { output_path: "", chapter_count: 0 };
  }

  return invoke<SaveMetadataChaptersResponse>("metadata_save_chapters", {
    request: {
      url: request.url,
      output_dir: request.outputDir,
      output_path: request.outputPath,
      file_name: request.fileName,
      user_agent: request.options?.userAgent,
      referer: request.options?.referer,
      proxy: request.options?.proxy,
      cookie_bucket_id: request.options?.cookieBucketId,
      auth_payload_ref: request.options?.authPayloadRef,
      rate_limit: request.options?.rateLimit
    }
  });
}

export async function saveMetadataInfoJson(
  request: SaveMetadataInfoJsonRequest
): Promise<SaveMetadataInfoJsonResponse> {
  if (!isTauriRuntime()) {
    return { output_path: "" };
  }

  return invoke<SaveMetadataInfoJsonResponse>("metadata_save_info_json", {
    request: {
      url: request.url,
      output_dir: request.outputDir,
      output_path: request.outputPath,
      user_agent: request.options?.userAgent,
      referer: request.options?.referer,
      proxy: request.options?.proxy,
      cookie_bucket_id: request.options?.cookieBucketId,
      auth_payload_ref: request.options?.authPayloadRef,
      rate_limit: request.options?.rateLimit
    }
  });
}

export async function saveMetadataComments(
  request: SaveMetadataCommentsRequest
): Promise<SaveMetadataCommentsResponse> {
  if (!isTauriRuntime()) {
    return { output_path: "" };
  }

  return invoke<SaveMetadataCommentsResponse>("metadata_save_comments", {
    request: {
      url: request.url,
      output_dir: request.outputDir,
      output_path: request.outputPath,
      user_agent: request.options?.userAgent,
      referer: request.options?.referer,
      proxy: request.options?.proxy,
      cookie_bucket_id: request.options?.cookieBucketId,
      auth_payload_ref: request.options?.authPayloadRef,
      rate_limit: request.options?.rateLimit
    }
  });
}

export async function saveMetadataLiveChat(
  request: SaveMetadataLiveChatRequest
): Promise<SaveMetadataLiveChatResponse> {
  if (!isTauriRuntime()) {
    return { output_path: "" };
  }

  return invoke<SaveMetadataLiveChatResponse>("metadata_save_live_chat", {
    request: {
      url: request.url,
      output_dir: request.outputDir,
      output_path: request.outputPath,
      user_agent: request.options?.userAgent,
      referer: request.options?.referer,
      proxy: request.options?.proxy,
      cookie_bucket_id: request.options?.cookieBucketId,
      auth_payload_ref: request.options?.authPayloadRef,
      rate_limit: request.options?.rateLimit
    }
  });
}

export async function mergeMetadataSubtitles(
  request: MergeMetadataSubtitlesRequest
): Promise<MergeMetadataSubtitlesResponse> {
  if (!isTauriRuntime()) {
    return { output_path: "", merged_count: 0 };
  }

  return invoke<MergeMetadataSubtitlesResponse>("metadata_merge_subtitles", {
    request: {
      input_paths: request.inputPaths,
      output_path: request.outputPath
    }
  });
}

export async function openSubtitleWorkshopFile(inputPath: string): Promise<SubtitleWorkshopOpenResponse> {
  if (!isTauriRuntime()) {
    return { path: "", format: "srt", content: "", line_count: 0 };
  }

  return invoke<SubtitleWorkshopOpenResponse>("subtitle_workshop_open", {
    request: { input_path: inputPath }
  });
}

export async function saveSubtitleWorkshopFile(
  request: SaveSubtitleWorkshopFileRequest
): Promise<SubtitleWorkshopSaveResponse> {
  if (!isTauriRuntime()) {
    return { output_path: "", format: "srt", line_count: 0 };
  }

  return invoke<SubtitleWorkshopSaveResponse>("subtitle_workshop_save", {
    request: {
      output_path: request.outputPath,
      content: request.content
    }
  });
}

export async function clipVideo(request: ClipVideoRequest): Promise<ClipVideoResponse> {
  if (!isTauriRuntime()) {
    return { job_id: request.jobId ?? "", output_path: "" };
  }

  return invoke<ClipVideoResponse>("media_clip_video", {
    request: {
      job_id: request.jobId,
      input_path: request.inputPath,
      output_path: request.outputPath,
      mode: request.mode,
      video_codec: request.videoCodec,
      audio_codec: request.audioCodec,
      crf: request.crf,
      preset: request.preset,
      start_seconds: request.startSeconds,
      end_seconds: request.endSeconds
    }
  });
}

export async function transcodeMedia(request: TranscodeMediaRequest): Promise<ClipVideoResponse> {
  if (!isTauriRuntime()) {
    return { job_id: request.jobId ?? "", output_path: "" };
  }

  return invoke<ClipVideoResponse>("media_transcode", {
    request: {
      job_id: request.jobId,
      input_path: request.inputPath,
      output_path: request.outputPath,
      preset: request.preset,
      video_codec: request.videoCodec,
      audio_codec: request.audioCodec,
      crf: request.crf,
      speed_preset: request.speedPreset,
      audio_bitrate: request.audioBitrate,
      metadata_title: request.metadataTitle,
      metadata_artist: request.metadataArtist,
      cover_path: request.coverPath
    }
  });
}

export async function generateWhisperSubtitles(request: WhisperSubtitlesRequest): Promise<WhisperSubtitlesResponse> {
  if (!isTauriRuntime()) {
    return { job_id: request.jobId ?? "", output_path: "", format: request.outputFormat ?? "srt" };
  }

  return invoke<WhisperSubtitlesResponse>("media_generate_whisper_subtitles", {
    request: {
      job_id: request.jobId,
      input_path: request.inputPath,
      output_dir: request.outputDir,
      output_path: request.outputPath,
      language: request.language,
      model: request.model,
      task: request.task,
      output_format: request.outputFormat
    }
  });
}

export async function detectShots(request: DetectShotsRequest): Promise<DetectShotsResponse> {
  if (!isTauriRuntime()) {
    return { markers: [] };
  }

  return invoke<DetectShotsResponse>("media_detect_shots", {
    request: {
      input_path: request.inputPath,
      threshold: request.threshold
    }
  });
}

export async function saveShotMarkers(request: SaveShotMarkersRequest): Promise<SaveShotMarkersResponse> {
  if (!isTauriRuntime()) {
    return { output_path: "", marker_count: 0 };
  }

  return invoke<SaveShotMarkersResponse>("media_save_shot_markers", {
    request: {
      output_path: request.outputPath,
      markers: request.markers
    }
  });
}

export async function generateWaveformPeaks(
  request: GenerateWaveformPeaksRequest
): Promise<WaveformPeaksResponse> {
  if (!isTauriRuntime()) {
    return {
      cache_path: "",
      sample_rate: 0,
      channel_count: 0,
      bucket_count: 0,
      duration_seconds: 0,
      peaks: []
    };
  }

  return invoke<WaveformPeaksResponse>("media_generate_waveform_peaks", {
    request: {
      input_path: request.inputPath,
      bucket_count: request.bucketCount
    }
  });
}

export async function parseTorrentFile(path: string): Promise<TorrentMetadataResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<TorrentMetadataResponse>("torrent_parse_file", {
    request: { path }
  });
}

export async function parseMagnetUri(uri: string): Promise<MagnetMetadataResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MagnetMetadataResponse>("torrent_parse_magnet", {
    request: { uri }
  });
}

export async function queueTorrentFile(
  path: string,
  outputDir?: string,
  selectedPaths: string[] = [],
  options?: DownloadTaskCreateOptions
): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("torrent_queue_file", {
    request: { path, output_dir: outputDir || null, selected_paths: selectedPaths, create_options: toCreateDownloadOptions(options) }
  });
}

export async function queueMagnetUri(
  uri: string,
  outputDir?: string,
  options?: DownloadTaskCreateOptions
): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("torrent_queue_magnet", {
    request: { uri, output_dir: outputDir || null, create_options: toCreateDownloadOptions(options) }
  });
}

export async function listP2pOffers(): Promise<P2pOffer[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ offers: P2pOffer[] }>("p2p_list_offers");
  return response.offers;
}

export async function onP2pOffersChanged(
  handler: (event: P2pOffersChangedEvent) => void
): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<P2pOffersChangedEvent>("p2p:offers_changed", (event) => handler(event.payload));
}

export async function createP2pOffer(filePath: string): Promise<P2pOffer | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<P2pOffer>("p2p_create_offer", {
    request: { file_path: filePath }
  });
}

export async function getP2pOffer(shortCode: string): Promise<P2pOffer | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<P2pOffer>("p2p_get_offer", {
    request: { short_code: shortCode }
  });
}

export async function startP2pSend(shortCode: string): Promise<P2pOffer | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<P2pOffer>("p2p_start_send", {
    request: { short_code: shortCode }
  });
}

export async function probeP2pShare(shareCode: string): Promise<P2pNetworkProbeResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<P2pNetworkProbeResponse>("p2p_probe_share", {
    request: { share_code: shareCode }
  });
}

export async function prepareP2pReceive(shortCode: string, outputDir: string): Promise<P2pOffer | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<P2pOffer>("p2p_prepare_receive", {
    request: { short_code: shortCode, output_dir: outputDir }
  });
}

export async function queueP2pReceive(
  shortCode: string,
  options?: DownloadTaskCreateOptions
): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("p2p_queue_receive", {
    request: { short_code: shortCode, create_options: toCreateDownloadOptions(options) }
  });
}

export async function cancelP2pOffer(shortCode: string): Promise<P2pOffer | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<P2pOffer>("p2p_cancel_offer", {
    request: { short_code: shortCode }
  });
}

export async function pauseP2pOffer(shortCode: string): Promise<P2pOffer | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<P2pOffer>("p2p_pause_offer", {
    request: { short_code: shortCode }
  });
}

export async function resumeP2pOffer(shortCode: string): Promise<P2pOffer | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<P2pOffer>("p2p_resume_offer", {
    request: { short_code: shortCode }
  });
}

export async function runP2pOfferBulkAction(
  action: P2pOfferBulkAction,
  shortCodes: string[]
): Promise<P2pOfferBulkActionResult | null> {
  if (!isTauriRuntime()) {
    return { offers: [], deleted: [], failed: [] };
  }

  return invoke<P2pOfferBulkActionResult>("p2p_bulk_action", {
    request: { action, short_codes: shortCodes }
  });
}

export async function deleteP2pOffer(shortCode: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("p2p_delete_offer", {
    request: { short_code: shortCode }
  });
  return response.deleted;
}

export async function clearP2pOffers(): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("p2p_clear_offers");
  return response.cleared;
}

export async function exportP2pOffers(input: {
  outputPath?: string;
  shortCodes?: string[];
} = {}): Promise<P2pOffersExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<P2pOffersExportResponse>("p2p_export_offers", {
    request: {
      output_path: input.outputPath || null,
      short_codes: input.shortCodes?.length ? input.shortCodes : null
    }
  });
}

export async function importP2pOffers(inputPath: string): Promise<P2pOffersImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<P2pOffersImportResponse>("p2p_import_offers", {
    request: { input_path: inputPath }
  });
}

export async function getCookieAuthLocalSummary(): Promise<CookieAuthLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CookieAuthLocalSummaryResponse>("cookies_get_local_summary");
}

export async function exportCookieAuthLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("cookies_export_local_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}
export async function getCookieAuthCapabilityCatalog(): Promise<CookieAuthCapabilityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CookieAuthCapabilityCatalogResponse>("cookies_get_capability_catalog");
}

export async function exportCookieAuthCapabilityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("cookies_export_capability_catalog", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getP2pLocalSummary(): Promise<P2pLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<P2pLocalSummaryResponse>("p2p_get_local_summary");
}

export async function exportP2pLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("p2p_export_local_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getP2pCapabilityCatalog(): Promise<P2pCapabilityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<P2pCapabilityCatalogResponse>("p2p_get_capability_catalog");
}

export async function exportP2pCapabilityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("p2p_export_capability_catalog", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function scanLibraryFolder(folderPath: string): Promise<LibraryScanResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryScanResponse>("library_scan_folder", {
    request: { folder_path: folderPath }
  });
}

export async function listLibraryCatalog(): Promise<LibraryCatalog | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryCatalog>("library_list_catalog");
}

export async function importLibraryFolder(folderPath: string): Promise<LibraryCatalog | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryCatalog>("library_import_folder", {
    request: { folder_path: folderPath }
  });
}

export async function rescanLibraryCatalog(): Promise<LibraryCatalog | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryCatalog>("library_rescan_catalog");
}

export async function pruneMissingLibraryItems(): Promise<LibraryCatalog | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryCatalog>("library_prune_missing");
}

export async function deleteLibraryCatalogItem(path: string): Promise<LibraryCatalog | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryCatalog>("library_delete_catalog_item", {
    request: { path }
  });
}

export async function deleteLibraryCatalogItems(paths: string[]): Promise<{
  catalog: LibraryCatalog;
  deleted: string[];
  failed: { id: string; error: string }[];
} | null> {
  if (!isTauriRuntime()) {
    return { catalog: { schema_version: 1, folders: [], item_count: 0, items: [], updated_at: "" }, deleted: [], failed: [] };
  }

  return invoke("library_delete_catalog_items", {
    request: { paths }
  });
}

export async function clearLibraryCatalog(): Promise<{ cleared: number; catalog: LibraryCatalog } | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<{ cleared: number; catalog: LibraryCatalog }>("library_clear_catalog");
}

export async function exportLibraryCatalog(outputPath?: string | null): Promise<LibraryCatalogExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryCatalogExportResponse>("library_export_catalog", {
    request: { output_path: outputPath || null }
  });
}

export async function importLibraryCatalog(inputPath: string): Promise<LibraryCatalogImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryCatalogImportResponse>("library_import_catalog", {
    request: { input_path: inputPath }
  });
}

export async function getLibraryFormatCatalog(): Promise<LibraryFormatCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryFormatCatalogResponse>("library_get_format_catalog");
}

export async function exportLibraryFormatCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("library_export_format_catalog", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function openLibraryItem(path: string): Promise<LibraryOpenResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryOpenResponse>("library_open_item", {
    request: { path }
  });
}

export async function extractLibraryCbzPagePreview(
  path: string,
  pageIndex: number
): Promise<LibraryCbzPagePreviewResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryCbzPagePreviewResponse>("library_extract_cbz_page_preview", {
    request: { path, page_index: pageIndex }
  });
}

export async function extractLibraryEpubTextPreview(
  path: string,
  spineIndex: number
): Promise<LibraryEpubTextPreviewResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryEpubTextPreviewResponse>("library_extract_epub_text_preview", {
    request: { path, spine_index: spineIndex }
  });
}

export async function openLibraryExternal(path: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  await invoke("library_open_external", {
    request: { path }
  });
  return true;
}

export async function revealLibraryItemPath(path: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  await invoke("library_reveal_item", {
    request: { path }
  });
  return true;
}

export async function getLibraryReadingState(path: string): Promise<LibraryReadingState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryReadingState>("library_get_reading_state", {
    request: { path }
  });
}

export async function saveLibraryProgress(path: string, progressPercent: number): Promise<LibraryReadingState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryReadingState>("library_save_progress", {
    request: { path, progress_percent: progressPercent }
  });
}

export async function addLibraryBookmark(path: string, positionPercent: number, label?: string): Promise<LibraryReadingState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryReadingState>("library_add_bookmark", {
    request: { path, position_percent: positionPercent, label: label || null }
  });
}

export async function addLibraryHighlight(
  path: string,
  text: string,
  positionPercent: number,
  note?: string
): Promise<LibraryReadingState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryReadingState>("library_add_highlight", {
    request: { path, text, position_percent: positionPercent, note: note || null }
  });
}

export async function updateLibraryBookmark(
  path: string,
  id: string,
  patch: { label?: string; positionPercent?: number }
): Promise<LibraryReadingState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryReadingState>("library_update_bookmark", {
    request: {
      path,
      id,
      label: patch.label,
      position_percent: patch.positionPercent
    }
  });
}

export async function updateLibraryHighlight(
  path: string,
  id: string,
  patch: { text?: string; note?: string | null; positionPercent?: number }
): Promise<LibraryReadingState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryReadingState>("library_update_highlight", {
    request: {
      path,
      id,
      text: patch.text,
      note: patch.note === undefined ? undefined : patch.note,
      position_percent: patch.positionPercent
    }
  });
}

export async function deleteLibraryBookmark(path: string, id: string): Promise<LibraryReadingState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryReadingState>("library_delete_bookmark", {
    request: { path, id }
  });
}

export async function deleteLibraryHighlight(path: string, id: string): Promise<LibraryReadingState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryReadingState>("library_delete_highlight", {
    request: { path, id }
  });
}

export async function deleteLibraryAnnotations(
  path: string,
  bookmarkIds: string[],
  highlightIds: string[]
): Promise<LibraryAnnotationsDeleteResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryAnnotationsDeleteResponse>("library_delete_annotations", {
    request: {
      path,
      bookmark_ids: bookmarkIds,
      highlight_ids: highlightIds
    }
  });
}

export async function clearLibraryAnnotations(
  path: string,
  scope: "all" | "bookmarks" | "highlights" = "all"
): Promise<LibraryReadingState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryReadingState>("library_clear_annotations", {
    request: { path, scope }
  });
}

export async function exportLibraryReadingState(
  path: string,
  outputPath: string,
  format: "json" | "markdown"
): Promise<LibraryExportReadingStateResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryExportReadingStateResponse>("library_export_reading_state", {
    request: {
      path,
      output_path: outputPath,
      format
    }
  });
}

export async function importLibraryReadingState(
  path: string,
  inputPath: string
): Promise<LibraryImportReadingStateResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryImportReadingStateResponse>("library_import_reading_state", {
    request: {
      path,
      input_path: inputPath
    }
  });
}

export async function exportLibraryReadingStates(outputPath?: string | null): Promise<LibraryReadingStatesExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryReadingStatesExportResponse>("library_export_reading_states", {
    request: { output_path: outputPath || null }
  });
}

export async function importLibraryReadingStates(inputPath: string): Promise<LibraryReadingStatesImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryReadingStatesImportResponse>("library_import_reading_states", {
    request: { input_path: inputPath }
  });
}

export async function getLibraryLocalSummary(): Promise<LibraryLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryLocalSummaryResponse>("library_get_local_summary");
}

export async function exportLibraryLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("library_export_local_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getLibraryReaderSettings(): Promise<LibraryReaderSettings | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryReaderSettings>("library_get_reader_settings");
}

export async function updateLibraryReaderSettings(patch: {
  focusMode?: boolean;
  theme?: LibraryReaderSettings["theme"];
  fontFamily?: LibraryReaderSettings["font_family"];
  fontSizePercent?: number;
  lineHeightPercent?: number;
  zoomPercent?: number;
}): Promise<LibraryReaderSettings | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryReaderSettings>("library_update_reader_settings", {
    request: {
      focus_mode: patch.focusMode,
      theme: patch.theme,
      font_family: patch.fontFamily,
      font_size_percent: patch.fontSizePercent,
      line_height_percent: patch.lineHeightPercent,
      zoom_percent: patch.zoomPercent
    }
  });
}

export async function exportLibraryReaderSettings(outputPath?: string | null): Promise<LibraryReaderSettingsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryReaderSettingsExportResponse>("library_export_reader_settings", {
    request: { output_path: outputPath || null }
  });
}

export async function importLibraryReaderSettings(inputPath: string): Promise<LibraryReaderSettingsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LibraryReaderSettingsImportResponse>("library_import_reader_settings", {
    request: { input_path: inputPath }
  });
}

export async function scanMusicFolder(folderPath: string): Promise<MusicScanResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicScanResponse>("music_scan_folder", {
    request: { folder_path: folderPath }
  });
}

export async function listMusicCatalog(): Promise<MusicCatalog | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicCatalog>("music_list_catalog");
}

export async function importMusicFolder(folderPath: string): Promise<MusicCatalog | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicCatalog>("music_import_folder", {
    request: { folder_path: folderPath }
  });
}

export async function rescanMusicCatalog(): Promise<MusicCatalog | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicCatalog>("music_rescan_catalog");
}

export async function pruneMissingMusicTracks(): Promise<MusicCatalog | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicCatalog>("music_prune_missing");
}

export async function deleteMusicCatalogTrack(path: string): Promise<MusicCatalog | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicCatalog>("music_delete_catalog_track", {
    request: { path }
  });
}

export async function deleteMusicCatalogTracks(paths: string[]): Promise<{
  catalog: MusicCatalog;
  deleted: string[];
  failed: { id: string; error: string }[];
} | null> {
  if (!isTauriRuntime()) {
    return { catalog: { schema_version: 1, folders: [], track_count: 0, tracks: [], artists: [], albums: [], updated_at: "" }, deleted: [], failed: [] };
  }

  return invoke("music_delete_catalog_tracks", {
    request: { paths }
  });
}

export async function clearMusicCatalog(): Promise<{ cleared: number; catalog: MusicCatalog } | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<{ cleared: number; catalog: MusicCatalog }>("music_clear_catalog");
}

export async function exportMusicCatalog(outputPath?: string | null): Promise<MusicCatalogExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicCatalogExportResponse>("music_export_catalog", {
    request: { output_path: outputPath || null }
  });
}

export async function importMusicCatalog(inputPath: string): Promise<MusicCatalogImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicCatalogImportResponse>("music_import_catalog", {
    request: { input_path: inputPath }
  });
}

export async function getMusicFormatCatalog(): Promise<MusicFormatCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicFormatCatalogResponse>("music_get_format_catalog");
}

export async function exportMusicFormatCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("music_export_format_catalog", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getMusicLocalSummary(): Promise<MusicLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicLocalSummaryResponse>("music_get_local_summary");
}

export async function exportMusicLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("music_export_local_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getMusicQueue(): Promise<MusicQueueState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicQueueState>("music_get_queue");
}

export async function saveMusicQueue(
  tracks: MusicTrack[],
  activePath?: string,
  volumePercent?: number
): Promise<MusicQueueState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicQueueState>("music_save_queue", {
    request: { tracks, active_path: activePath || null, volume_percent: volumePercent }
  });
}

export async function exportMusicQueue(outputPath?: string | null): Promise<MusicQueueExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicQueueExportResponse>("music_export_queue", {
    request: { output_path: outputPath || null }
  });
}

export async function importMusicQueue(inputPath: string): Promise<MusicQueueImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicQueueImportResponse>("music_import_queue", {
    request: { input_path: inputPath }
  });
}

export async function getMusicLyrics(trackPath: string): Promise<MusicLyricsResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicLyricsResponse>("music_get_lyrics", {
    request: { track_path: trackPath }
  });
}

export async function saveMusicLyrics(
  trackPath: string,
  content: string,
  options: { outputPath?: string | null; format?: "lrc" | "txt" | "srt" | "vtt" | null } = {}
): Promise<MusicLyricsSaveResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicLyricsSaveResponse>("music_save_lyrics", {
    request: {
      track_path: trackPath,
      content,
      output_path: options.outputPath || null,
      format: options.format || null
    }
  });
}

export async function exportMusicLyrics(
  trackPath: string,
  outputPath?: string | null
): Promise<MusicLyricsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicLyricsExportResponse>("music_export_lyrics", {
    request: { track_path: trackPath, output_path: outputPath || null }
  });
}

export async function importMusicLyrics(input: {
  inputPath: string;
  trackPath?: string | null;
  outputPath?: string | null;
}): Promise<MusicLyricsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicLyricsImportResponse>("music_import_lyrics", {
    request: {
      input_path: input.inputPath,
      track_path: input.trackPath || null,
      output_path: input.outputPath || null
    }
  });
}

export async function getMusicServiceMatrix(): Promise<MusicServiceMatrixEntry[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<MusicServiceMatrixResponse>("music_get_service_matrix");
  return response.services;
}

export async function exportMusicServiceMatrix(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("music_export_service_matrix", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function listMusicPlaylists(): Promise<MusicPlaylist[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ playlists: MusicPlaylist[] }>("music_list_playlists");
  return response.playlists;
}

export async function saveMusicPlaylist(
  name: string,
  tracks: MusicTrack[],
  id?: string
): Promise<MusicPlaylist | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicPlaylist>("music_save_playlist", {
    request: { id: id || null, name, tracks }
  });
}

export async function exportMusicPlaylist(input: {
  id?: string | null;
  name?: string | null;
  tracks?: MusicTrack[];
  outputPath?: string | null;
}): Promise<{ output_path: string; track_count: number } | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke("music_export_playlist", {
    request: {
      id: input.id || null,
      name: input.name || null,
      tracks: input.tracks ?? [],
      output_path: input.outputPath || null
    }
  });
}

export async function importMusicPlaylist(inputPath: string, name?: string, id?: string): Promise<{
  playlist: MusicPlaylist;
  imported_count: number;
  skipped_count: number;
} | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke("music_import_playlist", {
    request: { input_path: inputPath, name: name || null, id: id || null }
  });
}

export async function exportMusicPlaylists(input: {
  outputPath?: string;
  ids?: string[];
} = {}): Promise<MusicPlaylistsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicPlaylistsExportResponse>("music_export_playlists", {
    request: {
      output_path: input.outputPath || null,
      ids: input.ids?.length ? input.ids : null
    }
  });
}

export async function importMusicPlaylists(inputPath: string): Promise<MusicPlaylistsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicPlaylistsImportResponse>("music_import_playlists", {
    request: { input_path: inputPath }
  });
}

export async function deleteMusicPlaylist(id: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("music_delete_playlist", {
    request: { id }
  });
  return response.deleted;
}

export async function deleteMusicPlaylists(ids: string[]): Promise<{
  deleted: string[];
  failed: { id: string; error: string }[];
}> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [] };
  }

  return invoke("music_delete_playlists", {
    request: { ids }
  });
}

export async function clearMusicPlaylists(): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("music_clear_playlists");
  return response.cleared;
}

export async function getMusicSleepTimer(): Promise<MusicSleepTimerState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicSleepTimerState>("music_get_sleep_timer");
}

export async function updateMusicSleepTimer(
  enabled: boolean,
  durationMinutes?: number
): Promise<MusicSleepTimerState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicSleepTimerState>("music_update_sleep_timer", {
    request: { enabled, duration_minutes: durationMinutes }
  });
}

export async function getMusicEqualizer(): Promise<MusicEqualizerState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicEqualizerState>("music_get_equalizer");
}

export async function updateMusicEqualizer(patch: {
  enabled?: boolean;
  preset?: MusicEqualizerState["preset"];
  bassGainDb?: number;
  midGainDb?: number;
  trebleGainDb?: number;
}): Promise<MusicEqualizerState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicEqualizerState>("music_update_equalizer", {
    request: {
      enabled: patch.enabled,
      preset: patch.preset,
      bass_gain_db: patch.bassGainDb,
      mid_gain_db: patch.midGainDb,
      treble_gain_db: patch.trebleGainDb
    }
  });
}

export async function getMusicDiscordPresence(): Promise<MusicDiscordPresenceState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicDiscordPresenceState>("music_get_discord_presence");
}

export async function updateMusicDiscordPresence(patch: {
  enabled?: boolean;
  includeTitle?: boolean;
  includeArtist?: boolean;
  includeAlbum?: boolean;
  includeElapsed?: boolean;
  privacyMode?: MusicDiscordPresenceState["privacy_mode"];
}): Promise<MusicDiscordPresenceState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicDiscordPresenceState>("music_update_discord_presence", {
    request: {
      enabled: patch.enabled,
      include_title: patch.includeTitle,
      include_artist: patch.includeArtist,
      include_album: patch.includeAlbum,
      include_elapsed: patch.includeElapsed,
      privacy_mode: patch.privacyMode
    }
  });
}

export async function exportMusicSettings(outputPath?: string | null): Promise<MusicSettingsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicSettingsExportResponse>("music_export_settings", {
    request: { output_path: outputPath || null }
  });
}

export async function importMusicSettings(inputPath: string): Promise<MusicSettingsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicSettingsImportResponse>("music_import_settings", {
    request: { input_path: inputPath }
  });
}

export async function recordMusicPlayback(
  track: MusicTrack,
  playedSeconds = 30
): Promise<MusicPlaybackStatsResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicPlaybackStatsResponse>("music_record_playback", {
    request: { track, played_seconds: playedSeconds }
  });
}

export async function getMusicPlaybackStats(): Promise<MusicPlaybackStatsResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicPlaybackStatsResponse>("music_get_playback_stats");
}

export async function clearMusicPlaybackHistory(): Promise<MusicPlaybackStatsResponse | null> {
  if (!isTauriRuntime()) {
    return {
      play_count: 0,
      played_seconds: 0,
      top_tracks: [],
      recent: []
    };
  }

  return invoke<MusicPlaybackStatsResponse>("music_clear_playback_history");
}

export async function exportMusicPlaybackHistory(outputPath?: string | null): Promise<MusicPlaybackHistoryExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicPlaybackHistoryExportResponse>("music_export_playback_history", {
    request: { output_path: outputPath || null }
  });
}

export async function importMusicPlaybackHistory(inputPath: string): Promise<MusicPlaybackHistoryImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<MusicPlaybackHistoryImportResponse>("music_import_playback_history", {
    request: { input_path: inputPath }
  });
}

export async function cancelClipVideo(jobId: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  await invoke("media_cancel_clip", {
    request: { job_id: jobId }
  });
  return true;
}

export async function onClipProgress(
  handler: (event: ClipProgressEvent) => void
): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<ClipProgressEvent>("media:clip-progress", (event) => handler(event.payload));
}

export interface DownloadsSettings {
  schema_version: 1;
  max_concurrency: number;
  default_output_dir?: string | null;
  organize_by_platform: boolean;
  filename_template: string;
  skip_existing: boolean;
  completed_task_cleanup: "archive" | "delete" | string;
  archived_task_retention_days?: number | null;
  default_quality: string;
  default_audio_format: string;
  default_user_agent?: string | null;
  default_referer?: string | null;
  default_proxy?: string | null;
  default_rate_limit?: string | null;
  default_live_from_start: boolean;
  default_concurrent_fragments?: number | null;
  custom_ytdlp_args?: string | null;
  subtitles: SubtitleSettings;
  sponsorblock: SponsorBlockSettings;
  metadata: MetadataSettings;
}

export interface DownloadsSettingsExportResponse {
  output_path: string;
  exported_setting_count: number;
  settings: DownloadsSettings;
}

export interface DownloadsSettingsImportResponse {
  input_path: string;
  imported_setting_count: number;
  settings: DownloadsSettings;
}

export interface NetworkSettingsBackup {
  schema_version: 1;
  default_user_agent?: string | null;
  default_referer?: string | null;
  default_proxy?: string | null;
  default_rate_limit?: string | null;
  default_live_from_start: boolean;
  default_concurrent_fragments?: number | null;
}

export interface NetworkSettingsExportResponse {
  output_path: string;
  exported_setting_count: number;
  settings: NetworkSettingsBackup;
}

export interface NetworkSettingsImportResponse {
  input_path: string;
  imported_setting_count: number;
  settings: NetworkSettingsBackup;
}

export interface AppearanceSettings {
  schema_version: 1;
  language: string;
  theme: "system" | "light" | "dark" | "contrast" | "paper" | "midnight" | "forest" | "dracula" | "catppuccin" | "one-dark" | "e-ink" | "solar" | "rose" | "nord";
  font_scale_percent: number;
  density: "compact" | "comfortable" | "spacious";
}

export interface AiSettings {
  schema_version: 1;
  whisper_model: "tiny" | "base" | "small" | "medium" | "large";
  whisper_language?: string | null;
  whisper_task: "transcribe" | "translate";
  subtitle_translate_enabled: boolean;
  grammar_cleanup_enabled: boolean;
  provider: "none" | "local";
}

export interface AiSettingsExportResponse {
  output_path: string;
  exported_setting_count: number;
  settings: AiSettings;
}

export interface AiSettingsImportResponse {
  input_path: string;
  imported_setting_count: number;
  settings: AiSettings;
}

export interface AppearanceSettingsExportResponse {
  output_path: string;
  exported_setting_count: number;
  settings: AppearanceSettings;
}

export interface AppearanceSettingsImportResponse {
  input_path: string;
  imported_setting_count: number;
  settings: AppearanceSettings;
}

export interface AppearanceCapabilityCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  setting_fields: string[];
  data_files: string[];
  sensitive_fields: string[];
  reads_appearance_values: boolean;
  writes_appearance_values: boolean;
  imports_appearance_files: boolean;
  exports_appearance_files: boolean;
  uses_external_assets: boolean;
  copies_external_theme_text: boolean;
  copies_external_translation_text: boolean;
  verifies_visual_contrast: boolean;
  verifies_full_ui_translation: boolean;
  supports_batch: boolean;
  scope: string;
  limitations: string[];
}

export interface AppearanceCapabilityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  capability_count: number;
  capabilities: AppearanceCapabilityCatalogItem[];
  appearance_surfaces: string[];
  setting_fields: string[];
  data_files: string[];
  sensitive_fields: string[];
  supported_outputs: string[];
  reads_appearance_values: boolean;
  writes_appearance_values: boolean;
  imports_appearance_files: boolean;
  exports_appearance_files: boolean;
  uses_external_assets: boolean;
  copies_external_theme_text: boolean;
  copies_external_translation_text: boolean;
  verifies_visual_contrast: boolean;
  verifies_full_ui_translation: boolean;
  parity_gate_status: string;
  review_notes: string[];
}

export interface AppearanceThemeCatalogItem {
  id: string;
  label: string;
  css_class: string;
  category: string;
  system_aware: boolean;
  common_name_compatible: boolean;
  original_token_set: boolean;
  review_note: string;
}

export interface AppearanceThemeCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  current_theme: string;
  current_language: string;
  theme_count: number;
  language_count: number;
  density_count: number;
  font_scale_min_percent: number;
  font_scale_max_percent: number;
  themes: AppearanceThemeCatalogItem[];
  languages: string[];
  densities: string[];
  css_source_path: string;
  includes_external_assets: boolean;
  copies_external_theme_text: boolean;
  verifies_visual_contrast: boolean;
  review_notes: string[];
}

export interface AppearanceLanguageCatalogItem {
  id: string;
  label: string;
  native_label: string;
  text_direction: string;
  shell_translation_keys: number;
  shell_translation_complete: boolean;
  review_note: string;
}

export interface AppearanceLanguageCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  current_language: string;
  language_count: number;
  shell_translation_key_count: number;
  languages: AppearanceLanguageCatalogItem[];
  includes_extension_locales: boolean;
  includes_plugin_runtime_i18n: boolean;
  copies_external_translation_text: boolean;
  verifies_full_ui_translation: boolean;
  review_notes: string[];
}

export interface AiLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  provider: string;
  local_provider_enabled: boolean;
  cloud_provider_enabled: boolean;
  api_key_configured: boolean;
  whisper_model: string;
  whisper_task: string;
  whisper_language_set: boolean;
  subtitle_translate_enabled: boolean;
  grammar_cleanup_enabled: boolean;
  whisper_configured: boolean;
  whisper_path_override_set: boolean;
  whisper_download_source_set: boolean;
  whisper_install_error?: string | null;
  executes_ai_workflows: boolean;
  includes_prompts: boolean;
  includes_api_keys: boolean;
  includes_file_bodies: boolean;
  review_notes: string[];
}

export interface AiCapabilityCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  data_files: string[];
  settings_fields: string[];
  sensitive_fields: string[];
  mutates_settings: boolean;
  executes_whisper: boolean;
  executes_remote_ai: boolean;
  reads_media_files: boolean;
  includes_prompts: boolean;
  includes_api_keys: boolean;
  supports_batch: boolean;
  scope: string;
  limitations: string[];
}

export interface AiCapabilityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  capability_count: number;
  capabilities: AiCapabilityCatalogItem[];
  ai_surfaces: string[];
  data_files: string[];
  settings_fields: string[];
  sensitive_fields: string[];
  supported_providers: string[];
  supported_whisper_tasks: string[];
  mutates_settings: boolean;
  executes_whisper: boolean;
  executes_remote_ai: boolean;
  reads_media_files: boolean;
  includes_prompts: boolean;
  includes_api_keys: boolean;
  verifies_whisper_e2e: boolean;
  verifies_translate_e2e: boolean;
  verifies_grammar_e2e: boolean;
  parity_gate_status: string;
  review_notes: string[];
}

export interface AppShellSettings {
  schema_version: 1;
  quick_capture_shortcut: string;
  quick_capture_enabled: boolean;
  updated_at?: string | null;
}

export interface AppShellSettingsExportResponse {
  output_path: string;
  exported_setting_count: number;
  settings: AppShellSettings;
}

export interface AppShellSettingsImportResponse {
  input_path: string;
  imported_setting_count: number;
  settings: AppShellSettings;
}

export interface AdvancedSettings {
  schema_version: 1;
  diagnostics_include_urls: boolean;
}

export interface AdvancedSettingsExportResponse {
  output_path: string;
  exported_setting_count: number;
  settings: AdvancedSettings;
}

export interface AdvancedSettingsImportResponse {
  input_path: string;
  imported_setting_count: number;
  settings: AdvancedSettings;
}

export interface Settings {
  schema_version: 1;
  appearance: AppearanceSettings;
  downloads: DownloadsSettings;
  ai: AiSettings;
  app_shell: AppShellSettings;
  advanced: AdvancedSettings;
}

export interface NetworkValidationResponse {
  schema_version: 1;
  ok: boolean;
  proxy_configured: boolean;
  proxy_kind?: string | null;
  proxy_host?: string | null;
  proxy_port?: number | null;
  message: string;
}

export interface AppearanceSettingsPatch {
  language?: string;
  theme?: AppearanceSettings["theme"];
  font_scale_percent?: number;
  density?: AppearanceSettings["density"];
}

export interface DownloadsSettingsPatch {
  max_concurrency?: number;
  default_output_dir?: string | null;
  organize_by_platform?: boolean;
  filename_template?: string;
  skip_existing?: boolean;
  completed_task_cleanup?: "archive" | "delete" | string;
  archived_task_retention_days?: number | null;
  default_quality?: string;
  default_audio_format?: string;
  default_user_agent?: string | null;
  default_referer?: string | null;
  default_proxy?: string | null;
  default_rate_limit?: string | null;
  default_live_from_start?: boolean;
  default_concurrent_fragments?: number | null;
  custom_ytdlp_args?: string | null;
  subtitles?: SubtitleSettings;
  sponsorblock?: SponsorBlockSettings;
  metadata?: MetadataSettings;
}

export interface AdvancedSettingsPatch {
  diagnostics_include_urls?: boolean;
}

export interface AiSettingsPatch {
  whisper_model?: AiSettings["whisper_model"];
  whisper_language?: string | null;
  whisper_task?: AiSettings["whisper_task"];
  subtitle_translate_enabled?: boolean;
  grammar_cleanup_enabled?: boolean;
  provider?: AiSettings["provider"];
}

export interface AppShellSettingsPatch {
  quick_capture_shortcut?: string;
  quick_capture_enabled?: boolean;
}

export interface SettingsChangedEvent {
  settings: Settings;
  changed_paths: string[];
}

export interface LibraryChangedEvent {
  domain: "books" | "music" | "courses" | "notes";
  reason: string;
}

export interface ChannelNewItemsEvent {
  channel_id: string;
  item_count: number;
}

export async function getSettings(): Promise<Settings | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<Settings>("settings_get_all");
}

export async function exportSettingsManifest(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ path: string }>("settings_export_manifest", {
    request: { output_path: outputPath || null }
  });
  return response.path;
}

export async function importSettingsManifest(manifestPath: string): Promise<Settings | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<Settings>("settings_import_manifest", {
    request: { manifest_path: manifestPath }
  });
}

export async function updateSettingsDownloads(patch: DownloadsSettingsPatch): Promise<Settings | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<Settings>("settings_update", {
    request: {
      patch: {
        downloads: patch
      }
    }
  });
}

export async function updateSettingsAppearance(patch: AppearanceSettingsPatch): Promise<Settings | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<Settings>("settings_update", {
    request: {
      patch: {
        appearance: patch
      }
    }
  });
}

export async function updateSettingsAdvanced(patch: AdvancedSettingsPatch): Promise<Settings | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<Settings>("settings_update", {
    request: {
      patch: {
        advanced: patch
      }
    }
  });
}

export async function exportAdvancedSettings(outputPath?: string | null): Promise<AdvancedSettingsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AdvancedSettingsExportResponse>("advanced_export_settings", {
    request: { output_path: outputPath || null }
  });
}

export async function importAdvancedSettings(inputPath: string): Promise<AdvancedSettingsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AdvancedSettingsImportResponse>("advanced_import_settings", {
    request: { input_path: inputPath }
  });
}

export async function exportAppearanceSettings(outputPath?: string | null): Promise<AppearanceSettingsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AppearanceSettingsExportResponse>("appearance_export_settings", {
    request: { output_path: outputPath || null }
  });
}

export async function importAppearanceSettings(inputPath: string): Promise<AppearanceSettingsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AppearanceSettingsImportResponse>("appearance_import_settings", {
    request: { input_path: inputPath }
  });
}

export async function getAppearanceThemeCatalog(): Promise<AppearanceThemeCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AppearanceThemeCatalogResponse>("appearance_get_theme_catalog");
}

export async function exportAppearanceThemeCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("appearance_export_theme_catalog", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getAppearanceLanguageCatalog(): Promise<AppearanceLanguageCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AppearanceLanguageCatalogResponse>("appearance_get_language_catalog");
}

export async function exportAppearanceLanguageCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("appearance_export_language_catalog", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getAppearanceCapabilityCatalog(): Promise<AppearanceCapabilityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AppearanceCapabilityCatalogResponse>("appearance_get_capability_catalog");
}

export async function exportAppearanceCapabilityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("appearance_export_capability_catalog", {
    request: outputPath ? { output_path: outputPath } : null
  });
  return response.archive_path;
}

export async function updateSettingsAi(patch: AiSettingsPatch): Promise<Settings | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<Settings>("settings_update", {
    request: {
      patch: {
        ai: patch
      }
    }
  });
}

export async function getAiLocalSummary(): Promise<AiLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AiLocalSummaryResponse>("ai_get_local_summary");
}

export async function exportAiLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("ai_export_local_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getAiCapabilityCatalog(): Promise<AiCapabilityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AiCapabilityCatalogResponse>("ai_get_capability_catalog");
}

export async function exportAiCapabilityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("ai_export_capability_catalog", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function exportAiSettings(outputPath?: string | null): Promise<AiSettingsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AiSettingsExportResponse>("ai_export_settings", {
    request: { output_path: outputPath || null }
  });
}

export async function importAiSettings(inputPath: string): Promise<AiSettingsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AiSettingsImportResponse>("ai_import_settings", {
    request: { input_path: inputPath }
  });
}

export async function getAppShellSettings(): Promise<AppShellSettings | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AppShellSettings>("app_get_shell_settings");
}

export async function exportAppShellSettings(outputPath?: string | null): Promise<AppShellSettingsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AppShellSettingsExportResponse>("app_export_shell_settings", {
    request: { output_path: outputPath || null }
  });
}

export async function importAppShellSettings(inputPath: string): Promise<AppShellSettingsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AppShellSettingsImportResponse>("app_import_shell_settings", {
    request: { input_path: inputPath }
  });
}

export async function updateAppShellSettings(patch: AppShellSettingsPatch): Promise<AppShellSettings | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<AppShellSettings>("app_update_shell_settings", {
    request: {
      patch: {
        quick_capture_shortcut: patch.quick_capture_shortcut,
        quick_capture_enabled: patch.quick_capture_enabled
      }
    }
  });
}

export type SettingsResetSection =
  | "all"
  | "appearance"
  | "downloads"
  | "network"
  | "advanced"
  | "auth"
  | "twitter_x_auth"
  | "ai"
  | "app_shell"
  | "shortcut"
  | "update"
  | "extension"
  | "channels"
  | "reader"
  | "library"
  | "music"
  | "music_queue"
  | "music_sleep_timer"
  | "music_equalizer"
  | "music_discord_presence"
  | "dependencies"
  | "tools";

export async function resetSettingsSection(section: SettingsResetSection): Promise<Settings | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<Settings>("settings_reset_section", {
    request: { section }
  });
}

export async function onSettingsChanged(handler: (event: SettingsChangedEvent) => void): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<SettingsChangedEvent>("settings:changed", (event) => handler(event.payload));
}

export async function onLibraryChanged(handler: (event: LibraryChangedEvent) => void): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<LibraryChangedEvent>("library:changed", (event) => handler(event.payload));
}

export async function onChannelNewItems(handler: (event: ChannelNewItemsEvent) => void): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<ChannelNewItemsEvent>("channel:new_items", (event) => handler(event.payload));
}

export async function validateNetworkSettings(proxy?: string): Promise<NetworkValidationResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<NetworkValidationResponse>("settings_validate_network", {
    request: { proxy: proxy || null }
  });
}

export interface CookieBucket {
  schema_version: 1;
  id: string;
  name: string;
  platform?: string | null;
  domain_hints: string[];
  path_hints?: string[];
  secure_only?: boolean;
  expires_summary?: string | null;
  cookie_count: number;
  source: "paste" | "file" | "browser_extension";
  storage_path: string;
  created_at: string;
  updated_at: string;
  last_tested_at?: string | null;
  health: "untested" | "valid" | "expired" | "error";
}

export interface CookieBucketsChangedEvent {
  reason: string;
  buckets: CookieBucket[];
}

export interface CookieTestManyResponse {
  buckets: CookieBucket[];
  failed: BulkDownloadFailure[];
}

export interface BilibiliImportItem {
  id: string;
  title: string;
  source_url: string;
  owner?: string | null;
  duration_seconds?: number | null;
  added_at?: string | null;
  collection: "watch_later" | "history" | string;
  created_task_id?: string | null;
}

export interface BilibiliAccountStatus {
  schema_version: 1;
  status: "not_configured" | "cookie_unverified" | "cookie_available" | string;
  display_name?: string | null;
  cookie_bucket_id?: string | null;
  cookie_bucket_name?: string | null;
  cookie_health?: CookieBucket["health"] | null;
  imported_watch_later_count: number;
  imported_history_count: number;
  last_imported_at?: string | null;
  message: string;
}

export interface BilibiliImportQueueSkippedItem {
  id: string;
  reason: string;
}

export interface BilibiliImportQueueManyResponse {
  created: DownloadTask[];
  skipped: BilibiliImportQueueSkippedItem[];
}

export interface BilibiliImportsChangedEvent {
  reason: string;
  items: BilibiliImportItem[];
  account_status: BilibiliAccountStatus;
}

export interface BilibiliManifestExportResponse {
  schema_version: 1;
  output_path: string;
  exported_count: number;
  collection: "all" | "watch_later" | "history" | string;
}

export interface BilibiliLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  account_status: string;
  cookie_bucket_set: boolean;
  cookie_bucket_id?: string | null;
  cookie_health?: CookieBucket["health"] | null;
  import_count: number;
  watch_later_count: number;
  history_count: number;
  owner_count: number;
  total_duration_seconds: number;
  queued_import_count: number;
  transfer_task_count: number;
  collection_counts: LocalCountEntry[];
  owner_counts: LocalCountEntry[];
  transfer_status_counts: LocalCountEntry[];
  last_imported_at?: string | null;
  review_notes: string[];
}

export interface CookieImportRequest {
  name: string;
  platform?: string;
  source:
    | { type: "paste"; text: string }
    | { type: "file"; path: string }
    | { type: "browser_extension"; payload_ref: string };
}

export async function listCookieBuckets(platform?: string): Promise<CookieBucket[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ buckets: CookieBucket[] }>("cookies_list_buckets", {
    request: platform ? { platform } : null
  });
  return response.buckets;
}

export async function onCookieBucketsChanged(
  handler: (event: CookieBucketsChangedEvent) => void
): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<CookieBucketsChangedEvent>("cookie:buckets_changed", (event) => handler(event.payload));
}

export async function onExtensionPayloadsChanged(
  handler: (event: ExtensionPayloadsChangedEvent) => void
): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<ExtensionPayloadsChangedEvent>("extension:payloads_changed", (event) => handler(event.payload));
}

export async function onExtensionPairingChanged(
  handler: (event: ExtensionPairingChangedEvent) => void
): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<ExtensionPairingChangedEvent>("extension:pairing_changed", (event) => handler(event.payload));
}

export async function onBilibiliImportsChanged(
  handler: (event: BilibiliImportsChangedEvent) => void
): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<BilibiliImportsChangedEvent>("bilibili:imports_changed", (event) => handler(event.payload));
}

export async function importCookieBucket(request: CookieImportRequest): Promise<CookieBucket | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CookieBucket>("cookies_import", { request });
}

export async function exportCookieBucket(bucketId: string, outputPath: string): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ path: string }>("cookies_export", {
    request: { bucket_id: bucketId, output_path: outputPath }
  });
  return response.path;
}

export async function exportCookieBuckets(
  outputPath?: string | null,
  bucketIds?: string[] | null
): Promise<CookieBucketsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CookieBucketsExportResponse>("cookies_export_buckets", {
    request: {
      output_path: outputPath ?? null,
      bucket_ids: bucketIds && bucketIds.length > 0 ? bucketIds : null
    }
  });
}

export async function importCookieBuckets(inputPath: string): Promise<CookieBucketsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CookieBucketsImportResponse>("cookies_import_buckets", {
    request: { input_path: inputPath }
  });
}

export async function deleteCookieBucket(bucketId: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("cookies_delete_bucket", {
    request: { bucket_id: bucketId }
  });
  return response.deleted;
}

export async function renameCookieBucket(bucketId: string, name: string): Promise<CookieBucket | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CookieBucket>("cookies_rename_bucket", {
    request: { bucket_id: bucketId, name }
  });
}

export async function matchCookieBuckets(url: string): Promise<CookieBucket[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ buckets: CookieBucket[] }>("cookies_match_url", {
    request: { url }
  });
  return response.buckets;
}

export async function testCookieBucket(bucketId: string, url?: string): Promise<CookieBucket | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CookieBucket>("cookies_test", {
    request: { bucket_id: bucketId, url: url || null }
  });
}

export async function testCookieBuckets(bucketIds: string[], url?: string): Promise<CookieTestManyResponse> {
  if (!isTauriRuntime()) {
    return { buckets: [], failed: [] };
  }

  return invoke<CookieTestManyResponse>("cookies_test_many", {
    request: { bucket_ids: bucketIds, url: url || null }
  });
}

export async function clearCookieBuckets(bucketIds: string[], platform?: string): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("cookies_clear", {
    request: { bucket_ids: bucketIds, platform: platform || null }
  });
  return response.cleared;
}

export async function importBilibiliManifest(
  manifestPath: string,
  collection: "watch_later" | "history" | "manifest"
): Promise<BilibiliImportItem[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ items: BilibiliImportItem[] }>("bilibili_import_manifest", {
    request: { manifest_path: manifestPath, collection }
  });
  return response.items;
}

export async function exportBilibiliManifest(input: {
  outputPath?: string;
  collection?: "all" | "watch_later" | "history";
  ids?: string[];
} = {}): Promise<BilibiliManifestExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<BilibiliManifestExportResponse>("bilibili_export_manifest", {
    request: {
      output_path: input.outputPath || null,
      collection: input.collection || null,
      ids: input.ids?.length ? input.ids : null
    }
  });
}

export async function listBilibiliImported(): Promise<BilibiliImportItem[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ items: BilibiliImportItem[] }>("bilibili_list_imported");
  return response.items;
}

export async function deleteBilibiliImportedItem(id: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("bilibili_delete_imported_item", {
    request: { id }
  });
  return response.deleted;
}

export async function deleteBilibiliImportedItems(ids: string[]): Promise<{ deleted: string[]; failed: BulkDownloadFailure[] }> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [] };
  }

  return invoke<{ deleted: string[]; failed: BulkDownloadFailure[] }>("bilibili_delete_imported_items", {
    request: { ids }
  });
}

export async function clearBilibiliImported(collection: "all" | "watch_later" | "history" = "all"): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("bilibili_clear_imported", {
    request: { collection }
  });
  return response.cleared;
}

export async function getBilibiliAccountStatus(): Promise<BilibiliAccountStatus | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<BilibiliAccountStatus>("bilibili_account_status");
}

export async function getBilibiliLocalSummary(): Promise<BilibiliLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<BilibiliLocalSummaryResponse>("bilibili_get_local_summary");
}

export async function exportBilibiliLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("bilibili_export_local_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function queueBilibiliImportedItem(
  id: string,
  options?: DownloadTaskCreateOptions
): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("bilibili_queue_imported_item", {
    request: { id, create_options: toCreateDownloadOptions(options) }
  });
}

export async function queueBilibiliImportedItems(
  ids: string[],
  options?: DownloadTaskCreateOptions
): Promise<BilibiliImportQueueManyResponse> {
  if (!isTauriRuntime()) {
    return { created: [], skipped: [] };
  }

  return invoke<BilibiliImportQueueManyResponse>("bilibili_queue_imported_items", {
    request: { ids, create_options: toCreateDownloadOptions(options) }
  });
}

export interface ChannelSubscription {
  schema_version: 1;
  id: string;
  name: string;
  source_url: string;
  platform: string;
  enabled: boolean;
  auto_download: boolean;
  last_checked_at?: string | null;
  last_error?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChannelHistoryItem {
  schema_version: 1;
  id: string;
  channel_id: string;
  source_url: string;
  title: string;
  author?: string | null;
  source_kind?: string | null;
  checked_at: string;
  created_task_id?: string | null;
  error?: string | null;
  notification_status?: "pending" | "shown" | "none" | string | null;
  dedupe_key?: string | null;
}

export interface ChannelSettings {
  schema_version: 1;
  auto_poll_enabled: boolean;
  poll_interval_minutes: number;
  last_poll_started_at?: string | null;
  last_poll_finished_at?: string | null;
  last_error?: string | null;
}

export interface ChannelsExportResponse {
  schema_version: 1;
  output_path: string;
  exported_channel_count: number;
  exported_history_count: number;
  included_settings: boolean;
}

export interface ChannelsImportResponse {
  schema_version: 1;
  imported_channel_count: number;
  imported_history_count: number;
  skipped_channel_count: number;
  skipped_history_count: number;
  settings_imported: boolean;
  channels: ChannelSubscription[];
  history: ChannelHistoryItem[];
  settings: ChannelSettings;
}

export interface ChannelSettingsExportResponse {
  output_path: string;
  exported_setting_count: number;
  settings: ChannelSettings;
}

export interface ChannelSettingsImportResponse {
  input_path: string;
  imported_setting_count: number;
  settings: ChannelSettings;
}

export interface ChannelPollDueResponse {
  checked: number;
  created_task_count: number;
  items: ChannelHistoryItem[];
  settings: ChannelSettings;
}

export interface ChannelHistoryQueueSkippedItem {
  id: string;
  title: string;
  reason: string;
}

export interface ChannelHistoryQueueManyResponse {
  created: DownloadTask[];
  items: ChannelHistoryItem[];
  skipped: ChannelHistoryQueueSkippedItem[];
}

export interface ChannelBulkDeleteResponse {
  deleted: string[];
  failed: BulkDownloadFailure[];
}

export interface ChannelHistoryBulkDeleteResponse {
  deleted: string[];
  failed: BulkDownloadFailure[];
}

export interface ChannelNotificationBulkShownResponse {
  items: ChannelHistoryItem[];
  failed: BulkDownloadFailure[];
}

export interface ChannelsChangedEvent {
  reason: string;
  channels: ChannelSubscription[];
  history: ChannelHistoryItem[];
  settings: ChannelSettings;
}

export interface TelegramAccountState {
  schema_version: 1;
  auth_state: "signed_out" | "pending" | "signed_in" | "error";
  phone_hint?: string | null;
  display_name?: string | null;
  last_error?: string | null;
  updated_at: string;
}

export interface TelegramMediaItem {
  id: string;
  chat_id: string;
  title: string;
  media_type: "photo" | "video" | "audio" | "document" | "file";
  source_url?: string | null;
  local_path?: string | null;
  size_bytes?: number | null;
  created_at?: string | null;
}

export interface TelegramChat {
  schema_version: 1;
  id: string;
  title: string;
  kind: "chat" | "channel" | "group" | "bot";
  username?: string | null;
  last_message_at?: string | null;
  media_count: number;
  media: TelegramMediaItem[];
  updated_at: string;
}

export interface TelegramSearchResponse {
  chats: TelegramChat[];
  media: TelegramMediaItem[];
}

export interface TelegramSyncStatusResponse {
  schema_version: 1;
  mode: "local_manifest" | string;
  auth_state: TelegramAccountState["auth_state"] | string;
  chat_count: number;
  media_count: number;
  local_media_count: number;
  missing_local_media_count: number;
  remote_source_count: number;
  queued_transfer_count: number;
  active_transfer_count: number;
  completed_transfer_count: number;
  failed_transfer_count: number;
  last_manifest_updated_at?: string | null;
  last_error?: string | null;
  updated_at: string;
}

export interface TelegramManifestChangedEvent {
  reason: string;
  chats: TelegramChat[];
  sync_status: TelegramSyncStatusResponse;
}

export interface TelegramManifestExportResponse {
  schema_version: 1;
  output_path: string;
  exported_chat_count: number;
  exported_media_count: number;
}

export interface TelegramStateExportResponse {
  schema_version: 1;
  output_path: string;
  state: TelegramAccountState;
  includes_session_secret: boolean;
  includes_chat_manifest: boolean;
  review_notes: string[];
}

export interface TelegramStateImportResponse {
  input_path: string;
  state: TelegramAccountState;
  downgraded_signed_in: boolean;
  review_notes: string[];
}

export interface TelegramLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  auth_state: TelegramAccountState["auth_state"] | string;
  phone_hint_set: boolean;
  chat_count: number;
  channel_count: number;
  group_count: number;
  bot_count: number;
  media_count: number;
  local_media_count: number;
  missing_local_media_count: number;
  remote_source_count: number;
  total_media_size_bytes: number;
  queueable_media_count: number;
  transfer_task_count: number;
  chat_kind_counts: LocalCountEntry[];
  media_type_counts: LocalCountEntry[];
  transfer_status_counts: LocalCountEntry[];
  last_manifest_updated_at?: string | null;
  last_error?: string | null;
  review_notes: string[];
}

export interface TelegramCapabilityCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  telegram_surfaces: string[];
  data_files: string[];
  task_kinds: string[];
  sensitive_fields: string[];
  reads_remote_telegram: boolean;
  includes_session_secret: boolean;
  includes_message_bodies: boolean;
  includes_media_file_bodies: boolean;
  mutates_account_state: boolean;
  mutates_manifest: boolean;
  creates_download_tasks: boolean;
  opens_local_files: boolean;
  supports_batch: boolean;
  scope: string;
  limitations: string[];
}

export interface TelegramCapabilityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  capability_count: number;
  capabilities: TelegramCapabilityCatalogItem[];
  telegram_surfaces: string[];
  data_files: string[];
  task_kinds: string[];
  supported_chat_kinds: string[];
  supported_media_types: string[];
  sensitive_fields: string[];
  includes_session_secret: boolean;
  includes_message_bodies: boolean;
  includes_media_file_bodies: boolean;
  reads_remote_telegram: boolean;
  mutates_account_state: boolean;
  mutates_manifest: boolean;
  creates_download_tasks: boolean;
  opens_local_files: boolean;
  verifies_mtproto_login_e2e: boolean;
  verifies_remote_sync_e2e: boolean;
  verifies_media_download_e2e: boolean;
  parity_gate_status: string;
  review_notes: string[];
}

export interface TelegramCloneSkippedItem {
  id: string;
  title: string;
  reason: string;
}

export interface TelegramCloneWizardResponse {
  chat: TelegramChat;
  created: DownloadTask[];
  skipped: TelegramCloneSkippedItem[];
}

export interface TelegramMediaQueueManyResponse {
  created: DownloadTask[];
  skipped: TelegramCloneSkippedItem[];
}

export interface TelegramLocalMediaCopyItem {
  id: string;
  title: string;
  source_path: string;
  output_path: string;
  size_bytes: number;
}

export interface TelegramLocalMediaCopyResponse {
  copied: TelegramLocalMediaCopyItem[];
  skipped: TelegramCloneSkippedItem[];
  output_dir: string;
}

export interface TelegramPruneMissingResponse {
  chats: TelegramChat[];
  pruned_media: number;
}

export interface TelegramMediaDeleteResponse {
  deleted: boolean;
  chats: TelegramChat[];
}

export interface TelegramMediaBulkDeleteResponse {
  deleted: string[];
  failed: BulkDownloadFailure[];
  chats: TelegramChat[];
}

export interface CourseEntry {
  schema_version: 1;
  id: string;
  source_url: string;
  platform: string;
  title: string;
  lesson_count: number;
  attachment_count: number;
  status: string;
  cookie_bucket_id?: string | null;
  remote_extraction_note?: string | null;
  lessons: CourseLesson[];
  attachments: CourseAttachment[];
  created_at: string;
  updated_at: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  source_url?: string | null;
  local_path?: string | null;
  duration_seconds?: number | null;
  progress_percent: number;
  note_count: number;
  opened_at?: string | null;
}

export interface CourseAttachment {
  id: string;
  title: string;
  source_url?: string | null;
  local_path?: string | null;
  size_bytes: number;
  kind: string;
}

export interface CourseLessonQueueSkippedItem {
  lesson_id: string;
  title: string;
  reason: string;
}

export interface CourseLessonQueueAllResponse {
  course: CourseEntry;
  created: DownloadTask[];
  skipped: CourseLessonQueueSkippedItem[];
}

export interface CourseLessonQueueManySkippedItem {
  course_id: string;
  lesson_id: string;
  title: string;
  reason: string;
}

export interface CourseLessonQueueManyResponse {
  created: DownloadTask[];
  skipped: CourseLessonQueueManySkippedItem[];
  failed: BulkDownloadFailure[];
}

export interface CourseAttachmentQueueSkippedItem {
  attachment_id: string;
  title: string;
  reason: string;
}

export interface CourseAttachmentQueueAllResponse {
  course: CourseEntry;
  created: DownloadTask[];
  skipped: CourseAttachmentQueueSkippedItem[];
}

export interface CourseAttachmentQueueManySkippedItem {
  course_id: string;
  attachment_id: string;
  title: string;
  reason: string;
}

export interface CourseAttachmentQueueManyResponse {
  created: DownloadTask[];
  skipped: CourseAttachmentQueueManySkippedItem[];
  failed: BulkDownloadFailure[];
}

export interface CoursePruneMissingResponse {
  courses: CourseEntry[];
  pruned_lessons: number;
  pruned_attachments: number;
}

export interface CourseItemDeleteResponse {
  deleted: boolean;
  course: CourseEntry;
}

export interface CourseManifestExportResponse {
  schema_version: 1;
  output_path: string;
  exported_count: number;
}

export interface CourseManifestBundleImportResponse {
  schema_version: 1;
  imported_count: number;
  courses: CourseEntry[];
}

export interface CourseProgressExportResponse {
  schema_version: 1;
  output_path: string;
  exported_course_count: number;
  exported_lesson_count: number;
}

export interface CourseProgressImportResponse {
  schema_version: 1;
  imported_course_count: number;
  imported_lesson_count: number;
  skipped_course_count: number;
  skipped_lesson_count: number;
  courses: CourseEntry[];
}

export interface CourseLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  course_count: number;
  imported_course_count: number;
  probed_course_count: number;
  platform_count: number;
  lesson_count: number;
  attachment_count: number;
  local_lesson_count: number;
  missing_local_lesson_count: number;
  remote_lesson_source_count: number;
  local_attachment_count: number;
  missing_local_attachment_count: number;
  remote_attachment_source_count: number;
  total_attachment_size_bytes: number;
  queueable_lesson_count: number;
  queueable_attachment_count: number;
  cookie_linked_course_count: number;
  average_progress_percent: number;
  completed_lesson_count: number;
  note_linked_lesson_count: number;
  transfer_task_count: number;
  platform_counts: LocalCountEntry[];
  status_counts: LocalCountEntry[];
  attachment_kind_counts: LocalCountEntry[];
  transfer_status_counts: LocalCountEntry[];
  last_updated_at?: string | null;
  review_notes: string[];
}

export interface CourseCapabilityCatalogItem {
  capability: string;
  label: string;
  status: string;
  commands: string[];
  cli_aliases: string[];
  desktop_ui: string[];
  course_surfaces: string[];
  data_files: string[];
  task_kinds: string[];
  sensitive_fields: string[];
  reads_remote_platforms: boolean;
  includes_cookie_values: boolean;
  includes_note_bodies: boolean;
  includes_downloaded_files: boolean;
  mutates_course_library: boolean;
  mutates_learning_notes: boolean;
  creates_download_tasks: boolean;
  opens_local_files: boolean;
  supports_batch: boolean;
  scope: string;
  limitations: string[];
}

export interface CourseCapabilityCatalogResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  capability_count: number;
  capabilities: CourseCapabilityCatalogItem[];
  supported_platforms: string[];
  course_surfaces: string[];
  data_files: string[];
  task_kinds: string[];
  sensitive_fields: string[];
  includes_cookie_values: boolean;
  includes_note_bodies: boolean;
  includes_downloaded_files: boolean;
  reads_remote_platforms: boolean;
  mutates_course_library: boolean;
  mutates_learning_notes: boolean;
  creates_download_tasks: boolean;
  opens_local_files: boolean;
  verifies_platform_login_e2e: boolean;
  verifies_remote_attachment_crawl: boolean;
  verifies_course_player_e2e: boolean;
  parity_gate_status: string;
  review_notes: string[];
}

export interface CourseItemBulkDeleteResponse {
  deleted: string[];
  failed: BulkDownloadFailure[];
  courses: CourseEntry[];
}

export interface CoursePlatformMatrixEntry {
  id: string;
  label: string;
  host_hints: string[];
  status: string;
  evidence: string[];
  limitations: string[];
}

export interface CoursePlatformMatrixResponse {
  schema_version: 1;
  platforms: CoursePlatformMatrixEntry[];
}

export interface CoursePlatformSample {
  platform_id: string;
  label: string;
  url: string;
  title_hint: string;
}

export interface CoursePlatformSampleResponse {
  schema_version: 1;
  samples: CoursePlatformSample[];
  pending_remote_extraction: boolean;
}

export interface LearningNote {
  schema_version: 1;
  id: string;
  title: string;
  body: string;
  source_url?: string | null;
  timestamp_seconds?: number | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  outgoing_links: string[];
  backlink_count: number;
}

export interface LearningNoteSaveInput {
  id?: string;
  title: string;
  body: string;
  sourceUrl?: string;
  timestampSeconds?: number | null;
  tags?: string[];
}

export interface LearningNotesExportResponse {
  schema_version: 1;
  output_path: string;
  exported_count: number;
}

export interface LearningNotesImportResponse {
  schema_version: 1;
  imported_count: number;
  skipped_count: number;
  notes: LearningNote[];
}

export interface CourseLessonNoteSaveInput {
  courseId: string;
  lessonId: string;
  title: string;
  body: string;
  timestampSeconds?: number | null;
}

export interface SpacedReviewCard {
  schema_version: 1;
  id: string;
  note_id: string;
  prompt: string;
  answer: string;
  tags: string[];
  ease: number;
  interval_days: number;
  due_at: string;
  last_reviewed_at?: string | null;
  review_count: number;
  lapse_count: number;
  source_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SpacedReviewCardSaveInput {
  id?: string;
  noteId?: string;
  prompt: string;
  answer: string;
  tags?: string[];
  sourceUrl?: string;
  dueAt?: string;
}

export interface SpacedReviewCardsExportResponse {
  schema_version: 1;
  output_path: string;
  exported_count: number;
}

export interface SpacedReviewCardsImportResponse {
  schema_version: 1;
  imported_count: number;
  skipped_count: number;
  cards: SpacedReviewCard[];
}

export interface PomodoroSession {
  schema_version: 1;
  id: string;
  label: string;
  duration_minutes: number;
  break_minutes: number;
  completed: boolean;
  linked_source_url?: string | null;
  started_at: string;
  ended_at: string;
}

export interface PomodoroSessionSaveInput {
  label?: string;
  durationMinutes: number;
  breakMinutes?: number;
  completed: boolean;
  linkedSourceUrl?: string;
  notifyOnComplete?: boolean;
}

export interface PomodoroSessionsExportResponse {
  schema_version: 1;
  output_path: string;
  exported_count: number;
}

export interface PomodoroSessionsImportResponse {
  schema_version: 1;
  imported_count: number;
  skipped_count: number;
  sessions: PomodoroSession[];
}

export interface LearningDashboardDay {
  date: string;
  note_count: number;
  completed_sessions: number;
  focus_minutes: number;
  activity_count: number;
}

export interface LearningDashboard {
  schema_version: 1;
  note_count: number;
  review_card_count: number;
  due_review_card_count: number;
  completed_session_count: number;
  completed_minutes: number;
  course_progress_count: number;
  reading_progress_count: number;
  reading_annotation_count: number;
  music_play_count: number;
  music_played_minutes: number;
  daily_goal_minutes: number;
  today_focus_minutes: number;
  daily_goal_met: boolean;
  active_day_count_30d: number;
  current_streak_days: number;
  longest_streak_days: number;
  heatmap: LearningDashboardDay[];
  updated_at: string;
}

export interface LearningGraphNode {
  id: string;
  title: string;
  backlink_count: number;
}

export interface LearningGraphEdge {
  source_id: string;
  target_id: string;
  label: string;
}

export interface LearningGraph {
  schema_version: 1;
  nodes: LearningGraphNode[];
  edges: LearningGraphEdge[];
  updated_at: string;
}

export interface LearningLocalSummaryResponse {
  schema_version: 1;
  generated_at: string;
  data_root: string;
  note_count: number;
  note_with_source_count: number;
  note_without_source_count: number;
  note_with_timestamp_count: number;
  note_without_timestamp_count: number;
  note_with_tags_count: number;
  tag_count: number;
  outgoing_link_count: number;
  backlink_count_total: number;
  journal_note_count: number;
  review_card_count: number;
  due_review_card_count: number;
  reviewed_card_count: number;
  review_lapse_count_total: number;
  review_tag_counts: LocalCountEntry[];
  pomodoro_session_count: number;
  completed_pomodoro_count: number;
  open_pomodoro_count: number;
  focus_minutes_total: number;
  break_minutes_total: number;
  session_with_source_count: number;
  daily_goal_minutes: number;
  today_focus_minutes: number;
  daily_goal_met: boolean;
  active_days_30: number;
  current_streak_days: number;
  longest_streak_days: number;
  heatmap_day_count: number;
  graph_node_count: number;
  graph_edge_count: number;
  tag_counts: LocalCountEntry[];
  note_source_status_counts: LocalCountEntry[];
  note_timestamp_status_counts: LocalCountEntry[];
  pomodoro_status_counts: LocalCountEntry[];
  pomodoro_source_status_counts: LocalCountEntry[];
  first_note_created_at?: string | null;
  last_note_created_at?: string | null;
  last_note_updated_at?: string | null;
  first_session_started_at?: string | null;
  last_session_started_at?: string | null;
  last_session_ended_at?: string | null;
  generated_from_dashboard_at: string;
  generated_from_graph_at: string;
  includes_note_bodies: boolean;
  includes_source_urls: boolean;
  includes_downloaded_content: boolean;
  includes_cookie_values: boolean;
  executes_timers: boolean;
  updates_learning_state: boolean;
  review_notes: string[];
}

export interface LearningDashboardExportResponse {
  schema_version: 1;
  archive_path: string;
  heatmap_days: number;
}

export interface LearningDailyGoalExportResponse {
  schema_version: 1;
  output_path: string;
  focus_minutes: number;
}

export interface LearningDailyGoalImportResponse {
  schema_version: 1;
  focus_minutes: number;
  dashboard: LearningDashboard;
}

export interface LearningGraphExportResponse {
  schema_version: 1;
  archive_path: string;
  node_count: number;
  edge_count: number;
}

export interface PluginNavItem {
  id: string;
  label: string;
}

export interface PluginEventInfo {
  name: string;
  description?: string | null;
}

export interface PluginInfo {
  schema_version: 1;
  id: string;
  display_name: string;
  version: string;
  abi_version: string;
  host_abi_version: string;
  state: "installed" | "enabled" | "disabled" | "failed" | "incompatible";
  dynamic_library_path?: string | null;
  entrypoint?: string | null;
  preflight_status: string;
  preflight_message: string;
  capabilities: string[];
  permissions: string[];
  commands: string[];
  events: PluginEventInfo[];
  nav_items: PluginNavItem[];
  i18n?: unknown;
  settings_schema?: unknown;
  installed_at?: string | null;
  updated_at?: string | null;
  last_error?: string | null;
  manifest_path: string;
}

export interface PluginSettingsResponse {
  schema_version: 1;
  id: string;
  settings: Record<string, unknown>;
  data_dir: string;
}

export interface PluginCommandResponse {
  schema_version: 1;
  id: string;
  command: string;
  status: "queued_local";
  message: string;
  result: unknown;
  log_path: string;
  data_dir: string;
}

export interface PluginCommandLogEntry {
  schema_version: 1;
  id: string;
  command: string;
  status: string;
  message: string;
  payload: unknown;
  created_at: string;
}

export interface PluginCommandLogListResponse {
  schema_version: 1;
  id: string;
  commands: PluginCommandLogEntry[];
  log_path: string;
}

export interface PluginEventEmitResponse {
  schema_version: 1;
  id: string;
  event: string;
  status: "recorded_local";
  message: string;
  log_path: string;
  data_dir: string;
}

export interface PluginEventLogEntry {
  schema_version: 1;
  id: string;
  event: string;
  status: string;
  message: string;
  payload: unknown;
  created_at: string;
}

export interface PluginEventListResponse {
  schema_version: 1;
  id: string;
  events: PluginEventLogEntry[];
  log_path: string;
}

export interface PluginActivityLogEntry {
  schema_version: 1;
  id: string;
  message: string;
  created_at: string;
}

export interface PluginActivityLogListResponse {
  schema_version: 1;
  id: string;
  activities: PluginActivityLogEntry[];
  log_path: string;
}

export interface PluginMarketplaceEntry {
  id: string;
  name: string;
  manifest_path: string;
  version?: string | null;
  description?: string | null;
  source?: string | null;
  sha256?: string | null;
  signature?: string | null;
  signature_url?: string | null;
  capabilities: string[];
  permissions: string[];
}

export interface PluginBulkUpdateResponse {
  checked: number;
  updated: number;
  plugins: PluginInfo[];
}

export interface PluginBulkInstallResponse {
  checked: number;
  installed: number;
  plugins: PluginInfo[];
}

export interface PluginBulkCheckResponse {
  checked: number;
  plugins: PluginInfo[];
}

export interface PluginBulkStateResponse {
  plugins: PluginInfo[];
  failed: BulkDownloadFailure[];
}

export interface PluginLogBulkClearResponse {
  cleared: string[];
  failed: BulkDownloadFailure[];
}

export async function listChannels(): Promise<ChannelSubscription[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ channels: ChannelSubscription[] }>("channels_list");
  return response.channels;
}

export async function onChannelsChanged(
  handler: (event: ChannelsChangedEvent) => void
): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<ChannelsChangedEvent>("channels:changed", (event) => handler(event.payload));
}

export async function addChannel(request: {
  name: string;
  sourceUrl: string;
  platform?: string;
  autoDownload?: boolean;
}): Promise<ChannelSubscription | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ChannelSubscription>("channels_add", {
    request: {
      name: request.name,
      source_url: request.sourceUrl,
      platform: request.platform,
      auto_download: request.autoDownload
    }
  });
}

export async function removeChannel(id: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("channels_remove", {
    request: { id }
  });
  return response.deleted;
}

export async function removeChannels(ids: string[]): Promise<ChannelBulkDeleteResponse> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [] };
  }

  return invoke<ChannelBulkDeleteResponse>("channels_remove_many", {
    request: { ids }
  });
}

export async function clearChannels(): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("channels_clear");
  return response.cleared;
}

export async function checkChannelNow(id: string): Promise<{
  channel: ChannelSubscription;
  items: ChannelHistoryItem[];
} | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke("channels_check_now", {
    request: { id }
  });
}

export async function listChannelHistory(): Promise<ChannelHistoryItem[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ items: ChannelHistoryItem[] }>("channels_list_history");
  return response.items;
}

export async function deleteChannelHistoryItem(id: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("channels_delete_history_item", {
    request: { id }
  });
  return response.deleted;
}

export async function deleteChannelHistoryItems(ids: string[]): Promise<ChannelHistoryBulkDeleteResponse> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [] };
  }

  return invoke<ChannelHistoryBulkDeleteResponse>("channels_delete_history_items", {
    request: { ids }
  });
}

export async function clearChannelHistory(): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("channels_clear_history");
  return response.cleared;
}

export async function markChannelNotificationShown(id: string): Promise<ChannelHistoryItem | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ChannelHistoryItem>("channels_mark_notification_shown", {
    request: { id }
  });
}

export async function markChannelNotificationsShown(ids: string[]): Promise<ChannelNotificationBulkShownResponse> {
  if (!isTauriRuntime()) {
    return { items: [], failed: [] };
  }

  return invoke<ChannelNotificationBulkShownResponse>("channels_mark_notifications_shown", {
    request: { ids }
  });
}

export async function queueChannelHistoryItem(
  id: string,
  options?: DownloadTaskCreateOptions
): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("channels_queue_history_item", {
    request: { id, create_options: toCreateDownloadOptions(options) }
  });
}

export async function queueChannelHistoryItems(
  ids: string[],
  options?: DownloadTaskCreateOptions
): Promise<ChannelHistoryQueueManyResponse> {
  if (!isTauriRuntime()) {
    return { created: [], items: [], skipped: [] };
  }

  return invoke<ChannelHistoryQueueManyResponse>("channels_queue_history_items", {
    request: { ids, create_options: toCreateDownloadOptions(options) }
  });
}

export async function getChannelSettings(): Promise<ChannelSettings | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ settings: ChannelSettings }>("channels_get_settings");
  return response.settings;
}

export async function exportChannelSettings(outputPath?: string | null): Promise<ChannelSettingsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ChannelSettingsExportResponse>("channels_export_settings", {
    request: { output_path: outputPath || null }
  });
}

export async function importChannelSettings(inputPath: string): Promise<ChannelSettingsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ChannelSettingsImportResponse>("channels_import_settings", {
    request: { input_path: inputPath }
  });
}

export async function exportChannels(input: {
  outputPath?: string;
  channelIds?: string[];
  includeHistory?: boolean;
  includeSettings?: boolean;
} = {}): Promise<ChannelsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ChannelsExportResponse>("channels_export", {
    request: {
      output_path: input.outputPath || null,
      channel_ids: input.channelIds?.length ? input.channelIds : null,
      include_history: input.includeHistory ?? null,
      include_settings: input.includeSettings ?? null
    }
  });
}

export async function importChannels(inputPath: string): Promise<ChannelsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ChannelsImportResponse>("channels_import", {
    request: { input_path: inputPath }
  });
}

export async function updateChannelSettings(patch: {
  autoPollEnabled?: boolean;
  pollIntervalMinutes?: number;
}): Promise<ChannelSettings | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ settings: ChannelSettings }>("channels_update_settings", {
    request: {
      auto_poll_enabled: patch.autoPollEnabled,
      poll_interval_minutes: patch.pollIntervalMinutes
    }
  });
  return response.settings;
}

export async function pollDueChannels(): Promise<ChannelPollDueResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<ChannelPollDueResponse>("channels_poll_due");
}

export async function getTelegramState(): Promise<TelegramAccountState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<TelegramAccountState>("telegram_get_state");
}

export async function exportTelegramState(outputPath?: string): Promise<TelegramStateExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<TelegramStateExportResponse>("telegram_export_state", {
    request: { output_path: outputPath || null }
  });
}

export async function importTelegramState(inputPath: string): Promise<TelegramStateImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<TelegramStateImportResponse>("telegram_import_state", {
    request: { input_path: inputPath }
  });
}

export async function startTelegramAuth(phoneHint?: string): Promise<TelegramAccountState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<TelegramAccountState>("telegram_auth_start", {
    request: { phone_hint: phoneHint }
  });
}

export async function logoutTelegram(): Promise<TelegramAccountState | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<TelegramAccountState>("telegram_logout");
}

export async function importTelegramManifest(manifestPath: string): Promise<TelegramChat[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ chats: TelegramChat[] }>("telegram_import_manifest", {
    request: { manifest_path: manifestPath }
  });
  return response.chats;
}

export async function exportTelegramManifest(input: {
  outputPath?: string;
  chatIds?: string[];
} = {}): Promise<TelegramManifestExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<TelegramManifestExportResponse>("telegram_export_manifest", {
    request: {
      output_path: input.outputPath || null,
      chat_ids: input.chatIds?.length ? input.chatIds : null
    }
  });
}

export async function listTelegramChats(): Promise<TelegramChat[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ chats: TelegramChat[] }>("telegram_list_chats");
  return response.chats;
}

export async function deleteTelegramChat(id: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("telegram_delete_chat", {
    request: { id }
  });
  return response.deleted;
}

export async function deleteTelegramChats(ids: string[]): Promise<{
  deleted: string[];
  failed: { id: string; error: string }[];
}> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [] };
  }

  return invoke("telegram_delete_chats", {
    request: { ids }
  });
}

export async function deleteTelegramMedia(id: string): Promise<TelegramMediaDeleteResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<TelegramMediaDeleteResponse>("telegram_delete_media", {
    request: { id }
  });
}

export async function deleteTelegramMediaItems(ids: string[]): Promise<TelegramMediaBulkDeleteResponse | null> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [], chats: [] };
  }

  return invoke<TelegramMediaBulkDeleteResponse>("telegram_delete_media_items", {
    request: { ids, output_dir: null }
  });
}

export async function clearTelegramChats(): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("telegram_clear_chats");
  return response.cleared;
}

export async function pruneMissingTelegramMedia(): Promise<TelegramPruneMissingResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<TelegramPruneMissingResponse>("telegram_prune_missing_local_media");
}

export async function searchTelegram(query = ""): Promise<TelegramSearchResponse> {
  if (!isTauriRuntime()) {
    return { chats: [], media: [] };
  }

  return invoke<TelegramSearchResponse>("telegram_search", {
    request: { query: query || null }
  });
}

export async function getTelegramSyncStatus(): Promise<TelegramSyncStatusResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<TelegramSyncStatusResponse>("telegram_get_sync_status");
}

export async function getTelegramLocalSummary(): Promise<TelegramLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<TelegramLocalSummaryResponse>("telegram_get_local_summary");
}

export async function exportTelegramLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("telegram_export_local_summary", {
    request: outputPath ? { output_path: outputPath } : null
  });
  return response.archive_path;
}

export async function getTelegramCapabilityCatalog(): Promise<TelegramCapabilityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<TelegramCapabilityCatalogResponse>("telegram_get_capability_catalog");
}

export async function exportTelegramCapabilityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("telegram_export_capability_catalog", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function onTelegramManifestChanged(
  handler: (event: TelegramManifestChangedEvent) => void
): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<TelegramManifestChangedEvent>("telegram:manifest_changed", (event) => handler(event.payload));
}

export async function queueTelegramMedia(
  id: string,
  options?: DownloadTaskCreateOptions
): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("telegram_download_media", {
    request: { id, create_options: toCreateDownloadOptions(options) }
  });
}

export async function queueTelegramMediaItems(
  ids: string[],
  outputDir?: string,
  options?: DownloadTaskCreateOptions
): Promise<TelegramMediaQueueManyResponse> {
  if (!isTauriRuntime()) {
    return { created: [], skipped: [] };
  }

  return invoke<TelegramMediaQueueManyResponse>("telegram_queue_media_items", {
    request: { ids, output_dir: outputDir || null, create_options: toCreateDownloadOptions(options) }
  });
}

export async function copyTelegramLocalMedia(ids: string[], outputDir: string): Promise<TelegramLocalMediaCopyResponse> {
  if (!isTauriRuntime()) {
    return { copied: [], skipped: [], output_dir: outputDir };
  }

  return invoke<TelegramLocalMediaCopyResponse>("telegram_copy_local_media", {
    request: { ids, output_dir: outputDir }
  });
}

export async function cloneTelegramChat(input: {
  chatId: string;
  outputDir?: string;
  mediaTypes: TelegramMediaItem["media_type"][];
  limit?: number;
  options?: DownloadTaskCreateOptions;
}): Promise<TelegramCloneWizardResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<TelegramCloneWizardResponse>("telegram_clone_wizard", {
    request: {
      chat_id: input.chatId,
      output_dir: input.outputDir || null,
      media_types: input.mediaTypes,
      limit: input.limit ?? null,
      create_options: toCreateDownloadOptions(input.options)
    }
  });
}

export async function openTelegramMedia(id: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  await invoke("telegram_open_media", { request: { id } });
  return true;
}

export async function revealTelegramMedia(id: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  await invoke("telegram_reveal_media", { request: { id } });
  return true;
}

export async function listCourses(): Promise<CourseEntry[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ courses: CourseEntry[] }>("courses_list");
  return response.courses;
}

export async function getCoursePlatformMatrix(): Promise<CoursePlatformMatrixEntry[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<CoursePlatformMatrixResponse>("courses_get_platform_matrix");
  return response.platforms;
}

export async function getCoursePlatformSamples(): Promise<CoursePlatformSample[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<CoursePlatformSampleResponse>("courses_get_platform_samples");
  return response.samples;
}

export async function exportCoursePlatformSamples(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("courses_export_platform_samples", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function exportCoursePlatformMatrix(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("courses_export_platform_matrix", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function probeCourse(sourceUrl: string, titleHint?: string, cookieBucketId?: string): Promise<CourseEntry | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseEntry>("courses_probe", {
    request: { source_url: sourceUrl, title_hint: titleHint, cookie_bucket_id: cookieBucketId || null }
  });
}

export async function importCourse(sourceUrl: string, titleHint?: string, cookieBucketId?: string): Promise<CourseEntry | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseEntry>("courses_import", {
    request: { source_url: sourceUrl, title_hint: titleHint, cookie_bucket_id: cookieBucketId || null }
  });
}

export async function importCourseManifest(manifestPath: string, cookieBucketId?: string): Promise<CourseEntry | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseEntry>("courses_import_manifest", {
    request: { manifest_path: manifestPath, cookie_bucket_id: cookieBucketId || null }
  });
}

export async function importCourseManifestBundle(manifestPath: string, cookieBucketId?: string): Promise<CourseManifestBundleImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseManifestBundleImportResponse>("courses_import_manifest_bundle", {
    request: { manifest_path: manifestPath, cookie_bucket_id: cookieBucketId || null }
  });
}

export async function exportCourseManifest(input: {
  outputPath?: string;
  courseIds?: string[];
} = {}): Promise<CourseManifestExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseManifestExportResponse>("courses_export_manifest", {
    request: {
      output_path: input.outputPath || null,
      course_ids: input.courseIds?.length ? input.courseIds : null
    }
  });
}

export async function exportCourseProgress(input: {
  outputPath?: string;
  courseIds?: string[];
} = {}): Promise<CourseProgressExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseProgressExportResponse>("courses_export_progress", {
    request: {
      output_path: input.outputPath || null,
      course_ids: input.courseIds?.length ? input.courseIds : null
    }
  });
}

export async function importCourseProgress(inputPath: string): Promise<CourseProgressImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseProgressImportResponse>("courses_import_progress", {
    request: { input_path: inputPath }
  });
}

export async function getCourseLocalSummary(): Promise<CourseLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseLocalSummaryResponse>("courses_get_local_summary");
}

export async function exportCourseLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("courses_export_local_summary", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function getCourseCapabilityCatalog(): Promise<CourseCapabilityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseCapabilityCatalogResponse>("courses_get_capability_catalog");
}

export async function exportCourseCapabilityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("courses_export_capability_catalog", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export async function deleteCourse(courseId: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("courses_delete", {
    request: { course_id: courseId }
  });
  return response.deleted;
}

export async function deleteCourses(courseIds: string[]): Promise<{
  deleted: string[];
  failed: { id: string; error: string }[];
}> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [] };
  }

  return invoke("courses_delete_many", {
    request: { course_ids: courseIds }
  });
}

export async function clearCourses(): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("courses_clear");
  return response.cleared;
}

export async function pruneMissingCourseLocalFiles(): Promise<CoursePruneMissingResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CoursePruneMissingResponse>("courses_prune_missing_local_files");
}

export async function deleteCourseLesson(courseId: string, lessonId: string): Promise<CourseItemDeleteResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseItemDeleteResponse>("courses_delete_lesson", {
    request: { course_id: courseId, lesson_id: lessonId }
  });
}

export async function deleteCourseLessons(groups: Array<{ courseId: string; lessonIds: string[] }>): Promise<CourseItemBulkDeleteResponse> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [], courses: [] };
  }

  return invoke<CourseItemBulkDeleteResponse>("courses_delete_lessons", {
    request: {
      courses: groups.map((group) => ({
        course_id: group.courseId,
        lesson_ids: group.lessonIds
      }))
    }
  });
}

export async function deleteCourseAttachment(courseId: string, attachmentId: string): Promise<CourseItemDeleteResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseItemDeleteResponse>("courses_delete_attachment", {
    request: { course_id: courseId, attachment_id: attachmentId }
  });
}

export async function deleteCourseAttachments(groups: Array<{ courseId: string; attachmentIds: string[] }>): Promise<CourseItemBulkDeleteResponse> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [], courses: [] };
  }

  return invoke<CourseItemBulkDeleteResponse>("courses_delete_attachments", {
    request: {
      courses: groups.map((group) => ({
        course_id: group.courseId,
        attachment_ids: group.attachmentIds
      }))
    }
  });
}

export async function updateCourseCookieBucket(courseId: string, cookieBucketId?: string): Promise<CourseEntry | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseEntry>("courses_update_cookie_bucket", {
    request: {
      course_id: courseId,
      cookie_bucket_id: cookieBucketId || null
    }
  });
}

export async function updateCourseLessonProgress(
  courseId: string,
  lessonId: string,
  progressPercent: number
): Promise<CourseEntry | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseEntry>("courses_update_progress", {
    request: {
      course_id: courseId,
      lesson_id: lessonId,
      progress_percent: progressPercent
    }
  });
}

export async function openCourseLesson(courseId: string, lessonId: string): Promise<CourseEntry | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseEntry>("courses_open_lesson", {
    request: {
      course_id: courseId,
      lesson_id: lessonId
    }
  });
}

export async function queueCourseLesson(
  courseId: string,
  lessonId: string,
  outputDir?: string,
  cookieBucketId?: string,
  options?: DownloadTaskCreateOptions
): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("courses_queue_lesson", {
    request: {
      course_id: courseId,
      lesson_id: lessonId,
      output_dir: outputDir || null,
      cookie_bucket_id: cookieBucketId || null,
      create_options: toCreateDownloadOptions(options)
    }
  });
}

export async function queueAllCourseLessons(
  courseId: string,
  outputDir?: string,
  limit?: number,
  cookieBucketId?: string,
  options?: DownloadTaskCreateOptions
): Promise<CourseLessonQueueAllResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseLessonQueueAllResponse>("courses_queue_all_lessons", {
    request: {
      course_id: courseId,
      output_dir: outputDir || null,
      limit: limit ?? null,
      cookie_bucket_id: cookieBucketId || null,
      create_options: toCreateDownloadOptions(options)
    }
  });
}

export async function queueManyCourseLessons(
  groups: Array<{ courseId: string; lessonIds: string[]; outputDir?: string; cookieBucketId?: string; options?: DownloadTaskCreateOptions }>
): Promise<CourseLessonQueueManyResponse> {
  if (!isTauriRuntime()) {
    return { created: [], skipped: [], failed: [] };
  }

  return invoke<CourseLessonQueueManyResponse>("courses_queue_many_lessons", {
    request: {
      courses: groups.map((group) => ({
        course_id: group.courseId,
        lesson_ids: group.lessonIds,
        output_dir: group.outputDir || null,
        cookie_bucket_id: group.cookieBucketId || null,
        create_options: toCreateDownloadOptions(group.options)
      }))
    }
  });
}

export async function queueCourseAttachment(
  courseId: string,
  attachmentId: string,
  outputDir?: string,
  cookieBucketId?: string,
  options?: DownloadTaskCreateOptions
): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("courses_queue_attachment", {
    request: {
      course_id: courseId,
      attachment_id: attachmentId,
      output_dir: outputDir || null,
      cookie_bucket_id: cookieBucketId || null,
      create_options: toCreateDownloadOptions(options)
    }
  });
}

export async function queueManyCourseAttachments(
  groups: Array<{ courseId: string; attachmentIds: string[]; outputDir?: string; cookieBucketId?: string; options?: DownloadTaskCreateOptions }>
): Promise<CourseAttachmentQueueManyResponse> {
  if (!isTauriRuntime()) {
    return { created: [], skipped: [], failed: [] };
  }

  return invoke<CourseAttachmentQueueManyResponse>("courses_queue_many_attachments", {
    request: {
      courses: groups.map((group) => ({
        course_id: group.courseId,
        attachment_ids: group.attachmentIds,
        output_dir: group.outputDir || null,
        cookie_bucket_id: group.cookieBucketId || null,
        create_options: toCreateDownloadOptions(group.options)
      }))
    }
  });
}

export async function queueAllCourseAttachments(
  courseId: string,
  outputDir?: string,
  limit?: number,
  cookieBucketId?: string,
  options?: DownloadTaskCreateOptions
): Promise<CourseAttachmentQueueAllResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CourseAttachmentQueueAllResponse>("courses_queue_all_attachments", {
    request: {
      course_id: courseId,
      output_dir: outputDir || null,
      limit: limit ?? null,
      cookie_bucket_id: cookieBucketId || null,
      create_options: toCreateDownloadOptions(options)
    }
  });
}

export async function saveCourseLessonNote(input: CourseLessonNoteSaveInput): Promise<LearningNote | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LearningNote>("courses_save_lesson_note", {
    request: {
      course_id: input.courseId,
      lesson_id: input.lessonId,
      title: input.title,
      body: input.body,
      timestamp_seconds: input.timestampSeconds ?? null
    }
  });
}

export async function listLearningNotes(query = ""): Promise<LearningNote[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ notes: LearningNote[] }>("learning_notes_list", {
    request: { query: query || null }
  });
  return response.notes;
}

export async function saveLearningNote(input: LearningNoteSaveInput): Promise<LearningNote | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LearningNote>("learning_notes_save", {
    request: {
      id: input.id || null,
      title: input.title,
      body: input.body,
      source_url: input.sourceUrl || null,
      timestamp_seconds: input.timestampSeconds ?? null,
      tags: input.tags ?? []
    }
  });
}

export async function deleteLearningNote(id: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("learning_notes_delete", {
    request: { id }
  });
  return response.deleted;
}

export async function deleteLearningNotes(ids: string[]): Promise<{ deleted: string[]; failed: BulkDownloadFailure[] }> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [] };
  }

  return invoke<{ deleted: string[]; failed: BulkDownloadFailure[] }>("learning_notes_delete_many", {
    request: { ids }
  });
}

export async function clearLearningNotes(): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("learning_notes_clear");
  return response.cleared;
}

export async function listSpacedReviewCards(query = "", dueOnly = false): Promise<SpacedReviewCard[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ cards: SpacedReviewCard[] }>("spaced_review_cards_list", {
    request: { query: query || null, due_only: dueOnly }
  });
  return response.cards;
}

export async function saveSpacedReviewCard(input: SpacedReviewCardSaveInput): Promise<SpacedReviewCard | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<SpacedReviewCard>("spaced_review_cards_save", {
    request: {
      id: input.id || null,
      note_id: input.noteId || null,
      prompt: input.prompt,
      answer: input.answer,
      tags: input.tags ?? [],
      source_url: input.sourceUrl || null,
      due_at: input.dueAt || null
    }
  });
}

export async function reviewSpacedReviewCard(id: string, rating: "again" | "hard" | "good" | "easy"): Promise<SpacedReviewCard | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<SpacedReviewCard>("spaced_review_cards_review", {
    request: { id, rating }
  });
}

export async function deleteSpacedReviewCard(id: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("spaced_review_cards_delete", {
    request: { id }
  });
  return response.deleted;
}

export async function deleteSpacedReviewCards(ids: string[]): Promise<{ deleted: string[]; failed: BulkDownloadFailure[] }> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [] };
  }

  return invoke<{ deleted: string[]; failed: BulkDownloadFailure[] }>("spaced_review_cards_delete_many", {
    request: { ids }
  });
}

export async function clearSpacedReviewCards(): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("spaced_review_cards_clear");
  return response.cleared;
}

export async function exportSpacedReviewCards(input: {
  outputPath?: string;
  ids?: string[];
} = {}): Promise<SpacedReviewCardsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<SpacedReviewCardsExportResponse>("spaced_review_cards_export", {
    request: {
      output_path: input.outputPath || null,
      ids: input.ids?.length ? input.ids : null
    }
  });
}

export async function importSpacedReviewCards(inputPath: string): Promise<SpacedReviewCardsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<SpacedReviewCardsImportResponse>("spaced_review_cards_import", {
    request: { input_path: inputPath }
  });
}

export async function exportLearningNotes(input: {
  outputPath?: string;
  ids?: string[];
} = {}): Promise<LearningNotesExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LearningNotesExportResponse>("learning_notes_export", {
    request: {
      output_path: input.outputPath || null,
      ids: input.ids?.length ? input.ids : null
    }
  });
}

export async function importLearningNotes(inputPath: string): Promise<LearningNotesImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LearningNotesImportResponse>("learning_notes_import", {
    request: { input_path: inputPath }
  });
}

export async function listPomodoroSessions(): Promise<PomodoroSession[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ sessions: PomodoroSession[] }>("pomodoro_sessions_list");
  return response.sessions;
}

export async function deletePomodoroSession(id: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("pomodoro_sessions_delete", {
    request: { id }
  });
  return response.deleted;
}

export async function deletePomodoroSessions(ids: string[]): Promise<{ deleted: string[]; failed: BulkDownloadFailure[] }> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [] };
  }

  return invoke<{ deleted: string[]; failed: BulkDownloadFailure[] }>("pomodoro_sessions_delete_many", {
    request: { ids }
  });
}

export async function clearPomodoroSessions(): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("pomodoro_sessions_clear");
  return response.cleared;
}

export async function exportPomodoroSessions(input: {
  outputPath?: string;
  ids?: string[];
} = {}): Promise<PomodoroSessionsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PomodoroSessionsExportResponse>("pomodoro_sessions_export", {
    request: {
      output_path: input.outputPath || null,
      ids: input.ids?.length ? input.ids : null
    }
  });
}

export async function importPomodoroSessions(inputPath: string): Promise<PomodoroSessionsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PomodoroSessionsImportResponse>("pomodoro_sessions_import", {
    request: { input_path: inputPath }
  });
}

export async function savePomodoroSession(input: PomodoroSessionSaveInput): Promise<PomodoroSession | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PomodoroSession>("pomodoro_sessions_save", {
    request: {
      label: input.label || null,
      duration_minutes: input.durationMinutes,
      break_minutes: input.breakMinutes ?? null,
      completed: input.completed,
      linked_source_url: input.linkedSourceUrl || null,
      notify_on_complete: input.notifyOnComplete ?? false
    }
  });
}

export async function getLearningDashboard(): Promise<LearningDashboard | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LearningDashboard>("learning_get_dashboard");
}

export async function updateLearningDailyGoal(focusMinutes: number): Promise<LearningDashboard | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LearningDashboard>("learning_update_daily_goal", {
    request: { focus_minutes: focusMinutes }
  });
}

export async function exportLearningDailyGoal(outputPath?: string | null): Promise<LearningDailyGoalExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LearningDailyGoalExportResponse>("learning_export_daily_goal", {
    request: { output_path: outputPath ?? null }
  });
}

export async function importLearningDailyGoal(inputPath: string): Promise<LearningDailyGoalImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LearningDailyGoalImportResponse>("learning_import_daily_goal", {
    request: { input_path: inputPath }
  });
}

export async function getLearningGraph(): Promise<LearningGraph | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LearningGraph>("learning_get_graph");
}

export async function getLearningLocalSummary(): Promise<LearningLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LearningLocalSummaryResponse>("learning_get_local_summary");
}

export async function exportLearningLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("learning_export_local_summary", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function exportLearningDashboard(input: { outputPath?: string } = {}): Promise<LearningDashboardExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LearningDashboardExportResponse>("learning_export_dashboard", {
    request: {
      output_path: input.outputPath || null
    }
  });
}

export async function exportLearningGraph(input: { outputPath?: string } = {}): Promise<LearningGraphExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LearningGraphExportResponse>("learning_export_graph", {
    request: {
      output_path: input.outputPath || null
    }
  });
}

export async function listPlugins(): Promise<PluginInfo[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ plugins: PluginInfo[] }>("plugins_list");
  return response.plugins;
}

export async function onPluginStatus(handler: (event: PluginInfo) => void): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<PluginInfo>("plugin:status", (event) => handler(event.payload));
}

export interface PluginsChangedEvent {
  reason: string;
  plugins: PluginInfo[];
  marketplace: PluginMarketplaceEntry[];
}

export async function onPluginsChanged(handler: (event: PluginsChangedEvent) => void): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<PluginsChangedEvent>("plugins:changed", (event) => handler(event.payload));
}

export async function listPluginMarketplace(): Promise<PluginMarketplaceEntry[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ entries: PluginMarketplaceEntry[] }>("plugins_list_marketplace");
  return response.entries;
}

export async function importPluginMarketplace(registryPath: string): Promise<PluginMarketplaceEntry[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ entries: PluginMarketplaceEntry[] }>("plugins_import_marketplace", {
    request: { registry_path: registryPath }
  });
  return response.entries;
}

export async function exportPluginMarketplace(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("plugins_export_marketplace", {
    request: { output_path: outputPath || null }
  });
  return response.archive_path;
}

export interface PluginRegistryEntry {
  state?: PluginInfo["state"] | null;
  installed_at?: string | null;
  updated_at?: string | null;
  last_error?: string | null;
}

export interface PluginRegistry {
  schema_version: number;
  states: Record<string, PluginRegistryEntry>;
}

export interface PluginRegistryExportResponse {
  output_path: string;
  exported_state_count: number;
}

export interface PluginRegistryImportResponse {
  imported_state_count: number;
  skipped_state_count: number;
  registry: PluginRegistry;
  plugins: PluginInfo[];
}

export interface PluginSettingsExportResponse {
  output_path: string;
  exported_settings_count: number;
  skipped_plugin_count: number;
}

export interface PluginSettingsImportResponse {
  imported_settings_count: number;
  skipped_settings_count: number;
  settings: PluginSettingsResponse[];
}

export async function exportPluginRegistry(outputPath?: string | null): Promise<PluginRegistryExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginRegistryExportResponse>("plugins_export_registry", {
    request: { output_path: outputPath || null }
  });
}

export async function importPluginRegistry(inputPath: string): Promise<PluginRegistryImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginRegistryImportResponse>("plugins_import_registry", {
    request: { input_path: inputPath }
  });
}

export async function exportPluginSettings(outputPath?: string | null, ids?: string[] | null): Promise<PluginSettingsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginSettingsExportResponse>("plugins_export_settings", {
    request: { output_path: outputPath || null, ids: ids && ids.length > 0 ? ids : null }
  });
}

export async function importPluginSettings(inputPath: string): Promise<PluginSettingsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginSettingsImportResponse>("plugins_import_settings", {
    request: { input_path: inputPath }
  });
}

export async function deletePluginMarketplaceEntry(id: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ deleted: boolean }>("plugins_delete_marketplace_entry", {
    request: { id }
  });
  return response.deleted;
}

export async function deletePluginMarketplaceEntries(ids: string[]): Promise<{
  deleted: string[];
  failed: { id: string; error: string }[];
}> {
  if (!isTauriRuntime()) {
    return { deleted: [], failed: [] };
  }

  return invoke("plugins_delete_marketplace_entries", {
    request: { ids }
  });
}

export async function clearPluginMarketplace(): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ cleared: number }>("plugins_clear_marketplace");
  return response.cleared;
}

export async function installPlugin(manifestPath: string): Promise<PluginInfo | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginInfo>("plugins_install", {
    request: { manifest_path: manifestPath }
  });
}

export async function installPluginFailureSample(): Promise<PluginInfo | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginInfo>("plugins_install_failure_sample");
}

export async function updatePluginFromMarketplace(id: string): Promise<PluginInfo | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginInfo>("plugins_update_from_marketplace", {
    request: { id }
  });
}

export async function updateAllPluginsFromMarketplace(): Promise<PluginBulkUpdateResponse> {
  if (!isTauriRuntime()) {
    return { checked: 0, updated: 0, plugins: [] };
  }

  return invoke<PluginBulkUpdateResponse>("plugins_update_all_from_marketplace");
}

export async function installMissingPluginsFromMarketplace(): Promise<PluginBulkInstallResponse> {
  if (!isTauriRuntime()) {
    return { checked: 0, installed: 0, plugins: [] };
  }

  return invoke<PluginBulkInstallResponse>("plugins_install_missing_from_marketplace");
}

export async function checkAllPluginHosts(): Promise<PluginBulkCheckResponse> {
  if (!isTauriRuntime()) {
    return { checked: 0, plugins: [] };
  }

  return invoke<PluginBulkCheckResponse>("plugins_check_all_hosts");
}

export async function enablePlugin(id: string): Promise<PluginInfo | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginInfo>("plugins_enable", { request: { id } });
}

export async function disablePlugin(id: string): Promise<PluginInfo | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginInfo>("plugins_disable", { request: { id } });
}

export async function setPluginsState(ids: string[], state: "enabled" | "disabled"): Promise<PluginBulkStateResponse> {
  if (!isTauriRuntime()) {
    return { plugins: [], failed: [] };
  }

  return invoke<PluginBulkStateResponse>("plugins_set_state_many", {
    request: { ids, state }
  });
}

export async function checkPluginHost(id: string): Promise<PluginInfo | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginInfo>("plugins_check_host", { request: { id } });
}

export async function uninstallPlugin(id: string, removeData = false): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ uninstalled: boolean }>("plugins_uninstall", {
    request: { id, remove_data: removeData }
  });
  return response.uninstalled;
}

export async function getPluginSettings(id: string): Promise<PluginSettingsResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginSettingsResponse>("plugins_get_settings", {
    request: { id }
  });
}

export async function updatePluginSettings(
  id: string,
  patch: Record<string, unknown>
): Promise<PluginSettingsResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginSettingsResponse>("plugins_update_settings", {
    request: { id, patch }
  });
}

export async function getPluginDataDir(id: string): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ data_dir: string }>("plugins_get_data_dir", {
    request: { id }
  });
  return response.data_dir;
}

export async function runPluginCommand(
  id: string,
  command: string,
  payload: Record<string, unknown> = {}
): Promise<PluginCommandResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginCommandResponse>("plugins_run_command", {
    request: { id, command, payload }
  });
}

export async function listPluginCommandLogs(
  id: string,
  limit = 20
): Promise<PluginCommandLogListResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginCommandLogListResponse>("plugins_list_command_logs", {
    request: { id, limit }
  });
}

export async function clearPluginCommandLogs(id: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ cleared: boolean }>("plugins_clear_command_logs", {
    request: { id }
  });
  return response.cleared;
}

export async function emitPluginEvent(
  id: string,
  event: string,
  payload: Record<string, unknown> = {}
): Promise<PluginEventEmitResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginEventEmitResponse>("plugins_emit_event", {
    request: { id, event, payload }
  });
}

export async function listPluginEvents(
  id: string,
  limit = 20
): Promise<PluginEventListResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginEventListResponse>("plugins_list_events", {
    request: { id, limit }
  });
}

export async function clearPluginEvents(id: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ cleared: boolean }>("plugins_clear_events", {
    request: { id }
  });
  return response.cleared;
}

export async function listPluginActivity(
  id: string,
  limit = 20
): Promise<PluginActivityLogListResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<PluginActivityLogListResponse>("plugins_list_activity", {
    request: { id, limit }
  });
}

export async function clearPluginActivity(id: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  const response = await invoke<{ cleared: boolean }>("plugins_clear_activity", {
    request: { id }
  });
  return response.cleared;
}

export async function clearPluginLogs(
  ids: string[],
  kind: "commands" | "events" | "activity"
): Promise<PluginLogBulkClearResponse> {
  if (!isTauriRuntime()) {
    return { cleared: [], failed: [] };
  }

  return invoke<PluginLogBulkClearResponse>("plugins_clear_logs_many", {
    request: { ids, kind }
  });
}

export interface ShellOpenRequest {
  source: "deep_link" | "global_shortcut";
  url: string | null;
  target?: {
    route: string;
    params: Record<string, string>;
  } | null;
  message: string;
}

export type DownloadKind =
  | "generic"
  | "video"
  | "playlist"
  | "audio"
  | "image"
  | "subtitles_only"
  | "torrent"
  | "p2p"
  | "pdf"
  | "book"
  | "webpage"
  | "course"
  | "telegram_media"
  | "course_lesson";

export interface DownloadTask {
  schema_version: 1;
  id: string;
  kind: DownloadKind;
  source_url: string;
  platform: string;
  title: string;
  status: "queued" | "active" | "paused" | "completed" | "failed" | "canceled" | "archived";
  position: number;
  output_dir?: string | null;
  output_path?: string | null;
  downloaded_bytes?: number | null;
  total_bytes?: number | null;
  speed_bytes_per_sec?: number | null;
  eta_seconds?: number | null;
  file_count?: number | null;
  last_error?: string | null;
  error_category?:
    | "network"
    | "rate_limited"
    | "auth_required"
    | "permission_denied"
    | "not_found"
    | "unsupported_url"
    | "path_invalid"
    | "dependency_missing"
    | "dependency_failed"
    | "internal"
    | null;
  retryable?: boolean | null;
  retry_count: number;
  run_after_active_slot?: boolean;
  user_agent?: string | null;
  referer?: string | null;
  proxy?: string | null;
  cookie_bucket_id?: string | null;
  auth_payload_ref?: string | null;
  rate_limit?: string | null;
  live_from_start?: boolean;
  concurrent_fragments?: number | null;
  custom_ytdlp_args?: string | null;
  start_seconds?: number | null;
  end_seconds?: number | null;
  quality?: string | null;
  audio_format?: string | null;
  thumbnail_url?: string | null;
  thumbnail_path?: string | null;
  subtitles?: SubtitleSettings | null;
  sponsorblock?: SponsorBlockSettings | null;
  metadata?: MetadataSettings | null;
  details_json?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  started_at?: string | null;
  finished_at?: string | null;
}

export interface DownloadProgressEvent {
  schema_version: 1;
  task_id: string;
  status: DownloadTask["status"];
  downloaded_bytes: number;
  total_bytes?: number | null;
  speed_bytes_per_sec?: number | null;
  eta_seconds?: number | null;
  file_count?: number | null;
  output_path?: string | null;
  message: string;
  updated_at: string;
}

export interface DownloadStateEvent {
  task_id: string;
  previous_status: DownloadTask["status"];
  status: DownloadTask["status"];
  task: DownloadTask;
}

export interface DownloadFileEvent {
  path: string;
  size_bytes?: number | null;
  role: "primary" | "subtitle" | "thumbnail" | "metadata" | "attachment" | "log" | "other" | string;
}

export interface DownloadCompletedEvent {
  task: DownloadTask;
  files: DownloadFileEvent[];
}

export interface DownloadFailureEvent {
  schema_version: 1;
  code: string;
  category:
    | "network"
    | "rate_limited"
    | "auth_required"
    | "permission_denied"
    | "not_found"
    | "unsupported_url"
    | "path_invalid"
    | "dependency_missing"
    | "dependency_failed"
    | "internal";
  message: string;
  retryable: boolean;
  user_action?: string | null;
}

export interface DownloadFailedEvent {
  task: DownloadTask;
  error: DownloadFailureEvent;
}

export interface DownloadsListChangedEvent {
  reason: string;
  tasks: DownloadTask[];
}

export interface BatchFailure {
  index: number;
  source_url?: string | null;
  error: string;
}

export interface CreateDownloadBatchResult {
  created: DownloadTask[];
  failed: BatchFailure[];
}

export type DownloadBulkAction = "start" | "pause" | "resume" | "retry" | "cancel" | "archive" | "restore" | "delete";

export interface BulkDownloadFailure {
  id: string;
  error: string;
}

export interface BulkDownloadActionResult {
  tasks: DownloadTask[];
  failed: BulkDownloadFailure[];
}

export interface DownloadTaskCreateOptions {
  kind?: DownloadKind;
  outputDir?: string;
  outputPath?: string;
  userAgent?: string;
  referer?: string;
  proxy?: string;
  cookieBucketId?: string;
  authPayloadRef?: string;
  rateLimit?: string;
  liveFromStart?: boolean;
  concurrentFragments?: number;
  customYtdlpArgs?: string;
  startSeconds?: number;
  endSeconds?: number;
  quality?: string;
  audioFormat?: string;
  thumbnailUrl?: string;
  expectedSha256?: string;
  subtitles?: SubtitleSettings;
  sponsorblock?: SponsorBlockSettings;
  metadata?: MetadataSettings;
  runAfterActiveSlot?: boolean;
}

export interface DownloadTaskCreateItem {
  sourceUrl: string;
  titleOverride?: string;
  options?: DownloadTaskCreateOptions;
}

function toCreateDownloadRequest(
  sourceUrl: string | null,
  options?: DownloadTaskCreateOptions,
  titleOverride?: string
) {
  return {
    source_url: sourceUrl,
    kind: options?.kind,
    output_dir: options?.outputDir,
    output_path: options?.outputPath,
    title_override: titleOverride,
    user_agent: options?.userAgent,
    referer: options?.referer,
    proxy: options?.proxy,
    cookie_bucket_id: options?.cookieBucketId,
    auth_payload_ref: options?.authPayloadRef,
    rate_limit: options?.rateLimit,
    live_from_start: options?.liveFromStart,
    concurrent_fragments: options?.concurrentFragments,
    custom_ytdlp_args: options?.customYtdlpArgs,
    start_seconds: options?.startSeconds,
    end_seconds: options?.endSeconds,
    quality: options?.quality,
    audio_format: options?.audioFormat,
    thumbnail_url: options?.thumbnailUrl,
    expected_sha256: options?.expectedSha256,
    subtitles: options?.subtitles,
    sponsorblock: options?.sponsorblock,
    metadata: options?.metadata,
    run_after_active_slot: options?.runAfterActiveSlot
  };
}

function toCreateDownloadOptions(options?: DownloadTaskCreateOptions) {
  if (!options) {
    return undefined;
  }
  const { source_url: _sourceUrl, title_override: _titleOverride, kind: _kind, ...request } =
    toCreateDownloadRequest(null, options);
  return request;
}

export async function getDownloadsSettings(): Promise<DownloadsSettings | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsSettings>("downloads_get_settings");
}

export async function updateDownloadsSettings(
  patchOrMaxConcurrency: DownloadsSettingsPatch | number
): Promise<DownloadsSettings | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const request =
    typeof patchOrMaxConcurrency === "number"
      ? { max_concurrency: patchOrMaxConcurrency }
      : { patch: patchOrMaxConcurrency };

  return invoke<DownloadsSettings>("downloads_update_settings", {
    request
  });
}

export async function exportDownloadsSettings(outputPath?: string | null): Promise<DownloadsSettingsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsSettingsExportResponse>("downloads_export_settings", {
    request: { output_path: outputPath || null }
  });
}

export async function importDownloadsSettings(inputPath: string): Promise<DownloadsSettingsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsSettingsImportResponse>("downloads_import_settings", {
    request: { input_path: inputPath }
  });
}

export async function exportNetworkSettings(outputPath?: string | null): Promise<NetworkSettingsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<NetworkSettingsExportResponse>("network_export_settings", {
    request: { output_path: outputPath || null }
  });
}

export async function importNetworkSettings(inputPath: string): Promise<NetworkSettingsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<NetworkSettingsImportResponse>("network_import_settings", {
    request: { input_path: inputPath }
  });
}

export async function exportDownloadFilterPresets(
  presets: DownloadFilterPresetBackupItem[],
  outputPath?: string | null,
  selectedPresetId?: string | null
): Promise<DownloadFilterPresetsExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadFilterPresetsExportResponse>("downloads_export_filter_presets", {
    request: {
      output_path: outputPath || null,
      selected_preset_id: selectedPresetId || null,
      presets
    }
  });
}

export async function importDownloadFilterPresets(inputPath: string): Promise<DownloadFilterPresetsImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadFilterPresetsImportResponse>("downloads_import_filter_presets", {
    request: { input_path: inputPath }
  });
}

export async function getDownloadsLocalSummary(): Promise<DownloadsLocalSummaryResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsLocalSummaryResponse>("downloads_get_local_summary");
}

export async function exportDownloadsLocalSummary(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_local_summary", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsKindCatalog(): Promise<DownloadsKindCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsKindCatalogResponse>("downloads_get_kind_catalog");
}

export async function exportDownloadsKindCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_kind_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsOptionCatalog(): Promise<DownloadsOptionCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsOptionCatalogResponse>("downloads_get_option_catalog");
}

export async function exportDownloadsOptionCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_option_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsStatusCatalog(): Promise<DownloadsStatusCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsStatusCatalogResponse>("downloads_get_status_catalog");
}

export async function exportDownloadsStatusCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_status_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsErrorCatalog(): Promise<DownloadsErrorCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsErrorCatalogResponse>("downloads_get_error_catalog");
}

export async function exportDownloadsErrorCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_error_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsIntegrityCatalog(): Promise<DownloadsIntegrityCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsIntegrityCatalogResponse>("downloads_get_integrity_catalog");
}

export async function exportDownloadsIntegrityCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_integrity_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsCleanupCatalog(): Promise<DownloadsCleanupCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsCleanupCatalogResponse>("downloads_get_cleanup_catalog");
}

export async function exportDownloadsCleanupCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_cleanup_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsLogCatalog(): Promise<DownloadsLogCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsLogCatalogResponse>("downloads_get_log_catalog");
}

export async function exportDownloadsLogCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_log_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsEventCatalog(): Promise<DownloadsEventCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsEventCatalogResponse>("downloads_get_event_catalog");
}

export async function exportDownloadsEventCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_event_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsQueueCatalog(): Promise<DownloadsQueueCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsQueueCatalogResponse>("downloads_get_queue_catalog");
}

export async function exportDownloadsQueueCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_queue_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsRetryCatalog(): Promise<DownloadsRetryCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsRetryCatalogResponse>("downloads_get_retry_catalog");
}

export async function exportDownloadsRetryCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_retry_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsSourceCatalog(): Promise<DownloadsSourceCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsSourceCatalogResponse>("downloads_get_source_catalog");
}

export async function exportDownloadsSourceCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_source_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsOutputCatalog(): Promise<DownloadsOutputCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsOutputCatalogResponse>("downloads_get_output_catalog");
}

export async function exportDownloadsOutputCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_output_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsArtifactCatalog(): Promise<DownloadsArtifactCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsArtifactCatalogResponse>("downloads_get_artifact_catalog");
}

export async function exportDownloadsArtifactCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_artifact_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsHistoryCatalog(): Promise<DownloadsHistoryCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsHistoryCatalogResponse>("downloads_get_history_catalog");
}

export async function exportDownloadsHistoryCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_history_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsPrivacyCatalog(): Promise<DownloadsPrivacyCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsPrivacyCatalogResponse>("downloads_get_privacy_catalog");
}

export async function exportDownloadsPrivacyCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_privacy_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsRuntimeCatalog(): Promise<DownloadsRuntimeCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsRuntimeCatalogResponse>("downloads_get_runtime_catalog");
}

export async function exportDownloadsRuntimeCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_runtime_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsInheritanceCatalog(): Promise<DownloadsInheritanceCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsInheritanceCatalogResponse>("downloads_get_inheritance_catalog");
}

export async function exportDownloadsInheritanceCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_inheritance_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function getDownloadsFilterCatalog(): Promise<DownloadsFilterCatalogResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsFilterCatalogResponse>("downloads_get_filter_catalog");
}

export async function exportDownloadsFilterCatalog(outputPath?: string | null): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  const response = await invoke<{ archive_path: string }>("downloads_export_filter_catalog", {
    request: { output_path: outputPath ?? null }
  });
  return response.archive_path;
}

export async function exportDownloadsTasks(
  outputPath?: string | null,
  includeArchived = true
): Promise<DownloadsTasksExportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsTasksExportResponse>("downloads_export_tasks", {
    request: { output_path: outputPath ?? null, include_archived: includeArchived }
  });
}

export async function importDownloadsTasks(inputPath: string): Promise<DownloadsTasksImportResponse | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadsTasksImportResponse>("downloads_import_tasks", {
    request: { input_path: inputPath }
  });
}
export async function createDownloadTask(
  sourceUrl: string,
  titleOverride?: string,
  options?: DownloadTaskCreateOptions
): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("downloads_create", {
    request: toCreateDownloadRequest(sourceUrl, options, titleOverride)
  });
}

export async function createDownloadTasks(
  sourceUrls: string[],
  options?: DownloadTaskCreateOptions
): Promise<CreateDownloadBatchResult | null> {
  return createDownloadTaskItems(sourceUrls.map((sourceUrl) => ({ sourceUrl, options })));
}

export async function createDownloadTaskItems(items: DownloadTaskCreateItem[]): Promise<CreateDownloadBatchResult | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<CreateDownloadBatchResult>("downloads_create_batch", {
    request: {
      items: items.map((item) => toCreateDownloadRequest(item.sourceUrl, item.options, item.titleOverride))
    }
  });
}

export async function listDownloadTasks(): Promise<DownloadTask[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ tasks: DownloadTask[] }>("downloads_list");
  return response.tasks;
}

export async function getDownloadTask(id: string): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("downloads_get", { request: { id } });
}

export async function cancelDownloadTask(id: string): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("downloads_cancel", { request: { id } });
}

export async function startDownloadTask(id: string): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("downloads_start", { request: { id } });
}

export async function pauseDownloadTask(id: string): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("downloads_pause", { request: { id } });
}

export async function resumeDownloadTask(id: string): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("downloads_resume", { request: { id } });
}

export async function retryDownloadTask(id: string): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("downloads_retry", { request: { id } });
}

export async function clearCompletedDownloads(archive?: boolean): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ affected: number }>("downloads_clear_completed", {
    request: { archive: typeof archive === "boolean" ? archive : null }
  });
  return response.affected;
}

export async function clearArchivedDownloads(): Promise<number> {
  if (!isTauriRuntime()) {
    return 0;
  }

  const response = await invoke<{ affected: number }>("downloads_clear_archived");
  return response.affected;
}

export async function archiveDownloadTask(id: string): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("downloads_archive", { request: { id } });
}

export async function restoreDownloadTask(id: string): Promise<DownloadTask | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<DownloadTask>("downloads_restore", { request: { id } });
}

export async function runDownloadBulkAction(action: DownloadBulkAction, ids: string[]): Promise<BulkDownloadActionResult | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<BulkDownloadActionResult>("downloads_bulk_action", {
    request: { action, ids }
  });
}

export async function deleteDownloadTask(id: string): Promise<boolean> {
  if (!isTauriRuntime()) {
    return false;
  }

  await invoke("downloads_delete", { request: { id } });
  return true;
}

export async function reorderDownloadTasks(orderedIds: string[]): Promise<DownloadTask[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await invoke<{ tasks: DownloadTask[] }>("downloads_reorder", {
    request: { ordered_ids: orderedIds }
  });
  return response.tasks;
}

export interface DownloadLogPage {
  lines: string[];
  entries: DownloadLogEntry[];
  cursor: number;
  next_cursor?: number | null;
  total_lines: number;
  matched_lines: number;
}

export interface DownloadLogEntry {
  line_number: number;
  level: "info" | "warning" | "error" | "issue" | string;
  source: string;
  message: string;
  is_issue: boolean;
  raw: string;
}

export async function getDownloadLogPage(
  id: string,
  options: { cursor?: number; limit?: number; search?: string } = {}
): Promise<DownloadLogPage> {
  if (!isTauriRuntime()) {
    return { lines: [], entries: [], cursor: 0, next_cursor: null, total_lines: 0, matched_lines: 0 };
  }

  return invoke<DownloadLogPage>("downloads_get_logs", {
    request: {
      id,
      cursor: options.cursor,
      limit: options.limit,
      search: options.search || null
    }
  });
}
export async function getDownloadLogs(id: string): Promise<string[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  const response = await getDownloadLogPage(id);
  return response.lines;
}

export async function onShellOpen(handler: (request: ShellOpenRequest) => void): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<ShellOpenRequest>("fetchdock://shell-open", (event) => handler(event.payload));
}

export async function onDownloadProgress(
  handler: (event: DownloadProgressEvent) => void
): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<DownloadProgressEvent>("download:progress", (event) => handler(event.payload));
}

export async function onDownloadCreated(handler: (task: DownloadTask) => void): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<DownloadTask>("download:created", (event) => handler(event.payload));
}

export async function onDownloadState(handler: (event: DownloadStateEvent) => void): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<DownloadStateEvent>("download:state", (event) => handler(event.payload));
}

export async function onDownloadCompleted(
  handler: (event: DownloadCompletedEvent) => void
): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<DownloadCompletedEvent>("download:completed", (event) => handler(event.payload));
}

export async function onDownloadFailed(
  handler: (event: DownloadFailedEvent) => void
): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<DownloadFailedEvent>("download:failed", (event) => handler(event.payload));
}

export async function onDownloadsListChanged(
  handler: (event: DownloadsListChangedEvent) => void
): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<DownloadsListChangedEvent>("downloads:list_changed", (event) => handler(event.payload));
}

export function isTauriRuntime(): boolean {
  return "__TAURI_INTERNALS__" in window;
}
