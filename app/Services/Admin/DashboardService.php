<?php

namespace App\Services\Admin;

use App\Models\Empleado;
use App\Models\Fichaje;
use App\Models\Nomina;
use App\Models\User;
use Carbon\Carbon;

class DashboardService
{
    /**
     * Obtener estadísticas de nóminas del mes anterior
     */
    public function getEstadisticasNominas(): array
    {
        $mesAnterior = Carbon::now()->subMonth();
        $añoMesAnterior = $mesAnterior->year;
        $numeroMesAnterior = $mesAnterior->month;
        $nombreMesAnterior = ucfirst($mesAnterior->locale('es')->isoFormat('MMMM'));

        $nominasMesAnterior = Nomina::where('año', $añoMesAnterior)
            ->where('mes', $numeroMesAnterior)
            ->count();

        $gastoNominasMesAnterior = Nomina::where('año', $añoMesAnterior)
            ->where('mes', $numeroMesAnterior)
            ->sum('salario_neto');

        $empleadosConNomina = Nomina::where('año', $añoMesAnterior)
            ->where('mes', $numeroMesAnterior)
            ->distinct('empleado_id')
            ->count('empleado_id');

        $nominasPendientes = Nomina::where('estado', 'pendiente_completar')->count();

        $totalEmpleados = User::role('empleado')->count();

        return [
            'total_mes_anterior' => $nominasMesAnterior,
            'gasto_total' => $gastoNominasMesAnterior,
            'empleados_con_nomina' => $empleadosConNomina,
            'pendientes' => $nominasPendientes,
            'promedio_empleado' => $empleadosConNomina > 0 ? $gastoNominasMesAnterior / $empleadosConNomina : 0,
            'cobertura' => $totalEmpleados > 0 ? ($empleadosConNomina / $totalEmpleados) * 100 : 0,
            'nombre_mes_anterior' => $nombreMesAnterior
        ];
    }

    /**
     * Obtener estadísticas de fichajes
     */
    public function getEstadisticasFichajes(): array
    {
        $hoy = Carbon::today()->format('Y-m-d');
        $mesActual = Carbon::now()->month;
        $añoActual = Carbon::now()->year;
        $totalEmpleados = User::role('empleado')->count();

        // Empleados fichados hoy
        $empleadosFichados = Fichaje::where('fecha', $hoy)
            ->distinct('empleado_id')
            ->count('empleado_id');

        $empleadosSinFichar = $totalEmpleados - $empleadosFichados;

        // Calcular entradas abiertas
        $entradasAbiertas = 0;
        $empleadosConFichajes = Fichaje::where('fecha', $hoy)
            ->distinct('empleado_id')
            ->pluck('empleado_id');

        foreach ($empleadosConFichajes as $empleadoId) {
            if (Fichaje::tieneEntradaAbierta($empleadoId, $hoy)) {
                $entradasAbiertas++;
            }
        }

        // Calcular horas totales del día
        $horasHoy = 0;
        foreach ($empleadosConFichajes as $empleadoId) {
            $horasHoy += Fichaje::calcularHorasDia($empleadoId, $hoy);
        }

        $promedioHorasHoy = $empleadosFichados > 0 ? $horasHoy / $empleadosFichados : 0;

        // Calcular horas totales del mes actual
        $promedioHorasMes = $this->calcularPromedioHorasMes($añoActual, $mesActual);

        return [
            'empleados_fichados' => $empleadosFichados,
            'sin_fichar' => $empleadosSinFichar,
            'entradas_abiertas' => $entradasAbiertas,
            'horas_hoy' => $horasHoy,
            'promedio_horas_hoy' => $promedioHorasHoy,
            'promedio_horas_mes' => $promedioHorasMes
        ];
    }

    /**
     * Calcular promedio de horas del mes
     */
    private function calcularPromedioHorasMes(int $año, int $mes): float
    {
        $primerDiaMes = Carbon::create($año, $mes, 1)->format('Y-m-d');
        $ultimoDiaMes = Carbon::create($año, $mes, 1)->endOfMonth()->format('Y-m-d');

        $empleadosActivosMes = Fichaje::whereBetween('fecha', [$primerDiaMes, $ultimoDiaMes])
            ->distinct('empleado_id')
            ->pluck('empleado_id');

        $horasMes = 0;
        foreach ($empleadosActivosMes as $empleadoId) {
            $fechaActual = Carbon::create($año, $mes, 1);
            $fechaFin = Carbon::now()->min(Carbon::create($año, $mes, 1)->endOfMonth());

            while ($fechaActual->lte($fechaFin)) {
                $horasMes += Fichaje::calcularHorasDia($empleadoId, $fechaActual->format('Y-m-d'));
                $fechaActual->addDay();
            }
        }

        $empleadosActivosCount = $empleadosActivosMes->count();
        return $empleadosActivosCount > 0 ? $horasMes / $empleadosActivosCount : 0;
    }

    /**
     * Obtener últimos fichajes
     */
    public function getUltimosFichajes(): array
    {
        $hoy = Carbon::today()->format('Y-m-d');

        return Fichaje::with('empleado')
            ->where('fecha', $hoy)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->toArray();
    }

    /**
     * Obtener todos los empleados
     */
    public function getEmpleados()
    {
        return Empleado::all();
    }
}
