<?php

namespace App\Services;

use App\Models\Nomina;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser;

class NominaService
{
    /**
     * Procesar archivo de nómina y extraer información del nombre
     * Formato esperado: DNI_nombre_fecha.pdf o DNI_fecha.pdf
     */
    public function procesarArchivoNomina($archivo, int $año, int $mes): array
    {
        $nombreArchivo = $archivo->getClientOriginalName();

        // Extraer DNI del nombre del archivo
        $dni = $this->extraerDNI($nombreArchivo);

        if (!$dni) {
            return [
                'success' => false,
                'error' => "No se pudo extraer el DNI del archivo: {$nombreArchivo}",
                'archivo' => $nombreArchivo
            ];
        }

        // Buscar empleado por DNI
        $empleado = User::where('dni', $dni)->first();

        if (!$empleado) {
            return [
                'success' => false,
                'error' => "No se encontró empleado con DNI: {$dni}",
                'archivo' => $nombreArchivo,
                'dni' => $dni
            ];
        }

        // Verificar si ya existe nómina para este período
        $nominaExistente = Nomina::deEmpleado($empleado->id)
            ->delPeriodo($año, $mes)
            ->first();

        if ($nominaExistente) {
            return [
                'success' => false,
                'error' => "Ya existe nómina para {$empleado->name} en {$mes}/{$año}",
                'archivo' => $nombreArchivo,
                'empleado' => $empleado->name
            ];
        }

        // Guardar archivo
        $nombreArchivoGuardado = "nomina_{$empleado->id}_{$año}_{$mes}.pdf";
        $rutaArchivo = "nominas/{$año}/{$mes}";
        $archivoPath = $archivo->storeAs($rutaArchivo, $nombreArchivoGuardado, 'local');

        // Intentar extraer datos del PDF
        // Laravel 11 guarda en storage/app/private/ por defecto con disco 'local'
        $rutaCompletaPDF = Storage::disk('local')->path($archivoPath);
        $datosPDF = $this->extraerDatosPDF($rutaCompletaPDF);

        // Crear nómina con datos extraídos (o null si no se pudieron extraer)
        $nomina = Nomina::create([
            'empleado_id' => $empleado->id,
            'año' => $año,
            'mes' => $mes,
            'archivo_nombre' => $nombreArchivoGuardado,
            'archivo_path' => $archivoPath,
            'archivo_mime_type' => $archivo->getMimeType(),
            'archivo_tamaño' => $archivo->getSize(),
            'salario_bruto' => $datosPDF['salario_bruto'] ?? null,
            'salario_neto' => $datosPDF['salario_neto'] ?? null,
            'deducciones_ss' => $datosPDF['deducciones_ss'] ?? null,
            'deducciones_irpf' => $datosPDF['deducciones_irpf'] ?? null,
            'estado' => $datosPDF['completo'] ? 'enviada' : 'pendiente_completar',
        ]);

        return [
            'success' => true,
            'nomina' => $nomina,
            'empleado' => $empleado->name,
            'archivo' => $nombreArchivo
        ];
    }

    /**
     * Extraer DNI del nombre del archivo
     * Formatos soportados:
     * - 12345678A_NombreApellido_202501.pdf
     * - 12345678A_202501.pdf
     * - 12345678-A_NombreApellido_202501.pdf
     */
    private function extraerDNI(string $nombreArchivo): ?string
    {
        // Eliminar extensión
        $sinExtension = pathinfo($nombreArchivo, PATHINFO_FILENAME);

        // Intentar extraer DNI (8 dígitos + letra o guion + letra)
        if (preg_match('/^(\d{8}[-]?[A-Za-z])/', $sinExtension, $matches)) {
            return strtoupper(str_replace('-', '', $matches[1]));
        }

        return null;
    }

    /**
     * Procesar múltiples archivos de nóminas
     */
    public function procesarMultiplesNominas(array $archivos, int $año, int $mes): array
    {
        $resultados = [
            'exitosos' => [],
            'errores' => [],
            'total' => count($archivos),
            'procesados' => 0,
        ];

        foreach ($archivos as $archivo) {
            $resultado = $this->procesarArchivoNomina($archivo, $año, $mes);

            if ($resultado['success']) {
                $resultados['exitosos'][] = $resultado;
                $resultados['procesados']++;
            } else {
                $resultados['errores'][] = $resultado;
            }
        }

        return $resultados;
    }

    /**
     * Validar formato de archivo de nómina
     */
    public function validarFormatoArchivo(string $nombreArchivo): array
    {
        $dni = $this->extraerDNI($nombreArchivo);
        $empleado = $dni ? User::where('dni', $dni)->first() : null;

        return [
            'valido' => (bool) $dni,
            'dni' => $dni,
            'empleado' => $empleado ? $empleado->name : null,
            'empleado_id' => $empleado?->id,
        ];
    }

