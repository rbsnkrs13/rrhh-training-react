<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\EmpleadoController as AdminEmpleadoController;
use App\Http\Controllers\Admin\FichajeController as AdminFichajeController;
use App\Http\Controllers\Admin\FichajeDashboardController as AdminFichajeDashboardController;
use App\Http\Controllers\Admin\NominaController as AdminNominaController;
use App\Http\Controllers\Admin\NominaEjemploController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\FichajeController as UserFichajeController;
use App\Http\Controllers\User\NominaController as UserNominaController;
use Illuminate\Support\Facades\Route;

// ============================================
// RUTA RAÍZ - Redirección según tipo de usuario
// ============================================
Route::get('/', [AuthenticatedSessionController::class, 'redirectToDashboard'])->middleware(['auth']);

// ============================================
// RUTAS ADMIN - Solo accesibles por administradores
// ============================================
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {

    // Dashboard Admin
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Empleados CRUD
    Route::resource('empleados', AdminEmpleadoController::class);

    // Fichajes - Dashboard con todos los fichajes
    Route::get('/fichajes', [AdminFichajeDashboardController::class, 'index'])->name('fichajes.dashboard');

    // Fichajes - Vista individual empleado (la que ya existía)
    Route::get('/fichajes/empleado/{id}', [AdminFichajeController::class, 'index'])->name('fichajes.empleado');

    // Nóminas (gestión masiva admin)
    Route::get('/nominas', [AdminNominaController::class, 'index'])->name('nominas.index');
    Route::post('/nominas/subir', [AdminNominaController::class, 'subir'])->name('nominas.subir');
    Route::post('/nominas/subir-masivo', [AdminNominaController::class, 'subirMasivo'])->name('nominas.subir-masivo');
    Route::put('/nominas/{nomina}', [AdminNominaController::class, 'actualizar'])->name('nominas.actualizar');
    Route::delete('/nominas/{nomina}', [AdminNominaController::class, 'eliminar'])->name('nominas.eliminar');

    // Nóminas ejemplo (generación automática)
    Route::get('/nominas-ejemplo/descargar-todas', [NominaEjemploController::class, 'descargarTodas'])->name('nominas.ejemplo.descargar-todas');

    // Mensajes/Chat
    Route::get('/mensajes', function () {
        return inertia('Admin/Mensajes');
    })->name('mensajes.index');
});

// ============================================
// RUTAS EMPLEADO - Dashboard personal
// ============================================
Route::middleware(['auth'])->group(function () {

    // Dashboard Empleado
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');

    // Fichajes empleado
    Route::get('/fichajes', [UserFichajeController::class, 'index'])->name('fichajes.index');
    Route::get('/fichajes/historial', [UserFichajeController::class, 'historial'])->name('fichajes.historial');
    Route::post('/fichajes/entrada', [UserFichajeController::class, 'ficharEntrada'])->name('fichajes.entrada');
    Route::post('/fichajes/salida', [UserFichajeController::class, 'ficharSalida'])->name('fichajes.salida');

    // Nóminas empleado
    Route::get('/mis-nominas', [UserNominaController::class, 'index'])->name('user.nominas.index');
    Route::post('/mis-nominas/verificar-password', [UserNominaController::class, 'verificarPassword'])->name('user.nominas.verificar-password');
    Route::get('/mis-nominas/{nomina}/descargar', [UserNominaController::class, 'descargar'])->name('user.nominas.descargar');
});

require __DIR__.'/auth.php';
