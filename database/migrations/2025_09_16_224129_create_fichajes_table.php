<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fichajes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empleado_id')->constrained('users')->onDelete('cascade');
            $table->date('fecha');
            $table->time('hora_entrada')->nullable();
            $table->time('hora_salida')->nullable();
            $table->decimal('horas_trabajadas', 5, 2)->nullable();
            $table->text('observaciones')->nullable();
            $table->enum('estado', ['completo', 'incompleto', 'pendiente'])->default('pendiente');
            $table->timestamps();

            // Índices para optimizar consultas
            $table->index(['empleado_id', 'fecha']);
            $table->index('fecha');

            // Un empleado solo puede tener un fichaje por día
            $table->unique(['empleado_id', 'fecha']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fichajes');
    }
};