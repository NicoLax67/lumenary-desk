$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
$npm = (Get-Command npm.cmd).Source
$startMenu = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs"
$desktop = [Environment]::GetFolderPath("Desktop")
$shortcutTargets = @(
  (Join-Path $startMenu "Lumenary Desk Mail.lnk"),
  (Join-Path $desktop "Lumenary Desk Mail.lnk")
)

$shell = New-Object -ComObject WScript.Shell

foreach ($shortcutPath in $shortcutTargets) {
  $shortcut = $shell.CreateShortcut($shortcutPath)
  $shortcut.TargetPath = $npm
  $shortcut.Arguments = "run desktop"
  $shortcut.WorkingDirectory = $projectRoot
  $shortcut.Description = "Lumenary Desk Mail Desktop-App"
  $shortcut.IconLocation = "$env:SystemRoot\System32\shell32.dll,220"
  $shortcut.Save()
}

Write-Output "Lumenary Desk Mail wurde installiert."
