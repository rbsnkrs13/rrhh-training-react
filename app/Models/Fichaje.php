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
        'hora_entrada',
        'hora_salida',
        'horas_trabajadas',
        'observaciones',
        'estado'
    ];

    protected $casts = [
        'fecha' => 'date',
        'horas_trabajadas' => 'decimal:2'
    ];

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(User::class, 'empleado_id');
    }

    // Calcular horas trabajadas automáticamente
    public function calcularHorasTrabajadas(): void
    {
        if ($this->hora_entrada && $this->hora_salida) {
            // Extraer solo la parte de hora si viene como timestamp
            $horaEntrada = strlen($this->hora_entrada) > 5 ?
                Carbon::parse($this->hora_entrada)->format('H:i') :
                $this->hora_entrada;
            $horaSalida = strlen($this->hora_salida) > 5 ?
                Carbon::parse($this->hora_salida)->format('H:i') :
                $this->hora_salida;

            $entrada = Carbon::createFromFormat('H:i', $horaEntrada);
            $salida = Carbon::createFromFormat('H:i', $horaSalida);

            // Si sale antes de entrar, asumimos que es el día siguiente
            if ($salida->lt($entrada)) {
                $salida->addDay();
            }

            $this->horas_trabajadas = $salida->diffInMinutes($entrada) / 60;
            $this->estado = 'completo';
        } elseif ($this->hora_entrada) {
            $this->estado = 'incompleto';
        } else {
            $this->estado = 'pendiente';
        }
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