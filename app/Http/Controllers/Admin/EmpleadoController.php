<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use App\Services\Admin\EmpleadoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmpleadoController extends Controller
{
    protected $empleadoService;

    public function __construct(EmpleadoService $empleadoService)
    {
        $this->empleadoService = $empleadoService;
    }

    //Busca y filtra empleados, con paginación y ordenamiento
    public function index(Request $request)
    {
        $empleados = $this->empleadoService->getEmpleadosFiltrados($request);

        return Inertia::render('Admin/Empleados/Index', [
            'empleados' => $empleados,
            'filtros' => $request->only(['busqueda', 'departamento', 'estado', 'ordenPor'])
        ]);
    }

    // Formulario para crear un nuevo empleado
    public function create()
    {
        return Inertia::render('Admin/Empleados/Crear');
    }

    // Almacena un nuevo empleado en la base de datos validando los datos recibidos
    public function store(Request $request)
    {
        $datos = $request->validate(
            $this->empleadoService->getValidationRules(),
            $this->empleadoService->getValidationMessages()
        );

        $empleado = $this->empleadoService->crearEmpleado($datos);

        return redirect()->route('empleados.index')
            ->with('success', '✅ Empleado "' . $empleado->nombre . '" creado exitosamente');
    }

    // Muestra los detalles de un empleado específico
    public function show(Empleado $empleado)
    {
        // Cargar relaciones necesarias
        $empleado->load(['contrato', 'user']);

        // Obtener últimos 30 fichajes
        $fichajes = \App\Models\Fichaje::where('empleado_id', $empleado->id)
            ->orderBy('fecha', 'desc')
            ->orderBy('hora', 'desc')
            ->limit(30)
            ->get()
            ->map(function($fichaje) {
                return [
                    'id' => $fichaje->id,
                    'fecha' => $fichaje->fecha,
                    'hora' => \Carbon\Carbon::parse($fichaje->hora)->format('H:i'),
                    'tipo' => $fichaje->tipo,
                ];
            });

        // Obtener nóminas
        $nominas = \App\Models\Nomina::where('empleado_id', $empleado->id)
            ->orderBy('año', 'desc')
            ->orderBy('mes', 'desc')
            ->limit(12)
            ->get()
            ->map(function($nomina) {
                return [
                    'id' => $nomina->id,
                    'mes' => $nomina->mes,
                    'año' => $nomina->año,
                    'nombre_mes' => $nomina->nombre_mes,
                    'salario_bruto' => $nomina->salario_bruto,
                    'salario_neto' => $nomina->salario_neto,
                    'estado' => $nomina->estado,
                ];
            });

        // Calcular estadísticas
        $estadisticas = [
            'total_fichajes' => \App\Models\Fichaje::where('empleado_id', $empleado->id)->count(),
            'horas_mes_actual' => \App\Models\Fichaje::calcularHorasMes($empleado->id, now()->year, now()->month),
            'dias_trabajados_mes' => \App\Models\Fichaje::where('empleado_id', $empleado->id)
                ->whereYear('fecha', now()->year)
                ->whereMonth('fecha', now()->month)
                ->distinct('fecha')
                ->count('fecha'),
        ];

        return Inertia::render('Admin/Empleados/Ver', [
            'empleado' => $empleado,
            'fichajes' => $fichajes,
            'nominas' => $nominas,
            'estadisticas' => $estadisticas,
        ]);
    }

    // Formulario para editar un empleado existente
    public function edit(Empleado $empleado)
    {
        return Inertia::render('Admin/Empleados/Editar', [
            'empleado' => $empleado
        ]);
    }

    // Actualiza un empleado existente en la base de datos validando los datos recibidos
    public function update(Request $request, Empleado $empleado)
    {
        $datos = $request->validate(
            $this->empleadoService->getValidationRules($empleado->id),
            $this->empleadoService->getValidationMessages()
        );

        $empleado = $this->empleadoService->actualizarEmpleado($empleado, $datos);

        return redirect()->route('empleados.index')
            ->with('success', '✅ Empleado "' . $empleado->nombre . '" actualizado exitosamente');
    }

    // Elimina un empleado de la base de datos
    public function destroy(Empleado $empleado)
    {
        $nombre = $this->empleadoService->eliminarEmpleado($empleado);

        return redirect()->route('empleados.index')
            ->with('success', '🗑️ Empleado "' . $nombre . '" eliminado exitosamente');
    }
}