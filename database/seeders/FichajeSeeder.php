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
        $fechaFin = Carbon::now()->subDays(1);
        $fechaInicio = $fechaFin->copy()->subWeeks(3)->startOfWeek();
        $fechaActual = $fechaInicio->copy();

        while ($fechaActual <= $fechaFin) {
            if ($fechaActual->isWeekday()) {
                foreach ($usuarios as $usuario) {
                    // 85% probabilidad de que el empleado fiche ese día
                    if (rand(1, 100) <= 85) {
                        $this->crearFichajesCompletos($usuario->id, $fechaActual);
                    }
                }
            }
            $fechaActual->addDay();
        }

        // Crear fichajes para HOY
        $hoy = Carbon::now();
        $horaActual = $hoy->hour;

        foreach ($usuarios as $usuario) {
            if ($horaActual >= 18) {
                // Después de las 6 PM: día completo
                $this->crearFichajesCompletos($usuario->id, $hoy);
            } else {
                // Antes de las 6 PM: solo entrada o entrada + pausa
                $this->crearFichajesParciales($usuario->id, $hoy, $horaActual);
            }
        }

        $this->command->info('✅ Fichajes creados con múltiples entradas/salidas por día');
    }

    private function crearFichajesCompletos($empleadoId, $fecha): void
    {
        // Entrada (8:00-9:00)
        $horaEntrada = $this->generarHoraRandom(8, 0, 9, 0);
        Fichaje::create([
            'empleado_id' => $empleadoId,
            'fecha' => $fecha->format('Y-m-d'),
            'tipo' => 'entrada',
            'hora' => $horaEntrada,
        ]);

        // Salida pausa comida (13:00-14:00)
        $horaSalidaPausa = $this->generarHoraRandom(13, 0, 14, 0);
        Fichaje::create([
            'empleado_id' => $empleadoId,
            'fecha' => $fecha->format('Y-m-d'),
            'tipo' => 'salida',
            'hora' => $horaSalidaPausa,
        ]);

        // Vuelta de pausa (14:00-15:00)
        $horaVueltaPausa = $this->generarHoraRandom(14, 0, 15, 0);
        Fichaje::create([
            'empleado_id' => $empleadoId,
            'fecha' => $fecha->format('Y-m-d'),
            'tipo' => 'entrada',
            'hora' => $horaVueltaPausa,
        ]);

        // Salida final (17:00-18:30)
        $horaSalidaFinal = $this->generarHoraRandom(17, 0, 18, 30);
        Fichaje::create([
            'empleado_id' => $empleadoId,
            'fecha' => $fecha->format('Y-m-d'),
            'tipo' => 'salida',
            'hora' => $horaSalidaFinal,
        ]);
    }

    private function crearFichajesParciales($empleadoId, $fecha, $horaActual): void
    {
        // Siempre entrada inicial
        $horaEntrada = $this->generarHoraRandom(8, 0, 9, 0);
        Fichaje::create([
            'empleado_id' => $empleadoId,
            'fecha' => $fecha->format('Y-m-d'),
            'tipo' => 'entrada',
            'hora' => $horaEntrada,
        ]);

        // Si es después de las 13h, añadir pausa y vuelta
        if ($horaActual >= 14) {
            $horaSalidaPausa = $this->generarHoraRandom(13, 0, 14, 0);
            Fichaje::create([
                'empleado_id' => $empleadoId,
                'fecha' => $fecha->format('Y-m-d'),
                'tipo' => 'salida',
                'hora' => $horaSalidaPausa,
            ]);

            $horaVueltaPausa = $this->generarHoraRandom(14, 0, 15, 0);
            Fichaje::create([
                'empleado_id' => $empleadoId,
                'fecha' => $fecha->format('Y-m-d'),
                'tipo' => 'entrada',
                'hora' => $horaVueltaPausa,
            ]);
        }
    }

    private function generarHoraRandom($horaMin, $minMin, $horaMax, $minMax): string
    {
        $minutosMin = ($horaMin * 60) + $minMin;
        $minutosMax = ($horaMax * 60) + $minMax;
        $minutosRandom = rand($minutosMin, $minutosMax);

        $hora = intdiv($minutosRandom, 60);
        $minutos = $minutosRandom % 60;

        return str_pad($hora, 2, '0', STR_PAD_LEFT) . ':' . str_pad($minutos, 2, '0', STR_PAD_LEFT);
    }
}