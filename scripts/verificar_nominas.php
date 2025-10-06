<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Nomina;
use Illuminate\Support\Facades\Storage;

echo "Verificando nóminas:\n";
echo "===================\n\n";

$nominas = Nomina::all();

foreach ($nominas as $nomina) {
    echo "ID: {$nomina->id}\n";
    echo "Empleado: {$nomina->empleado_id}\n";
    echo "Ruta guardada: {$nomina->archivo_path}\n";

    $existe = Storage::disk('local')->exists($nomina->archivo_path);
    echo "¿Existe? " . ($existe ? "✓ SÍ" : "✗ NO") . "\n";

    if (!$existe) {
        // Buscar rutas alternativas
        $rutaAlternativa1 = str_replace('nominas/', 'private/nominas/', $nomina->archivo_path);
        if (Storage::disk('local')->exists($rutaAlternativa1)) {
            echo "  → Encontrado en: {$rutaAlternativa1}\n";
        }
    }

    echo "\n";
}
