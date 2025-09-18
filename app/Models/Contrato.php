<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contrato extends Model
{
    use HasFactory;

    protected $fillable = [
        'empleado_id',
        'tipo_contrato',
        'fecha_inicio',
        'fecha_fin',
        'jornada',
        'salario_bruto_mensual',
        'dias_vacaciones',
        'estado'
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'salario_bruto_mensual' => 'decimal:2'
    ];

    // Relación con empleado (un contrato pertenece a un empleado)
    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class);
    }

    // Scopes para consultas comunes
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    public function scopeIndefinidos($query)
    {
        return $query->where('tipo_contrato', 'indefinido');
    }

    public function scopeTemporales($query)
    {
        return $query->where('tipo_contrato', 'temporal');
    }

    // Métodos auxiliares
    public function esIndefinido(): bool
    {
        return $this->tipo_contrato === 'indefinido';
    }

    public function esTemporal(): bool
    {
        return $this->tipo_contrato === 'temporal';
    }
}