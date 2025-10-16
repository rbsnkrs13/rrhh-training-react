<?php

namespace App\Http\Controllers\User;

use App\Services\User\DashboardService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Mostrar dashboard del empleado
     */
    public function index(): Response
    {
        $user = Auth::user();

        $datos = $this->dashboardService->obtenerDatosDashboard($user->id, $user->email);

        return Inertia::render('Employee/EmpleadoDashboard', $datos);
    }
}
