<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

class NominaEjemploController extends Controller
{
    private $empleados = [
        ['dni' => '12345678A', 'nombre' => 'Admin RRHH', 'salario_bruto' => 3500.00, 'ss' => 222.25, 'irpf' => 525.00],
        ['dni' => '23456789B', 'nombre' => 'María García López', 'salario_bruto' => 2800.00, 'ss' => 177.80, 'irpf' => 420.00],
        ['dni' => '34567890C', 'nombre' => 'Carlos Rodríguez Sánchez', 'salario_bruto' => 3200.00, 'ss' => 203.20, 'irpf' => 480.00],
        ['dni' => '45678901D', 'nombre' => 'Ana Martínez Fernández', 'salario_bruto' => 2600.00, 'ss' => 165.10, 'irpf' => 390.00],
        ['dni' => '56789012E', 'nombre' => 'David López Pérez', 'salario_bruto' => 2900.00, 'ss' => 184.15, 'irpf' => 435.00],
        ['dni' => '67890123F', 'nombre' => 'Laura Hernández Ruiz', 'salario_bruto' => 3100.00, 'ss' => 196.85, 'irpf' => 465.00],
        ['dni' => '78901234G', 'nombre' => 'Jorge Silva Torres', 'salario_bruto' => 2700.00, 'ss' => 171.45, 'irpf' => 405.00],
    ];

    /**
     * Generar nómina HTML individual
     */
    public function generarNomina($index)
    {
        if ($index < 1 || $index > count($this->empleados)) {
            abort(404, 'Empleado no encontrado');
        }

        $empleado = $this->empleados[$index - 1];

        // Calcular salario neto
        $salario_neto = $empleado['salario_bruto'] - $empleado['ss'] - $empleado['irpf'];

        // Datos dinámicos
        $mes = Carbon::now()->locale('es')->isoFormat('MMMM');
        $año = Carbon::now()->year;
        $fecha_emision = Carbon::now()->locale('es')->isoFormat('D [de] MMMM [de] YYYY');

        $data = [
            'empleado' => $empleado,
            'salario_neto' => $salario_neto,
            'mes' => ucfirst($mes),
            'año' => $año,
            'fecha_emision' => $fecha_emision,
            'titulo' => "{$empleado['nombre']} - {$mes} {$año}",
        ];

        return view('nominas.plantilla', $data);
    }

    /**
     * Listar todas las nóminas disponibles
     */
    public function index()
    {
        return view('nominas.index', [
            'empleados' => $this->empleados,
            'total' => count($this->empleados)
        ]);
    }
}
