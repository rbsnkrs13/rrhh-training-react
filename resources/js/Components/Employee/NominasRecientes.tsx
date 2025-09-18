import { FileText } from 'lucide-react';

interface Nomina {
    id: number;
    mes: string;
    año: number;
    archivo: string;
}

interface Props {
    nominasRecientes: Nomina[];
}

export default function NominasRecientes({ nominasRecientes }: Props) {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                {/* Header con enlace a "Ver todas" */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Mis Nóminas</h3>
                    <a
                        href={route('nominas.index')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        Ver todas
                    </a>
                </div>
                {/* Lista de nóminas */}
                <div className="space-y-3">
                    {nominasRecientes.length > 0 ? (
                        // Mostrar máximo 3 nóminas
                        nominasRecientes.slice(0, 3).map((nomina) => (
                            <div key={nomina.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <FileText className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="text-sm font-medium">
                                        {nomina.mes} {nomina.año}
                                    </span>
                                </div>
                                {/* Enlace de descarga */}
                                <a
                                    href={route('nominas.descargar', nomina.id)}
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    Descargar
                                </a>
                            </div>
                        ))
                    ) : (
                        // Mensaje cuando no hay nóminas
                        <p className="text-gray-600 text-sm">No hay nóminas disponibles</p>
                    )}
                </div>
            </div>
        </div>
    );
}