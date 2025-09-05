<?php

namespace Database\Seeders;

use App\Models\Empleado;
use Illuminate\Database\Seeder;

class EmpleadoSeeder extends Seeder
{
    public function run(): void
    {
        // Crear empleados específicos (jefes/importantes)
        Empleado::create([
            'nombre' => 'Ana García Martínez',
            'email' => 'ana.garcia@empresa.com',
            'departamento' => 'RRHH',
            'puesto' => 'Directora RRHH',
            'salario' => 65000,
            'fecha_contratacion' => now()->subYears(3),
            'activo' => true,
            'notas' => 'Directora del departamento de Recursos Humanos'
        ]);

        Empleado::create([
            'nombre' => 'Carlos López Silva',
            'email' => 'carlos.lopez@empresa.com',
            'departamento' => 'IT',
            'puesto' => 'CTO',
            'salario' => 85000,
            'fecha_contratacion' => now()->subYears(4),
            'activo' => true,
            'notas' => 'Chief Technology Officer'
        ]);

        // Crear empleados aleatorios
        Empleado::factory(50)->create();
    }
}