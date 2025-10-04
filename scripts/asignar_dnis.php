<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

// DNIs ficticios para asignar
$dnis = [
    '12345678A',
    '23456789B',
    '34567890C',
    '45678901D',
    '56789012E',
    '67890123F',
    '78901234G',
    '89012345H',
    '90123456I',
    '01234567J',
];

$usuarios = User::all();

echo "Asignando DNIs a usuarios:\n";
echo "==========================\n\n";

foreach ($usuarios as $index => $usuario) {
    if ($usuario->dni) {
        echo "✓ {$usuario->name} ya tiene DNI: {$usuario->dni}\n";
        continue;
    }

    $dni = $dnis[$index % count($dnis)];

    $usuario->update(['dni' => $dni]);

    echo "✓ Asignado DNI {$dni} a {$usuario->name} ({$usuario->email})\n";
}

echo "\n¡Completado!\n";
