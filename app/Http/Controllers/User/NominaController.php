<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Nomina;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NominaController extends Controller
{
    /**
     * Vista empleado: mis nóminas
     * Solo muestra nóminas con datos completos (salario_bruto y salario_neto)
     */
    public function index(Request $request)
    {
        $empleadoId = auth()->id();
        $año = $request->get('año', now()->year);

        // Obtener solo nóminas completas del empleado (con salarios procesados)
        $nominas = Nomina::deEmpleado($empleadoId)
            ->delAño($año)
            ->whereNotNull('salario_bruto')
            ->whereNotNull('salario_neto')
            ->orderBy('año', 'desc')
            ->orderBy('mes', 'desc')
            ->get();

        // Generar años disponibles
        $añosDisponibles = range(
            now()->subYears(3)->year,
            now()->year
        );

        // Estadísticas del año
        $estadisticas = [
            'total_nominas' => $nominas->count(),
            'nominas_descargadas' => $nominas->where('estado', 'vista')->count(),
            'pendientes_descarga' => $nominas->where('estado', '!=', 'vista')->count(),
            'salario_bruto_total' => $nominas->sum('salario_bruto'),
            'salario_neto_total' => $nominas->sum('salario_neto'),
        ];

        return Inertia::render('Employee/Nominas/Index', [
            'nominas' => $nominas,
            'año' => $año,
            'añosDisponibles' => $añosDisponibles,
            'estadisticas' => $estadisticas,
        ]);
    }

    /**
     * Descargar nómina (empleado)
     */
    public function descargar(Nomina $nomina)
    {
        // Verificar que el empleado autenticado puede descargar esta nómina
        if ($nomina->empleado_id !== auth()->id()) {
            abort(403, 'No tienes permiso para descargar esta nómina.');
        }

        // Verificar que el archivo existe
        if (!Storage::disk('local')->exists($nomina->archivo_path)) {
            return back()->with('error', 'El archivo de nómina no se encuentra disponible.');
        }

        // Marcar como vista al descargar
        $nomina->marcarComoVista();

        // Generar URL temporal para descarga
        try {
            $url = $nomina->getUrlDescarga();
            return redirect($url);
        } catch (\Exception $e) {
            return back()->with('error', 'Error al generar la descarga. Contacta con administración.');
        }
    }
}
