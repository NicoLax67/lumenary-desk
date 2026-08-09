$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$installer = Join-Path $projectRoot "desktop\install-windows.ps1"

if (-not (Test-Path -LiteralPath $installer -PathType Leaf)) {
  throw "Installationsdatei wurde nicht gefunden: $installer"
}

powershell.exe -ExecutionPolicy Bypass -File $installer
