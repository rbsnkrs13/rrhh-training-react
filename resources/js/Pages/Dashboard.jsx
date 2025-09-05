import MetricCard from "@/Components/MetricCard"; //componente que viene de components, alli se crea lo que es la vista
import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function Dashboard({ empleadosIniciales, configuracion }) { //Datos importados de web.php
    // Estado para el período seleccionado que despues se usaran en los botones
    const [periodo, setPeriodo] = useState('mes');
    const [empleados] = useState(empleadosIniciales); //Viene de web.php 

    // Calcular métricas reales
    const empleadosActivos = empleados.filter(emp => emp.activo).length;
    const empleadosInactivos = empleados.filter(emp => !emp.activo).length;
    const totalEmpleados = empleados.length;

    // Métricas por departamento
    const departamentos = empleados.reduce((acc, emp) => {
        acc[emp.departamento] = (acc[emp.departamento] || 0) + 1;
        return acc;
    }, {});

    // Datos cambian según el período
    //Periodo == MES? entonces datos de este mes : si no?datos de este año
    // Departamento con más empleados
    const deptoMayorEmpleados = Object.entries(departamentos)
        .sort(([, a], [, b]) => b - a)[0];

    // Simular datos según período
    const metricas = periodo === 'mes' ? {
        nuevosEmpleados: 3,
        vacacionesPendientes: 8,
        cumpleanos: 2,
        rotacion: 2.1
    } : {
        nuevosEmpleados: 15,
        vacacionesPendientes: 34,
        cumpleanos: 12,
        rotacion: 8.7
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header con filtros */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                🎯 {configuracion.empresa}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Dashboard de Recursos Humanos - v{configuracion.version}
                            </p>
                        </div>

                        <div className="flex space-x-3 mt-4 sm:mt-0">
                            <button
                                onClick={() => setPeriodo('mes')}
                                className={`px-4 py-2 rounded-lg transition-colors ${periodo === 'mes'
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                📅 Este Mes
                            </button>
                            <button
                                onClick={() => setPeriodo('año')}
                                className={`px-4 py-2 rounded-lg transition-colors ${periodo === 'año'
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                📊 Este Año
                            </button>

                            <Link
                                href="/empleados"
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                👥 Gestionar Empleados
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Cerrar Sesión
                            </Link>
                        </div>
                    </div>

                    {/* Grid principal de métricas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <MetricCard
                            titulo="Total Empleados"
                            valor={totalEmpleados}
                            color="blue"
                        />
                        <MetricCard
                            titulo="Empleados Activos"
                            valor={empleadosActivos}
                            color="green"
                        />
                        <MetricCard
                            titulo={`Nuevos Contratados (${periodo})`}
                            valor={metricas.nuevosEmpleados}
                            color="blue"
                        />
                        <MetricCard
                            titulo="Vacaciones Pendientes"
                            valor={metricas.vacacionesPendientes}
                            color="yellow"
                        />
                    </div>

                    {/* Segunda fila de métricas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <MetricCard
                            titulo="Empleados Inactivos"
                            valor={empleadosInactivos}
                            color="red"
                        />
                        <MetricCard
                            titulo="Cumpleaños Hoy"
                            valor={metricas.cumpleanos}
                            color="yellow"
                        />
                        <MetricCard
                            titulo={`Rotación (${periodo})`}
                            valor={`${metricas.rotacion}%`}
                            color="red"
                        />
                    </div>

                    {/* Sección departamentos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Distribución por departamentos */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                📊 Distribución por Departamentos
                            </h2>
                            <div className="space-y-3">
                                {Object.entries(departamentos).map(([depto, count]) => (
                                    <div key={depto} className="flex items-center justify-between">
                                        <span className="text-gray-700">{depto}</span>
                                        <div className="flex items-center">
                                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{ width: `${(count / totalEmpleados) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-semibold text-gray-900 w-8 text-right">
                                                {count}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {deptoMayorEmpleados && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-700">
                                        🏆 <strong>{deptoMayorEmpleados[0]}</strong> es el departamento con más empleados ({deptoMayorEmpleados[1]})
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Empleados recientes */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                👋 Empleados Activos Recientes
                            </h2>
                            <div className="space-y-3">
                                {empleados
                                    .filter(emp => emp.activo)
                                    .slice(0, 4)
                                    .map(empleado => (
                                        <div key={empleado.id} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{empleado.nombre}</p>
                                                <p className="text-sm text-gray-500">{empleado.departamento}</p>
                                            </div>
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                Activo
                                            </span>
                                        </div>
                                    ))}
                            </div>

                            <Link
                                href="/empleados"
                                className="block mt-4 text-center text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Ver todos los empleados →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}