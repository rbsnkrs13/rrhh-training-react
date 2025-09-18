<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Fichaje;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class FichajeSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener usuarios empleados (excluyendo admin)
        $usuarios = User::whereHas('roles', function($query) {
            $query->where('name', 'empleado');
        })->get();

        // Si no hay empleados con rol, usar los primeros usuarios no admin
        if ($usuarios->isEmpty()) {
            $usuarios = User::where('email', '!=', 'admin@empresa.com')->get();
        }

        // Generar fichajes para las últimas 3 semanas desde hoy (lunes a viernes)
        $fechaFin = Carbon::now()->subDays(1); // Hasta ayer (no incluir hoy en el bucle histórico)
        $fechaInicio = $fechaFin->copy()->subWeeks(3)->startOfWeek(); // 3 semanas atrás desde el lunes

        $fechaActual = $fechaInicio->copy();

        while ($fechaActual <= $fechaFin) {
            // Solo días laborables (lunes a viernes)
            if ($fechaActual->isWeekday()) {

                foreach ($usuarios as $usuario) {
                    // 85% probabilidad de que el empleado fiche ese día
                    if (rand(1, 100) <= 85) {

                        // Hora de entrada entre 8:00 y 9:00
                        $hora = 8;
                        $minutos = rand(0, 60); // 0-60 min = 8:00 a 9:00
                        if ($minutos >= 60) {
                            $hora = 9;
                            $minutos = 0;
                        }
                        $horaEntrada = str_pad($hora, 2, '0', STR_PAD_LEFT) . ':' . str_pad($minutos, 2, '0', STR_PAD_LEFT);

                        // Calcular hora de salida: entrada + 8h trabajo + 1h pausa
                        $entradaTime = Carbon::parse($fechaActual->format('Y-m-d') . ' ' . $horaEntrada);
                        $salidaTime = $entradaTime->copy()->addHours(9); // 8h trabajo + 1h pausa
                        $horaSalida = $salidaTime->format('H:i');

                        // Calcular horas trabajadas (siempre 8h por diseño)
                        $horasTrabajadas = 8;

                        // Todos los días son completos
                        Fichaje::create([
                            'empleado_id' => $usuario->id,
                            'fecha' => $fechaActual->format('Y-m-d'),
                            'hora_entrada' => $horaEntrada,
                            'hora_salida' => $horaSalida,
                            'horas_trabajadas' => $horasTrabajadas,
                            'estado' => 'completo'
                        ]);
                    }
                }
            }

            $fechaActual->addDay();
        }

        // Crear fichajes para HOY con lógica inteligente según la hora actual
        $hoy = Carbon::now(); // Definir la variable $hoy correctamente
        $empleadosHoy = $usuarios; // TODOS los usuarios tienen fichaje de hoy
        $horaActual = $hoy->hour;

        foreach ($empleadosHoy as $usuario) {
            // Hora de entrada realista (8:00-9:00)
            $horaHoy = 8;
            $minutosHoy = rand(0, 60); // 0-60 min = 8:00 a 9:00
            if ($minutosHoy >= 60) {
                $horaHoy = 9;
                $minutosHoy = 0;
            }
            $horaEntrada = str_pad($horaHoy, 2, '0', STR_PAD_LEFT) . ':' . str_pad($minutosHoy, 2, '0', STR_PAD_LEFT);

            // Lógica inteligente según la hora actual
            if ($horaActual >= 18) {
                // Después de las 6 PM: día completo (ya terminaron)
                $entradaTime = Carbon::parse($hoy->format('Y-m-d') . ' ' . $horaEntrada);
                $salidaTime = $entradaTime->copy()->addHours(9); // 8h trabajo + 1h pausa
                $horaSalida = $salidaTime->format('H:i');
                $horasTrabajadas = 8;
                $estado = 'completo';
            } else {
                // Antes de las 6 PM: solo entrada (están trabajando)
                $horaSalida = null;
                $horasTrabajadas = null;
                $estado = 'pendiente';
            }

            Fichaje::create([
                'empleado_id' => $usuario->id,
                'fecha' => $hoy->format('Y-m-d'),
                'hora_entrada' => $horaEntrada,
                'hora_salida' => $horaSalida,
                'horas_trabajadas' => $horasTrabajadas,
                'estado' => $estado
            ]);
        }

        $this->command->info('✅ Fichajes creados: fichajes de las últimas 3 semanas + actividad de hoy');
    }
}