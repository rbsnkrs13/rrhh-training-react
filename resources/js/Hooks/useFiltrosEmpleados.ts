import { useState, useMemo } from 'react';

interface Filtros {
    busqueda: string;
    departamento: string;
    estado: string;
    ordenPor: string;
}

interface Empleado {
    id: number;
    nombre: string;
    departamento: string;
    activo: boolean;
    [key: string]: any;
}

export function useFiltrosEmpleados(empleados: Empleado[]) {
    const [filtros, setFiltros] = useState<Filtros>({
        busqueda: '',
        departamento: 'todos',
        estado: 'todos',
        ordenPor: 'nombre',
    });

    const empleadosFiltrados = useMemo(() => {
        return empleados
            .filter(empleado => {
                const coincideBusqueda = empleado.nombre
                    .toLowerCase()
                    .includes(filtros.busqueda.toLowerCase());

                const coincideDepartamento =
                    filtros.departamento === 'todos' || empleado.departamento === filtros.departamento;

                const coincideEstado =
                    filtros.estado === 'todos' ||
                    (filtros.estado === 'activo' && empleado.activo) ||
                    (filtros.estado === 'inactivo' && !empleado.activo);

                return coincideBusqueda && coincideDepartamento && coincideEstado;
            })
            .sort((a, b) => {
                switch (filtros.ordenPor) {
                    case 'nombre':
                        return a.nombre.localeCompare(b.nombre);
                    case 'nombre-desc':
                        return b.nombre.localeCompare(a.nombre);
                    case 'departamento':
                        return a.departamento.localeCompare(b.departamento);
                    case 'estado':
                        return (b.activo ? 1 : 0) - (a.activo ? 1 : 0);
                    default:
                        return 0;
                }
            });
    }, [empleados, filtros]);

    const departamentos = useMemo(() => {
        return [...new Set(empleados.map(emp => emp.departamento))];
    }, [empleados]);

    return {
        filtros,
        setFiltros,
        empleadosFiltrados,
        departamentos
    };
}
