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
        <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg sm:rounded-xl border border-purple-100">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-purple-600" />
                        Mis Nóminas
                    </h3>
                    <a
                        href={route('user.nominas.index')}
                        className="text-purple-600 hover:text-purple-700 text-sm font-semibold transition-colors"
                    >
                        Ver todas →
                    </a>
                </div>
                <div className="space-y-3">
                    {nominas.length > 0 ? (
                        nominas.slice(0, 3).map((nomina) => (
                            <div key={nomina.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all duration-200 border border-purple-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-800">
                                        {nomina.mes} {nomina.año}
                                    </span>
                                    <a
                                        href={route('user.nominas.descargar', nomina.id)}
                                        className="text-purple-600 hover:text-purple-700 text-sm font-semibold transition-colors"
                                    >
                                        Descargar
                                    </a>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex justify-between bg-white/60 px-2 py-1 rounded">
                                        <span className="text-gray-600">Bruto:</span>
                                        <span className="font-semibold text-gray-900">
                                            {nomina.salario_bruto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                                        </span>
                                    </div>
                                    <div className="flex justify-between bg-white/60 px-2 py-1 rounded">
                                        <span className="text-gray-600">Neto:</span>
                                        <span className="font-semibold text-green-600">
                                            {nomina.salario_neto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm text-center py-4">No hay nóminas disponibles</p>
                    )}
                </div>
            </div>
        </div>
    );
}