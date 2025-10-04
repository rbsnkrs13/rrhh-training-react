<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Verificando DNIs en la base de datos:\n";
echo "======================================\n\n";

$users = DB::table('users')->select('id', 'name', 'email', 'dni')->get();

foreach ($users as $user) {
    $dni = $user->dni ?? 'NULL';
    echo "ID: {$user->id} - {$user->name} ({$user->email}) - DNI: {$dni}\n";
}

echo "\n";
