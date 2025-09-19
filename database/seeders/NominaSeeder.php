<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Nomina;
use Illuminate\Database\Seeder;

class NominaSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener usuarios empleados
        $usuarios = User::whereHas('roles', function($query) {
            $query->where('name', 'empleado');
        })->get();

        // Si no hay empleados con rol, usar todos menos admin
        if ($usuarios->isEmpty()) {
            $usuarios = User::where('email', '!=', 'admin@empresa.com')->get();
        }

        // Períodos para crear nóminas (año actual hasta septiembre)
        $periodos = [
            ['mes' => 1, 'año' => 2025],   // Enero
            ['mes' => 2, 'año' => 2025],   // Febrero
            ['mes' => 3, 'año' => 2025],   // Marzo
            ['mes' => 4, 'año' => 2025],   // Abril
            ['mes' => 5, 'año' => 2025],   // Mayo
            ['mes' => 6, 'año' => 2025],   // Junio
            ['mes' => 7, 'año' => 2025],   // Julio
            ['mes' => 8, 'año' => 2025],   // Agosto
            ['mes' => 9, 'año' => 2025],   // Septiembre
        ];

        // Crear nóminas para cada usuario y cada mes
        foreach ($usuarios as $usuario) {
            // Obtener el nombre limpio para el archivo
            $nombreLimpio = str_replace('@empresa.com', '', $usuario->email);
            $nombreLimpio = str_replace('.', '_', $nombreLimpio);

            foreach ($periodos as $periodo) {
                $nombreMes = $this->getNombreMes($periodo['mes']);
                $nombreArchivo = "nomina_{$nombreLimpio}_{$nombreMes}_{$periodo['año']}.pdf";

                Nomina::create([
                    'empleado_id' => $usuario->id,
                    'mes' => $periodo['mes'],
                    'año' => $periodo['año'],
                    'archivo_nombre' => $nombreArchivo,
                    'archivo_path' => "nominas/{$nombreArchivo}",
                    'archivo_mime_type' => 'application/pdf',
                    'archivo_tamaño' => rand(150000, 500000), // Entre 150KB y 500KB
                    'salario_bruto' => rand(2500, 5000),
                    'salario_neto' => rand(1800, 3500),
                    'estado' => 'enviada'
                ]);
            }
        }

        $this->command->info('✅ Nóminas creadas: 9 meses de 2025 para todos los empleados');
    }

    private function getNombreMes(int $mes): string
    {
        $meses = [
            1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
            5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
            9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
        ];

        return $meses[$mes];
    }
}