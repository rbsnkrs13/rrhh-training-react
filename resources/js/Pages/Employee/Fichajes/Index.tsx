import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import FlashMessage from '@/Components/Shared/Common/FlashMessage';
import BotonesFichaje from '@/Components/User/Fichajes/BotonesFichaje';
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
}

export default function Index({
    fichajesHoy,
    tieneEntradaAbierta,
    fichajesDelMes,
    estadisticas,
    fechaActual
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

                    <BotonesFichaje
                        puedeEntrar={!tieneEntradaAbierta}
                        puedeSalir={tieneEntradaAbierta}
                    />

                    <ResumenFichajeHoy
                        fichajesHoy={fichajesHoy}
                        tieneEntradaAbierta={tieneEntradaAbierta}
                        horasHoy={calcularHorasHoy()}
                    />

                    <EstadisticasMes estadisticas={estadisticas} />

                    <TablaHistorialFichajes fichajes={fichajesDelMes.slice(0, 10)} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
