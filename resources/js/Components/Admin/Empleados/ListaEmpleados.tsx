import { useState } from 'react';
import TarjetaEmpleado from './TarjetaEmpleado';
import type { Filtros } from '@/types';

interface Empleado {
    id: number;
    nombre: string;
    email: string;
    departamento: string;
    puesto?: string;
    salario?: number;
    fecha_contratacion: string;
    antiguedad?: number;
    activo: boolean;
    notas?: string;
}

interface ListaEmpleadosProps {
    empleados: Empleado[];
    filtros: Filtros;
}

export default function ListaEmpleados({ empleados, filtros }: ListaEmpleadosProps) {
    const [expandidos, setExpandidos] = useState<Record<number, boolean>>({});

    const toggleExpandido = (empleadoId: number) => {
        setExpandidos(prev => ({
            ...prev,
            [empleadoId]: !prev[empleadoId],
        }));
    };

    if (empleados.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Empleados (0)
                    </h2>
                </div>
                <div className="p-6">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-xl text-gray-500 mb-2">
                            No se encontraron empleados
                        </p>
                        <p className="text-gray-400">
                            {filtros.busqueda ||
                            filtros.departamento !== 'todos' ||
                            filtros.estado !== 'todos'
                                ? 'Prueba ajustando los filtros de búsqueda'
                                : 'No hay empleados registrados en el sistema'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                    Empleados ({empleados.length})
                </h2>
            </div>

            <div className="p-6">
                <div className="grid gap-4">
                    {empleados.map(empleado => (
                        <TarjetaEmpleado
                            key={empleado.id}
                            empleado={empleado}
                            expandido={expandidos[empleado.id] || false}
                            onToggle={() => toggleExpandido(empleado.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
