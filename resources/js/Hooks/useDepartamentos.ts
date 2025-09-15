import { useMemo } from 'react';
import type { Empleado, Departamento, UseDepartamentosReturn } from '@/types';

export default function useDepartamentos(empleados: Empleado[]): UseDepartamentosReturn {
    return useMemo(() => {
        const conteoDeptos = empleados.reduce((acc, emp) => {
            acc[emp.departamento] = (acc[emp.departamento] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Mantener estructura original para compatibilidad
        const departamentos = conteoDeptos;

        const deptoMayorEmpleados = Object.entries(departamentos)
            .sort(([, a], [, b]) => b - a)[0] || ['', 0];

        return { departamentos, deptoMayorEmpleados };
    }, [empleados]);
}