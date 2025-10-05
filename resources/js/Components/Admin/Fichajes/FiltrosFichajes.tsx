import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';

interface Empleado {
    id: number;
    name: string;
}

interface FiltrosFichajesProps {
    empleados: Empleado[];
    filtrosActuales: {
        empleado_id?: string;
        fecha_desde?: string;
        fecha_hasta?: string;
        estado?: string;
    };
}

export default function FiltrosFichajes({ empleados, filtrosActuales }: FiltrosFichajesProps) {
    const [empleadoFiltro, setEmpleadoFiltro] = useState(filtrosActuales.empleado_id || '');
    const [fechaDesde, setFechaDesde] = useState(filtrosActuales.fecha_desde || '');
    const [fechaHasta, setFechaHasta] = useState(filtrosActuales.fecha_hasta || '');
    const [estadoFiltro, setEstadoFiltro] = useState(filtrosActuales.estado || '');

    const handleLimpiarFiltros = () => {
        router.get('/admin/fichajes', {}, {
            preserveState: false,
        });
    };

    const handleAplicarFiltros = () => {
        router.get('/admin/fichajes', {
            empleado_id: empleadoFiltro || undefined,
            fecha_desde: fechaDesde || undefined,
            fecha_hasta: fechaHasta || undefined,
            estado: estadoFiltro || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Filtros
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Filtro Empleado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Empleado
                        </label>
                        <select
                            value={empleadoFiltro}
                            onChange={(e) => setEmpleadoFiltro(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos</option>
                            {empleados.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro Fecha Desde */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Desde
                        </label>
                        <input
                            type="date"
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filtro Fecha Hasta */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hasta
                        </label>
                        <input
                            type="date"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filtro Estado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado
                        </label>
                        <select
                            value={estadoFiltro}
                            onChange={(e) => setEstadoFiltro(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos</option>
                            <option value="completo">Completo</option>
                            <option value="en_curso">En Curso</option>
                            <option value="incompleto">Incompleto</option>
                            <option value="sin_fichar">Sin Fichar</option>
                        </select>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleLimpiarFiltros}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                    >
                        Limpiar Filtros
                    </button>
                    <button
                        onClick={handleAplicarFiltros}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
}
