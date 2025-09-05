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
        
        return [
            'nombre' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'departamento' => $departamento,
            'puesto' => $this->faker->randomElement($puestos[$departamento]),
            'salario' => $this->faker->numberBetween(25000, 80000),
            'fecha_contratacion' => $this->faker->dateTimeBetween('-5 years', 'now'),
            'activo' => $this->faker->boolean(85), // 85% activos
            'notas' => $this->faker->optional(0.3)->sentence(),
        ];
    }
}