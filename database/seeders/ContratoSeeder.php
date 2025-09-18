<?php

namespace Database\Seeders;

use App\Models\Empleado;
use App\Models\Contrato;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ContratoSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener todos los empleados
        $empleados = Empleado::all();

        foreach ($empleados as $empleado) {
            // Determinar tipo de contrato según el puesto
            $tipoContrato = $this->determinarTipoContrato($empleado->puesto);

            // Determinar jornada según el departamento
            $jornada = $this->determinarJornada($empleado->departamento);

            // Calcular salario mensual basado en el salario anual del empleado
            $salarioMensual = round($empleado->salario / 12, 2);

            // Fecha de inicio (usar la fecha de contratación del empleado)
            $fechaInicio = Carbon::parse($empleado->fecha_contratacion);

            // Fecha fin (solo para temporales)
            $fechaFin = null;
            if ($tipoContrato === 'temporal') {
                $fechaFin = $fechaInicio->copy()->addMonths(rand(6, 24));
            }

            // Días de vacaciones según el tipo de contrato
            $diasVacaciones = $this->determinarDiasVacaciones($tipoContrato, $jornada);

            // Horas semanales según la jornada
            $horasSemanales = $jornada === 'completa' ? 40 : 25;

            Contrato::create([
                'empleado_id' => $empleado->id,
                'tipo_contrato' => $tipoContrato,
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin,
                'jornada' => $jornada,
                'horas_semanales' => $horasSemanales,
                'salario_bruto_mensual' => $salarioMensual,
                'dias_vacaciones' => $diasVacaciones,
                'estado' => 'activo'
            ]);
        }

        $this->command->info('✅ Contratos creados para todos los empleados');
    }

    private function determinarTipoContrato(string $puesto): string
    {
        // Puestos senior/directivos = indefinido
        $puestosIndefinidos = [
            'Director', 'CTO', 'Manager', 'Senior', 'Jefe', 'Responsable'
        ];

        foreach ($puestosIndefinidos as $termino) {
            if (str_contains($puesto, $termino)) {
                return 'indefinido';
            }
        }

        // Prácticas para puestos junior
        if (str_contains($puesto, 'Junior') || str_contains($puesto, 'Becario')) {
            return rand(1, 100) <= 40 ? 'practicas' : 'temporal';
        }

        // 70% indefinido, 25% temporal, 5% prácticas para el resto
        $random = rand(1, 100);
        if ($random <= 70) return 'indefinido';
        if ($random <= 95) return 'temporal';
        return 'practicas';
    }

    private function determinarJornada(string $departamento): string
    {
        // Departamentos que suelen tener más jornadas parciales
        $departamentosConParciales = ['RRHH', 'Marketing', 'Contabilidad'];

        if (in_array($departamento, $departamentosConParciales)) {
            return rand(1, 100) <= 20 ? 'parcial' : 'completa';
        }

        // IT y Ventas casi siempre completa
        return rand(1, 100) <= 90 ? 'completa' : 'parcial';
    }

    private function determinarDiasVacaciones(string $tipoContrato, string $jornada): int
    {
        if ($tipoContrato === 'practicas') {
            return rand(15, 18); // Menos vacaciones para prácticas
        }

        if ($jornada === 'parcial') {
            return rand(18, 22); // Proporcionalmente menos para parciales
        }

        // Jornada completa indefinido/temporal
        return rand(22, 30);
    }
}