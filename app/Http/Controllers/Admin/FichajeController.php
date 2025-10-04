<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\FichajeService;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FichajeController extends Controller
{
    protected $fichajeService;

    public function __construct(FichajeService $fichajeService)
    {
        $this->fichajeService = $fichajeService;
    }

    /**
     * Vista admin: ver fichajes de todos los empleados
     */
    public function index(Request $request)
    {
        $fechaActual = now()->format('Y-m-d');
        $empleadoSeleccionado = $request->get('empleado_id');

        // Obtener todos los empleados para el selector
        $empleados = User::orderBy('name')->get();

        $fichajesHoy = [];
        $tieneEntradaAbierta = false;
        $fichajesDelMes = [];
        $estadisticas = [
            'total_dias_trabajados' => 0,
            'total_horas_mes' => 0,
            'promedio_horas_dia' => 0,
        ];

        if ($empleadoSeleccionado) {
            $fichajesHoy = $this->fichajeService->getFichajesHoy($empleadoSeleccionado);
            $tieneEntradaAbierta = $this->fichajeService->tieneEntradaAbierta($empleadoSeleccionado, $fechaActual);
            $fichajesDelMes = $this->fichajeService->getFichajesDelMes($empleadoSeleccionado);
            $estadisticas = $this->fichajeService->calcularEstadisticasMes($fichajesDelMes);
        }

        return Inertia::render('Admin/Fichajes/Index', [
            'fichajesHoy' => $fichajesHoy,
            'tieneEntradaAbierta' => $tieneEntradaAbierta,
            'fichajesDelMes' => $fichajesDelMes,
            'estadisticas' => $estadisticas,
            'fechaActual' => $fechaActual,
            'empleados' => $empleados,
            'empleadoSeleccionado' => $empleadoSeleccionado,
        ]);
    }
}
