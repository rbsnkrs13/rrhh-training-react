<?php

use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\FichajeController;
use App\Http\Controllers\NominaController;
use App\Models\Empleado;
use App\Models\Fichaje;
use App\Models\Nomina;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

// Ruta raíz que redirije según el usuario
Route::get('/', function () {
    $user = Auth::user();

    // Si es admin, mostrar dashboard admin
    if ($user->email === 'admin@empresa.com') {
        $empleados = Empleado::all();

        return Inertia::render('Admin/Dashboard', [
            'empleadosIniciales' => $empleados,
            'configuracion' => [
                'empresa' => 'RRHH',
                'version' => '2.0.0'
            ]
        ]);
    } else {
        // Si es empleado, redirigir a su dashboard
        return redirect()->route('empleado.dashboard');
    }
})->name('dashboard')->middleware(['auth']);

// Dashboard para empleados con datos reales
Route::get('/empleado/dashboard', function () {
    $user = Auth::user();

    // Obtener fichajes recientes del usuario y crear entradas/salidas separadas
    $fichajesDB = Fichaje::where('empleado_id', $user->id)
        ->orderBy('fecha', 'desc')
        ->limit(8)
        ->get();

    $fichajesRecientes = collect();

    foreach ($fichajesDB as $fichaje) {
        $fechaSolo = Carbon::parse($fichaje->fecha)->format('Y-m-d');

        // Agregar entrada (formato directo sin conversión)
        $fichajesRecientes->push([
            'id' => $fichaje->id . '_entrada',
            'tipo' => 'entrada',
            'fecha_hora' => $fechaSolo . ' ' . $fichaje->hora_entrada
        ]);

        // Agregar salida si existe (formato directo sin conversión)
        if ($fichaje->hora_salida) {
            $fichajesRecientes->push([
                'id' => $fichaje->id . '_salida',
                'tipo' => 'salida',
                'fecha_hora' => $fechaSolo . ' ' . $fichaje->hora_salida
            ]);
        }
    }

    // Ordenar por fecha más reciente y limitar a 10
    $fichajesRecientes = $fichajesRecientes
        ->sortByDesc('fecha_hora')
        ->take(10)
        ->values();

    // Obtener nóminas del usuario
    $nominasRecientes = Nomina::where('empleado_id', $user->id)
        ->orderBy('año', 'desc')
        ->orderBy('mes', 'desc')
        ->limit(5)
        ->get()
        ->map(function($nomina) {
            return [
                'id' => $nomina->id,
                'mes' => $nomina->mes,
                'año' => $nomina->año,
                'archivo' => $nomina->archivo_nombre
            ];
        });

    // Buscar información del empleado por email
    $empleadoInfo = Empleado::where('email', $user->email)->first();

    // Calcular estado de fichaje actual (fichaje de hoy)
    $fichajeHoy = Fichaje::where('empleado_id', $user->id)
        ->whereDate('fecha', Carbon::today())
        ->first();

    $estadoFichaje = [
        'fichado' => $fichajeHoy && !$fichajeHoy->hora_salida,
        'ultimaEntrada' => $fichajeHoy ? $fichajeHoy->hora_entrada : null,
        'horasHoy' => $fichajeHoy && $fichajeHoy->horas_trabajadas ? $fichajeHoy->horas_trabajadas : 0
    ];

    // Calcular horas de la semana actual (lunes a viernes)
    $inicioSemana = Carbon::now()->startOfWeek(Carbon::MONDAY);
    $finSemana = Carbon::now()->endOfWeek(Carbon::FRIDAY);

    $fichajesSemana = Fichaje::where('empleado_id', $user->id)
        ->whereBetween('fecha', [$inicioSemana, $finSemana])
        ->where('estado', 'completo') // Solo fichajes completos
        ->whereNotNull('hora_entrada')
        ->whereNotNull('hora_salida')
        ->get();

    $horasTrabajadas = 0;
    foreach ($fichajesSemana as $fichaje) {
        // Usar directamente las horas_trabajadas del seeder (ya calculadas)
        $horasTrabajadas += $fichaje->horas_trabajadas ?? 0;
    }

    // Obtener horas semanales del contrato del empleado
    $empleadoInfo = Empleado::where('email', $user->email)->first();
    $contrato = null;
    $horasObjetivo = 40; // Default
    if ($empleadoInfo) {
        $contrato = \App\Models\Contrato::where('empleado_id', $empleadoInfo->id)->first();
        $horasObjetivo = $contrato ? $contrato->horas_semanales : 40;
    }

    $horasSemana = [
        'trabajadas' => $horasTrabajadas,
        'objetivo' => $horasObjetivo
    ];

    return Inertia::render('Employee/EmpleadoDashboard', [
        'fichajesRecientes' => $fichajesRecientes,
        'nominasRecientes' => $nominasRecientes,
        'empleadoInfo' => $empleadoInfo,
        'estadoFichaje' => $estadoFichaje,
        'horasSemana' => $horasSemana
    ]);
})->name('empleado.dashboard')->middleware(['auth']);

// CRUD completo de empleados (solo admin)
Route::resource('empleados', EmpleadoController::class)->middleware(['auth']);

// Rutas de fichajes
Route::middleware('auth')->group(function () {
    // Admin: ver todos los fichajes
    Route::get('/fichajes', [FichajeController::class, 'index'])->name('fichajes.index');
    Route::get('/fichajes/historial', [FichajeController::class, 'historial'])->name('fichajes.historial');

    // Empleados: fichar entrada/salida
    Route::post('/fichajes/entrada', [FichajeController::class, 'ficharEntrada'])->name('fichajes.entrada');
    Route::post('/fichajes/salida', [FichajeController::class, 'ficharSalida'])->name('fichajes.salida');
});

// Rutas de nóminas
Route::middleware('auth')->group(function () {
    // Empleados: ver sus propias nóminas
    Route::get('/nominas', [NominaController::class, 'index'])->name('nominas.index');
    Route::get('/nominas/{nomina}/descargar', [NominaController::class, 'descargar'])->name('nominas.descargar');

    // Admin: gestionar nóminas
    Route::post('/nominas/subir', [NominaController::class, 'subir'])->name('nominas.subir');
    Route::post('/nominas/subir-masivo', [NominaController::class, 'subirMasivo'])->name('nominas.subir-masivo');
    Route::delete('/nominas/{nomina}', [NominaController::class, 'eliminar'])->name('nominas.eliminar');
});