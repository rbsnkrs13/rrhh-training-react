import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Users, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import KPICard from '@/Components/Admin/Fichajes/KPICard';
import FiltrosFichajes from '@/Components/Admin/Fichajes/FiltrosFichajes';
import TablaFichajes from '@/Components/Admin/Fichajes/TablaFichajes';

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
                        <KPICard
                            icon={Users}
                            value={`${estadisticas.empleados_fichados}/${estadisticas.total_empleados}`}
                            label="Fichados HOY"
                            color="blue"
                        />
                        <KPICard
                            icon={Clock}
                            value={`${estadisticas.total_horas_hoy.toFixed(1)}h`}
                            label="Horas Hoy"
                            color="green"
                        />
                        <KPICard
                            icon={AlertCircle}
                            value={estadisticas.empleados_sin_fichar}
                            label="Sin Fichar"
                            color="red"
                        />
                        <KPICard
                            icon={TrendingUp}
                            value={`${estadisticas.promedio_horas.toFixed(1)}h`}
                            label="Promedio/Empleado"
                            color="purple"
                        />
                    </div>

                    {/* Filtros */}
                    <div className="mb-6">
                        <FiltrosFichajes empleados={empleados} filtrosActuales={filtros} />
                    </div>

                    {/* Tabla de Fichajes */}
                    <TablaFichajes fichajes={fichajes} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
