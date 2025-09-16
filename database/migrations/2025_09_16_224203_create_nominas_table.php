<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nominas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empleado_id')->constrained('users')->onDelete('cascade');
            $table->integer('año');
            $table->integer('mes');
            $table->string('archivo_nombre');
            $table->string('archivo_path');
            $table->string('archivo_mime_type');
            $table->bigInteger('archivo_tamaño');
            $table->decimal('salario_bruto', 10, 2)->nullable();
            $table->decimal('salario_neto', 10, 2)->nullable();
            $table->text('observaciones')->nullable();
            $table->enum('estado', ['pendiente', 'enviada', 'vista'])->default('pendiente');
            $table->timestamp('fecha_descarga')->nullable();
            $table->timestamps();

            // Índices para optimizar consultas
            $table->index(['empleado_id', 'año', 'mes']);
            $table->index(['año', 'mes']);
            $table->index('estado');

            // Un empleado solo puede tener una nómina por mes/año
            $table->unique(['empleado_id', 'año', 'mes']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nominas');
    }
};