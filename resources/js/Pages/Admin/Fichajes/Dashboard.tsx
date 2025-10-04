import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Users, Clock, AlertCircle, TrendingUp, Download, Search } from 'lucide-react';

interface FichajeIndividual {
    id: number;
    tipo: 'entrada' | 'salida';
    hora: string;
}

interface FichajeDia {
    empleado_id: number;
    empleado_nombre: string;
    fecha: string;
    fichajes: FichajeIndividual[];
    horas_trabajadas: number;
    estado: 'completo' | 'en_curso' | 'sin_fichar' | 'incompleto';
}

interface EstadisticasHoy {
    total_empleados: number;
    empleados_fichados: number;
    empleados_sin_fichar: number;
    total_horas_hoy: number;
    promedio_horas: number;
}

interface Empleado {
    id: number;
    name: string;
}

interface Filtros {
    empleado_id?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
    estado?: string;
}

interface AdminFichajesDashboardProps extends PageProps {
    fichajes: FichajeDia[];
    estadisticas: EstadisticasHoy;
    empleados: Empleado[];
    filtros: Filtros;
}

export default function Dashboard({
    fichajes,
    estadisticas,
    empleados,
    filtros
}: AdminFichajesDashboardProps) {
    const [empleadoFiltro, setEmpleadoFiltro] = useState(filtros.empleado_id || '');
    const [fechaDesde, setFechaDesde] = useState(filtros.fecha_desde || '');
    const [fechaHasta, setFechaHasta] = useState(filtros.fecha_hasta || '');
    const [estadoFiltro, setEstadoFiltro] = useState(filtros.estado || '');

    const formatearHora = (hora: string) => {
        if (!hora) return '--:--';
        const horaPart = hora.split('T')[1] || hora;
        return horaPart.substring(0, 5);
    };

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'completo':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">✅ Completo</span>;
            case 'en_curso':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">⚠️ En Curso</span>;
            case 'incompleto':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">⚠️ Incompleto</span>;
            case 'sin_fichar':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">❌ Sin Fichar</span>;
            default:
                return null;
        }
    };

    const handleExportarCSV = () => {
        // TODO: Implementar exportación CSV
        console.log('Exportar CSV con filtros:', { empleadoFiltro, fechaDesde, fechaHasta, estadoFiltro });
    };

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
        <AuthenticatedLayout>
            <Head title="Dashboard Fichajes - Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">📊 Dashboard de Fichajes - Administración</h2>
                        <p className="text-gray-600 mt-1">Gestión y control de fichajes de todos los empleados</p>
                    </div>

                    {/* KPIs Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Total Empleados */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Users className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {estadisticas.empleados_fichados}/{estadisticas.total_empleados}
                                    </div>
                                    <div className="text-xs text-gray-600">Fichados HOY</div>
                                </div>
                            </div>
                        </div>

                        {/* Total Horas Hoy */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Clock className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-green-600">
                                        {estadisticas.total_horas_hoy.toFixed(1)}h
                                    </div>
                                    <div className="text-xs text-gray-600">Horas Hoy</div>
                                </div>
                            </div>
                        </div>

                        {/* Sin Fichar */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-8 w-8 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-red-600">
                                        {estadisticas.empleados_sin_fichar}
                                    </div>
                                    <div className="text-xs text-gray-600">Sin Fichar</div>
                                </div>
                            </div>
                        </div>

                        {/* Promedio Horas */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <TrendingUp className="h-8 w-8 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {estadisticas.promedio_horas.toFixed(1)}h
                                    </div>
                                    <div className="text-xs text-gray-600">Promedio/Empleado</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
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

                    {/* Tabla de Fichajes */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    📋 Fichajes de Empleados
                                </h3>
                                <button
                                    onClick={handleExportarCSV}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                                >
                                    <Download className="h-4 w-4" />
                                    Exportar CSV
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Empleado
                                            </th>
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acción
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {fichajes.length > 0 ? fichajes.map((fichaje, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <span className="text-blue-600 font-medium text-sm">
                                                                    {fichaje.empleado_nombre.split(' ').map(n => n[0]).join('')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {fichaje.empleado_nombre}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(fichaje.fecha).toLocaleDateString('es-ES')}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {fichaje.fichajes.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {fichaje.fichajes.map((f) => (
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
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {fichaje.horas_trabajadas.toFixed(1)}h
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getEstadoBadge(fichaje.estado)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <a
                                                        href={`/admin/empleados/${fichaje.empleado_id}`}
                                                        className="text-blue-600 hover:text-blue-900 font-medium"
                                                    >
                                                        Ver Detalle
                                                    </a>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                    No hay fichajes para mostrar con los filtros seleccionados
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                    ← Anterior
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">
                                    1
                                </button>
                                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    2
                                </button>
                                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    3
                                </button>
                                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    Siguiente →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
