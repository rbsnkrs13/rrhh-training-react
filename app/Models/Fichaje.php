<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Fichaje extends Model
{
    use HasFactory;

    protected $fillable = [
        'empleado_id',
        'fecha',
        'tipo',
        'hora',
        'observaciones'
    ];

    protected $casts = [
        'fecha' => 'date',
        'hora' => 'datetime:H:i'
    ];

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(User::class, 'empleado_id');
    }

    // Calcular horas trabajadas de un día (suma de intervalos entrada-salida)
    public static function calcularHorasDia($empleadoId, $fecha): float
    {
        $fichajes = self::deEmpleado($empleadoId)
            ->where('fecha', $fecha)
            ->orderBy('hora')
            ->get();

        $totalMinutos = 0;
        $ultimaEntrada = null;

        foreach ($fichajes as $fichaje) {
            if ($fichaje->tipo === 'entrada') {
                $ultimaEntrada = Carbon::parse($fichaje->hora);
            } elseif ($fichaje->tipo === 'salida' && $ultimaEntrada) {
                $salida = Carbon::parse($fichaje->hora);
                $totalMinutos += $ultimaEntrada->diffInMinutes($salida);
                $ultimaEntrada = null;
            }
        }

        return round($totalMinutos / 60, 2);
    }

    // Calcular horas trabajadas de un mes completo
    public static function calcularHorasMes($empleadoId, $año, $mes): float
    {
        $fechas = self::deEmpleado($empleadoId)
            ->whereYear('fecha', $año)
            ->whereMonth('fecha', $mes)
            ->distinct('fecha')
            ->pluck('fecha');

        $totalHoras = 0;
        foreach ($fechas as $fecha) {
            $totalHoras += self::calcularHorasDia($empleadoId, $fecha);
        }

        return round($totalHoras, 2);
    }

    // Verificar si hay una entrada sin salida (fichaje abierto)
    public static function tieneEntradaAbierta($empleadoId, $fecha): bool
    {
        $fichajes = self::deEmpleado($empleadoId)
            ->where('fecha', $fecha)
            ->orderBy('hora')
            ->get();

        $contador = 0;
        foreach ($fichajes as $fichaje) {
            $contador += ($fichaje->tipo === 'entrada') ? 1 : -1;
        }

        return $contador > 0;
    }

    // Scope para obtener fichajes de un empleado
    public function scopeDeEmpleado($query, $empleadoId)
    {
        return $query->where('empleado_id', $empleadoId);
    }

    // Scope para obtener fichajes del mes actual
    public function scopeDelMesActual($query)
    {
        return $query->whereMonth('fecha', now()->month)
                    ->whereYear('fecha', now()->year);
    }

    // Scope para obtener fichajes por rango de fechas
    public function scopeEntreFechas($query, $desde, $hasta)
    {
        return $query->whereBetween('fecha', [$desde, $hasta]);
    }
}