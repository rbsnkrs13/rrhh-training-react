<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Empleado extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'email', 
        'departamento',
        'puesto',
        'salario',
        'fecha_contratacion',
        'activo',
        'notas'
    ];

    protected $casts = [
        'activo' => 'boolean',
        'fecha_contratacion' => 'date',
        'salario' => 'decimal:2'
    ];

    // Scopes útiles
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    public function scopePorDepartamento($query, $departamento)
    {
        return $query->where('departamento', $departamento);
    }

    // Accessor para antigüedad
    public function getAntiguedadAttribute()
    {
        return $this->fecha_contratacion->diffInYears(now());
    }

    // Relación con Contrato
    public function contrato()
    {
        return $this->hasOne(Contrato::class, 'empleado_id');
    }

    // Relación con User
    public function user()
    {
        return $this->belongsTo(User::class, 'id', 'id');
    }
}