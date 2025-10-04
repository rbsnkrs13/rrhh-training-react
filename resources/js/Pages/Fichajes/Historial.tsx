import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Calendar, Download, Filter, AlertCircle } from 'lucide-react';

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

interface FichajesHistorialProps extends PageProps {
    fichajes: FichajeDia[];
    año: number;
    mes: number;
    añosDisponibles: number[];
}

export default function Historial({
    fichajes,
    año,
    mes,
    añosDisponibles
}: FichajesHistorialProps) {
    const [filtroAño, setFiltroAño] = useState(año);
    const [filtroMes, setFiltroMes] = useState(mes);

    const meses = [
        { value: 1, label: 'Enero' },
        { value: 2, label: 'Febrero' },
        { value: 3, label: 'Marzo' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Mayo' },
        { value: 6, label: 'Junio' },
        { value: 7, label: 'Julio' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Septiembre' },
        { value: 10, label: 'Octubre' },
        { value: 11, label: 'Noviembre' },
        { value: 12, label: 'Diciembre' }
    ];

    const aplicarFiltros = () => {
        router.get('/fichajes/historial', {
            año: filtroAño,
            mes: filtroMes
        });
    };

    const exportarCSV = () => {
        const headers = ['Fecha', 'Fichajes', 'Horas Trabajadas', 'Estado'];
        const csvContent = [
            headers.join(','),
            ...fichajes.map(dia => [
                dia.fecha,
                dia.fichajes.map(f => `${f.tipo}:${formatearHora(f.hora)}`).join(';'),
                dia.horas_trabajadas.toFixed(2),
                dia.tiene_entrada_abierta ? 'En curso' : 'Completo'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fichajes_${filtroAño}_${String(filtroMes).padStart(2, '0')}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const formatearHora = (hora: string) => {
        if (!hora) return '--:--';
        const horaPart = hora.split('T')[1] || hora;
        return horaPart.substring(0, 5);
    };

    const calcularEstadisticas = () => {
        const completos = fichajes.filter(f => !f.tiene_entrada_abierta);
        const totalHoras = fichajes.reduce((sum, f) => sum + f.horas_trabajadas, 0);

        return {
            totalDias: fichajes.length,
            diasCompletos: completos.length,
            diasIncompletos: fichajes.filter(f => f.tiene_entrada_abierta).length,
            totalHoras: totalHoras,
            promedioHoras: completos.length > 0 ? totalHoras / completos.length : 0
        };
    };

    const estadisticas = calcularEstadisticas();
    const mesSeleccionado = meses.find(m => m.value === filtroMes)?.label || 'Mes';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Historial de Fichajes
                    </h2>
                    <a
                        href="/fichajes"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        Volver a fichajes
                    </a>
                </div>
            }
        >
            <Head title="Historial de Fichajes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filtros */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <Filter className="w-5 h-5 mr-2" />
                                    Filtros
                                </h3>
                                <button
                                    onClick={exportarCSV}
                                    disabled={fichajes.length === 0}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Exportar CSV
                                </button>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Año
                                    </label>
                                    <select
                                        value={filtroAño}
                                        onChange={(e) => setFiltroAño(Number(e.target.value))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {añosDisponibles.map(año => (
                                            <option key={año} value={año}>{año}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mes
                                    </label>
                                    <select
                                        value={filtroMes}
                                        onChange={(e) => setFiltroMes(Number(e.target.value))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {meses.map(mes => (
                                            <option key={mes.value} value={mes.value}>{mes.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={aplicarFiltros}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Aplicar Filtros
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas del Período */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Resumen - {mesSeleccionado} {filtroAño}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {estadisticas.totalDias}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Fichajes</div>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {estadisticas.diasCompletos}
                                    </div>
                                    <div className="text-sm text-gray-600">Días Completos</div>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {estadisticas.diasIncompletos}
                                    </div>
                                    <div className="text-sm text-gray-600">Días Incompletos</div>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {Number(estadisticas.totalHoras).toFixed(1)}h
                                    </div>
                                    <div className="text-sm text-gray-600">Total Horas</div>
                                </div>

                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-indigo-600">
                                        {Number(estadisticas.promedioHoras).toFixed(1)}h
                                    </div>
                                    <div className="text-sm text-gray-600">Promedio/Día</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Fichajes */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                Fichajes Detallados
                            </h3>

                            {fichajes.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fecha
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Día
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fichajes
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Horas Trabajadas
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {fichajes.map((dia, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(dia.fecha).toLocaleDateString('es-ES')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(dia.fecha).toLocaleDateString('es-ES', { weekday: 'short' })}
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
                                    No hay fichajes registrados para el período seleccionado
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}