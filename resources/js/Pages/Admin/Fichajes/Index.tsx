import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import FlashMessage from '@/Components/Common/FlashMessage';
import { Clock, Calendar, BarChart3, AlertCircle } from 'lucide-react';

interface FichajeIndividual {
    id: number;
    tipo: 'entrada' | 'salida';
    hora: string;
}

interface FichajeDia {
    fecha: string;
    fichajes: FichajeIndividual[];
    horas_trabajadas: number;
    tiene_entrada_abierta: boolean;
}

interface Estadisticas {
    total_dias_trabajados: number;
    total_horas_mes: number;
    promedio_horas_dia: number;
}

interface FichajesIndexProps extends PageProps {
    fichajesHoy: FichajeIndividual[];
    tieneEntradaAbierta: boolean;
    fichajesDelMes: FichajeDia[];
    estadisticas: Estadisticas;
    fechaActual: string;
    empleados?: any[];
    empleadoSeleccionado?: number;
}

export default function Index({
    fichajesHoy,
    tieneEntradaAbierta,
    fichajesDelMes,
    estadisticas,
    fechaActual,
    empleados = [],
    empleadoSeleccionado
}: FichajesIndexProps) {
    const handleEmpleadoChange = (empleadoId: string) => {
        router.get('/admin/fichajes', { empleado_id: empleadoId }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatearHora = (hora: string) => {
        if (!hora) return '--:--';
        // Extraer solo HH:mm de timestamp
        const horaPart = hora.split('T')[1] || hora;
        return horaPart.substring(0, 5);
    };

    const calcularHorasHoy = () => {
        if (fichajesDelMes.length === 0) return 0;
        const hoy = fichajesDelMes.find(f => f.fecha.split('T')[0] === fechaActual);
        return hoy?.horas_trabajadas || 0;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Fichajes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <FlashMessage />

                    {/* Selector de Empleado */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Seleccionar Empleado</h3>
                            <select
                                value={empleadoSeleccionado || ''}
                                onChange={(e) => handleEmpleadoChange(e.target.value)}
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

                    {!empleadoSeleccionado ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-12 text-center text-gray-500">
                                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <p className="text-lg">Selecciona un empleado para ver sus fichajes</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Fichaje de Hoy */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <Clock className="w-5 h-5 mr-2" />
                                Fichaje de Hoy
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Estado Actual */}
                                <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center">
                                    <div className="text-sm text-gray-500">Estado Actual</div>
                                    <div className="text-lg font-semibold mt-1">
                                        {tieneEntradaAbierta ? (
                                            <span className="text-yellow-600">Fichado</span>
                                        ) : fichajesHoy.length > 0 ? (
                                            <span className="text-green-600">Completo</span>
                                        ) : (
                                            <span className="text-gray-600">Sin fichar</span>
                                        )}
                                    </div>
                                </div>

                                {/* Fichajes de Hoy */}
                                <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center">
                                    <div className="text-sm text-gray-500">Fichajes de Hoy</div>
                                    <div className="text-lg font-semibold mt-1">
                                        {fichajesHoy.length > 0 ? (
                                            <div>
                                                <div>{fichajesHoy.length} fichajes</div>
                                                <div className="text-sm text-gray-600 font-normal">
                                                    Último: {formatearHora(fichajesHoy[fichajesHoy.length - 1].hora)}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">Sin fichajes</span>
                                        )}
                                    </div>
                                </div>

                                {/* Horas Trabajadas */}
                                <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center">
                                    <div className="text-sm text-gray-500">Horas Trabajadas Hoy</div>
                                    <div className="text-lg font-semibold mt-1">
                                        {calcularHorasHoy().toFixed(1)}h
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Estadísticas del Mes */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <BarChart3 className="w-5 h-5 mr-2" />
                                Estadísticas del Mes
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {estadisticas.total_dias_trabajados}
                                    </div>
                                    <div className="text-sm text-gray-600">Días Trabajados</div>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {Number(estadisticas.total_horas_mes).toFixed(1)}h
                                    </div>
                                    <div className="text-sm text-gray-600">Total Horas</div>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {Number(estadisticas.promedio_horas_dia).toFixed(1)}h
                                    </div>
                                    <div className="text-sm text-gray-600">Promedio/Día</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fichajes Recientes */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Fichajes del Mes
                                </h3>
                                {empleadoSeleccionado && (
                                    <a
                                        href={`/admin/fichajes/historial?empleado_id=${empleadoSeleccionado}`}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Ver historial completo
                                    </a>
                                )}
                            </div>

                            {fichajesDelMes.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fecha
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fichajes
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Horas
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {fichajesDelMes.slice(0, 10).map((dia, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(dia.fecha).toLocaleDateString('es-ES')}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        <div className="flex flex-wrap gap-2">
                                                            {dia.fichajes.map((f) => (
                                                                <span
                                                                    key={f.id}
                                                                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                                                        f.tipo === 'entrada'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-red-100 text-red-800'
                                                                    }`}
                                                                >
                                                                    {f.tipo === 'entrada' ? '→' : '←'} {formatearHora(f.hora)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {dia.horas_trabajadas.toFixed(1)}h
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            dia.tiene_entrada_abierta
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-green-100 text-green-800'
                                                        }`}>
                                                            {dia.tiene_entrada_abierta && <AlertCircle className="w-3 h-3 mr-1" />}
                                                            {dia.tiene_entrada_abierta ? 'En curso' : 'Completo'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No hay fichajes registrados este mes
                                </div>
                            )}
                        </div>
                    </div>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}