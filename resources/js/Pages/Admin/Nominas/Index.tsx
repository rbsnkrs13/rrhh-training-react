import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import PrimaryButton from '@/Components/Shared/Common/PrimaryButton';
import SecondaryButton from '@/Components/Shared/Common/SecondaryButton';
import FlashMessage from '@/Components/Shared/Common/FlashMessage';
import FlipCard from '@/Components/Admin/Nominas/FlipCard';
import PanelSubidaNominas from '@/Components/Admin/Nominas/PanelSubidaNominas';
import FiltrosNominas from '@/Components/Admin/Nominas/FiltrosNominas';
import TablaNominas from '@/Components/Admin/Nominas/TablaNominas';
import ModalEdicionNomina from '@/Components/Admin/Nominas/ModalEdicionNomina';

interface Empleado {
    id: number;
    name: string;
    dni: string;
}

interface Nomina {
    id: number;
    empleado_id: number;
    empleado: {
        name: string;
        dni: string;
    };
    año: number;
    mes: number;
    nombre_mes: string;
    archivo_nombre: string;
    archivo_tamaño: number;
    salario_bruto?: number;
    salario_neto?: number;
    deducciones_ss?: number;
    deducciones_irpf?: number;
    observaciones?: string;
    estado: string;
    created_at: string;
}

interface Props extends PageProps {
    nominas: Nomina[];
    empleados: Empleado[];
    año: number;
    mes?: number;
    añosDisponibles: number[];
    estadisticas: {
        total_nominas: number;
        total_empleados: number;
        salario_bruto_total: number;
        salario_neto_total: number;
    };
}

export default function Index({ auth, nominas, empleados, año, mes, añosDisponibles, estadisticas }: Props) {
    const [mostrarSubida, setMostrarSubida] = useState(false);
    const [cardFlipped, setCardFlipped] = useState<{ [key: number]: boolean }>({});
    const [nominaEditando, setNominaEditando] = useState<Nomina | null>(null);

    const toggleCard = (cardIndex: number) => {
        setCardFlipped(prev => ({ ...prev, [cardIndex]: !prev[cardIndex] }));
    };

    // Calcular promedios para las tarjetas volteadas
    const promedioNominas = estadisticas.total_nominas > 0 ? estadisticas.total_nominas / (mes ? 1 : 12) : 0;
    const promedioBruto = estadisticas.total_nominas > 0 ? estadisticas.salario_bruto_total / estadisticas.total_nominas : 0;
    const promedioNeto = estadisticas.total_nominas > 0 ? estadisticas.salario_neto_total / estadisticas.total_nominas : 0;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gestión de Nóminas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <FlashMessage />

                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">Gestión de Nóminas</h1>
                        <div className="flex gap-3">
                            <SecondaryButton onClick={() => window.location.href = route('admin.nominas.ejemplo.descargar-todas')}>
                                <FileText className="w-4 h-4 mr-2" />
                                Generar Nóminas
                            </SecondaryButton>
                            <PrimaryButton onClick={() => setMostrarSubida(!mostrarSubida)}>
                                <Upload className="w-4 h-4 mr-2" />
                                {mostrarSubida ? 'Cerrar Subida' : 'Subir Nóminas'}
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* Estadísticas con efecto Flip */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <FlipCard
                            title="Total Nóminas"
                            value={estadisticas.total_nominas}
                            backTitle="Promedio/Mes"
                            backValue={promedioNominas.toFixed(1)}
                            isFlipped={cardFlipped[0] || false}
                            onToggle={() => toggleCard(0)}
                            backColor="bg-indigo-600"
                        />
                        <FlipCard
                            title="Empleados con Nómina"
                            value={estadisticas.total_empleados}
                            backTitle="Cobertura"
                            backValue={`${((estadisticas.total_empleados / empleados.length) * 100).toFixed(0)}%`}
                            isFlipped={cardFlipped[1] || false}
                            onToggle={() => toggleCard(1)}
                            backColor="bg-purple-600"
                        />
                        <FlipCard
                            title="Total Bruto"
                            value={
                                <span className="text-green-600">
                                    {estadisticas.salario_bruto_total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                                </span>
                            }
                            backTitle="Promedio/Empleado"
                            backValue={`${promedioBruto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€`}
                            isFlipped={cardFlipped[2] || false}
                            onToggle={() => toggleCard(2)}
                            backColor="bg-green-600"
                        />
                        <FlipCard
                            title="Total Neto"
                            value={
                                <span className="text-blue-600">
                                    {estadisticas.salario_neto_total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                                </span>
                            }
                            backTitle="Promedio/Empleado"
                            backValue={`${promedioNeto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€`}
                            isFlipped={cardFlipped[3] || false}
                            onToggle={() => toggleCard(3)}
                            backColor="bg-blue-600"
                        />
                    </div>

                    {/* Panel de Subida */}
                    {mostrarSubida && (
                        <div className="mb-6">
                            <PanelSubidaNominas empleados={empleados} añosDisponibles={añosDisponibles} />
                        </div>
                    )}

                    {/* Filtros */}
                    <div className="mb-6">
                        <FiltrosNominas
                            año={año}
                            mes={mes}
                            empleados={empleados}
                            añosDisponibles={añosDisponibles}
                        />
                    </div>

                    {/* Tabla de Nóminas */}
                    <TablaNominas nominas={nominas} onEditar={setNominaEditando} />

                    {/* Modal de Edición */}
                    <ModalEdicionNomina
                        nomina={nominaEditando}
                        onClose={() => setNominaEditando(null)}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
