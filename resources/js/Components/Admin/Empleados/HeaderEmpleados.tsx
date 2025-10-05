import { Link } from '@inertiajs/react';

interface HeaderEmpleadosProps {
    totalEmpleados: number;
    empleadosFiltrados: number;
}

export default function HeaderEmpleados({ totalEmpleados, empleadosFiltrados }: HeaderEmpleadosProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
                <p className="text-gray-600 mt-1">
                    Mostrando {empleadosFiltrados} de {totalEmpleados} empleados
                </p>
            </div>

            <div className="flex space-x-3 mt-4 sm:mt-0">
                <Link
                    href="/admin/empleados/create"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    ➕ Nuevo Empleado
                </Link>
                <Link
                    href="/admin/dashboard"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    ← Dashboard
                </Link>
            </div>
        </div>
    );
}
