<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Nomina;
use App\Models\User;
use App\Services\Admin\NominaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NominaController extends Controller
{
    protected $nominaService;

    public function __construct(NominaService $nominaService)
    {
        $this->nominaService = $nominaService;
    }

    /**
     * Vista admin: gestión de todas las nóminas
     */
    public function index(Request $request)
    {
        $año = $request->get('año', now()->year);
        $mes = $request->get('mes');
        $empleadoId = $request->get('empleado_id');

        $query = Nomina::with('empleado')
            ->delAño($año)
            ->orderBy('año', 'desc')
            ->orderBy('mes', 'desc');

        if ($mes) {
            $query->where('mes', $mes);
        }

        if ($empleadoId) {
            $query->where('empleado_id', $empleadoId);
        }

        $nominas = $query->get();

        // Obtener todos los empleados para filtro
        $empleados = User::orderBy('name')->select('id', 'name', 'dni')->get();

        // Generar años disponibles
        $añosDisponibles = range(
            now()->subYears(3)->year,
            now()->year + 1
        );

        // Estadísticas del año
        $estadisticas = [
            'total_nominas' => $nominas->count(),
            'total_empleados' => $nominas->pluck('empleado_id')->unique()->count(),
            'salario_bruto_total' => $nominas->sum('salario_bruto'),
            'salario_neto_total' => $nominas->sum('salario_neto'),
        ];

        return Inertia::render('Admin/Nominas/Index', [
            'nominas' => $nominas,
            'empleados' => $empleados,
            'año' => $año,
            'mes' => $mes,
            'añosDisponibles' => $añosDisponibles,
            'estadisticas' => $estadisticas,
        ]);
    }

    /**
     * Subir nómina individual
     */
    public function subir(Request $request)
    {
        $request->validate([
            'empleado_id' => 'required|exists:users,id',
            'año' => 'required|integer|min:2020|max:' . (now()->year + 1),
            'mes' => 'required|integer|min:1|max:12',
            'archivo' => 'required|file|mimes:pdf|max:10240', // 10MB máximo
            'salario_bruto' => 'nullable|numeric|min:0',
            'salario_neto' => 'nullable|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
        ]);

        // Verificar si ya existe nómina para este período
        $nominaExistente = Nomina::deEmpleado($request->empleado_id)
            ->delPeriodo($request->año, $request->mes)
            ->first();

        if ($nominaExistente) {
            return back()->with('error', 'Ya existe una nómina para este empleado en el período seleccionado.');
        }

        $archivo = $request->file('archivo');
        $nombreArchivo = "nomina_{$request->empleado_id}_{$request->año}_{$request->mes}.pdf";
        $rutaArchivo = "nominas/{$request->año}/{$request->mes}";

        // Guardar archivo en storage privado
        $archivoPath = $archivo->storeAs($rutaArchivo, $nombreArchivo, 'local');

        // Crear registro en base de datos
        $nomina = Nomina::create([
            'empleado_id' => $request->empleado_id,
            'año' => $request->año,
            'mes' => $request->mes,
            'archivo_nombre' => $nombreArchivo,
            'archivo_path' => $archivoPath,
            'archivo_mime_type' => $archivo->getMimeType(),
            'archivo_tamaño' => $archivo->getSize(),
            'salario_bruto' => $request->salario_bruto,
            'salario_neto' => $request->salario_neto,
            'observaciones' => $request->observaciones,
            'estado' => 'enviada',
        ]);

        return back()->with('success', "Nómina subida correctamente para {$nomina->nombre_mes} {$request->año}");
    }

    /**
     * Subir múltiples nóminas (admin)
     * Usa NominaService para extraer DNI de archivos y procesar automáticamente
     */
    public function subirMasivo(Request $request)
    {
        $request->validate([
            'año' => 'required|integer|min:2020|max:' . (now()->year + 1),
            'mes' => 'required|integer|min:1|max:12',
            'archivos' => 'required|array',
            'archivos.*' => 'file|mimes:pdf|max:10240',
        ]);

        $archivos = $request->file('archivos');
        $resultados = $this->nominaService->procesarMultiplesNominas($archivos, $request->año, $request->mes);

        $mensaje = "Subida masiva completada. {$resultados['procesados']} de {$resultados['total']} nóminas subidas correctamente.";

        if (!empty($resultados['errores'])) {
            $erroresTexto = array_map(fn($e) => $e['error'], array_slice($resultados['errores'], 0, 5));
            $mensaje .= " Errores: " . implode(', ', $erroresTexto);

            if (count($resultados['errores']) > 5) {
                $mensaje .= " (y " . (count($resultados['errores']) - 5) . " más)";
            }
        }

        return back()->with($resultados['procesados'] > 0 ? 'success' : 'error', $mensaje);
    }

    /**
     * Actualizar datos de nómina manualmente (para nóminas pendientes_completar)
     */
    public function actualizar(Request $request, Nomina $nomina)
    {
        $request->validate([
            'salario_bruto' => 'nullable|numeric|min:0',
            'salario_neto' => 'nullable|numeric|min:0',
            'deducciones_ss' => 'nullable|numeric|min:0',
            'deducciones_irpf' => 'nullable|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
        ]);

        $nominaActualizada = $this->nominaService->actualizarDatosNomina($nomina, $request->all());

        return back()->with('success', 'Nómina actualizada correctamente.');
    }

    /**
     * Eliminar nómina (admin)
     */
    public function eliminar(Nomina $nomina)
    {
        // Eliminar archivo del storage
        if (Storage::disk('local')->exists($nomina->archivo_path)) {
            Storage::disk('local')->delete($nomina->archivo_path);
        }

        // Eliminar registro de base de datos
        $nomina->delete();

        return back()->with('success', 'Nómina eliminada correctamente.');
    }
}
