# Script para actualizar el período de las nóminas HTML al mes/año actual
# Ejecutar desde la raíz del proyecto: powershell -ExecutionPolicy Bypass -File storage/nominas_ejemplo/actualizar_periodo_htmls.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Actualizador de Período en HTMLs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Obtener año y mes actual en español
$currentYear = (Get-Date).Year
$currentMonth = (Get-Date).Month

$mesesEspanol = @{
    1 = "Enero"
    2 = "Febrero"
    3 = "Marzo"
    4 = "Abril"
    5 = "Mayo"
    6 = "Junio"
    7 = "Julio"
    8 = "Agosto"
    9 = "Septiembre"
    10 = "Octubre"
    11 = "Noviembre"
    12 = "Diciembre"
}

$mesNombre = $mesesEspanol[$currentMonth]
$fechaActual = Get-Date -Format "d 'de' MMMM 'de' yyyy" -Culture es-ES

Write-Host "Período actual: $mesNombre $currentYear" -ForegroundColor Yellow
Write-Host "Fecha de emisión: $fechaActual" -ForegroundColor Yellow
Write-Host ""

# Directorio de HTMLs
$htmlDir = "storage\nominas_ejemplo\htmls"

if (-not (Test-Path $htmlDir)) {
    Write-Host "ERROR: No se encontró el directorio $htmlDir" -ForegroundColor Red
    exit 1
}

# Obtener todos los archivos HTML
$htmlFiles = Get-ChildItem -Path $htmlDir -Filter "*.html"

if ($htmlFiles.Count -eq 0) {
    Write-Host "ERROR: No se encontraron archivos HTML en $htmlDir" -ForegroundColor Red
    exit 1
}

Write-Host "Actualizando $($htmlFiles.Count) archivos HTML..." -ForegroundColor Cyan
Write-Host ""

$updated = 0
foreach ($htmlFile in $htmlFiles | Sort-Object Name) {
    Write-Host "Procesando: $($htmlFile.Name)" -ForegroundColor Yellow

    # Leer contenido
    $content = Get-Content $htmlFile.FullName -Raw -Encoding UTF8

    # Reemplazar período
    $content = $content -replace 'Período: \w+ \d{4}', "Período: $mesNombre $currentYear"

    # Reemplazar fecha de emisión
    $content = $content -replace 'Fecha de emisión: \d+ de \w+ de \d{4}', "Fecha de emisión: $fechaActual"

    # Reemplazar fecha del footer
    $content = $content -replace 'Documento generado el \d+ de \w+ de \d{4}', "Documento generado el $fechaActual"

    # Reemplazar título
    $content = $content -replace '- Enero 2025', "- $mesNombre $currentYear"

    # Guardar cambios
    Set-Content -Path $htmlFile.FullName -Value $content -Encoding UTF8

    Write-Host "  [OK] Actualizado a $mesNombre $currentYear" -ForegroundColor Green
    $updated++
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Completado" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Archivos actualizados: $updated" -ForegroundColor Green
Write-Host ""
Write-Host "Siguiente paso: Genera los PDFs con el script generar_pdfs.ps1" -ForegroundColor Yellow
Write-Host ""
