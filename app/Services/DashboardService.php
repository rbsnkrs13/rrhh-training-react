<?php

namespace App\Services;

use App\Models\Empleado;
use App\Models\Fichaje;
use App\Models\Nomina;
use App\Models\Contrato;
use Carbon\Carbon;

class DashboardService
{
    /**
     * Obtener fichajes recientes del empleado (últimos 7 días)
     */
    public function obtenerFichajesRecientes(int $empleadoId): array
    {
        $fechasRecientes = Fichaje::where('empleado_id', $empleadoId)
            ->select('fecha')
            ->distinct()
            ->orderBy('fecha', 'desc')
            ->limit(7)
            ->pluck('fecha');

        return $fechasRecientes->map(function($fecha) use ($empleadoId) {
            $horas = Fichaje::calcularHorasDia($empleadoId, $fecha);
            return [
                'fecha' => $fecha,
                'horas' => $horas,
                'completo' => $horas >= 8
            ];
        })->toArray();
    }

    /**
     * Obtener nóminas recientes del empleado
     */
    public function obtenerNominasRecientes(int $empleadoId): array
    {
        return Nomina::where('empleado_id', $empleadoId)
            ->whereNotNull('salario_bruto')
            ->whereNotNull('salario_neto')
            ->orderBy('año', 'desc')
            ->orderBy('mes', 'desc')
            ->limit(5)
            ->get()
            ->map(function($nomina) {
                return [
                    'id' => $nomina->id,
                    'mes' => $nomina->nombre_mes,
                    'año' => $nomina->año,
                    'archivo' => $nomina->archivo_nombre,
                    'salario_bruto' => $nomina->salario_bruto,
                    'salario_neto' => $nomina->salario_neto,
                ];
            })->toArray();
    }

    /**
     * Obtener información del empleado por email
     */
    public function obtenerEmpleadoPorEmail(string $email): ?Empleado
    {
        return Empleado::where('email', $email)->first();
    }

    /**
     * Calcular estado de fichaje actual (hoy)
     */
    public function calcularEstadoFichaje(int $empleadoId): array
    {
        $fechaHoy = Carbon::today()->format('Y-m-d');
        $fichajesHoy = Fichaje::where('empleado_id', $empleadoId)
            ->where('fecha', $fechaHoy)
            ->orderBy('hora')
            ->get();

        $tieneEntradaAbierta = Fichaje::tieneEntradaAbierta($empleadoId, $fechaHoy);
        $horasHoy = Fichaje::calcularHorasDia($empleadoId, $fechaHoy);
        $ultimaEntrada = $fichajesHoy->where('tipo', 'entrada')->last();

        return [
            'fichado' => $tieneEntradaAbierta,
            'ultimaEntrada' => $ultimaEntrada ? $ultimaEntrada->hora : null,
            'horasHoy' => $horasHoy
        ];
    }

    /**
     * Calcular horas trabajadas en la semana actual
     */
    public function calcularHorasSemana(int $empleadoId, string $email): array
    {
        $inicioSemana = Carbon::now()->startOfWeek(Carbon::MONDAY);
        $finSemana = Carbon::now()->endOfWeek(Carbon::FRIDAY);

        $fechasSemana = Fichaje::where('empleado_id', $empleadoId)
            ->whereBetween('fecha', [$inicioSemana, $finSemana])
            ->select('fecha')
            ->distinct()
            ->pluck('fecha');

        $horasTrabajadas = 0;
        foreach ($fechasSemana as $fecha) {
            $horasTrabajadas += Fichaje::calcularHorasDia($empleadoId, $fecha);
        }

        // Obtener horas semanales del contrato
        $empleadoInfo = Empleado::where('email', $email)->first();
        $horasObjetivo = 40; // Default

        if ($empleadoInfo) {
            $contrato = Contrato::where('empleado_id', $empleadoInfo->id)->first();
            $horasObjetivo = $contrato ? $contrato->horas_semanales : 40;
        }

        return [
            'trabajadas' => $horasTrabajadas,
            'objetivo' => $horasObjetivo
        ];
    }

    /**
     * Obtener todos los datos del dashboard del empleado
     */
    public function obtenerDatosDashboard(int $empleadoId, string $email): array
    {
        return [
            'fichajesRecientes' => $this->obtenerFichajesRecientes($empleadoId),
            'nominasRecientes' => $this->obtenerNominasRecientes($empleadoId),
            'empleadoInfo' => $this->obtenerEmpleadoPorEmail($email),
            'estadoFichaje' => $this->calcularEstadoFichaje($empleadoId),
            'horasSemana' => $this->calcularHorasSemana($empleadoId, $email)
        ];
    }
}
