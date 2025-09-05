<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmpleadoController extends Controller
{
    public function index(Request $request)
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

        $empleados = $query->get();

        return Inertia::render('Empleados', [
            'empleados' => $empleados,
            'filtros' => $request->only(['busqueda', 'departamento', 'estado', 'ordenPor'])
        ]);
    }

    public function create()
    {
        return Inertia::render('CrearEmpleado');
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|min:2|max:255',
            'email' => 'required|email|unique:empleados,email',
            'departamento' => 'required|string|in:IT,RRHH,Ventas,Marketing,Contabilidad,Logística',
            'puesto' => 'required|string|max:255',
            'salario' => 'nullable|numeric|min:0|max:999999.99',
            'fecha_contratacion' => 'required|date|before_or_equal:today',
            'activo' => 'boolean',
            'notas' => 'nullable|string|max:1000'
        ], [
            'email.unique' => 'Ya existe un empleado con ese email',
            'fecha_contratacion.before_or_equal' => 'La fecha de contratación no puede ser futura'
        ]);

        Empleado::create($datos);

        return redirect()->route('empleados.index')
            ->with('success', '✅ Empleado "' . $datos['nombre'] . '" creado exitosamente');
    }

    public function show(Empleado $empleado)
    {
        return Inertia::render('VerEmpleado', [
            'empleado' => $empleado
        ]);
    }

    public function edit(Empleado $empleado)
    {
        return Inertia::render('EditarEmpleado', [
            'empleado' => $empleado
        ]);
    }

    public function update(Request $request, Empleado $empleado)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|min:2|max:255',
            'email' => 'required|email|unique:empleados,email,' . $empleado->id,
            'departamento' => 'required|string|in:IT,RRHH,Ventas,Marketing,Contabilidad,Logística',
            'puesto' => 'required|string|max:255',
            'salario' => 'nullable|numeric|min:0|max:999999.99',
            'fecha_contratacion' => 'required|date|before_or_equal:today',
            'activo' => 'boolean',
            'notas' => 'nullable|string|max:1000'
        ]);

        $empleado->update($datos);

        return redirect()->route('empleados.index')
            ->with('success', '✅ Empleado "' . $datos['nombre'] . '" actualizado exitosamente');
    }

    public function destroy(Empleado $empleado)
    {
        $nombre = $empleado->nombre;
        $empleado->delete();

        return redirect()->route('empleados.index')
            ->with('success', '🗑️ Empleado "' . $nombre . '" eliminado exitosamente');
    }
}