    /**
     * Extraer datos del PDF de nómina
     * Intenta parsear texto y buscar patrones de salarios y deducciones
     */
    private function extraerDatosPDF(string $rutaArchivo): array
    {
        try {
            $parser = new Parser();
            $pdf = $parser->parseFile($rutaArchivo);
            $texto = $pdf->getText();

            // Normalizar texto: eliminar saltos de línea múltiples y espacios
            $texto = preg_replace('/\s+/', ' ', $texto);

            $salarioBruto = $this->extraerSalarioBruto($texto);
            $salarioNeto = $this->extraerSalarioNeto($texto);
            $deduccionesSS = $this->extraerDeduccionesSS($texto);
            $deduccionesIRPF = $this->extraerDeduccionesIRPF($texto);

            // Determinar si se pudo extraer información completa
            $completo = $salarioBruto !== null || $salarioNeto !== null;

            return [
                'salario_bruto' => $salarioBruto,
                'salario_neto' => $salarioNeto,
                'deducciones_ss' => $deduccionesSS,
                'deducciones_irpf' => $deduccionesIRPF,
                'completo' => $completo,
            ];
        } catch (\Exception $e) {
            // Si falla el parser, devolver array vacío para que se marque como pendiente
            return [
                'salario_bruto' => null,
                'salario_neto' => null,
                'deducciones_ss' => null,
                'deducciones_irpf' => null,
                'completo' => false,
            ];
        }
    }

    /**
     * Extraer salario bruto del texto del PDF
     * Busca patrones comunes: "Salario Bruto", "Total Devengado", "Base"
     */
    private function extraerSalarioBruto(string $texto): ?float
    {
        $patrones = [
            '/(?:Salario Bruto|Total Devengado|Base)[:\s]+([0-9.,]+)[\s€]?/i',
            '/(?:Bruto)[:\s]+([0-9.,]+)[\s€]?/i',
            '/(?:Total Bruto)[:\s]+([0-9.,]+)[\s€]?/i',
        ];

        foreach ($patrones as $patron) {
            if (preg_match($patron, $texto, $matches)) {
                return $this->parsearMoneda($matches[1]);
            }
        }

        return null;
    }

    /**
     * Extraer salario neto del texto del PDF
     * Busca patrones: "Líquido a percibir", "Total Neto", "A percibir"
     */
    private function extraerSalarioNeto(string $texto): ?float
    {
        $patrones = [
            '/(?:Líquido a percibir|Liquido a percibir)[:\s]+([0-9.,]+)[\s€]?/i',
            '/(?:Total Neto|Neto)[:\s]+([0-9.,]+)[\s€]?/i',
            '/(?:A percibir)[:\s]+([0-9.,]+)[\s€]?/i',
            '/(?:Importe Neto)[:\s]+([0-9.,]+)[\s€]?/i',
        ];

        foreach ($patrones as $patron) {
            if (preg_match($patron, $texto, $matches)) {
                return $this->parsearMoneda($matches[1]);
            }
        }

        return null;
    }

    /**
     * Extraer deducciones de Seguridad Social
     */
    private function extraerDeduccionesSS(string $texto): ?float
    {
        $patrones = [
            '/(?:Seguridad Social|S\.Social|SS|Cotización)[:\s]+([0-9.,]+)[\s€]?/i',
            '/(?:Aportación SS)[:\s]+([0-9.,]+)[\s€]?/i',
        ];

        foreach ($patrones as $patron) {
            if (preg_match($patron, $texto, $matches)) {
                return $this->parsearMoneda($matches[1]);
            }
        }

        return null;
    }

    /**
     * Extraer deducciones de IRPF
     */
    private function extraerDeduccionesIRPF(string $texto): ?float
    {
        $patrones = [
            '/(?:IRPF|I\.R\.P\.F\.)[:\s]+([0-9.,]+)[\s€]?/i',
            '/(?:Retención IRPF)[:\s]+([0-9.,]+)[\s€]?/i',
        ];

        foreach ($patrones as $patron) {
            if (preg_match($patron, $texto, $matches)) {
                return $this->parsearMoneda($matches[1]);
            }
        }

        return null;
    }

    /**
     * Convertir string de moneda a float
     * Soporta formatos: "2.500,00", "2500.00", "2,500.00"
     */
    private function parsearMoneda(string $valor): ?float
    {
        // Eliminar espacios y símbolo de euro
        $valor = trim(str_replace(['€', ' '], '', $valor));

        // Detectar formato: si tiene punto antes de coma, es formato europeo (2.500,00)
        if (preg_match('/\..*,/', $valor)) {
            // Formato europeo: eliminar puntos, reemplazar coma por punto
            $valor = str_replace(['.', ','], ['', '.'], $valor);
        } else {
            // Formato anglosajón o sin separadores: eliminar comas
            $valor = str_replace(',', '', $valor);
        }

        $float = filter_var($valor, FILTER_VALIDATE_FLOAT);

        return $float !== false ? $float : null;
    }

    /**
     * Actualizar datos de nómina manualmente
     */
    public function actualizarDatosNomina(Nomina $nomina, array $datos): Nomina
    {
        $nomina->update([
            'salario_bruto' => $datos['salario_bruto'] ?? $nomina->salario_bruto,
            'salario_neto' => $datos['salario_neto'] ?? $nomina->salario_neto,
            'deducciones_ss' => $datos['deducciones_ss'] ?? $nomina->deducciones_ss,
            'deducciones_irpf' => $datos['deducciones_irpf'] ?? $nomina->deducciones_irpf,
            'observaciones' => $datos['observaciones'] ?? $nomina->observaciones,
        ]);

        // Si se completaron los datos principales, cambiar estado
        if ($nomina->salario_bruto && $nomina->salario_neto) {
            $nomina->update(['estado' => 'enviada']);
        }

        return $nomina->fresh();
    }
}
