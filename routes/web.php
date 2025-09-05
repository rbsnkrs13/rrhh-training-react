<?php

use App\Http\Controllers\EmpleadoController;
use App\Models\Empleado;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// Dashboard con datos reales
Route::get('/', function () {
    $empleados = Empleado::all();
    
    return Inertia::render('Dashboard', [
        'empleadosIniciales' => $empleados,
        'configuracion' => [
            'empresa' => 'Mi Empresa RRHH',
            'version' => '2.0.0'
        ]
    ]);
})->name('dashboard');

// CRUD completo de empleados
Route::resource('empleados', EmpleadoController::class);