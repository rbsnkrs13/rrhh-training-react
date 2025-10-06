import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import FiltrosPeriodo from '@/Components/User/Fichajes/FiltrosPeriodo';
import EstadisticasPeriodo from '@/Components/User/Fichajes/EstadisticasPeriodo';
import TablaHistorialFichajes from '@/Components/Shared/Fichajes/TablaHistorialFichajes';
import { useEstadisticasFichajes } from '@/Hooks/useEstadisticasFichajes';
import { formatearHoras } from '@/Utils/formatHoras';

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

const MESES_NOMBRES = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function Historial({ fichajes, año, mes, añosDisponibles }: FichajesHistorialProps) {
    const estadisticas = useEstadisticasFichajes(fichajes);

    const formatearHora = (hora: string) => {
        if (!hora) return '--:--';
        const horaPart = hora.split('T')[1] || hora;
        return horaPart.substring(0, 5);
    };

    const exportarCSV = () => {
        const headers = ['Fecha', 'Fichajes', 'Horas Trabajadas', 'Estado'];
        const csvContent = [
            headers.join(','),
            ...fichajes.map(dia => [
                dia.fecha,
                dia.fichajes.map(f => `${f.tipo}:${formatearHora(f.hora)}`).join(';'),
                formatearHoras(dia.horas_trabajadas),
                dia.tiene_entrada_abierta ? 'En curso' : 'Completo'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fichajes_${año}_${String(mes).padStart(2, '0')}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <FiltrosPeriodo
                        añoInicial={año}
                        mesInicial={mes}
                        añosDisponibles={añosDisponibles}
                        onExportarCSV={exportarCSV}
                        tieneData={fichajes.length > 0}
                        rutaFiltros="/fichajes/historial"
                    />

                    <EstadisticasPeriodo
                        estadisticas={estadisticas}
                        titulo={`Resumen - ${MESES_NOMBRES[mes]} ${año}`}
                    />

                    <TablaHistorialFichajes fichajes={fichajes} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
