# Script para convertir nóminas HTML a PDF usando Chrome
# Ejecutar desde la raíz del proyecto: powershell -ExecutionPolicy Bypass -File storage/nominas_ejemplo/generar_pdfs.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Generador de PDFs de Nóminas" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Buscar Chrome en las ubicaciones comunes
$chromePaths = @(
    "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "${env:LOCALAPPDATA}\Google\Chrome\Application\chrome.exe"
)

$chromePath = $null
foreach ($path in $chromePaths) {
    if (Test-Path $path) {
        $chromePath = $path
        break
    }
}

if (-not $chromePath) {
    Write-Host "ERROR: No se encontró Google Chrome instalado." -ForegroundColor Red
    Write-Host "Por favor, instala Chrome o edita el script para usar otro navegador." -ForegroundColor Yellow
    exit 1
}

Write-Host "Chrome encontrado en: $chromePath" -ForegroundColor Green
Write-Host ""

# Obtener año y mes actual
$currentYear = (Get-Date).Year
$currentMonth = (Get-Date).Month
$currentMonthPadded = $currentMonth.ToString("00")
$periodoActual = "$currentYear$currentMonthPadded"

Write-Host "Período detectado: $(Get-Date -Format 'MMMM yyyy') ($periodoActual)" -ForegroundColor Yellow
Write-Host ""

# Directorios
$projectRoot = (Get-Location).Path
$htmlDir = Join-Path $projectRoot "storage\nominas_ejemplo\htmls"
$pdfDir = Join-Path $projectRoot "storage\nominas_ejemplo\pdfs"

# Crear carpeta de PDFs si no existe
if (-not (Test-Path $pdfDir)) {
    New-Item -ItemType Directory -Path $pdfDir | Out-Null
}

# Obtener todos los archivos HTML
$htmlFiles = Get-ChildItem -Path $htmlDir -Filter "*.html" | Sort-Object Name

if ($htmlFiles.Count -eq 0) {
    Write-Host "ERROR: No se encontraron archivos HTML en $htmlDir" -ForegroundColor Red
    exit 1
}

Write-Host "Encontrados $($htmlFiles.Count) archivos HTML para convertir" -ForegroundColor Cyan
Write-Host ""

$converted = 0
foreach ($htmlFile in $htmlFiles) {
    # Generar nombre del PDF según el formato esperado con período actual
    # De: 1_12345678A_AdminRRHH_202501.html
    # A:  12345678A_AdminRRHH_202510.pdf (con año/mes actual)

    # Extraer todo excepto el número inicial y reemplazar el período
    $baseName = $htmlFile.BaseName -replace '^\d+_', ''  # Quita "1_"
    $baseName = $baseName -replace '_\d{6}$', "_$periodoActual"  # Reemplaza "_202501" con período actual

    $pdfName = "$baseName.pdf"

    $htmlPath = $htmlFile.FullName
    $pdfPath = Join-Path $pdfDir $pdfName

    Write-Host "[$(($converted + 1))/$($htmlFiles.Count)] Convirtiendo: $($htmlFile.Name)" -ForegroundColor Yellow
    Write-Host "    -> $pdfName" -ForegroundColor Gray

    # Convertir HTML a PDF usando Chrome headless
    $arguments = @(
        "--headless",
        "--disable-gpu",
        "--print-to-pdf=`"$pdfPath`"",
        "--no-margins",
        "`"$htmlPath`""
    )

    try {
        $process = Start-Process -FilePath $chromePath -ArgumentList $arguments -NoNewWindow -Wait -PassThru

        if ($process.ExitCode -eq 0 -and (Test-Path $pdfPath)) {
            $fileSize = [math]::Round((Get-Item $pdfPath).Length / 1KB, 2)
            Write-Host "    [OK] PDF generado correctamente ($fileSize KB)" -ForegroundColor Green
            $converted++
        } else {
            Write-Host "    [ERROR] Error al generar PDF" -ForegroundColor Red
        }
    } catch {
        Write-Host "    [ERROR] Error: $_" -ForegroundColor Red
    }

    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Resumen" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Archivos procesados: $($htmlFiles.Count)" -ForegroundColor White
Write-Host "PDFs generados: $converted" -ForegroundColor Green
Write-Host ""
Write-Host "Los PDFs están en: storage\nominas_ejemplo\pdfs\" -ForegroundColor Cyan
Write-Host ""
Write-Host "Siguiente paso:" -ForegroundColor Yellow
Write-Host "1. Inicia el servidor: composer run dev" -ForegroundColor White
Write-Host "2. Ve a: http://localhost:8000/admin/nominas" -ForegroundColor White
Write-Host "3. Arrastra los 7 PDFs desde storage\nominas_ejemplo\pdfs\" -ForegroundColor White
Write-Host "4. Haz clic en 'Subir'" -ForegroundColor White
Write-Host ""
