<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Nomina extends Model
{
    use HasFactory;

    protected $fillable = [
        'empleado_id',
        'año',
        'mes',
        'archivo_nombre',
        'archivo_path',
        'archivo_mime_type',
        'archivo_tamaño',
        'salario_bruto',
        'salario_neto',
        'observaciones',
        'estado',
        'fecha_descarga'
    ];

    protected $casts = [
        'año' => 'integer',
        'mes' => 'integer',
        'archivo_tamaño' => 'integer',
        'salario_bruto' => 'decimal:2',
        'salario_neto' => 'decimal:2',
        'fecha_descarga' => 'datetime'
    ];

    protected $appends = [
        'nombre_mes'
    ];

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(User::class, 'empleado_id');
    }

    // Obtener URL temporal para descarga
    public function getUrlDescarga(): string
    {
        return Storage::disk('local')->temporaryUrl(
            $this->archivo_path,
            now()->addMinutes(10)
        );
    }

    // Marcar como vista al descargar
    public function marcarComoVista(): void
    {
        $this->update([
            'estado' => 'vista',
            'fecha_descarga' => now()
        ]);
    }

    // Scope para obtener nóminas de un empleado
    public function scopeDeEmpleado($query, $empleadoId)
    {
        return $query->where('empleado_id', $empleadoId);
    }

    // Scope para obtener nóminas por año
    public function scopeDelAño($query, $año)
    {
        return $query->where('año', $año);
    }

    // Scope para obtener nóminas por mes y año
    public function scopeDelPeriodo($query, $año, $mes)
    {
        return $query->where('año', $año)->where('mes', $mes);
    }

    // Obtener nombre del mes en español
    public function getNombreMesAttribute(): string
    {
        $meses = [
            1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
            5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
            9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
        ];

        return $meses[$this->mes] ?? 'Mes inválido';
    }

    // Formatear tamaño de archivo
    public function getTamañoFormateadoAttribute(): string
    {
        $bytes = $this->archivo_tamaño;

        if ($bytes >= 1048576) {
            return round($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return round($bytes / 1024, 2) . ' KB';
        }

        return $bytes . ' bytes';
    }
}