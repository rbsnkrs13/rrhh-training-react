import { CheckCircle, Clock } from 'lucide-react';
import { formatearHoras } from '@/Utils/formatHoras';

interface Fichaje {
    fecha: string;
    horas: number;
    completo: boolean;
}

interface FichajesRecientesProps {
    fichajes: Fichaje[];
}

export default function FichajesRecientes({ fichajes }: FichajesRecientesProps) {
    const formatearFecha = (fechaStr: string) => {
        const fecha = fechaStr.split('T')[0];
        const [año, mes, dia] = fecha.split('-');
        return `${dia}/${mes}/${año}`;
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg sm:rounded-xl border border-teal-100">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-teal-600" />
                    Fichajes Recientes
                </h3>
                <div className="space-y-2">
                    {fichajes && fichajes.length > 0 ? (
                        fichajes.slice(0, 5).map((fichaje, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-100 hover:shadow-sm transition-all duration-200">
                                <div className="flex items-center gap-3">
                                    {fichaje.completo ? (
                                        <div className="bg-green-100 p-1.5 rounded-lg">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        </div>
                                    ) : (
                                        <div className="bg-blue-100 p-1.5 rounded-lg">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-800">{formatearFecha(fichaje.fecha)}</span>
                                </div>
                                <span className="text-sm text-teal-700 font-semibold bg-white/60 px-2 py-1 rounded">
                                    {formatearHoras(fichaje.horas)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm text-center py-4">No hay fichajes recientes</p>
                    )}
                </div>
            </div>
        </div>
    );
}