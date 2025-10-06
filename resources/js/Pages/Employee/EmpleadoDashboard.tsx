import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User } from '@/types';
import BienvenidaReloj from '@/Components/User/Dashboard/BienvenidaReloj';
import EstadoFichaje from '@/Components/User/Dashboard/EstadoFichaje';
import FichajeRapido from '@/Components/User/Dashboard/FichajeRapido';
import ResumenSemanalHoras from '@/Components/User/Dashboard/ResumenSemanalHoras';
import NominasRecientes from '@/Components/User/Dashboard/NominasRecientes';
import FichajesRecientes from '@/Components/User/Dashboard/FichajesRecientes';
import InformacionPersonal from '@/Components/User/Dashboard/InformacionPersonal';

interface Fichaje {
    fecha: string;
    horas: number;
    completo: boolean;
}

interface Nomina {
    id: number;
    mes: string;
    año: number;
    archivo: string;
    salario_bruto: number;
    salario_neto: number;
}

interface Empleado {
    id: number;
    nombre: string;
    departamento: string;
    cargo: string;
}

interface Props {
    auth: {
        user: User;
    };
    fichajesRecientes?: Fichaje[];
    nominasRecientes?: Nomina[];
    empleadoInfo?: Empleado;
    estadoFichaje?: {
        fichado: boolean;
        ultimaEntrada?: string;
        horasHoy: number;
    };
    horasSemana?: {
        trabajadas: number;
        objetivo: number;
    };
}

export default function EmpleadoDashboard({
    auth,
    fichajesRecientes = [],
    nominasRecientes = [],
    empleadoInfo,
    estadoFichaje,
    horasSemana
}: Props) {
    const handleFichaje = (tipo: 'entrada' | 'salida') => {
        if (tipo === 'entrada') {
            router.post(route('fichajes.entrada'));
        } else {
            router.post(route('fichajes.salida'));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Panel de Empleado" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <BienvenidaReloj userName={auth.user.name} />
                            <EstadoFichaje estadoFichaje={estadoFichaje} />
                            <FichajeRapido estadoFichaje={estadoFichaje} onFichaje={handleFichaje} />
                            {horasSemana && <ResumenSemanalHoras horasSemana={horasSemana} />}
                            <NominasRecientes nominas={nominasRecientes} />
                            <FichajesRecientes fichajes={fichajesRecientes} />
                            {empleadoInfo && <InformacionPersonal empleado={empleadoInfo} />}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
