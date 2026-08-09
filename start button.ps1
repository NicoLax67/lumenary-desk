$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$electron = Join-Path $projectRoot "node_modules\electron\dist\electron.exe"
$mainScript = Join-Path $projectRoot "desktop\main.cjs"

if (-not (Test-Path -LiteralPath $electron -PathType Leaf)) {
  throw "electron.exe wurde nicht gefunden. Bitte zuerst install button.ps1 ausführen."
}

Start-Process -FilePath $electron -ArgumentList "`"$mainScript`"" -WorkingDirectory $projectRoot -WindowStyle Hidden
