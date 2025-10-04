<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Smalot\PdfParser\Parser;

echo "Test del Parser de PDF\n";
echo "=====================\n\n";

$pdfPath = storage_path('app/private/nominas/2025/10/nomina_1_2025_10.pdf');

if (!file_exists($pdfPath)) {
    echo "ERROR: No se encontró el PDF en: $pdfPath\n";
    echo "Verifica que hayas subido las nóminas primero.\n";
    exit(1);
}

echo "Parseando: $pdfPath\n\n";

try {
    $parser = new Parser();
    $pdf = $parser->parseFile($pdfPath);
    $texto = $pdf->getText();

    echo "TEXTO EXTRAÍDO:\n";
    echo "===============\n";
    echo $texto;
    echo "\n\n";

    echo "BÚSQUEDA DE PATRONES:\n";
    echo "====================\n";

    // Salario Bruto
    if (preg_match('/(?:Salario Bruto|Total Devengado|Bruto)[:\s]+([0-9.,]+)[\s€]?/i', $texto, $matches)) {
        echo "✓ Salario Bruto encontrado: {$matches[1]}\n";
    } else {
        echo "✗ Salario Bruto NO encontrado\n";
    }

    // Salario Neto
    if (preg_match('/(?:Líquido a percibir|Liquido a percibir|Total Neto|Neto)[:\s]+([0-9.,]+)[\s€]?/i', $texto, $matches)) {
        echo "✓ Salario Neto encontrado: {$matches[1]}\n";
    } else {
        echo "✗ Salario Neto NO encontrado\n";
    }

    // Seguridad Social
    if (preg_match('/(?:Seguridad Social|S\.Social|SS)[:\s]+([0-9.,]+)[\s€]?/i', $texto, $matches)) {
        echo "✓ Seguridad Social encontrada: {$matches[1]}\n";
    } else {
        echo "✗ Seguridad Social NO encontrada\n";
    }

    // IRPF
    if (preg_match('/(?:IRPF|I\.R\.P\.F\.)[:\s]+([0-9.,]+)[\s€]?/i', $texto, $matches)) {
        echo "✓ IRPF encontrado: {$matches[1]}\n";
    } else {
        echo "✗ IRPF NO encontrado\n";
    }

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
