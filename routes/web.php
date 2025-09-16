<?php

use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\FichajeController;
use App\Http\Controllers\NominaController;
use App\Models\Empleado;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// Dashboard con datos reales
Route::get('/', function () {
    $empleados = Empleado::all();
    
    return Inertia::render('Dashboard', [
        'empleadosIniciales' => $empleados,
        'configuracion' => [
            'empresa' => 'RRHH',
            'version' => '2.0.0'
        ]
    ]);
})->name('dashboard')->middleware('auth');

// CRUD completo de empleados
Route::resource('empleados', EmpleadoController::class)->middleware('auth');

// Rutas de fichajes para empleados
Route::middleware('auth')->group(function () {
    Route::get('/fichajes', [FichajeController::class, 'index'])->name('fichajes.index');
    Route::post('/fichajes/entrada', [FichajeController::class, 'ficharEntrada'])->name('fichajes.entrada');
    Route::post('/fichajes/salida', [FichajeController::class, 'ficharSalida'])->name('fichajes.salida');
    Route::get('/fichajes/historial', [FichajeController::class, 'historial'])->name('fichajes.historial');
});

// Rutas de nóminas para empleados
Route::middleware('auth')->group(function () {
    Route::get('/nominas', [NominaController::class, 'index'])->name('nominas.index');
    Route::get('/nominas/{nomina}/descargar', [NominaController::class, 'descargar'])->name('nominas.descargar');
});

// Rutas de administración de nóminas (temporal sin middleware admin)
Route::middleware('auth')->group(function () {
    Route::post('/nominas/subir', [NominaController::class, 'subir'])->name('nominas.subir');
    Route::post('/nominas/subir-masivo', [NominaController::class, 'subirMasivo'])->name('nominas.subir-masivo');
    Route::delete('/nominas/{nomina}', [NominaController::class, 'eliminar'])->name('nominas.eliminar');
});