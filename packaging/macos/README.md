# FetchDock macOS Packaging Notes

This is a packaging checklist, not a completed release artifact.

## Build

Run on macOS with the Tauri prerequisites installed:

```bash
npm install
npm run tauri -- build -- --bundles dmg
```

Expected bundle input already exists in `src-tauri/icons/icon.icns`.

## Release Gate

- Confirm the app starts from the mounted DMG.
- Confirm first-run text, app name, icon, and legal copy are FetchDock-owned.
- Confirm portable-mode markers are ignored on macOS unless explicitly supported.
- Run the final frontend/Rust verification gate on the release branch.
- Sign and notarize before distributing outside local development.

## Pending

- Apple Developer ID signing configuration.
- Notarization credentials and CI wiring.
- macOS-specific smoke test logs.
- Final DMG artifact naming and checksum generation.
