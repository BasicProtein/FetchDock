param(
  [switch]$SkipTypecheck,
  [switch]$SkipRustFmt,
  [switch]$FixRustFmt,
  [switch]$Json
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$results = [System.Collections.Generic.List[object]]::new()

function Add-Result {
  param(
    [string]$Name,
    [string]$Status,
    [string]$Message
  )

  $results.Add([pscustomobject]@{
    name = $Name
    status = $Status
    message = $Message
  }) | Out-Null
}

function Invoke-Step {
  param(
    [string]$Name,
    [scriptblock]$Script
  )

  if (-not $Json) {
    Write-Output "==> $Name"
  }

  try {
    & $Script
    Add-Result -Name $Name -Status "pass" -Message "passed"
  } catch {
    Add-Result -Name $Name -Status "fail" -Message ($_.Exception.Message)
    throw
  }
}

function Invoke-NoMatchScan {
  param(
    [string]$Name,
    [string]$Pattern
  )

  $globs = @(
    "--glob", "!node_modules/**",
    "--glob", "!src-tauri/target/**",
    "--glob", "!src-tauri/gen/**",
    "--glob", "!build-tools/**",
    "--glob", "!build-logs/**",
    "--glob", "!dist/**",
    "--glob", "!dist-extension/**",
    "--glob", "!data/**",
    "--glob", "!.gstack/**",
    "--glob", "!scripts/verify-fast.ps1"
  )

  & rg -n $Pattern @globs "."
  if ($LASTEXITCODE -eq 0) {
    throw "$Name found matches."
  }
  if ($LASTEXITCODE -gt 1) {
    throw "$Name scan failed with exit code $LASTEXITCODE."
  }
}

Set-Location -LiteralPath $repoRoot

if (-not $SkipTypecheck) {
  Invoke-Step -Name "frontend typecheck" -Script {
    & npm run typecheck
    if ($LASTEXITCODE -ne 0) {
      throw "npm run typecheck failed with exit code $LASTEXITCODE."
    }
  }
} else {
  Add-Result -Name "frontend typecheck" -Status "skipped" -Message "Skipped by -SkipTypecheck."
}

if (-not $SkipRustFmt) {
  Invoke-Step -Name "rust fmt check" -Script {
    $cargo = Join-Path $env:USERPROFILE ".cargo\bin\cargo.exe"
    if (-not (Test-Path -LiteralPath $cargo -PathType Leaf)) {
      $cargoCommand = Get-Command cargo -ErrorAction SilentlyContinue
      if (-not $cargoCommand) {
        throw "cargo.exe was not found."
      }
      $cargo = $cargoCommand.Source
    }

    if ($FixRustFmt) {
      & $cargo fmt --manifest-path src-tauri\Cargo.toml
    } else {
      & $cargo fmt --manifest-path src-tauri\Cargo.toml -- --check
    }
    if ($LASTEXITCODE -ne 0) {
      throw "cargo fmt failed with exit code $LASTEXITCODE."
    }
  }
} else {
  Add-Result -Name "rust fmt check" -Status "skipped" -Message "Skipped by -SkipRustFmt."
}

Invoke-Step -Name "browser extension static verify" -Script {
  & npm run verify:browser-extension
  if ($LASTEXITCODE -ne 0) {
    throw "npm run verify:browser-extension failed with exit code $LASTEXITCODE."
  }
}

Invoke-Step -Name "release packaging static guard" -Script {
  & npm run verify:release-packaging
  if ($LASTEXITCODE -ne 0) {
    throw "npm run verify:release-packaging failed with exit code $LASTEXITCODE."
  }
}

Invoke-Step -Name "project boundary guard" -Script {
  & npm run verify:project-boundary
  if ($LASTEXITCODE -ne 0) {
    throw "npm run verify:project-boundary failed with exit code $LASTEXITCODE."
  }
}

Invoke-Step -Name "conflict marker scan" -Script {
  Invoke-NoMatchScan -Name "conflict marker scan" -Pattern "<<<<<<<|=======|>>>>>>>"
}

Invoke-Step -Name "literal newline escape scan" -Script {
  Invoke-NoMatchScan -Name "literal newline escape scan" -Pattern '`r`n'
}

$summary = [pscustomobject]@{
  ok = $true
  checked_at = (Get-Date).ToUniversalTime().ToString("o")
  source_root = $repoRoot.Path
  result_count = $results.Count
  results = $results
  note = "Fast implementation preflight only; it does not run frontend tests, Rust tests, clippy, Tauri build, package signing, installer smoke, or browser E2E."
}

if ($Json) {
  $summary | ConvertTo-Json -Depth 5
} else {
  Write-Output "Fast verification passed: $($results.Count) checks"
  Write-Output $summary.note
}
