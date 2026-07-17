param(
  [string]$BuildToolsRoot = "E:\Software\VS_BuildTools",
  [string]$WindowsSdkRoot = ""
)

$ErrorActionPreference = "Stop"

$vcvars = Join-Path $BuildToolsRoot "Microsoft Visual Studio\18\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
if (-not (Test-Path -LiteralPath $vcvars)) {
  throw "vcvars64.bat was not found at $vcvars"
}

$cargo = Join-Path $env:USERPROFILE ".cargo\bin\cargo.exe"
if (-not (Test-Path -LiteralPath $cargo)) {
  throw "cargo.exe was not found at $cargo"
}

$sdkEnv = ""
if ($WindowsSdkRoot -ne "") {
  $sdkVersion = "10.0.26100.0"
  $sdkBin = Join-Path $WindowsSdkRoot "bin\$sdkVersion\x64"
  $sdkUmLib = Join-Path $WindowsSdkRoot "Lib\$sdkVersion\um\x64"
  $sdkUcrtLib = Join-Path $WindowsSdkRoot "Lib\$sdkVersion\ucrt\x64"
  $sdkUmInclude = Join-Path $WindowsSdkRoot "Include\$sdkVersion\um"
  $sdkUcrtInclude = Join-Path $WindowsSdkRoot "Include\$sdkVersion\ucrt"
  $sdkSharedInclude = Join-Path $WindowsSdkRoot "Include\$sdkVersion\shared"
  $sdkWinrtInclude = Join-Path $WindowsSdkRoot "Include\$sdkVersion\winrt"
  $sdkCppWinrtInclude = Join-Path $WindowsSdkRoot "Include\$sdkVersion\cppwinrt"

  foreach ($requiredPath in @($sdkBin, $sdkUmLib, $sdkUcrtLib, $sdkUmInclude, $sdkUcrtInclude, $sdkSharedInclude)) {
    if (-not (Test-Path -LiteralPath $requiredPath)) {
      throw "Windows SDK path is incomplete: $requiredPath"
    }
  }

  $sdkEnv = " && set `"WindowsSdkDir=$WindowsSdkRoot\`" && set `"WindowsSDKLibVersion=$sdkVersion\`" && set `"WindowsSDKVersion=$sdkVersion\`" && set `"PATH=$sdkBin;!PATH!`" && set `"LIB=$sdkUmLib;$sdkUcrtLib;!LIB!`" && set `"INCLUDE=$sdkUmInclude;$sdkUcrtInclude;$sdkSharedInclude;$sdkWinrtInclude;$sdkCppWinrtInclude;!INCLUDE!`""
}

$cmdPrefix = "call `"$vcvars`" >nul$sdkEnv"

function Invoke-CheckedCmd {
  param([string]$Command)

  cmd.exe /v:on /d /c $Command
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed with exit code $LASTEXITCODE`: $Command"
  }
}

function Invoke-CheckedPs {
  param([string]$Command)

  Invoke-Expression $Command
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed with exit code $LASTEXITCODE`: $Command"
  }
}

Invoke-CheckedPs "npm run typecheck"
Invoke-CheckedPs "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/verify-fast.ps1 -SkipTypecheck -SkipRustFmt"
Invoke-CheckedPs "npm test"
Invoke-CheckedPs "npm run build"
Invoke-CheckedPs "npm audit --omit=dev"

Invoke-CheckedCmd "$cmdPrefix && `"$cargo`" fmt --manifest-path src-tauri/Cargo.toml -- --check"
Invoke-CheckedCmd "$cmdPrefix && `"$cargo`" test --manifest-path src-tauri/Cargo.toml"
Invoke-CheckedCmd "$cmdPrefix && `"$cargo`" clippy --manifest-path src-tauri/Cargo.toml --all-targets --all-features -- -D warnings"
Invoke-CheckedCmd "$cmdPrefix && set `"PATH=$env:USERPROFILE\.cargo\bin;!PATH!`" && npm run tauri build -- --debug"
