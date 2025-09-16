import { useState, useMemo, useCallback } from 'react';
import type { Empleado, Metricas, UseMetricasReturn } from '@/types';

// Hook personalizado para calcular métricas clave de empleados
// Recibe empleados, año y mes seleccionados para filtrar y calcular métricas
export default function useMetricas(
    empleados: Empleado[],
    añoSeleccionado: number,
    mesSeleccionado: number
): UseMetricasReturn {
    // Estado para manejar carga simulada de métricas
    const [cargandoMetricas, setCargandoMetricas] = useState<boolean>(false);

    // useMemo optimiza cálculos pesados - solo recalcula si cambian las dependencias
    const metricas = useMemo<Metricas>(() => {
        const empleadosPeriodo = empleados.filter(emp => {
            const fechaContratacion = new Date(emp.fecha_contratacion);
            return (
                fechaContratacion.getFullYear() === añoSeleccionado &&
                fechaContratacion.getMonth() + 1 === mesSeleccionado
            );
        });

        // Cálculos de métricas clave, cantidad de empleados activos/inactivos, media de antiguedad y salario, ratio de retención, rango salarial
        const empleadosActivosTotal = empleados.filter(emp => emp.activo).length;
        const empleadosInactivosTotal = empleados.filter(emp => !emp.activo).length;
        const totalEmpleados = empleados.length;

        const promedioAntiguedad =
            empleados.reduce((acc, emp) => {
                const años =
                    (new Date().getTime() - new Date(emp.fecha_contratacion).getTime()) /
                    (1000 * 60 * 60 * 24 * 365);
                return acc + años;
            }, 0) / empleados.length;

        const promedioSalarial =
            empleados.reduce((acc, emp) => {
                const salario = emp.salario ? parseFloat(emp.salario.toString()) : 0;
                return acc + salario;
            }, 0) / empleados.length;

        const ratioRetencion = (empleadosActivosTotal / totalEmpleados) * 100;

        const salarios = empleados
            .map(e => (e.salario ? parseFloat(e.salario.toString()) : 0))
            .filter(s => !isNaN(s) && s > 0);

        const rangoSalarial =
            salarios.length > 0
                ? {
                      min: Math.min(...salarios),
                      max: Math.max(...salarios),
                  }
                : { min: 0, max: 0 };

        // Devuelve todas las métricas calculadas
        return {
            empleadosContratadosMes: empleadosPeriodo.length,
            empleadosActivosTotal,
            empleadosInactivosTotal,
            totalEmpleados,
            promedioAntiguedad,
            promedioSalarial,
            ratioRetencion,
            rangoSalarial,
        };
    }, [empleados, añoSeleccionado, mesSeleccionado]);

    // Función para simular carga de métricas con useCallback para evitar recreación innecesaria
    const simularCarga = useCallback(() => {
        setCargandoMetricas(true);
        const timer = setTimeout(() => {
            setCargandoMetricas(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return { metricas, cargandoMetricas, simularCarga };
}
