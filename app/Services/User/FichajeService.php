<?php

namespace App\Services\User;

use App\Models\Fichaje;
use Carbon\Carbon;

class FichajeService
{
    /**
     * Obtener fichajes de hoy de un empleado
     */
    public function getFichajesHoy(int $empleadoId): array
    {
        $fechaActual = now()->format('Y-m-d');

        return Fichaje::deEmpleado($empleadoId)
            ->where('fecha', $fechaActual)
            ->orderBy('hora')
            ->get()
            ->toArray();
    }

    /**
     * Verificar si tiene entrada abierta
     */
    public function tieneEntradaAbierta(int $empleadoId, string $fecha): bool
    {
        return Fichaje::tieneEntradaAbierta($empleadoId, $fecha);
    }

    /**
     * Obtener fichajes del mes agrupados por día
     */
    public function getFichajesDelMes(int $empleadoId, ?int $año = null, ?int $mes = null): array
    {
        $año = $año ?? now()->year;
        $mes = $mes ?? now()->month;

        return Fichaje::deEmpleado($empleadoId)
            ->whereYear('fecha', $año)
            ->whereMonth('fecha', $mes)
            ->orderBy('fecha', 'desc')
            ->orderBy('hora', 'asc')
            ->get()
            ->groupBy('fecha')
            ->map(function ($fichajesDia) {
                $fecha = $fichajesDia->first()->fecha;
                $empleadoId = $fichajesDia->first()->empleado_id;
                return [
                    'fecha' => $fecha,
                    'fichajes' => $fichajesDia,
                    'horas_trabajadas' => Fichaje::calcularHorasDia($empleadoId, $fecha),
                    'tiene_entrada_abierta' => Fichaje::tieneEntradaAbierta($empleadoId, $fecha),
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Calcular estadísticas del mes
     */
    public function calcularEstadisticasMes(array $fichajesDelMes): array
    {
        $totalHoras = collect($fichajesDelMes)->sum('horas_trabajadas');
        $diasCompletos = collect($fichajesDelMes)->where('tiene_entrada_abierta', false)->count();

        return [
            'total_dias_trabajados' => $diasCompletos,
            'total_horas_mes' => $totalHoras,
            'promedio_horas_dia' => $diasCompletos > 0 ? round($totalHoras / $diasCompletos, 2) : 0,
        ];
    }

    /**
     * Fichar entrada
     */
    public function ficharEntrada(int $empleadoId): array
    {
        $fechaActual = now()->format('Y-m-d');
        $horaActual = now()->format('H:i');

        if ($this->tieneEntradaAbierta($empleadoId, $fechaActual)) {
            return [
                'success' => false,
                'message' => 'Ya tienes una entrada sin salida. Debes fichar la salida primero.'
            ];
        }

        Fichaje::create([
            'empleado_id' => $empleadoId,
            'fecha' => $fechaActual,
            'tipo' => 'entrada',
            'hora' => $horaActual,
        ]);

        return [
            'success' => true,
            'message' => "Entrada fichada correctamente a las {$horaActual}"
        ];
    }

    /**
     * Fichar salida
     */
    public function ficharSalida(int $empleadoId): array
    {
        $fechaActual = now()->format('Y-m-d');
        $horaActual = now()->format('H:i');

        if (!$this->tieneEntradaAbierta($empleadoId, $fechaActual)) {
            return [
                'success' => false,
                'message' => 'Debes fichar la entrada primero.'
            ];
        }

        Fichaje::create([
            'empleado_id' => $empleadoId,
            'fecha' => $fechaActual,
            'tipo' => 'salida',
            'hora' => $horaActual,
        ]);

        $horasTrabajadas = Fichaje::calcularHorasDia($empleadoId, $fechaActual);

        return [
            'success' => true,
            'message' => "Salida fichada correctamente a las {$horaActual}. Horas acumuladas hoy: {$horasTrabajadas}h"
        ];
    }

    /**
     * Obtener todos los fichajes agrupados por empleado y día con filtros
     */
    public function getTodosFichajesConFiltros(?int $empleadoId = null, ?string $fechaDesde = null, ?string $fechaHasta = null, ?string $estado = null): array
    {
        $query = Fichaje::with('empleado')
            ->select('fichajes.*')
            ->orderBy('fecha', 'desc')
            ->orderBy('hora', 'asc');

        // Filtro por empleado
        if ($empleadoId) {
            $query->where('empleado_id', $empleadoId);
        }

        // Filtro por rango de fechas
        if ($fechaDesde) {
            $query->where('fecha', '>=', $fechaDesde);
        }
        if ($fechaHasta) {
            $query->where('fecha', '<=', $fechaHasta);
        }

        $fichajes = $query->get();

        // Agrupar por empleado_id y fecha
        $fichajesAgrupados = $fichajes->groupBy(function ($fichaje) {
            return $fichaje->empleado_id . '_' . $fichaje->fecha;
        })->map(function ($fichajesDia) {
            $primerFichaje = $fichajesDia->first();
            $fecha = $primerFichaje->fecha;
            $empleadoId = $primerFichaje->empleado_id;
            $empleado = $primerFichaje->empleado;

            $horasTrabajadas = Fichaje::calcularHorasDia($empleadoId, $fecha);
            $tieneEntradaAbierta = Fichaje::tieneEntradaAbierta($empleadoId, $fecha);

            // Determinar el estado
            $estadoFichaje = $this->determinarEstado($fichajesDia->count(), $tieneEntradaAbierta, $horasTrabajadas, $fecha);

            return [
                'empleado_id' => $empleadoId,
                'empleado_nombre' => $empleado->name ?? 'Desconocido',
                'fecha' => $fecha,
                'fichajes' => $fichajesDia->map(function ($f) {
                    return [
                        'id' => $f->id,
                        'tipo' => $f->tipo,
                        'hora' => $f->hora,
                    ];
                })->toArray(),
                'horas_trabajadas' => $horasTrabajadas,
                'estado' => $estadoFichaje,
            ];
        })->values()->toArray();

        // Filtro por estado (después de calcular estados)
        if ($estado) {
            $fichajesAgrupados = collect($fichajesAgrupados)
                ->filter(fn($f) => $f['estado'] === $estado)
                ->values()
                ->toArray();
        }

        return $fichajesAgrupados;
    }

    /**
     * Determinar el estado de un fichaje
     */
    private function determinarEstado(int $cantidadFichajes, bool $tieneEntradaAbierta, float $horasTrabajadas, string $fecha): string
    {
        $fechaActual = now()->format('Y-m-d');
        $esDiaActual = $fecha === $fechaActual;

        // Sin fichajes
        if ($cantidadFichajes === 0) {
            return 'sin_fichar';
        }

        // Tiene entrada abierta
        if ($tieneEntradaAbierta) {
            // Si es hoy, está en curso
            if ($esDiaActual) {
                return 'en_curso';
            }
            // Si es día pasado con entrada abierta, está incompleto
            return 'incompleto';
        }

        // Todos los fichajes cerrados
        if ($horasTrabajadas < 8) {
            return 'incompleto'; // Menos de 8 horas
        }

        return 'completo'; // Todo OK
    }

    /**
     * Calcular estadísticas para el dashboard admin (hoy)
     */
    public function calcularEstadisticasHoy(): array
    {
        $fechaActual = now()->format('Y-m-d');
        $totalEmpleados = \App\Models\User::count();

        // Obtener empleados que ficharon hoy
        $empleadosFichadosHoy = Fichaje::where('fecha', $fechaActual)
            ->distinct('empleado_id')
            ->count('empleado_id');

        // Calcular total de horas trabajadas hoy
        $empleadosIds = Fichaje::where('fecha', $fechaActual)
            ->distinct()
            ->pluck('empleado_id');

        $totalHorasHoy = 0;
        foreach ($empleadosIds as $empId) {
            $totalHorasHoy += Fichaje::calcularHorasDia($empId, $fechaActual);
        }

        $promedioHoras = $empleadosFichadosHoy > 0 ? round($totalHorasHoy / $empleadosFichadosHoy, 1) : 0;

        return [
            'total_empleados' => $totalEmpleados,
            'empleados_fichados' => $empleadosFichadosHoy,
            'empleados_sin_fichar' => $totalEmpleados - $empleadosFichadosHoy,
            'total_horas_hoy' => round($totalHorasHoy, 1),
            'promedio_horas' => $promedioHoras,
        ];
    }
}
