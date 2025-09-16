<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Fichaje;
use App\Models\Nomina;
use Carbon\Carbon;

class FichajesNominasSeeder extends Seeder
{
    public function run(): void
    {
        $usuario = User::first();

        if (!$usuario) {
            $this->command->info('No hay usuarios en la base de datos. Creando uno...');
            $usuario = User::create([
                'name' => 'Usuario Test',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
        }

        $this->command->info("Creando datos de prueba para el usuario: {$usuario->name}");

        // Crear fichajes de los últimos 15 días
        for ($i = 14; $i >= 0; $i--) {
            $fecha = Carbon::now()->subDays($i)->format('Y-m-d');

            // No crear fichajes para fines de semana
            $esFinde = Carbon::parse($fecha)->isWeekend();
            if ($esFinde) continue;

            $horaEntrada = '08:' . str_pad(rand(0, 30), 2, '0', STR_PAD_LEFT);
            $horaSalida = null;
            $estado = 'incompleto';

            // 80% de probabilidad de tener salida
            if (rand(1, 100) <= 80 && $i > 0) { // No marcar salida para hoy
                $horaSalida = '17:' . str_pad(rand(0, 30), 2, '0', STR_PAD_LEFT);
                $estado = 'completo';
            }

            $fichaje = Fichaje::create([
                'empleado_id' => $usuario->id,
                'fecha' => $fecha,
                'hora_entrada' => $horaEntrada,
                'hora_salida' => $horaSalida,
                'estado' => $estado,
                'observaciones' => rand(1, 100) <= 20 ? 'Observación de prueba' : null,
            ]);

            // Calcular horas si está completo
            if ($estado === 'completo') {
                $fichaje->calcularHorasTrabajadas();
                $fichaje->save();
            }
        }

        // Crear nóminas de los últimos 6 meses
        for ($i = 5; $i >= 0; $i--) {
            $fecha = Carbon::now()->subMonths($i);
            $año = $fecha->year;
            $mes = $fecha->month;

            // Crear archivo ficticio
            $nombreArchivo = "nomina_{$usuario->id}_{$año}_{$mes}.pdf";
            $rutaArchivo = "nominas/{$año}/{$mes}/{$nombreArchivo}";

            Nomina::create([
                'empleado_id' => $usuario->id,
                'año' => $año,
                'mes' => $mes,
                'archivo_nombre' => $nombreArchivo,
                'archivo_path' => $rutaArchivo,
                'archivo_mime_type' => 'application/pdf',
                'archivo_tamaño' => rand(100000, 500000), // Entre 100KB y 500KB
                'salario_bruto' => rand(25000, 35000) / 10, // Entre 2500€ y 3500€
                'salario_neto' => rand(18000, 25000) / 10, // Entre 1800€ y 2500€
                'observaciones' => rand(1, 100) <= 30 ? 'Nómina de prueba' : null,
                'estado' => ['pendiente', 'enviada', 'vista'][rand(0, 2)],
                'fecha_descarga' => rand(1, 100) <= 60 ? $fecha->addDays(rand(1, 10)) : null,
            ]);
        }

        $this->command->info('✅ Datos de prueba creados:');
        $this->command->info('   - ' . Fichaje::count() . ' fichajes');
        $this->command->info('   - ' . Nomina::count() . ' nóminas');
    }
}