<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\EmpleadoController as AdminEmpleadoController;
use App\Http\Controllers\Admin\FichajeController as AdminFichajeController;
use App\Http\Controllers\Admin\FichajeDashboardController as AdminFichajeDashboardController;
use App\Http\Controllers\Admin\NominaController as AdminNominaController;
use App\Http\Controllers\User\FichajeController as UserFichajeController;
use App\Http\Controllers\User\NominaController as UserNominaController;
use App\Models\Empleado;
use App\Models\Fichaje;
use App\Models\Nomina;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

// ============================================
// RUTA RAÍZ - Redirección según tipo de usuario
// ============================================
Route::get('/', function () {
    if (auth()->user()->email === 'admin@empresa.com') {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('dashboard');
})->middleware(['auth']);

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
});

// ============================================
// RUTAS EMPLEADO - Dashboard personal
// ============================================
Route::middleware(['auth'])->group(function () {

    // Dashboard Empleado
    Route::get('/dashboard', function () {
        $user = Auth::user();

        // Obtener fichajes recientes agrupados por día (últimos 7 días)
        $fechasRecientes = Fichaje::where('empleado_id', $user->id)
            ->select('fecha')
            ->distinct()
            ->orderBy('fecha', 'desc')
            ->limit(7)
            ->pluck('fecha');

        $fichajesRecientes = $fechasRecientes->map(function($fecha) use ($user) {
            $horas = Fichaje::calcularHorasDia($user->id, $fecha);
            return [
                'fecha' => $fecha,
                'horas' => $horas,
                'completo' => $horas >= 8
            ];
        });

        // Obtener nóminas del usuario (solo las que tienen datos completos)
        $nominasRecientes = Nomina::where('empleado_id', $user->id)
            ->whereNotNull('salario_bruto')
            ->whereNotNull('salario_neto')
            ->orderBy('año', 'desc')
            ->orderBy('mes', 'desc')
            ->limit(5)
            ->get()
            ->map(function($nomina) {
                return [
                    'id' => $nomina->id,
                    'mes' => $nomina->nombre_mes,
                    'año' => $nomina->año,
                    'archivo' => $nomina->archivo_nombre,
                    'salario_bruto' => $nomina->salario_bruto,
                    'salario_neto' => $nomina->salario_neto,
                ];
            });

        // Buscar información del empleado por email
        $empleadoInfo = Empleado::where('email', $user->email)->first();

        // Calcular estado de fichaje actual (fichaje de hoy)
        $fechaHoy = Carbon::today()->format('Y-m-d');
        $fichajesHoy = Fichaje::where('empleado_id', $user->id)
            ->where('fecha', $fechaHoy)
            ->orderBy('hora')
            ->get();

        $tieneEntradaAbierta = Fichaje::tieneEntradaAbierta($user->id, $fechaHoy);
        $horasHoy = Fichaje::calcularHorasDia($user->id, $fechaHoy);
        $ultimaEntrada = $fichajesHoy->where('tipo', 'entrada')->last();

        $estadoFichaje = [
            'fichado' => $tieneEntradaAbierta,
            'ultimaEntrada' => $ultimaEntrada ? $ultimaEntrada->hora : null,
            'horasHoy' => $horasHoy
        ];

        // Calcular horas de la semana actual (lunes a viernes)
        $inicioSemana = Carbon::now()->startOfWeek(Carbon::MONDAY);
        $finSemana = Carbon::now()->endOfWeek(Carbon::FRIDAY);

        $fechasSemana = Fichaje::where('empleado_id', $user->id)
            ->whereBetween('fecha', [$inicioSemana, $finSemana])
            ->select('fecha')
            ->distinct()
            ->pluck('fecha');

        $horasTrabajadas = 0;
        foreach ($fechasSemana as $fecha) {
            $horasTrabajadas += Fichaje::calcularHorasDia($user->id, $fecha);
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
    })->name('dashboard');

    // Fichajes empleado
    Route::get('/fichajes', [UserFichajeController::class, 'index'])->name('fichajes.index');
    Route::get('/fichajes/historial', [UserFichajeController::class, 'historial'])->name('fichajes.historial');
    Route::post('/fichajes/entrada', [UserFichajeController::class, 'ficharEntrada'])->name('fichajes.entrada');
    Route::post('/fichajes/salida', [UserFichajeController::class, 'ficharSalida'])->name('fichajes.salida');

    // Nóminas empleado
    Route::get('/mis-nominas', [UserNominaController::class, 'index'])->name('user.nominas.index');
    Route::get('/mis-nominas/{nomina}/descargar', [UserNominaController::class, 'descargar'])->name('user.nominas.descargar');
});

require __DIR__.'/auth.php';
