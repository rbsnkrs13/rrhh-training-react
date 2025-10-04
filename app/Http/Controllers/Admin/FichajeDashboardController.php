<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\FichajeService;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FichajeDashboardController extends Controller
{
    protected $fichajeService;

    public function __construct(FichajeService $fichajeService)
    {
        $this->fichajeService = $fichajeService;
    }

    /**
     * Dashboard de fichajes para admin
     * Muestra todos los fichajes de todos los empleados con filtros
     */
    public function index(Request $request)
    {
        // Obtener filtros del request
        $empleadoId = $request->get('empleado_id');
        $fechaDesde = $request->get('fecha_desde');
        $fechaHasta = $request->get('fecha_hasta');
        $estado = $request->get('estado');

        // Si no hay filtros de fecha, usar últimos 7 días por defecto
        if (!$fechaDesde && !$fechaHasta) {
            $fechaHasta = now()->format('Y-m-d');
            $fechaDesde = now()->subDays(7)->format('Y-m-d');
        }

        // Obtener fichajes con filtros
        $fichajes = $this->fichajeService->getTodosFichajesConFiltros(
            $empleadoId ? (int)$empleadoId : null,
            $fechaDesde,
            $fechaHasta,
            $estado
        );

        // Calcular estadísticas del día actual
        $estadisticas = $this->fichajeService->calcularEstadisticasHoy();

        // Obtener todos los empleados para el filtro
        $empleados = User::orderBy('name')
            ->select('id', 'name')
            ->get();

        return Inertia::render('Admin/Fichajes/Dashboard', [
            'fichajes' => $fichajes,
            'estadisticas' => $estadisticas,
            'empleados' => $empleados,
            'filtros' => [
                'empleado_id' => $empleadoId,
                'fecha_desde' => $fechaDesde,
                'fecha_hasta' => $fechaHasta,
                'estado' => $estado,
            ]
        ]);
    }
}
