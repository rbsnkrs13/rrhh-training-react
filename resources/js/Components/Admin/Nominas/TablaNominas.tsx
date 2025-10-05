import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Edit, Download, Trash2 } from 'lucide-react';
import SecondaryButton from '@/Components/Shared/Common/SecondaryButton';

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

interface TablaNominasProps {
    nominas: Nomina[];
    onEditar: (nomina: Nomina) => void;
}

export default function TablaNominas({ nominas, onEditar }: TablaNominasProps) {
    const [nominaExpandida, setNominaExpandida] = useState<number | null>(null);

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const eliminarNomina = (nominaId: number) => {
        if (confirm('¿Estás seguro de eliminar esta nómina? Esta acción no se puede deshacer.')) {
            router.delete(route('admin.nominas.eliminar', nominaId));
        }
    };

    const descargarNomina = (nominaId: number) => {
        window.open(route('user.nominas.descargar', nominaId), '_blank');
    };

    if (nominas.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">Nóminas Registradas</h2>
                </div>
                <div className="px-6 py-12 text-center text-gray-500">
                    No hay nóminas registradas para los filtros seleccionados
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Nóminas Registradas</h2>
                <p className="text-sm text-gray-500 mt-1">Haz clic en una fila para ver más detalles</p>
            </div>
            <div className="overflow-x-auto">
                <div className="divide-y divide-gray-200">
                    {nominas.map((nomina) => (
                        <div key={nomina.id} className="hover:bg-gray-50 transition-colors">
                            {/* Fila compacta */}
                            <div
                                className="px-6 py-4 cursor-pointer flex items-center justify-between group"
                                onClick={() => setNominaExpandida(nominaExpandida === nomina.id ? null : nomina.id)}
                            >
                                <div className="flex items-center space-x-6 flex-1">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                            {nomina.empleado.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>

                                    {/* Info empleado */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {nomina.empleado.name}
                                        </p>
                                        <p className="text-sm text-gray-500">{nomina.empleado.dni}</p>
                                    </div>

                                    {/* Período con badge */}
                                    <div className="hidden sm:flex items-center space-x-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                            {nomina.nombre_mes} {nomina.año}
                                        </span>
                                    </div>

                                    {/* Salario con diseño mejorado */}
                                    <div className="hidden md:block text-right">
                                        <p className="text-lg font-bold text-green-600">
                                            {nomina.salario_neto ? `${nomina.salario_neto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€` : '-'}
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium">Salario Neto</p>
                                    </div>

                                    {/* Indicador expansión */}
                                    <div className="flex-shrink-0">
                                        <svg
                                            className={`h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-all ${nominaExpandida === nomina.id ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Sección expandida */}
                            {nominaExpandida === nomina.id && (
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">Archivo</p>
                                            <p className="text-sm text-gray-900 mt-1">{nomina.archivo_nombre}</p>
                                            <p className="text-xs text-gray-500">{formatBytes(nomina.archivo_tamaño)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">Salario Bruto</p>
                                            <p className="text-sm text-gray-900 mt-1">
                                                {nomina.salario_bruto ? `${nomina.salario_bruto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€` : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">Deducciones SS</p>
                                            <p className="text-sm text-gray-900 mt-1">
                                                {nomina.deducciones_ss ? `${nomina.deducciones_ss.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€` : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">Deducciones IRPF</p>
                                            <p className="text-sm text-gray-900 mt-1">
                                                {nomina.deducciones_irpf ? `${nomina.deducciones_irpf.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€` : '-'}
                                            </p>
                                        </div>
                                        {nomina.observaciones && (
                                            <div className="md:col-span-2">
                                                <p className="text-xs font-medium text-gray-500 uppercase">Observaciones</p>
                                                <p className="text-sm text-gray-900 mt-1">{nomina.observaciones}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex space-x-2 pt-4 border-t border-gray-200">
                                        <SecondaryButton onClick={() => onEditar(nomina)}>
                                            <Edit className="w-4 h-4 mr-1" />
                                            Editar
                                        </SecondaryButton>
                                        <SecondaryButton onClick={() => descargarNomina(nomina.id)}>
                                            <Download className="w-4 h-4 mr-1" />
                                            Descargar
                                        </SecondaryButton>
                                        <SecondaryButton
                                            onClick={() => eliminarNomina(nomina.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Eliminar
                                        </SecondaryButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
