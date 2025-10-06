import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import FiltroPeriodoNominas from '@/Components/Admin/Nominas/FiltroPeriodoNominas';
import EstadisticasNominas from '@/Components/Admin/Nominas/EstadisticasNominas';
import ListadoNominas from '@/Components/Admin/Nominas/ListadoNominas';

interface Nomina {
    id: number;
    año: number;
    mes: number;
    archivo_nombre: string;
    archivo_tamaño: number;
    salario_bruto: number | null;
    salario_neto: number | null;
    observaciones: string | null;
    estado: 'pendiente' | 'enviada' | 'vista';
    fecha_descarga: string | null;
    nombre_mes: string;
    tamaño_formateado: string;
}

interface Estadisticas {
    total_nominas: number;
    nominas_descargadas: number;
    pendientes_descarga: number;
    salario_bruto_total: number;
    salario_neto_total: number;
}

interface NominasIndexProps extends PageProps {
    nominas: Nomina[];
    año: number;
    añosDisponibles: number[];
    estadisticas: Estadisticas;
}

export default function Index({
    nominas,
    año,
    añosDisponibles,
    estadisticas
}: NominasIndexProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Nóminas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <FiltroPeriodoNominas añoActual={año} añosDisponibles={añosDisponibles} />
                    <EstadisticasNominas estadisticas={estadisticas} />
                    <ListadoNominas nominas={nominas} año={año} isEmployee={true} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
