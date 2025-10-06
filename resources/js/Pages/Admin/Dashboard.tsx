import { formatearHoras } from '@/Utils/formatHoras';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import FlipCard from '@/Components/Admin/Dashboard/FlipCard';
import FichajesEstado from '@/Components/Admin/Dashboard/FichajesEstado';
import UltimosFichajes from '@/Components/Admin/Dashboard/UltimosFichajes';
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

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header con color */}
                    <div className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 shadow-xl">
                        <h1 className="text-4xl font-bold text-white">Dashboard Administrativo</h1>
                        <p className="text-slate-300 mt-2 text-lg">{configuracion.empresa} - v{configuracion.version}</p>
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
                                frontValue={`${formatearHoras(estadisticasFichajes.promedio_horas_mes)}`}
                                frontColor="text-green-600"
                                backTitle="Media Horas Hoy"
                                backValue={`${formatearHoras(estadisticasFichajes.promedio_horas_hoy)}`}
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
                        <div className="bg-white rounded-xl shadow-xl p-6 border-t-4 border-indigo-500">
                            <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                Accesos Rápidos
                            </h3>
                            <div className="space-y-3">
                                <a
                                    href="/admin/fichajes"
                                    className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <Clock className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">Fichajes</h4>
                                            <p className="text-sm text-blue-100">Ver registro completo</p>
                                        </div>
                                    </div>
                                    {estadisticasFichajes.entradas_abiertas > 0 && (
                                        <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg">
                                            {estadisticasFichajes.entradas_abiertas}
                                        </span>
                                    )}
                                </a>

                                <a
                                    href="/admin/nominas"
                                    className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <FileText className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">Nóminas</h4>
                                            <p className="text-sm text-emerald-100">Gestionar nóminas</p>
                                        </div>
                                    </div>
                                    {estadisticasNominas.pendientes > 0 && (
                                        <span className="px-3 py-1.5 bg-amber-500 text-white text-sm font-bold rounded-full shadow-lg">
                                            {estadisticasNominas.pendientes}
                                        </span>
                                    )}
                                </a>

                                <a
                                    href="/admin/empleados"
                                    className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <Users className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">Empleados</h4>
                                            <p className="text-sm text-purple-100">Gestionar plantilla</p>
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
