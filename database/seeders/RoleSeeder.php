<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Crear permisos
        $permissions = [
            'ver_dashboard',
            'gestionar_empleados',
            'ver_empleados',
            'crear_empleados',
            'editar_empleados',
            'eliminar_empleados',
            'gestionar_fichajes',
            'ver_fichajes_propios',
            'ver_todos_fichajes',
            'gestionar_nominas',
            'ver_nominas_propias',
            'subir_nominas',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Crear rol Admin
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo([
            'ver_dashboard',
            'gestionar_empleados',
            'ver_empleados',
            'crear_empleados',
            'editar_empleados',
            'eliminar_empleados',
            'gestionar_fichajes',
            'ver_todos_fichajes',
            'gestionar_nominas',
            'subir_nominas',
        ]);

        // Crear rol Empleado
        $empleadoRole = Role::create(['name' => 'empleado']);
        $empleadoRole->givePermissionTo([
            'ver_fichajes_propios',
            'ver_nominas_propias',
        ]);

        // Asignar rol admin al usuario admin
        $adminUser = User::where('email', 'admin@empresa.com')->first();
        if ($adminUser) {
            $adminUser->assignRole('admin');
        }

        // Asignar rol empleado a los usuarios empleados
        $empleadosEmails = [
            'maria.garcia@empresa.com',
            'carlos.rodriguez@empresa.com',
            'ana.martinez@empresa.com',
            'david.lopez@empresa.com',
            'laura.hernandez@empresa.com',
            'jorge.silva@empresa.com'
        ];

        foreach ($empleadosEmails as $email) {
            $empleadoUser = User::where('email', $email)->first();
            if ($empleadoUser) {
                $empleadoUser->assignRole('empleado');
            }
        }
    }
}