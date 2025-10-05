import { router } from '@inertiajs/react';
import { FileText, Download, Eye } from 'lucide-react';
import { formatearSalario, formatearFecha } from '@/Utils/formatters';

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

interface ListadoNominasProps {
    nominas: Nomina[];
    año: number;
}

const getEstadoBadge = (estado: string) => {
    const badges = {
        pendiente: 'bg-gray-100 text-gray-800',
        enviada: 'bg-blue-100 text-blue-800',
        vista: 'bg-green-100 text-green-800'
    };

    const textos = {
        pendiente: 'Pendiente',
        enviada: 'Disponible',
        vista: 'Descargada'
    };

    return {
        className: badges[estado as keyof typeof badges] || badges.pendiente,
        texto: textos[estado as keyof typeof textos] || 'Pendiente'
    };
};

export default function ListadoNominas({ nominas, año }: ListadoNominasProps) {
    const descargarNomina = (nominaId: number) => {
        router.get(`/nominas/${nominaId}/descargar`);
    };

    if (nominas.length === 0) {
        return (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Nóminas Disponibles
                    </h3>
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No hay nóminas disponibles
                        </h3>
                        <p className="text-gray-500">
                            No se encontraron nóminas para el año {año}.
                            Las nóminas estarán disponibles cuando sean subidas por el departamento de RRHH.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Nóminas Disponibles
                </h3>

                <div className="space-y-4">
                    {nominas.map((nomina) => (
                        <div
                            key={nomina.id}
                            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <FileText className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-medium text-gray-900">
                                                Nómina {nomina.nombre_mes} {nomina.año}
                                            </h4>
                                            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                                <span>Archivo: {nomina.archivo_nombre}</span>
                                                <span>•</span>
                                                <span>Tamaño: {nomina.tamaño_formateado}</span>
                                                {nomina.fecha_descarga && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Descargada: {formatearFecha(nomina.fecha_descarga)}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {(nomina.salario_bruto || nomina.salario_neto) && (
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {nomina.salario_bruto && (
                                                <div className="bg-gray-50 p-3 rounded">
                                                    <div className="text-sm text-gray-600">Salario Bruto</div>
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        {formatearSalario(nomina.salario_bruto)}
                                                    </div>
                                                </div>
                                            )}
                                            {nomina.salario_neto && (
                                                <div className="bg-gray-50 p-3 rounded">
                                                    <div className="text-sm text-gray-600">Salario Neto</div>
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        {formatearSalario(nomina.salario_neto)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {nomina.observaciones && (
                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                            <div className="text-sm text-gray-600">
                                                <strong>Observaciones:</strong> {nomina.observaciones}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-shrink-0 ml-6">
                                    <div className="flex flex-col items-end space-y-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoBadge(nomina.estado).className}`}>
                                            {nomina.estado === 'vista' && <Eye className="w-3 h-3 mr-1" />}
                                            {getEstadoBadge(nomina.estado).texto}
                                        </span>

                                        <button
                                            onClick={() => descargarNomina(nomina.id)}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Descargar PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
