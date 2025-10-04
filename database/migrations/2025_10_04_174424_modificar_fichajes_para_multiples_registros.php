<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fichajes', function (Blueprint $table) {
            // Eliminar constraint único (ahora permitimos múltiples registros por día)
            $table->dropUnique(['empleado_id', 'fecha']);

            // Eliminar columnas antiguas
            $table->dropColumn(['hora_entrada', 'hora_salida', 'horas_trabajadas', 'estado']);

            // Añadir nuevas columnas
            $table->enum('tipo', ['entrada', 'salida'])->after('fecha');
            $table->time('hora')->after('tipo');
        });
    }

    public function down(): void
    {
        Schema::table('fichajes', function (Blueprint $table) {
            // Restaurar columnas antiguas
            $table->dropColumn(['tipo', 'hora']);

            $table->time('hora_entrada')->nullable();
            $table->time('hora_salida')->nullable();
            $table->decimal('horas_trabajadas', 5, 2)->nullable();
            $table->enum('estado', ['pendiente', 'incompleto', 'completo'])->default('pendiente');

            // Restaurar constraint único
            $table->unique(['empleado_id', 'fecha']);
        });
    }
};
