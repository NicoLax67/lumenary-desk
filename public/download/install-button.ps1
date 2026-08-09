$ErrorActionPreference = "Stop"

$installRoot = Join-Path $env:LOCALAPPDATA "LumenaryDeskMail"
$repoUrl = "https://github.com/NicoLax67/lumenary-desk.git"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git wurde nicht gefunden. Bitte installieren Sie Git for Windows und starten Sie diesen Installer erneut."
}

if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
  throw "Node.js/npm wurde nicht gefunden. Bitte installieren Sie Node.js und starten Sie diesen Installer erneut."
}

if (Test-Path -LiteralPath (Join-Path $installRoot ".git") -PathType Container) {
  git -C $installRoot pull --ff-only
} else {
  if (Test-Path -LiteralPath $installRoot) {
    throw "Installationsordner existiert bereits, ist aber kein Git-Repo: $installRoot"
  }
  git clone $repoUrl $installRoot
}

Push-Location $installRoot
try {
  npm.cmd install --ignore-scripts --no-audit --no-fund
  powershell.exe -ExecutionPolicy Bypass -File ".\install button.ps1"
} finally {
  Pop-Location
}

Write-Output "Lumenary Desk Mail wurde installiert. Sie finden 'start button' auf dem Desktop und im Startmenü."
