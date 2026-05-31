Write-Host "Testing Real-Time Engine APIs" -ForegroundColor Green
Write-Host ""

$baseUrl = "http://localhost:3000"

Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
$health = curl -UseBasicParsing "$baseUrl/health" | Select-Object -ExpandProperty Content
Write-Host $health -ForegroundColor Cyan
Write-Host ""

Write-Host "2. Testing GET /api/rooms..." -ForegroundColor Yellow
$rooms = curl -UseBasicParsing "$baseUrl/api/rooms" | Select-Object -ExpandProperty Content
Write-Host $rooms -ForegroundColor Cyan
Write-Host ""

Write-Host "3. Testing GET /api/rooms?mode=solo..." -ForegroundColor Yellow
$soloRooms = curl -UseBasicParsing "$baseUrl/api/rooms?mode=solo" | Select-Object -ExpandProperty Content
Write-Host $soloRooms -ForegroundColor Cyan
Write-Host ""

Write-Host "All tests completed!" -ForegroundColor Green
