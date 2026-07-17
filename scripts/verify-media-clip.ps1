param(
  [string]$BuildToolsRoot = "E:\Software\VS_BuildTools",
  [string]$WindowsSdkRoot = "",
  [string]$FfmpegPath = ""
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

if ($FfmpegPath -eq "") {
  $resolvedFfmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if ($null -eq $resolvedFfmpeg) {
    throw "ffmpeg was not found on PATH. Pass -FfmpegPath to run the real media tools matrix."
  }
  $FfmpegPath = $resolvedFfmpeg.Source
}

if (-not (Test-Path -LiteralPath $FfmpegPath -PathType Leaf)) {
  throw "FFmpeg executable was not found at $FfmpegPath"
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
$testName = "tests::clips_real_media_with_ffmpeg_copy_and_reencode_matrix"
$escapedFfmpeg = $FfmpegPath.Replace('"', '\"')
$command = "$cmdPrefix && set `"FETCHDOCK_FFMPEG=$escapedFfmpeg`" && `"$cargo`" test --manifest-path src-tauri/Cargo.toml $testName -- --ignored --exact --nocapture"

cmd.exe /v:on /d /c $command
if ($LASTEXITCODE -ne 0) {
  throw "Command failed with exit code $LASTEXITCODE`: $command"
}
