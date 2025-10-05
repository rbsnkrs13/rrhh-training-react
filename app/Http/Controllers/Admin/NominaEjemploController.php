<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;

class NominaEjemploController extends Controller
{
    private $empleados = [
        ['dni' => '12345678A', 'nombre' => 'Admin RRHH', 'salario_bruto' => 3500.00, 'ss' => 222.25, 'irpf' => 525.00],
        ['dni' => '23456789B', 'nombre' => 'María García López', 'salario_bruto' => 2800.00, 'ss' => 177.80, 'irpf' => 420.00],
        ['dni' => '34567890C', 'nombre' => 'Carlos Rodríguez Sánchez', 'salario_bruto' => 3200.00, 'ss' => 203.20, 'irpf' => 480.00],
        ['dni' => '45678901D', 'nombre' => 'Ana Martínez Fernández', 'salario_bruto' => 2600.00, 'ss' => 165.10, 'irpf' => 390.00],
        ['dni' => '56789012E', 'nombre' => 'David López Pérez', 'salario_bruto' => 2900.00, 'ss' => 184.15, 'irpf' => 435.00],
        ['dni' => '67890123F', 'nombre' => 'Laura Hernández Ruiz', 'salario_bruto' => 3100.00, 'ss' => 196.85, 'irpf' => 465.00],
        ['dni' => '78901234G', 'nombre' => 'Jorge Silva Torres', 'salario_bruto' => 2700.00, 'ss' => 171.45, 'irpf' => 405.00],
    ];

    /**
     * Descargar todas las nóminas en ZIP
     */
    public function descargarTodas(Request $request)
    {
        $año = $request->get('año', Carbon::now()->year);
        $mes_num = $request->get('mes', Carbon::now()->month);
        $fecha = Carbon::create($año, $mes_num, 1);
        $mes = $fecha->locale('es')->isoFormat('MMMM');

        $zip = new \ZipArchive();
        $zipFileName = "nominas_{$mes}_{$año}.zip";
        $zipPath = storage_path("app/temp/{$zipFileName}");

        // Crear directorio temporal si no existe
        if (!file_exists(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }

        if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === true) {
            foreach ($this->empleados as $index => $empleado) {
                // Calcular salario neto
                $salario_neto = $empleado['salario_bruto'] - $empleado['ss'] - $empleado['irpf'];
                $fecha_emision = $fecha->copy()->endOfMonth()->locale('es')->isoFormat('D [de] MMMM [de] YYYY');

                $data = [
                    'empleado' => $empleado,
                    'salario_neto' => $salario_neto,
                    'mes' => ucfirst($mes),
                    'año' => $año,
                    'fecha_emision' => $fecha_emision,
                    'titulo' => "{$empleado['nombre']} - {$mes} {$año}",
                ];

                // Generar PDF
                $pdf = Pdf::loadView('nominas.plantilla', $data);
                $pdfContent = $pdf->output();

                // Nombre del archivo en el ZIP (sin número de índice)
                $fileName = "{$empleado['dni']}_{$empleado['nombre']}_{$año}" . str_pad($mes_num, 2, '0', STR_PAD_LEFT) . ".pdf";
                $fileName = str_replace(' ', '', $fileName);

                $zip->addFromString($fileName, $pdfContent);
            }

            $zip->close();

            return response()->download($zipPath)->deleteFileAfterSend(true);
        }

        return back()->with('error', 'No se pudo generar el archivo ZIP');
    }
}
