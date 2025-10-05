import { router } from '@inertiajs/react';

interface Empleado {
    id: number;
    name: string;
    dni: string;
}

interface FiltrosNominasProps {
    año: number;
    mes?: number;
    empleados: Empleado[];
    añosDisponibles: number[];
}

export default function FiltrosNominas({ año, mes, empleados, añosDisponibles }: FiltrosNominasProps) {
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const aplicarFiltros = (nuevoAño?: number, nuevoMes?: number, empleadoId?: number) => {
        const params: Record<string, string> = {};

        if (nuevoAño !== undefined) params.año = nuevoAño.toString();
        if (nuevoMes !== undefined) params.mes = nuevoMes.toString();
        if (empleadoId !== undefined) params.empleado_id = empleadoId.toString();

        router.get(route('admin.nominas.index'), params, { preserveState: true });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                    <select
                        value={año}
                        onChange={(e) => aplicarFiltros(parseInt(e.target.value), mes)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        {añosDisponibles.map(a => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                    <select
                        value={mes || ''}
                        onChange={(e) => aplicarFiltros(año, e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Todos los meses</option>
                        {meses.map((m, i) => (
                            <option key={i} value={i + 1}>{m}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Empleado</label>
                    <select
                        onChange={(e) => aplicarFiltros(año, mes, e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Todos los empleados</option>
                        {empleados.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name} ({emp.dni})</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
