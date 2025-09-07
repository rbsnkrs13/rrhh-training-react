import { useState, useMemo, useCallback } from 'react';

export default function useMetricas(empleados, añoSeleccionado, mesSeleccionado) {
    const [cargandoMetricas, setCargandoMetricas] = useState(false);

    // useMemo optimiza cálculos pesados - solo recalcula si cambian las dependencias
    const metricas = useMemo(() => {
        const empleadosPeriodo = empleados.filter(emp => {
            const fechaContratacion = new Date(emp.fecha_contratacion);
            return fechaContratacion.getFullYear() === añoSeleccionado &&
                fechaContratacion.getMonth() + 1 === mesSeleccionado;
        });

        const empleadosActivosTotal = empleados.filter(emp => emp.activo).length;
        const empleadosInactivosTotal = empleados.filter(emp => !emp.activo).length;
        const totalEmpleados = empleados.length;

        const promedioAntiguedad = empleados.reduce((acc, emp) => {
            const años = (new Date() - new Date(emp.fecha_contratacion)) / (1000 * 60 * 60 * 24 * 365);
            return acc + años;
        }, 0) / empleados.length;

        const promedioSalarial = empleados.reduce((acc, emp) => {
            const salario = parseFloat(emp.salario) || 0;
            return acc + salario;
        }, 0) / empleados.length;

        const ratioRetencion = (empleadosActivosTotal / totalEmpleados) * 100;

        return {
            empleadosContratadosMes: empleadosPeriodo.length,
            empleadosActivosTotal,
            empleadosInactivosTotal,
            totalEmpleados,
            promedioAntiguedad,
            promedioSalarial,
            ratioRetencion
        };
    }, [empleados, añoSeleccionado, mesSeleccionado]);

    // useCallback optimiza funciones - evita recrearlas en cada render
    const simularCarga = useCallback(() => {
        setCargandoMetricas(true);
        const timer = setTimeout(() => {
            setCargandoMetricas(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return { metricas, cargandoMetricas, simularCarga };
}