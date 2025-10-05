<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\DashboardService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'empleadosIniciales' => $this->dashboardService->getEmpleados(),
            'configuracion' => [
                'empresa' => 'RRHH',
                'version' => '2.0.0'
            ],
            'estadisticasNominas' => $this->dashboardService->getEstadisticasNominas(),
            'estadisticasFichajes' => $this->dashboardService->getEstadisticasFichajes(),
            'ultimosFichajes' => $this->dashboardService->getUltimosFichajes()
        ]);
    }
}
