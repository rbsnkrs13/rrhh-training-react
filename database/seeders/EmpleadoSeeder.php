<?php

namespace Database\Seeders;

use App\Models\Empleado;
use Illuminate\Database\Seeder;

class EmpleadoSeeder extends Seeder
{
    public function run(): void
    {
        // Crear empleados específicos que coinciden con usuarios (pueden hacer login)
        $empleadosConUsuarios = [
            [
                'nombre' => 'María García López',
                'email' => 'maria.garcia@empresa.com',
                'departamento' => 'RRHH',
                'puesto' => 'Técnico RRHH',
                'salario' => 35000,
                'fecha_contratacion' => now()->subYears(2),
                'notas' => 'Especialista en nóminas y contratación'
            ],
            [
                'nombre' => 'Carlos Rodríguez Sánchez',
                'email' => 'carlos.rodriguez@empresa.com',
                'departamento' => 'IT',
                'puesto' => 'Desarrollador Senior',
                'salario' => 48000,
                'fecha_contratacion' => now()->subYears(3),
                'notas' => 'Especialista en Laravel y React'
            ],
            [
                'nombre' => 'Ana Martínez Fernández',
                'email' => 'ana.martinez@empresa.com',
                'departamento' => 'Ventas',
                'puesto' => 'Comercial Senior',
                'salario' => 42000,
                'fecha_contratacion' => now()->subYears(1),
                'notas' => 'Responsable de cuentas corporativas'
            ],
            [
                'nombre' => 'David López Pérez',
                'email' => 'david.lopez@empresa.com',
                'departamento' => 'Contabilidad',
                'puesto' => 'Contable',
                'salario' => 32000,
                'fecha_contratacion' => now()->subMonths(8),
                'notas' => 'Gestión de facturas y presupuestos'
            ],
            [
                'nombre' => 'Laura Hernández Ruiz',
                'email' => 'laura.hernandez@empresa.com',
                'departamento' => 'Marketing',
                'puesto' => 'Marketing Manager',
                'salario' => 45000,
                'fecha_contratacion' => now()->subYears(2),
                'notas' => 'Estrategia digital y redes sociales'
            ],
            [
                'nombre' => 'Jorge Silva Torres',
                'email' => 'jorge.silva@empresa.com',
                'departamento' => 'IT',
                'puesto' => 'DevOps Engineer',
                'salario' => 52000,
                'fecha_contratacion' => now()->subMonths(6),
                'notas' => 'Infraestructura y despliegues automáticos'
            ]
        ];

        foreach ($empleadosConUsuarios as $empleado) {
            Empleado::create([
                'nombre' => $empleado['nombre'],
                'email' => $empleado['email'],
                'departamento' => $empleado['departamento'],
                'puesto' => $empleado['puesto'],
                'salario' => $empleado['salario'],
                'fecha_contratacion' => $empleado['fecha_contratacion'],
                'activo' => true,
                'notas' => $empleado['notas']
            ]);
        }

        // Crear empleados específicos adicionales (jefes/importantes sin usuario)
        Empleado::create([
            'nombre' => 'Ana García Martínez',
            'email' => 'ana.garcia.directora@empresa.com',
            'departamento' => 'RRHH',
            'puesto' => 'Directora RRHH',
            'salario' => 65000,
            'fecha_contratacion' => now()->subYears(3),
            'activo' => true,
            'notas' => 'Directora del departamento de Recursos Humanos'
        ]);

        Empleado::create([
            'nombre' => 'Carlos López Silva',
            'email' => 'carlos.lopez.cto@empresa.com',
            'departamento' => 'IT',
            'puesto' => 'CTO',
            'salario' => 85000,
            'fecha_contratacion' => now()->subYears(4),
            'activo' => true,
            'notas' => 'Chief Technology Officer'
        ]);

        // Crear empleados aleatorios (mantener los 20+ del factory)
        Empleado::factory(20)->create();
    }
}