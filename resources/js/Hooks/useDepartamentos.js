import { useMemo } from 'react';

export default  function useDepartamentos(empleados) {
    return useMemo(() => {
        const departamentos = empleados.reduce((acc, emp) => {
            acc[emp.departamento] = (acc[emp.departamento] || 0) + 1;
            return acc;
        }, {});

        const deptoMayorEmpleados = Object.entries(departamentos)
            .sort(([, a], [, b]) => b - a)[0];

        return { departamentos, deptoMayorEmpleados };
    }, [empleados]);
}