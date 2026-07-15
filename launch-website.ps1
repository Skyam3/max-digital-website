$ErrorActionPreference = "SilentlyContinue"

$port = 3003
$url = "http://localhost:$port"
$projectDir = "C:\Users\maxak\OneDrive\Desktop\MAX Digital Gpt"
$firefox = "C:\Program Files\Mozilla Firefox\firefox.exe"

function Test-ServerUp {
    try {
        $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
        return $resp.StatusCode -eq 200
    } catch {
        return $false
    }
}

if (-not (Test-ServerUp)) {
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -WorkingDirectory $projectDir -WindowStyle Hidden

    $tries = 0
    while (-not (Test-ServerUp) -and $tries -lt 30) {
        Start-Sleep -Seconds 1
        $tries++
    }
}

Start-Process -FilePath $firefox -ArgumentList $url
