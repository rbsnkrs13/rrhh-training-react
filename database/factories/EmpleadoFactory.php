<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class EmpleadoFactory extends Factory
{
    public function definition(): array
    {
        $departamentos = ['IT', 'RRHH', 'Ventas', 'Marketing', 'Contabilidad', 'Logística'];
        $puestos = [
            'IT' => ['Desarrollador', 'Analista', 'DevOps', 'QA Tester'],
            'RRHH' => ['Especialista RRHH', 'Recruiter', 'Nóminas'],
            'Ventas' => ['Vendedor', 'Account Manager', 'Comercial'],
            'Marketing' => ['Marketing Manager', 'Community Manager', 'Diseñador'],
            'Contabilidad' => ['Contador', 'Auditor', 'Controller'],
            'Logística' => ['Operador', 'Supervisor', 'Coordinador']
        ];

        $departamento = $this->faker->randomElement($departamentos);

        // Fechas entre enero 2024 y septiembre 2025 (antes de hoy)
        $fechaContratacion = $this->faker->dateTimeBetween('2024-01-01', '2025-09-01');

        return [
            'nombre' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'departamento' => $departamento,
            'puesto' => $this->faker->randomElement($puestos[$departamento]),
            'salario' => $this->faker->numberBetween(25000, 80000),
            'fecha_contratacion' => $fechaContratacion,
            'activo' => $this->faker->boolean(85),
            'notas' => $this->faker->optional(0.3)->sentence(),
            'created_at' => $fechaContratacion,
            'updated_at' => now(), // Siempre la fecha actual
        ];
    }
}
