import { FileText } from 'lucide-react';

interface Nomina {
    id: number;
    mes: string;
    año: number;
    archivo: string;
    salario_bruto: number;
    salario_neto: number;
}

interface NominasRecientesProps {
    nominas: Nomina[];
}

export default function NominasRecientes({ nominas }: NominasRecientesProps) {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Mis Nóminas</h3>
                    <a
                        href={route('user.nominas.index')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        Ver todas
                    </a>
                </div>
                <div className="space-y-3">
                    {nominas.length > 0 ? (
                        nominas.slice(0, 3).map((nomina) => (
                            <div key={nomina.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <FileText className="w-4 h-4 text-gray-500 mr-2" />
                                        <span className="text-sm font-medium">
                                            {nomina.mes} {nomina.año}
                                        </span>
                                    </div>
                                    <a
                                        href={route('user.nominas.descargar', nomina.id)}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Descargar
                                    </a>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Bruto:</span>
                                        <span className="font-medium text-gray-900">
                                            {nomina.salario_bruto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Neto:</span>
                                        <span className="font-medium text-green-600">
                                            {nomina.salario_neto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-sm">No hay nóminas disponibles</p>
                    )}
                </div>
            </div>
        </div>
    );
}