import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import FlipCard from '@/Components/Dashboard/FlipCard';
import FichajesEstado from '@/Components/Dashboard/FichajesEstado';
import UltimosFichajes from '@/Components/Dashboard/UltimosFichajes';
import { Clock, FileText, Users, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import type { PageProps } from '@/types';

interface EstadisticasNominas {
    total_mes_anterior: number;
    gasto_total: number;
    empleados_con_nomina: number;
    pendientes: number;
    promedio_empleado: number;
    cobertura: number;
    nombre_mes_anterior: string;
}

interface EstadisticasFichajes {
    empleados_fichados: number;
    sin_fichar: number;
    entradas_abiertas: number;
    horas_hoy: number;
    promedio_horas_hoy: number;
    promedio_horas_mes: number;
}

interface Fichaje {
    id: number;
    empleado: {
        name: string;
    };
    tipo: 'entrada' | 'salida';
    hora: string;
    fecha: string;
}

interface Props extends PageProps {
    empleadosIniciales: any[];
    configuracion: {
        empresa: string;
        version: string;
    };
    estadisticasNominas: EstadisticasNominas;
    estadisticasFichajes: EstadisticasFichajes;
    ultimosFichajes: Fichaje[];
}

export default function Dashboard({
    auth,
    empleadosIniciales,
    configuracion,
    estadisticasNominas,
    estadisticasFichajes,
    ultimosFichajes
}: Props) {
    const [cardsFlipped, setCardsFlipped] = useState<{ [key: string]: boolean }>({});

    const toggleCard = (cardId: string) => {
        setCardsFlipped(prev => ({ ...prev, [cardId]: !prev[cardId] }));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Admin" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
                        <p className="text-gray-600 mt-1">{configuracion.empresa} - v{configuracion.version}</p>
                    </div>

                    {/* Métricas Principales con Flip */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Métricas Principales</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Tarjeta 1: Total Empleados */}
                            <FlipCard
                                frontTitle="Total Empleados"
                                frontValue={empleadosIniciales.length}
                                frontColor="text-indigo-600"
                                backTitle="Activos / Inactivos"
                                backValue={`${empleadosIniciales.filter(e => e.estado === 'activo').length} / ${empleadosIniciales.filter(e => e.estado === 'inactivo').length}`}
                                backGradient="bg-gradient-to-br from-indigo-500 to-purple-600"
                                isFlipped={cardsFlipped['empleados'] || false}
                                onFlip={() => toggleCard('empleados')}
                            />

                            {/* Tarjeta 2: Media Horas/Empleado Mes */}
                            <FlipCard
                                frontTitle="Media Horas/Emp Mes"
                                frontValue={`${estadisticasFichajes.promedio_horas_mes.toFixed(1)}h`}
                                frontColor="text-green-600"
                                backTitle="Media Horas Hoy"
                                backValue={`${estadisticasFichajes.promedio_horas_hoy.toFixed(1)}h`}
                                backGradient="bg-gradient-to-br from-green-500 to-emerald-600"
                                isFlipped={cardsFlipped['horas'] || false}
                                onFlip={() => toggleCard('horas')}
                            />

                            {/* Tarjeta 3: Nóminas Mes Anterior */}
                            <FlipCard
                                frontTitle={`Nóminas ${estadisticasNominas.nombre_mes_anterior}`}
                                frontValue={estadisticasNominas.total_mes_anterior}
                                frontColor="text-blue-600"
                                backTitle="Gasto Total"
                                backValue={`${estadisticasNominas.gasto_total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€`}
                                backGradient="bg-gradient-to-br from-blue-500 to-cyan-600"
                                isFlipped={cardsFlipped['nominas'] || false}
                                onFlip={() => toggleCard('nominas')}
                            />

                            {/* Tarjeta 4: Alertas/Pendientes */}
                            <FlipCard
                                frontTitle="Total Alertas"
                                frontValue={estadisticasFichajes.sin_fichar + estadisticasNominas.pendientes + estadisticasFichajes.entradas_abiertas}
                                frontColor="text-red-600"
                                backTitle="Desglose"
                                backValue={`${estadisticasFichajes.sin_fichar} sin fichar, ${estadisticasNominas.pendientes} nóminas`}
                                backGradient="bg-gradient-to-br from-red-500 to-orange-600"
                                isFlipped={cardsFlipped['alertas'] || false}
                                onFlip={() => toggleCard('alertas')}
                            />
                        </div>
                    </div>

                    {/* Estado de Fichajes */}
                    <div className="mb-8">
                        <FichajesEstado estado={estadisticasFichajes} />
                    </div>

                    {/* Grid de 2 columnas: Accesos Rápidos + Últimos Fichajes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Accesos Rápidos Mejorados */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accesos Rápidos</h3>
                            <div className="space-y-3">
                                <a
                                    href="/admin/fichajes"
                                    className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors">
                                            <Clock className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Fichajes</h4>
                                            <p className="text-sm text-gray-600">Ver registro completo</p>
                                        </div>
                                    </div>
                                    {estadisticasFichajes.entradas_abiertas > 0 && (
                                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                            {estadisticasFichajes.entradas_abiertas}
                                        </span>
                                    )}
                                </a>

                                <a
                                    href="/admin/nominas"
                                    className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-green-500 rounded-lg group-hover:bg-green-600 transition-colors">
                                            <FileText className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Nóminas</h4>
                                            <p className="text-sm text-gray-600">Gestionar nóminas</p>
                                        </div>
                                    </div>
                                    {estadisticasNominas.pendientes > 0 && (
                                        <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                                            {estadisticasNominas.pendientes}
                                        </span>
                                    )}
                                </a>

                                <a
                                    href="/admin/empleados"
                                    className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-purple-500 rounded-lg group-hover:bg-purple-600 transition-colors">
                                            <Users className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Empleados</h4>
                                            <p className="text-sm text-gray-600">Gestionar plantilla</p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Últimos Fichajes */}
                        <UltimosFichajes fichajes={ultimosFichajes} />
                    </div>

                    {/* Alertas */}
                    {(estadisticasFichajes.sin_fichar > 0 || estadisticasNominas.pendientes > 0) && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                            <div className="flex">
                                <AlertCircle className="h-5 w-5 text-yellow-400" />
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Atención Requerida</h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <ul className="list-disc list-inside space-y-1">
                                            {estadisticasFichajes.sin_fichar > 0 && (
                                                <li>{estadisticasFichajes.sin_fichar} empleados sin fichar hoy</li>
                                            )}
                                            {estadisticasNominas.pendientes > 0 && (
                                                <li>{estadisticasNominas.pendientes} nóminas pendientes de revisar</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
