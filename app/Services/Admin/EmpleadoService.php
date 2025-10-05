<?php

namespace App\Services\Admin;

use App\Models\Empleado;
use Illuminate\Http\Request;

class EmpleadoService
{
    /**
     * Obtener empleados con filtros y ordenamiento
     */
    public function getEmpleadosFiltrados(Request $request)
    {
        $query = Empleado::query();

        // Filtros desde React
        if ($request->filled('busqueda')) {
            $query->where('nombre', 'like', '%' . $request->busqueda . '%')
                  ->orWhere('email', 'like', '%' . $request->busqueda . '%');
        }

        if ($request->filled('departamento') && $request->departamento !== 'todos') {
            $query->where('departamento', $request->departamento);
        }

        if ($request->filled('estado') && $request->estado !== 'todos') {
            $activo = $request->estado === 'activo';
            $query->where('activo', $activo);
        }

        // Ordenamiento
        $ordenPor = $request->get('ordenPor', 'nombre');
        switch($ordenPor) {
            case 'nombre-desc':
                $query->orderBy('nombre', 'desc');
                break;
            case 'departamento':
                $query->orderBy('departamento')->orderBy('nombre');
                break;
            case 'fecha':
                $query->orderBy('fecha_contratacion', 'desc');
                break;
            default:
                $query->orderBy('nombre');
        }

        return $query->get();
    }

    /**
     * Validar datos de empleado
     */
    public function getValidationRules(?int $empleadoId = null): array
    {
        return [
            'nombre' => 'required|string|min:2|max:255',
            'email' => 'required|email|unique:empleados,email' . ($empleadoId ? ',' . $empleadoId : ''),
            'departamento' => 'required|string|in:IT,RRHH,Ventas,Marketing,Contabilidad,Logística',
            'puesto' => 'required|string|max:255',
            'salario' => 'nullable|numeric|min:0|max:999999.99',
            'fecha_contratacion' => 'required|date|before_or_equal:today',
            'activo' => 'boolean',
            'notas' => 'nullable|string|max:1000'
        ];
    }

    /**
     * Mensajes de validación personalizados
     */
    public function getValidationMessages(): array
    {
        return [
            'email.unique' => 'Ya existe un empleado con ese email',
            'fecha_contratacion.before_or_equal' => 'La fecha de contratación no puede ser futura'
        ];
    }

    /**
     * Crear nuevo empleado
     */
    public function crearEmpleado(array $datos): Empleado
    {
        return Empleado::create($datos);
    }

    /**
     * Actualizar empleado
     */
    public function actualizarEmpleado(Empleado $empleado, array $datos): Empleado
    {
        $empleado->update($datos);
        return $empleado;
    }

    /**
     * Eliminar empleado
     */
    public function eliminarEmpleado(Empleado $empleado): string
    {
        $nombre = $empleado->nombre;
        $empleado->delete();
        return $nombre;
    }
}
