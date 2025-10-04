<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $empleados = Empleado::all();

        return Inertia::render('Admin/Dashboard', [
            'empleadosIniciales' => $empleados,
            'configuracion' => [
                'empresa' => 'RRHH',
                'version' => '2.0.0'
            ]
        ]);
    }
}
