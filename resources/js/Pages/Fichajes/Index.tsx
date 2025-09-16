import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import FlashMessage from '@/Components/Common/FlashMessage';
import { Clock, Calendar, BarChart3, AlertCircle } from 'lucide-react';

interface Fichaje {
    id: number;
    fecha: string;
    hora_entrada: string | null;
    hora_salida: string | null;
    horas_trabajadas: number | null;
    observaciones: string | null;
    estado: 'completo' | 'incompleto' | 'pendiente';
}

interface Estadisticas {
    total_dias_trabajados: number;
    total_horas_mes: number;
    promedio_horas_dia: number;
    dias_incompletos: number;
}

interface FichajesIndexProps extends PageProps {
    fichajeHoy: Fichaje | null;
    fichajesDelMes: Fichaje[];
    estadisticas: Estadisticas;
    fechaActual: string;
}

export default function Index({
    auth,
    fichajeHoy,
    fichajesDelMes,
    estadisticas,
    fechaActual
}: FichajesIndexProps) {
    const handleFicharEntrada = () => {
        router.post('/fichajes/entrada');
    };

    const handleFicharSalida = () => {
        router.post('/fichajes/salida');
    };

    const formatearHora = (hora: string | null) => {
        if (!hora) return '--:--';
        return hora.substring(0, 5);
    };

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const puedeEntrar = !fichajeHoy || !fichajeHoy.hora_entrada;
    const puedeSalir = fichajeHoy && fichajeHoy.hora_entrada && !fichajeHoy.hora_salida;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Sistema de Fichajes
                    </h2>
                    <div className="text-sm text-gray-500">
                        {formatearFecha(fechaActual)}
                    </div>
                </div>
            }
        >
            <Head title="Fichajes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <FlashMessage />

                    {/* Fichaje de Hoy */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <Clock className="w-5 h-5 mr-2" />
                                Fichaje de Hoy
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Estado Actual */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Estado Actual</div>
                                    <div className="text-lg font-semibold">
                                        {fichajeHoy ? (
                                            fichajeHoy.estado === 'completo' ? (
                                                <span className="text-green-600">Completo</span>
                                            ) : fichajeHoy.estado === 'incompleto' ? (
                                                <span className="text-yellow-600">En curso</span>
                                            ) : (
                                                <span className="text-gray-600">Pendiente</span>
                                            )
                                        ) : (
                                            <span className="text-gray-600">Sin fichar</span>
                                        )}
                                    </div>
                                </div>

                                {/* Horas */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Entrada / Salida</div>
                                    <div className="text-lg font-semibold">
                                        {formatearHora(fichajeHoy?.hora_entrada)} - {formatearHora(fichajeHoy?.hora_salida)}
                                    </div>
                                </div>

                                {/* Horas Trabajadas */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Horas Trabajadas</div>
                                    <div className="text-lg font-semibold">
                                        {fichajeHoy?.horas_trabajadas ?
                                            `${Number(fichajeHoy.horas_trabajadas).toFixed(2)}h` :
                                            '--'
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="mt-6 flex space-x-4">
                                <button
                                    onClick={handleFicharEntrada}
                                    disabled={!puedeEntrar}
                                    className={`px-6 py-2 rounded-md font-medium ${
                                        puedeEntrar
                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    Fichar Entrada
                                </button>

                                <button
                                    onClick={handleFicharSalida}
                                    disabled={!puedeSalir}
                                    className={`px-6 py-2 rounded-md font-medium ${
                                        puedeSalir
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    Fichar Salida
                                </button>
                            </div>

                            {/* Observaciones */}
                            {fichajeHoy?.observaciones && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <div className="text-sm text-gray-600">
                                        <strong>Observaciones:</strong> {fichajeHoy.observaciones}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Estadísticas del Mes */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <BarChart3 className="w-5 h-5 mr-2" />
                                Estadísticas del Mes
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {estadisticas.dias_incompletos}
                                    </div>
                                    <div className="text-sm text-gray-600">Días Incompletos</div>
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
                                <a
                                    href="/fichajes/historial"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Ver historial completo
                                </a>
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
                                                    Entrada
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Salida
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
                                            {fichajesDelMes.slice(0, 10).map((fichaje) => (
                                                <tr key={fichaje.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(fichaje.fecha).toLocaleDateString('es-ES')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatearHora(fichaje.hora_entrada)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatearHora(fichaje.hora_salida)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {fichaje.horas_trabajadas ?
                                                            `${Number(fichaje.horas_trabajadas).toFixed(2)}h` :
                                                            '--'
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            fichaje.estado === 'completo'
                                                                ? 'bg-green-100 text-green-800'
                                                                : fichaje.estado === 'incompleto'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {fichaje.estado === 'incompleto' && <AlertCircle className="w-3 h-3 mr-1" />}
                                                            {fichaje.estado === 'completo' ? 'Completo' :
                                                             fichaje.estado === 'incompleto' ? 'Incompleto' : 'Pendiente'}
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}