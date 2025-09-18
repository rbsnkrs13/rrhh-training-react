<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Usuario Admin
        User::create([
            'name' => 'Admin RRHH',
            'email' => 'admin@empresa.com',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);

        // Usuarios Empleados (que coincidirán con algunos empleados del factory)
        $empleadosUsuarios = [
            ['name' => 'María García López', 'email' => 'maria.garcia@empresa.com'],
            ['name' => 'Carlos Rodríguez Sánchez', 'email' => 'carlos.rodriguez@empresa.com'],
            ['name' => 'Ana Martínez Fernández', 'email' => 'ana.martinez@empresa.com'],
            ['name' => 'David López Pérez', 'email' => 'david.lopez@empresa.com'],
            ['name' => 'Laura Hernández Ruiz', 'email' => 'laura.hernandez@empresa.com'],
            ['name' => 'Jorge Silva Torres', 'email' => 'jorge.silva@empresa.com'],
        ];

        foreach ($empleadosUsuarios as $empleado) {
            User::create([
                'name' => $empleado['name'],
                'email' => $empleado['email'],
                'password' => Hash::make('empleado123'),
                'email_verified_at' => now(),
            ]);
        }

        $this->call([
            RoleSeeder::class,
            EmpleadoSeeder::class,
            ContratoSeeder::class,
            FichajeSeeder::class,
            NominaSeeder::class,
        ]);
    }
}
