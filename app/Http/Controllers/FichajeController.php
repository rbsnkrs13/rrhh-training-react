<?php

namespace App\Http\Controllers;

use App\Models\Fichaje;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class FichajeController extends Controller
{
    public function index(Request $request)
    {
        $fechaActual = now()->format('Y-m-d');
        $empleadoSeleccionado = $request->get('empleado_id');

        // Obtener todos los empleados para el selector
        $empleados = \App\Models\User::orderBy('name')->get();

        // Si hay empleado seleccionado, obtener sus datos
        $fichajeHoy = null;
        $fichajesDelMes = collect();
        $estadisticas = [
            'total_dias_trabajados' => 0,
            'total_horas_mes' => 0,
            'promedio_horas_dia' => 0,
            'dias_incompletos' => 0,
        ];

        if ($empleadoSeleccionado) {
            // Obtener fichaje de hoy del empleado seleccionado
            $fichajeHoy = Fichaje::deEmpleado($empleadoSeleccionado)
                ->where('fecha', $fechaActual)
                ->first();

            // Obtener fichajes del mes actual del empleado seleccionado
            $fichajesDelMes = Fichaje::deEmpleado($empleadoSeleccionado)
                ->delMesActual()
                ->orderBy('fecha', 'desc')
                ->get();

            // Calcular estadísticas del mes
            $estadisticas = [
                'total_dias_trabajados' => $fichajesDelMes->where('estado', 'completo')->count(),
                'total_horas_mes' => $fichajesDelMes->sum('horas_trabajadas'),
                'promedio_horas_dia' => $fichajesDelMes->where('estado', 'completo')->avg('horas_trabajadas') ?? 0,
                'dias_incompletos' => $fichajesDelMes->where('estado', 'incompleto')->count(),
            ];
        } else {
            // Si no hay empleado seleccionado, mostrar estadísticas generales
            $fichajesDelMes = Fichaje::delMesActual()->with('empleado')->orderBy('fecha', 'desc')->get();

            $estadisticas = [
                'total_dias_trabajados' => $fichajesDelMes->where('estado', 'completo')->count(),
                'total_horas_mes' => $fichajesDelMes->sum('horas_trabajadas'),
                'promedio_horas_dia' => $fichajesDelMes->where('estado', 'completo')->avg('horas_trabajadas') ?? 0,
                'dias_incompletos' => $fichajesDelMes->where('estado', 'incompleto')->count(),
                'total_empleados_con_fichajes' => $fichajesDelMes->pluck('empleado_id')->unique()->count(),
            ];
        }

        return Inertia::render('Fichajes/Index', [
            'fichajeHoy' => $fichajeHoy,
            'fichajesDelMes' => $fichajesDelMes,
            'estadisticas' => $estadisticas,
            'fechaActual' => $fechaActual,
            'empleados' => $empleados,
            'empleadoSeleccionado' => $empleadoSeleccionado,
        ]);
    }

    public function ficharEntrada(Request $request)
    {
        $empleadoId = auth()->id();
        $fechaActual = now()->format('Y-m-d');
        $horaActual = now()->format('H:i');

        // Verificar si ya tiene fichaje para hoy
        $fichaje = Fichaje::deEmpleado($empleadoId)
            ->where('fecha', $fechaActual)
            ->first();

        if ($fichaje && $fichaje->hora_entrada) {
            return back()->with('error', 'Ya has fichado la entrada para hoy.');
        }

        // Crear o actualizar fichaje
        $fichaje = Fichaje::updateOrCreate(
            [
                'empleado_id' => $empleadoId,
                'fecha' => $fechaActual
            ],
            [
                'hora_entrada' => $horaActual,
                'estado' => 'incompleto'
            ]
        );

        return back()->with('success', "Entrada fichada correctamente a las {$horaActual}");
    }

    public function ficharSalida(Request $request)
    {
        $empleadoId = auth()->id();
        $fechaActual = now()->format('Y-m-d');
        $horaActual = now()->format('H:i');

        // Buscar fichaje de hoy
        $fichaje = Fichaje::deEmpleado($empleadoId)
            ->where('fecha', $fechaActual)
            ->first();

        if (!$fichaje || !$fichaje->hora_entrada) {
            return back()->with('error', 'Debes fichar la entrada primero.');
        }

        if ($fichaje->hora_salida) {
            return back()->with('error', 'Ya has fichado la salida para hoy.');
        }

        // Actualizar con hora de salida
        $fichaje->update([
            'hora_salida' => $horaActual
        ]);

        // Calcular horas trabajadas automáticamente
        $fichaje->calcularHorasTrabajadas();
        $fichaje->save();

        return back()->with('success', "Salida fichada correctamente a las {$horaActual}. Horas trabajadas: {$fichaje->horas_trabajadas}");
    }

    public function historial(Request $request)
    {
        $empleadoId = auth()->id();
        $año = $request->get('año', now()->year);
        $mes = $request->get('mes', now()->month);

        // Obtener fichajes del período seleccionado
        $fichajes = Fichaje::deEmpleado($empleadoId)
            ->whereYear('fecha', $año)
            ->whereMonth('fecha', $mes)
            ->orderBy('fecha', 'desc')
            ->get();

        // Generar años disponibles (desde registro del empleado hasta año actual + 1)
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