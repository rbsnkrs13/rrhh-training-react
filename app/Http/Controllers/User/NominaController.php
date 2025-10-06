<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Nomina;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
     * Verificar contraseña del empleado para habilitar descarga de nóminas
     */
    public function verificarPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        // Verificar que la contraseña coincide con la del usuario autenticado
        if (!Hash::check($request->password, auth()->user()->password)) {
            return response()->json([
                'success' => false,
                'message' => 'La contraseña es incorrecta.',
            ], 401);
        }

        // Guardar en sesión con timestamp
        session(['nominas_verificado' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Contraseña verificada correctamente.',
            'expira_en' => now()->addMinutes(2)->toIso8601String(),
        ]);
    }

    /**
     * Descargar nómina (empleado)
     * Requiere verificación de contraseña válida (máximo 2 minutos)
     */
    public function descargar(Nomina $nomina)
    {
        // Verificar que el empleado autenticado puede descargar esta nómina
        if ($nomina->empleado_id !== auth()->id()) {
            abort(403, 'No tienes permiso para descargar esta nómina.');
        }

        // Verificar que la contraseña fue verificada recientemente
        $verificado = session('nominas_verificado');
        if (!$verificado || now()->diffInMinutes($verificado) >= 2) {
            abort(403, 'Debes verificar tu contraseña para descargar nóminas.');
        }

        // Verificar que el archivo existe
        if (!Storage::disk('local')->exists($nomina->archivo_path)) {
            return back()->with('error', 'El archivo de nómina no se encuentra disponible.');
        }

        // Marcar como vista al descargar
        $nomina->marcarComoVista();

        // Descargar archivo directamente
        return Storage::disk('local')->download(
            $nomina->archivo_path,
            $nomina->archivo_nombre,
            ['Content-Type' => 'application/pdf']
        );
    }
}
