<?php

namespace App\Http\Controllers;

use App\Models\Nomina;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NominaController extends Controller
{
    public function index(Request $request)
    {
        $empleadoId = auth()->id();
        $año = $request->get('año', now()->year);

        // Obtener nóminas del empleado para el año seleccionado
        $nominas = Nomina::deEmpleado($empleadoId)
            ->delAño($año)
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

        return Inertia::render('Nominas/Index', [
            'nominas' => $nominas,
            'año' => $año,
            'añosDisponibles' => $añosDisponibles,
            'estadisticas' => $estadisticas,
        ]);
    }

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

    public function eliminar(Nomina $nomina)
    {
        // Verificar permisos (temporal - cualquier usuario autenticado)
        // TODO: Implementar sistema de roles cuando esté disponible

        // Eliminar archivo del storage
        if (Storage::disk('local')->exists($nomina->archivo_path)) {
            Storage::disk('local')->delete($nomina->archivo_path);
        }

        // Eliminar registro de base de datos
        $nomina->delete();

        return back()->with('success', 'Nómina eliminada correctamente.');
    }

    // Método para administradores: subir múltiples nóminas
    public function subirMasivo(Request $request)
    {
        $request->validate([
            'año' => 'required|integer|min:2020|max:' . (now()->year + 1),
            'mes' => 'required|integer|min:1|max:12',
            'archivos' => 'required|array',
            'archivos.*' => 'file|mimes:pdf|max:10240',
            'empleados' => 'required|array',
            'empleados.*' => 'exists:users,id',
        ]);

        $archivos = $request->file('archivos');
        $empleados = $request->empleados;
        $exitosos = 0;
        $errores = [];

        foreach ($archivos as $index => $archivo) {
            if (!isset($empleados[$index])) {
                continue;
            }

            $empleadoId = $empleados[$index];

            // Verificar si ya existe
            $nominaExistente = Nomina::deEmpleado($empleadoId)
                ->delPeriodo($request->año, $request->mes)
                ->first();

            if ($nominaExistente) {
                $errores[] = "Empleado ID {$empleadoId}: Ya tiene nómina para este período";
                continue;
            }

            try {
                $nombreArchivo = "nomina_{$empleadoId}_{$request->año}_{$request->mes}.pdf";
                $rutaArchivo = "nominas/{$request->año}/{$request->mes}";
                $archivoPath = $archivo->storeAs($rutaArchivo, $nombreArchivo, 'local');

                Nomina::create([
                    'empleado_id' => $empleadoId,
                    'año' => $request->año,
                    'mes' => $request->mes,
                    'archivo_nombre' => $nombreArchivo,
                    'archivo_path' => $archivoPath,
                    'archivo_mime_type' => $archivo->getMimeType(),
                    'archivo_tamaño' => $archivo->getSize(),
                    'estado' => 'enviada',
                ]);

                $exitosos++;
            } catch (\Exception $e) {
                $errores[] = "Empleado ID {$empleadoId}: Error al subir archivo";
            }
        }

        $mensaje = "Subida masiva completada. {$exitosos} nóminas subidas correctamente.";
        if (!empty($errores)) {
            $mensaje .= " Errores: " . implode(', ', $errores);
        }

        return back()->with($exitosos > 0 ? 'success' : 'error', $mensaje);
    }
}