import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Calendar } from 'lucide-react';
import FlashMessage from '@/Components/Shared/Common/FlashMessage';
import SelectorEmpleado from '@/Components/Admin/Fichajes/SelectorEmpleado';
import ResumenFichajeHoy from '@/Components/Shared/Fichajes/ResumenFichajeHoy';
import EstadisticasMes from '@/Components/Shared/Fichajes/EstadisticasMes';
import TablaHistorialFichajes from '@/Components/Shared/Fichajes/TablaHistorialFichajes';

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
    const calcularHorasHoy = () => {
        if (fichajesDelMes.length === 0) return 0;
        const hoy = fichajesDelMes.find(f => f.fecha.split('T')[0] === fechaActual);
        return hoy?.horas_trabajadas || 0;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Fichajes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <FlashMessage />

                    <SelectorEmpleado
                        empleados={empleados}
                        empleadoSeleccionado={empleadoSeleccionado}
                        ruta="/admin/fichajes"
                    />

                    {!empleadoSeleccionado ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-12 text-center text-gray-500">
                                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <p className="text-lg">Selecciona un empleado para ver sus fichajes</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <ResumenFichajeHoy
                                fichajesHoy={fichajesHoy}
                                tieneEntradaAbierta={tieneEntradaAbierta}
                                horasHoy={calcularHorasHoy()}
                            />

                            <EstadisticasMes estadisticas={estadisticas} />

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                            <Calendar className="w-5 h-5 mr-2" />
                                            Fichajes del Mes (últimos 10)
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
                                        <TablaHistorialFichajes fichajes={fichajesDelMes.slice(0, 10)} />
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
