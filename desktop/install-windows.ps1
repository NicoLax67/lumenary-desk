$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
$electron = Join-Path $projectRoot "node_modules\electron\dist\electron.exe"
$mainScript = Join-Path $projectRoot "desktop\main.cjs"
$startMenu = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs"
$desktop = [Environment]::GetFolderPath("Desktop")
$shortcutTargets = @(
  (Join-Path $startMenu "Lumenary Desk Mail.lnk"),
  (Join-Path $desktop "Lumenary Desk Mail.lnk")
)

$shell = New-Object -ComObject WScript.Shell

if (-not (Test-Path -LiteralPath $electron -PathType Leaf)) {
  throw "electron.exe wurde nicht gefunden. Bitte zuerst npm install ausführen."
}

foreach ($shortcutPath in $shortcutTargets) {
  $shortcut = $shell.CreateShortcut($shortcutPath)
  $shortcut.TargetPath = $electron
  $shortcut.Arguments = "`"$mainScript`""
  $shortcut.WorkingDirectory = $projectRoot
  $shortcut.Description = "Lumenary Desk Mail Desktop-App"
  $shortcut.IconLocation = $electron
  $shortcut.Save()
}

Write-Output "Lumenary Desk Mail wurde installiert."
