param(
  [Parameter(Mandatory = $true)]
  [string]$Project,
  [Parameter(Mandatory = $true)]
  [string]$Archive
)

$ErrorActionPreference = "Stop"

$projectPath = (Resolve-Path -LiteralPath $Project).Path
$distPath = Join-Path $projectPath "dist"
$hostingPath = Join-Path $projectPath ".openai\hosting.json"
$serverEntry = Join-Path $distPath "server\index.js"

if (-not (Test-Path -LiteralPath $serverEntry -PathType Leaf)) {
  throw "Missing dist/server/index.js"
}

if (-not (Test-Path -LiteralPath $hostingPath -PathType Leaf)) {
  throw "Missing .openai/hosting.json"
}

$stageRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("lumenary-site-" + [System.Guid]::NewGuid().ToString())
$stageDist = Join-Path $stageRoot "dist"
$stageOpenAI = Join-Path $stageDist ".openai"

New-Item -ItemType Directory -Path $stageOpenAI -Force | Out-Null
Copy-Item -Path (Join-Path $distPath "*") -Destination $stageDist -Recurse -Force
Copy-Item -LiteralPath $hostingPath -Destination (Join-Path $stageOpenAI "hosting.json") -Force

$drizzlePath = Join-Path $projectPath "drizzle"
if (Test-Path -LiteralPath $drizzlePath -PathType Container) {
  $stageDrizzle = Join-Path $stageOpenAI "drizzle"
  New-Item -ItemType Directory -Path $stageDrizzle -Force | Out-Null
  Copy-Item -Path (Join-Path $drizzlePath "*") -Destination $stageDrizzle -Recurse -Force
}

New-Item -ItemType Directory -Path (Split-Path -Parent $Archive) -Force | Out-Null
tar -C $stageRoot -czf $Archive dist

$entries = tar -tzf $Archive
if ($entries -notcontains "dist/server/index.js") {
  throw "Archive missing dist/server/index.js"
}

if ($entries -notcontains "dist/.openai/hosting.json") {
  throw "Archive missing dist/.openai/hosting.json"
}

Write-Output $Archive
