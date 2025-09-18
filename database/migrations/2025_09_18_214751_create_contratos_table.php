<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contratos', function (Blueprint $table) {
            $table->id();

            // Relación con empleado
            $table->foreignId('empleado_id')->constrained('empleados')->onDelete('cascade');

            // Información básica del contrato
            $table->string('tipo_contrato'); // indefinido, temporal, prácticas
            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable(); // null para indefinidos

            // Información laboral esencial
            $table->enum('jornada', ['completa', 'parcial'])->default('completa');
            $table->decimal('salario_bruto_mensual', 8, 2);
            $table->integer('dias_vacaciones')->default(22);
            $table->enum('estado', ['activo', 'finalizado'])->default('activo');

            // Auditoria básica
            $table->timestamps();

            // Índices
            $table->index('empleado_id');
            $table->index('tipo_contrato');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contratos');
    }
};