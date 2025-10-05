import { router } from '@inertiajs/react';

interface Empleado {
    id: number;
    name: string;
}

interface SelectorEmpleadoProps {
    empleados: Empleado[];
    empleadoSeleccionado?: number;
    ruta: string;
}

export default function SelectorEmpleado({ empleados, empleadoSeleccionado, ruta }: SelectorEmpleadoProps) {
    const handleChange = (empleadoId: string) => {
        router.get(ruta, { empleado_id: empleadoId }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Seleccionar Empleado</h3>
                <select
                    value={empleadoSeleccionado || ''}
                    onChange={(e) => handleChange(e.target.value)}
                    className="w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Selecciona un empleado --</option>
                    {empleados.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                            {emp.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
