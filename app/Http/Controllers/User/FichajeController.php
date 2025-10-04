<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\FichajeService;
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
     * Vista empleado: ver solo sus propios fichajes
     */
    public function index()
    {
        $empleadoId = auth()->id();
        $fechaActual = now()->format('Y-m-d');

        $fichajesHoy = $this->fichajeService->getFichajesHoy($empleadoId);
        $tieneEntradaAbierta = $this->fichajeService->tieneEntradaAbierta($empleadoId, $fechaActual);
        $fichajesDelMes = $this->fichajeService->getFichajesDelMes($empleadoId);
        $estadisticas = $this->fichajeService->calcularEstadisticasMes($fichajesDelMes);

        return Inertia::render('Fichajes/Index', [
            'fichajesHoy' => $fichajesHoy,
            'tieneEntradaAbierta' => $tieneEntradaAbierta,
            'fichajesDelMes' => $fichajesDelMes,
            'estadisticas' => $estadisticas,
            'fechaActual' => $fechaActual,
        ]);
    }

    public function ficharEntrada()
    {
        $resultado = $this->fichajeService->ficharEntrada(auth()->id());

        return back()->with(
            $resultado['success'] ? 'success' : 'error',
            $resultado['message']
        );
    }

    public function ficharSalida()
    {
        $resultado = $this->fichajeService->ficharSalida(auth()->id());

        return back()->with(
            $resultado['success'] ? 'success' : 'error',
            $resultado['message']
        );
    }

    public function historial(Request $request)
    {
        $empleadoId = auth()->id();
        $año = $request->get('año', now()->year);
        $mes = $request->get('mes', now()->month);

        $fichajes = $this->fichajeService->getFichajesDelMes($empleadoId, $año, $mes);

        $añosDisponibles = range(
            now()->subYears(2)->year,
            now()->addYear()->year
        );

        return Inertia::render('Fichajes/Historial', [
            'fichajes' => $fichajes,
            'año' => $año,
            'mes' => $mes,
            'añosDisponibles' => $añosDisponibles,
        ]);
    }
}
